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
const PEAK_VIEWERS_KEY = 'twitch:peak-viewers';
const STREAMED_MINUTES_KEY = 'twitch:streamed-minutes';

// Guarda una muestra de viewers (solo se llama cuando el canal está en vivo).
// De paso actualiza el pico histórico y acumula minutos transmitidos.
// intervalMinutes debe ser cada cuántos minutos corre tu cron de
// collect-sample.js, para que el acumulado de horas sea realista.
export async function recordViewerSample(viewerCount, { intervalMinutes = 5 } = {}) {
  const sample = JSON.stringify({ v: viewerCount, t: Date.now() });
  await redisCommand(['LPUSH', SAMPLES_KEY, sample]);
  await redisCommand(['LTRIM', SAMPLES_KEY, 0, MAX_SAMPLES - 1]);

  // Pico histórico: solo sube, nunca se resetea solo.
  const currentPeakRaw = await redisCommand(['GET', PEAK_VIEWERS_KEY]);
  const currentPeak = currentPeakRaw ? Number(currentPeakRaw) : 0;
  if (viewerCount > currentPeak) {
    await redisCommand(['SET', PEAK_VIEWERS_KEY, String(viewerCount)]);
  }

  // Horas transmitidas: aproximado, sumando el intervalo del cron cada
  // vez que se confirma que el canal estaba en vivo.
  await redisCommand(['INCRBY', STREAMED_MINUTES_KEY, intervalMinutes]);
}

// Devuelve el pico histórico de viewers, o null si todavía no hay dato.
export async function getPeakViewers() {
  const raw = await redisCommand(['GET', PEAK_VIEWERS_KEY]);
  return raw ? Number(raw) : null;
}

// Devuelve el total de horas transmitidas acumuladas, o null si todavía
// no hay dato.
export async function getHoursStreamed() {
  const raw = await redisCommand(['GET', STREAMED_MINUTES_KEY]);
  return raw ? Number(raw) / 60 : null;
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