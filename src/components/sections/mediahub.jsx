import React from 'react';
import { Link } from 'react-router-dom';
import './mediahub.css';

export default function MediaHub() {
    // Datos del último video (el gancho)
    const latestVideo = {
        title: 'USÉ X-RAY Y NO SE DIERON CUENTA | EXTR3MO Ep. 4',
        videoId: '_XQoy2GR5yU',
        views: '45K vistas',
        date: 'Hace 2 días',
        duration: '14:25',
        description: 'Volvemos a Extr3mo, tomamos unos días para poder manejar y apoyar a Venezuela lo más posible en la tragedia del doble terremoto, y te dejo saber cómo TÚ también puedes hacerlo. Un poco de farmeo para los preparativos del evento final, poco a poco ya tendremos el full netherite, usando mi X-Ray favorito para hacer todo más rápido. '
    };

    return (
        <section className="media-hook-section" id="media-hub">
            <div className="media-hook-container">

                <div className="hook-header">
                    <span className="hook-badge">ÚLTIMO VIDEO</span>
                    <h2>CONTENIDO <span>DESTACADO</span></h2>
                </div>

                {/* Tarjeta Cinematográfica Gigante */}
                <div className="video-hero-card">
                    <div className="video-thumbnail-wrapper">
                        <a
                            href={`https://www.youtube.com/watch?v=${latestVideo.videoId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <img
                                src={`https://img.youtube.com/vi/${latestVideo.videoId}/maxresdefault.jpg`}
                                alt={latestVideo.title}
                                className="hook-thumb"
                            />
                            <div className="video-play-overlay">▶</div>
                        </a>
                        <span className="video-duration">{latestVideo.duration}</span>
                    </div>

                    <div className="video-hook-details">
                        <div className="video-meta-tags">
                            <span className="meta-stat">{latestVideo.views}</span>
                            <span className="meta-divider">•</span>
                            <span className="meta-stat">{latestVideo.date}</span>
                        </div>
                        <h3 className="video-hook-title">{latestVideo.title}</h3>
                        <p className="video-hook-desc">{latestVideo.description}</p>

                        {/* BOTÓN GANCHO: Envia a la página multimedia completa */}
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

            </div>
        </section>
    );
}