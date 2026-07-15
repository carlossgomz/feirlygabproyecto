// api/twitch-stats.js
// Vercel Serverless Function. Se despliega automáticamente al hacer
// push de este archivo dentro de la carpeta /api de tu proyecto.
// Endpoint resultante: https://tu-proyecto.vercel.app/api/twitch-stats

// Cache "tibio" entre invocaciones dentro de la misma instancia serverless.
// No está garantizado que persista (Vercel puede crear una instancia nueva
// en cualquier momento), pero cuando persiste, evita pedir un token nuevo
// en cada request.
let appToken = null;
let tokenExpiresAt = 0;
let broadcasterIdCache = {};

async function getAppAccessToken(clientId, clientSecret) {
  if (appToken && Date.now() < tokenExpiresAt - 60_000) return appToken;

  const res = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    }),
  });

  if (!res.ok) throw new Error(`No se pudo obtener el token de Twitch (status ${res.status})`);

  const data = await res.json();
  appToken = data.access_token;
  tokenExpiresAt = Date.now() + data.expires_in * 1000;
  return appToken;
}

async function twitchFetch(path, clientId, clientSecret) {
  const token = await getAppAccessToken(clientId, clientSecret);
  const res = await fetch(`https://api.twitch.tv/helix/${path}`, {
    headers: {
      'Client-Id': clientId,
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error(`Error de Twitch API en "${path}": status ${res.status}`);
  return res.json();
}

export default async function handler(req, res) {
  const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL_LOGIN } = process.env;

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !TWITCH_CHANNEL_LOGIN) {
    return res.status(500).json({
      error: 'Faltan variables de entorno en Vercel: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL_LOGIN',
    });
  }

  try {
    let broadcasterId = broadcasterIdCache[TWITCH_CHANNEL_LOGIN];
    if (!broadcasterId) {
      const userData = await twitchFetch(
        `users?login=${encodeURIComponent(TWITCH_CHANNEL_LOGIN)}`,
        TWITCH_CLIENT_ID,
        TWITCH_CLIENT_SECRET
      );
      if (!userData.data || userData.data.length === 0) {
        return res.status(404).json({ error: `No se encontró el canal "${TWITCH_CHANNEL_LOGIN}" en Twitch` });
      }
      broadcasterId = userData.data[0].id;
      broadcasterIdCache[TWITCH_CHANNEL_LOGIN] = broadcasterId;
    }

    const [followersData, streamData] = await Promise.all([
      twitchFetch(`channels/followers?broadcaster_id=${broadcasterId}`, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET),
      twitchFetch(`streams?user_id=${broadcasterId}`, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET),
    ]);

    const isLive = Boolean(streamData.data?.[0]);
    const currentViewers = isLive ? streamData.data[0].viewer_count : 0;

    // Cachea la respuesta 60s en el edge de Vercel para no gastar cuota de
    // la API de Twitch en cada visita simultánea a tu media kit.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    res.status(200).json({
      followers: followersData.total,
      isLive,
      currentViewers,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
}
