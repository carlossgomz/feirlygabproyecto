// api/youtube-latest.js
// Endpoint que consume la sección MediaHub: devuelve el último video subido
// al canal de YouTube, con vistas, duración y fecha ya formateadas.
// Endpoint: https://tu-proyecto.vercel.app/api/youtube-latest

import { getLatestUploadedVideo, getVideoStats } from '../lib/youtube.js';

// Convierte una duración ISO 8601 de YouTube (ej. "PT14M25S", "PT1H2M3S")
// a "H:MM:SS" o "MM:SS" para mostrarla como cualquier reproductor de video.
function formatDuration(isoDuration) {
  if (!isoDuration) return null;
  const match = isoDuration.match(/^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/);
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

// Formatea vistas grandes como "45K vistas" en vez del número crudo.
function formatViews(viewCount) {
  if (viewCount === null || viewCount === undefined) return null;
  if (viewCount >= 1_000_000) return `${(viewCount / 1_000_000).toFixed(1)}M vistas`;
  if (viewCount >= 1_000) return `${(viewCount / 1_000).toFixed(1)}K vistas`;
  return `${viewCount} vistas`;
}

export default async function handler(req, res) {
  const { YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID } = process.env;

  if (!YOUTUBE_API_KEY || !YOUTUBE_CHANNEL_ID) {
    return res.status(500).json({
      error: 'Faltan variables de entorno en Vercel: YOUTUBE_API_KEY, YOUTUBE_CHANNEL_ID',
    });
  }

  try {
    const snippet = await getLatestUploadedVideo(YOUTUBE_CHANNEL_ID, YOUTUBE_API_KEY);
    if (!snippet) {
      res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
      return res.status(200).json({ video: null, updatedAt: new Date().toISOString() });
    }

    const videoId = snippet.resourceId?.videoId;
    const { viewCount, duration } = await getVideoStats(videoId, YOUTUBE_API_KEY);

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');

    res.status(200).json({
      video: {
        videoId,
        title: snippet.title,
        description: snippet.description || null,
        // "maxres" no siempre existe (videos muy nuevos o verticales);
        // caemos a "high" que casi siempre está disponible.
        thumbnailUrl:
          snippet.thumbnails?.maxres?.url ||
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.default?.url ||
          null,
        url: `https://www.youtube.com/watch?v=${videoId}`,
        views: formatViews(viewCount),
        duration: formatDuration(duration),
        relativeDate: formatRelativeDate(snippet.publishedAt),
      },
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
}
