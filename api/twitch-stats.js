// api/twitch-stats.js
// Endpoint que consume tu página: devuelve seguidores, estado en vivo,
// viewers actuales, y el promedio calculado a partir de las muestras
// que va guardando api/collect-sample.js.
// Endpoint: https://tu-proyecto.vercel.app/api/twitch-stats

import { getBroadcasterInfo, getLiveStatus, getChannelInfo, getTopClips, twitchFetch } from '../lib/twitch.js';
import { getAverageViewers, getPeakViewers, getHoursStreamed } from '../lib/redis.js';

function formatClips(clips) {
  return clips.map((clip) => ({
    title: clip.title,
    url: clip.url,
    thumbnailUrl: clip.thumbnail_url,
    viewCount: clip.view_count,
    creatorName: clip.creator_name,
  }));
}

export default async function handler(req, res) {
  const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL_LOGIN } = process.env;

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !TWITCH_CHANNEL_LOGIN) {
    return res.status(500).json({
      error: 'Faltan variables de entorno en Vercel: TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL_LOGIN',
    });
  }

  try {
    const broadcasterInfo = await getBroadcasterInfo(TWITCH_CHANNEL_LOGIN, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET);
    const broadcasterId = broadcasterInfo.id;

    const [followersData, liveStatus, avgData, peakViewers, hoursStreamed, channelInfo, topClips] = await Promise.all([
      twitchFetch(`channels/followers?broadcaster_id=${broadcasterId}`, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET),
      getLiveStatus(broadcasterId, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET),
      // Si Redis no está configurado todavía, no tumbes toda la respuesta:
      // solo deja el promedio en null.
      getAverageViewers({ withinDays: 30 }).catch((err) => {
        console.error('No se pudo leer el promedio de Redis:', err.message);
        return { average: null, sampleCount: 0 };
      }),
      getPeakViewers().catch((err) => {
        console.error('No se pudo leer el pico de viewers de Redis:', err.message);
        return null;
      }),
      getHoursStreamed().catch((err) => {
        console.error('No se pudieron leer las horas transmitidas de Redis:', err.message);
        return null;
      }),
      getChannelInfo(broadcasterId, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET).catch((err) => {
        console.error('No se pudo leer la categoría del canal:', err.message);
        return { gameName: null, title: null };
      }),
      getTopClips(broadcasterId, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, { withinDays: 30, first: 4 }).catch((err) => {
        console.error('No se pudieron leer los clips del canal:', err.message);
        return [];
      }),
    ]);

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');

    res.status(200).json({
      followers: followersData.total,
      isLive: liveStatus.isLive,
      currentViewers: liveStatus.currentViewers,
      avgViewers: avgData.average, // null si aún no hay muestras suficientes
      avgSampleCount: avgData.sampleCount,
      peakViewers, // null si aún no hay muestras suficientes
      hoursStreamed, // null si aún no hay muestras suficientes
      profileImageUrl: broadcasterInfo.profileImageUrl,
      mainCategory: channelInfo.gameName, // null si nunca configuraste una categoría
      topClips: formatClips(topClips), // [] si no tienes clips en los últimos 30 días
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
}