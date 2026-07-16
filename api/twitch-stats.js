// api/twitch-stats.js
// Endpoint que consume tu página: devuelve seguidores, estado en vivo,
// viewers actuales, y el promedio calculado a partir de las muestras
// que va guardando api/collect-sample.js.
// Endpoint: https://tu-proyecto.vercel.app/api/twitch-stats

import { getBroadcasterInfo, getLiveStatus, getChannelInfo, getTopClips, getLatestVideo, twitchFetch } from '../lib/twitch.js';
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

// Twitch devuelve la duración como texto tipo "1h4m25s" o "45m10s" o "38s".
// La pasamos a "H:MM:SS" o "MM:SS" para mostrarla igual que un video normal.
function formatDuration(duration) {
  if (!duration) return null;
  const match = duration.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return null;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  const ss = String(seconds).padStart(2, '0');
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, '0')}:${ss}`;
  return `${minutes}:${ss}`;
}

// Convierte una fecha ISO en algo tipo "Hace 2 días" en español.
function formatRelativeDate(isoString) {
  if (!isoString) return null;
  const diffDays = Math.floor((Date.now() - new Date(isoString).getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Hace 1 día';
  if (diffDays < 30) return `Hace ${diffDays} días`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return diffMonths === 1 ? 'Hace 1 mes' : `Hace ${diffMonths} meses`;
  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? 'Hace 1 año' : `Hace ${diffYears} años`;
}

function formatLatestVideo(video) {
  if (!video) return null;
  return {
    title: video.title,
    url: video.url,
    // La miniatura viene como plantilla ("...%{width}x%{height}...") que hay
    // que rellenar con un tamaño real; puede venir vacía en VODs muy nuevos.
    thumbnailUrl: video.thumbnail_url
      ? video.thumbnail_url.replace('%{width}', '640').replace('%{height}', '360')
      : null,
    viewCount: video.view_count,
    duration: formatDuration(video.duration),
    relativeDate: formatRelativeDate(video.published_at || video.created_at),
    description: video.description || null,
  };
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

    const [followersData, liveStatus, avgData, peakViewers, hoursStreamed, channelInfo, topClips, latestVideo] = await Promise.all([
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
      getLatestVideo(broadcasterId, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET).catch((err) => {
        console.error('No se pudo leer el último VOD del canal:', err.message);
        return null;
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
      latestVideo: formatLatestVideo(latestVideo), // null si no hay VODs guardados en el canal
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
}