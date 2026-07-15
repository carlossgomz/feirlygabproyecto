// lib/twitch.js
// Funciones compartidas para hablar con la API Helix de Twitch.
// No es una ruta de Vercel (no está en /api), es solo un módulo importado.

let appToken = null;
let tokenExpiresAt = 0;
let broadcasterIdCache = {};

export async function getAppAccessToken(clientId, clientSecret) {
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

export async function twitchFetch(path, clientId, clientSecret) {
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

export async function getBroadcasterId(channelLogin, clientId, clientSecret) {
  if (broadcasterIdCache[channelLogin]) return broadcasterIdCache[channelLogin];
  const data = await twitchFetch(`users?login=${encodeURIComponent(channelLogin)}`, clientId, clientSecret);
  if (!data.data || data.data.length === 0) {
    throw new Error(`No se encontró el canal "${channelLogin}" en Twitch`);
  }
  broadcasterIdCache[channelLogin] = data.data[0].id;
  return broadcasterIdCache[channelLogin];
}

export async function getLiveStatus(broadcasterId, clientId, clientSecret) {
  const streamData = await twitchFetch(`streams?user_id=${broadcasterId}`, clientId, clientSecret);
  const isLive = Boolean(streamData.data?.[0]);
  const currentViewers = isLive ? streamData.data[0].viewer_count : 0;
  return { isLive, currentViewers };
}
