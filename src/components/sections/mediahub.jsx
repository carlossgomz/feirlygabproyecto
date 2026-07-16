import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './mediahub.css';

const YOUTUBE_API_URL = '/api/youtube-latest';
const TWITCH_API_URL = '/api/twitch-stats';

export default function MediaHub() {
    // --- Último video de YouTube (automático) ---
    const [youtubeVideo, setYoutubeVideo] = useState(null);
    const [youtubeLoaded, setYoutubeLoaded] = useState(false);

    // --- Último stream/VOD de Twitch (automático) ---
    const [twitchVideo, setTwitchVideo] = useState(null);
    const [twitchLoaded, setTwitchLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadYoutube() {
            try {
                const res = await fetch(YOUTUBE_API_URL);
                if (!res.ok) throw new Error(`Respuesta no válida (${res.status})`);
                const data = await res.json();
                if (!cancelled) setYoutubeVideo(data.video);
            } catch (err) {
                console.error('No se pudo cargar el último video de YouTube:', err);
            } finally {
                if (!cancelled) setYoutubeLoaded(true);
            }
        }

        async function loadTwitch() {
            try {
                const res = await fetch(TWITCH_API_URL);
                if (!res.ok) throw new Error(`Respuesta no válida (${res.status})`);
                const data = await res.json();
                if (!cancelled) setTwitchVideo(data.latestVideo);
            } catch (err) {
                console.error('No se pudo cargar el último stream de Twitch:', err);
            } finally {
                if (!cancelled) setTwitchLoaded(true);
            }
        }

        loadYoutube();
        loadTwitch();
        // Refresca cada 10 minutos por si sube contenido nuevo mientras alguien tiene la página abierta
        const interval = setInterval(() => {
            loadYoutube();
            loadTwitch();
        }, 10 * 60 * 1000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    return (
        <section className="media-hook-section" id="media-hub">
            <div className="media-hook-container">

                <div className="hook-header">
                    <span className="hook-badge">ÚLTIMO VIDEO</span>
                    <h2>CONTENIDO <span>DESTACADO</span></h2>
                </div>

                {/* Tarjeta Cinematográfica Gigante: último video de YouTube */}
                {youtubeVideo ? (
                    <div className="video-hero-card">
                        <div className="video-thumbnail-wrapper">
                            <a href={youtubeVideo.url} target="_blank" rel="noopener noreferrer">
                                <img
                                    src={youtubeVideo.thumbnailUrl}
                                    alt={youtubeVideo.title}
                                    className="hook-thumb"
                                />
                                <div className="video-play-overlay">▶</div>
                            </a>
                            {youtubeVideo.duration && (
                                <span className="video-duration">{youtubeVideo.duration}</span>
                            )}
                        </div>

                        <div className="video-hook-details">
                            <div className="video-meta-tags">
                                {youtubeVideo.views && <span className="meta-stat">{youtubeVideo.views}</span>}
                                {youtubeVideo.views && youtubeVideo.relativeDate && <span className="meta-divider">•</span>}
                                {youtubeVideo.relativeDate && <span className="meta-stat">{youtubeVideo.relativeDate}</span>}
                            </div>
                            <h3 className="video-hook-title">{youtubeVideo.title}</h3>
                            {youtubeVideo.description && (
                                <p className="video-hook-desc">{youtubeVideo.description}</p>
                            )}

                            <a
                                href="https://www.youtube.com/@feirlygab"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-explore-multimedia"
                            >
                                Ver Todo el Contenido <span>➔</span>
                            </a>
                        </div>
                    </div>
                ) : (
                    youtubeLoaded && (
                        <div className="video-hero-card video-card-empty">
                            <p className="video-hook-desc">Cargando el último video del canal de YouTube...</p>
                        </div>
                    )
                )}

                {/* Segunda tarjeta: último stream/VOD de Twitch */}
                <div className="hook-header hook-header-secondary">
                    <span className="hook-badge">ÚLTIMO STREAM</span>
                    <h2>REPLAY <span>TWITCH</span></h2>
                </div>

                {twitchVideo ? (
                    <div className="video-hero-card">
                        <div className="video-thumbnail-wrapper">
                            <a href={twitchVideo.url} target="_blank" rel="noopener noreferrer">
                                {twitchVideo.thumbnailUrl ? (
                                    <img
                                        src={twitchVideo.thumbnailUrl}
                                        alt={twitchVideo.title}
                                        className="hook-thumb"
                                    />
                                ) : (
                                    <div className="hook-thumb hook-thumb-placeholder"></div>
                                )}
                                <div className="video-play-overlay">▶</div>
                            </a>
                            {twitchVideo.duration && (
                                <span className="video-duration">{twitchVideo.duration}</span>
                            )}
                        </div>

                        <div className="video-hook-details">
                            <div className="video-meta-tags">
                                {twitchVideo.viewCount !== null && twitchVideo.viewCount !== undefined && (
                                    <span className="meta-stat">{twitchVideo.viewCount.toLocaleString('es-ES')} vistas</span>
                                )}
                                {twitchVideo.viewCount !== null && twitchVideo.relativeDate && <span className="meta-divider">•</span>}
                                {twitchVideo.relativeDate && <span className="meta-stat">{twitchVideo.relativeDate}</span>}
                            </div>
                            <h3 className="video-hook-title">{twitchVideo.title}</h3>
                            <p className="video-hook-desc">
                                {twitchVideo.description || 'Repasa la transmisión completa, disponible ahora en el canal de Twitch.'}
                            </p>

                            <a
                                href="https://www.twitch.tv/feirlygab/videos"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-explore-multimedia"
                            >
                                Ver Todos los Streams <span>➔</span>
                            </a>
                        </div>
                    </div>
                ) : (
                    twitchLoaded && (
                        <div className="video-hero-card video-card-empty">
                            <p className="video-hook-desc">Aún no hay VODs guardados en el canal de Twitch.</p>
                        </div>
                    )
                )}

            </div>
        </section>
    );
}