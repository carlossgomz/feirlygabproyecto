// lib/redis.js
// Cliente mínimo para la REST API de Upstash Redis (no necesita librería,
// solo fetch). Usa el formato de comando "pipeline de uno" que documenta
// Upstash: POST al endpoint con un array ["COMANDO", "arg1", "arg2", ...]

async function redisCommand(command) {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    throw new Error('Faltan UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN en las variables de entorno');
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(command),
  });

  if (!res.ok) throw new Error(`Error de Upstash Redis (status ${res.status})`);
  const data = await res.json();
  return data.result;
}

const SAMPLES_KEY = 'twitch:viewer-samples';
const MAX_SAMPLES = 8640; // ~30 días si se muestrea cada 5 min

// Guarda una muestra de viewers (solo se llama cuando el canal está en vivo)
export async function recordViewerSample(viewerCount) {
  const sample = JSON.stringify({ v: viewerCount, t: Date.now() });
  await redisCommand(['LPUSH', SAMPLES_KEY, sample]);
  await redisCommand(['LTRIM', SAMPLES_KEY, 0, MAX_SAMPLES - 1]);
}

// Lee las muestras guardadas y devuelve { average, sampleCount }
export async function getAverageViewers({ withinDays = 30 } = {}) {
  const raw = await redisCommand(['LRANGE', SAMPLES_KEY, 0, MAX_SAMPLES - 1]);
  if (!raw || raw.length === 0) return { average: null, sampleCount: 0 };

  const cutoff = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  const values = raw
    .map((s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    })
    .filter((s) => s && s.t >= cutoff)
    .map((s) => s.v);

  if (values.length === 0) return { average: null, sampleCount: 0 };

  const average = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  return { average, sampleCount: values.length };
}
