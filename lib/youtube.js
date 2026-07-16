// lib/youtube.js
// Funciones compartidas para hablar con la API de YouTube Data v3.
// No es una ruta de Vercel (no está en /api), es solo un módulo importado.

async function youtubeFetch(path, params, apiKey) {
  const url = new URL(`https://www.googleapis.com/youtube/v3/${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set('key', apiKey);

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Error de YouTube API en "${path}": status ${res.status} - ${body}`);
  }
  return res.json();
}

let uploadsPlaylistCache = {};

// El "uploads playlist" es una playlist especial que YouTube genera sola
// para cada canal con TODOS sus videos subidos, en orden. Es la forma más
// barata en cuota de encontrar el último video (mucho más barata que
// search.list).
export async function getUploadsPlaylistId(channelId, apiKey) {
  if (uploadsPlaylistCache[channelId]) return uploadsPlaylistCache[channelId];

  const data = await youtubeFetch('channels', { part: 'contentDetails', id: channelId }, apiKey);
  const channel = data.items?.[0];
  if (!channel) throw new Error(`No se encontró el canal de YouTube con id "${channelId}"`);

  const playlistId = channel.contentDetails.relatedPlaylists.uploads;
  uploadsPlaylistCache[channelId] = playlistId;
  return playlistId;
}

// Trae el video más reciente subido al canal (snippet: título, thumbnail,
// fecha, descripción, videoId).
export async function getLatestUploadedVideo(channelId, apiKey) {
  const playlistId = await getUploadsPlaylistId(channelId, apiKey);
  const data = await youtubeFetch(
    'playlistItems',
    { part: 'snippet', playlistId, maxResults: 1 },
    apiKey
  );
  return data.items?.[0]?.snippet || null;
}

// Trae vistas y duración de un video puntual (playlistItems no las incluye).
export async function getVideoStats(videoId, apiKey) {
  const data = await youtubeFetch(
    'videos',
    { part: 'statistics,contentDetails', id: videoId },
    apiKey
  );
  const video = data.items?.[0];
  if (!video) return { viewCount: null, duration: null };
  return {
    viewCount: video.statistics?.viewCount ? Number(video.statistics.viewCount) : null,
    duration: video.contentDetails?.duration || null, // formato ISO 8601, ej. "PT14M25S"
  };
}
