import React, { useState, useEffect } from 'react';
import './hero.css';
import gabImage from '../../assets/buena2.png';
import gabWordmark from '../../assets/logo-wordmark.png';
import gabLogoHeader from '../../assets/logo2.png';

// Mismo endpoint que ya consume el media kit (misma función serverless
// /api/twitch-stats.js), así que no hace falta duplicar llamadas a Twitch.
const STATS_API_URL = '/api/twitch-stats';

export default function Hero() {
    // Estado en vivo real, leído del mismo endpoint que usa el media kit.
    const [isLive, setIsLive] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadLiveStatus() {
            try {
                const res = await fetch(STATS_API_URL);
                if (!res.ok) throw new Error(`Respuesta no válida (${res.status})`);
                const data = await res.json();
                if (!cancelled) setIsLive(Boolean(data.isLive));
            } catch (err) {
                console.error('No se pudo consultar el estado en vivo de Twitch:', err);
                // Si falla, dejamos el badge en "offline" en vez de mentir que está en vivo.
            }
        }

        loadLiveStatus();
        // Revisa cada 60s si ya entró (o salió) en vivo
        const interval = setInterval(loadLiveStatus, 60 * 1000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    // Redes clave optimizadas con iconos SVG integrados directamente
    const quickLinks = [
        {
            name: 'TikTok',
            handle: '300K+ Fans',
            url: 'https://www.tiktok.com/@feirlygab',
            color: 'hero-tiktok',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
            )
        },
        {
            name: 'Instagram',
            handle: '80K+ Followers',
            url: 'https://www.instagram.com/fairlygab/',
            color: 'hero-instagram',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
            )
        },
        {
            name: 'Discord',
            handle: 'Cyber-Espacio',
            url: 'https://discord.gg/UqdatRpaCz',
            color: 'hero-discord',
            icon: (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
                    <path d="M18.5 4c-1.2-.8-2.6-1.3-4-1.5-.1 0-.2 0-.3.1-.2.3-.4.7-.5 1.1-1.5-.2-3-.2-4.5 0-.1-.4-.3-.8-.5-1.1 0-.1-.2-.1-.3-.1-1.4.2-2.8.7-4 1.5-.1 0-.1.1-.1.2-2.5 3.8-3.2 7.5-2.9 11.2 0 .1.1.2.2.3 1.7 1.2 3.3 2 4.9 2.5.1 0 .2 0 .3-.1.4-.5.7-1.1 1-1.7 0-.1 0-.2-.1-.3-.5-.2-1.1-.4-1.6-.7-.1 0-.1-.2 0-.3.1-.1.2-.2.3-.3 3.3 1.5 6.9 1.5 10.2 0 .1.1.2.2.3.3 0 .1.1.2 0 .3-.5.3-1 .5-1.6.7-.1.1-.1.2-.1.3.3.6.6 1.2 1 1.7.1.1.2.1.3.1 1.6-.5 3.2-1.3 4.9-2.5.1-.1.1-.2.2-.3.4-4.3-.7-8-2.9-11.2 0-.1-.1-.2-.2-.2z" />
                    <circle cx="9.5" cy="11.5" r="1.5" fill="currentColor" />
                    <circle cx="14.5" cy="11.5" r="1.5" fill="currentColor" />
                </svg>
            )
        },
        {
            name: 'X / Twitter',
            handle: 'Cyber-Espacio',
            url: 'https://x.com/FairlyGab',
            color: 'hero-x',
            icon: (
                <svg viewBox="0 0 24 24" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
            )
        }
    ];

    return (
        <div className="hero-viewport">
            <div className="hero-neon-glow pink-glow"></div>
            <div className="hero-neon-glow cyan-glow"></div>

            <div className="hero-background-avatar">
                <img src={gabImage} alt="FeirlyGab Ambient Background" />
            </div>

            <div className="hero-content-wrapper">
                <div className="hero-profile-info">
                    {isLive ? (
                        <a
                            href="https://twitch.tv/feirlygab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="live-badge-container is-live"
                        >
                            <span className="live-dot animate-pulse"></span>
                            <span className="live-text">STREAM ACTIVO</span>
                        </a>
                    ) : (
                        <div className="live-badge-container is-offline">
                            <span className="live-dot"></span>
                            <span className="live-text">OFFLINE</span>
                        </div>
                    )}

                    <img src={gabWordmark} alt="FeirlyGab" className="hero-brand-title" />
                    <p className="hero-bio">
                        Feirlygab, cuyo nombre real es Gabriella Suárez, es una destacada creadora de contenido y streamer venezolana, considerada actualmente como una de las figuras más influyentes en el ámbito del streaming dentro de su país.
                    </p>

                    {/* BOTONES FLOTANTES DE REDES SOCIALES */}
                    <div className="hero-social-buttons">
                        {quickLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`social-btn ${link.color}`}
                            >
                                {link.icon}
                            </a>
                        ))}
                    </div>

                    {/* Botones de acción principales */}
                    <div className="hero-cta-group">
                        <a
                            href="https://twitch.tv/feirlygab"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-primary-neon"
                        >
                            Seguir en Twitch
                        </a>                        <a href="/mediakit" className="btn-secondary-dark">Contacto Marcas</a>
                    </div>
                </div>
            </div>
        </div>
    );
}