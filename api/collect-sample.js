// api/collect-sample.js
// Este endpoint NO lo llama tu página. Lo llama un cron externo gratuito
// (ej. cron-job.org) cada 5-10 minutos. Cada vez que se ejecuta, si el
// canal está en vivo, guarda el viewer_count actual en Redis.
// Endpoint: https://tu-proyecto.vercel.app/api/collect-sample?secret=TU_CRON_SECRET

import { getBroadcasterId, getLiveStatus } from '../lib/twitch.js';
import { recordViewerSample } from '../lib/redis.js';

export default async function handler(req, res) {
  const { TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_CHANNEL_LOGIN, CRON_SECRET, CRON_INTERVAL_MINUTES } = process.env;

  // Protección simple para que no cualquiera pueda llamar este endpoint
  // y llenarte Redis de basura.
  const providedSecret = req.query.secret || req.headers['x-cron-secret'];
  if (!CRON_SECRET || providedSecret !== CRON_SECRET) {
    return res.status(401).json({ error: 'No autorizado' });
  }

  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !TWITCH_CHANNEL_LOGIN) {
    return res.status(500).json({ error: 'Faltan variables de entorno de Twitch' });
  }

  try {
    const broadcasterId = await getBroadcasterId(TWITCH_CHANNEL_LOGIN, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET);
    const { isLive, currentViewers } = await getLiveStatus(broadcasterId, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET);

    if (isLive) {
      // Si no defines CRON_INTERVAL_MINUTES en Vercel, asume 5 minutos
      // (ajusta esto al intervalo real que configuraste en cron-job.org).
      const intervalMinutes = CRON_INTERVAL_MINUTES ? Number(CRON_INTERVAL_MINUTES) : 5;
      await recordViewerSample(currentViewers, { intervalMinutes });
    }

    res.status(200).json({ recorded: isLive, currentViewers });
  } catch (err) {
    console.error(err);
    res.status(502).json({ error: err.message });
  }
}