// api/twitch-stats.js
// Endpoint que consume tu página: devuelve seguidores, estado en vivo,
// viewers actuales, y el promedio calculado a partir de las muestras
// que va guardando api/collect-sample.js.
// Endpoint: https://tu-proyecto.vercel.app/api/twitch-stats

import { getBroadcasterId, getLiveStatus, twitchFetch } from '../lib/twitch.js';
import { getAverageViewers } from '../lib/redis.js';

export default async function handler(req, res) {
  const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL_LOGIN } = process.env;

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !TWITCH_CHANNEL_LOGIN) {
    return res.status(500).json({
      error: 'Faltan variables de entorno en Vercel: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL_LOGIN',
    });
  }

  try {
    const broadcasterId = await getBroadcasterId(TWITCH_CHANNEL_LOGIN, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET);

    const [followersData, liveStatus, avgData] = await Promise.all([
      twitchFetch(`channels/followers?broadcaster_id=${broadcasterId}`, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET),
      getLiveStatus(broadcasterId, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET),
      // Si Redis no está configurado todavía, no tumbes toda la respuesta:
      // solo deja el promedio en null.
      getAverageViewers({ withinDays: 30 }).catch((err) => {
        console.error('No se pudo leer el promedio de Redis:', err.message);
        return { average: null, sampleCount: 0 };
      }),
    ]);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    res.status(200).json({
      followers: followersData.total,
      isLive: liveStatus.isLive,
      currentViewers: liveStatus.currentViewers,
      avgViewers: avgData.average, // null si aún no hay muestras suficientes
      avgSampleCount: avgData.sampleCount,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
}