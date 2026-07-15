import React from 'react';
import { Link } from 'react-router-dom';
import './eventos.css';

export default function Eventos() {
    // Lista de eventos próximos (tanto Online como Presenciales)
    const listaEventos = [
        {
            id: 1,
            date: '18 JUL',
            time: '18:00 UTC',
            title: 'Torneo Rivals: VI EN TI 🏆',
            type: 'Especial Twitch',
            modality: 'Online',
            location: 'twitch.tv/feirlygab',
            desc: 'Edición especial del torneo de creadores. Squads de streamers compitiendo en vivo por el pool de premios.',
            status: 'Confirmado',
            link: 'https://twitch.tv/feirlygab',
            btnText: 'Recordarme en Twitch 🔔'
        },
        {
            id: 2,
            date: '15 AGO',
            time: '16:00 Local',
            title: 'Meet & Greet de la Comunidad 🤝',
            type: 'Presencial',
            modality: 'Presencial',
            location: 'Centro de Convenciones (Zona Gaming)',
            desc: '¡Nos vemos cara a cara! Espacio dedicado para conocer a la comunidad, firmas de autógrafos, fotos grupales y entrega de mercancía exclusiva.',
            status: 'Confirmado',
            link: '#', // Aquí puedes poner el enlace a la compra de boletos o ubicación de Google Maps
            btnText: 'Ver Ubicación 📍'
        },
        {
            id: 3,
            date: '29 AGO',
            time: '20:00 UTC',
            title: 'Stream de Aniversario 🎉',
            type: 'Comunidad',
            modality: 'Online',
            location: 'twitch.tv/feirlygab',
            desc: 'Celebramos el año de directos con sorteos de skins, dinámicas de juego con viewers y anuncios exclusivos de la marca.',
            status: 'Próximamente',
            link: 'https://twitch.tv/feirlygab',
            btnText: 'Ir al Canal 👾'
        }
    ];

    return (
        <div className="eventos-page">
            <div className="eventos-container">

                <header className="eventos-header">
                    <Link to="/" className="back-btn">← Volver al Hub</Link>
                    <h1>PRÓXIMOS <span>EVENTOS</span></h1>
                    <p>Entérate de las próximas transmisiones en vivo, torneos especiales y encuentros presenciales con la comunidad.</p>
                </header>

                {/* Cronograma / Timeline de Eventos */}
                <div className="eventos-timeline">
                    {listaEventos.map((evento) => (
                        <div key={evento.id} className="evento-timeline-card">

                            {/* Bloque de Fecha Izquierda */}
                            <div className="evento-date-block">
                                <span className="ev-date">{evento.date}</span>
                                <span className="ev-time">{evento.time}</span>
                            </div>

                            {/* Contenido Derecho */}
                            <div className="evento-info-block">
                                <div className="evento-meta">
                                    <div className="evento-tags">
                                        <span className="ev-type-tag">{evento.type}</span>
                                        {/* Nueva etiqueta dinámica según la modalidad (Presencial u Online) */}
                                        <span className={`ev-modality-tag ${evento.modality.toLowerCase()}`}>
                                            {evento.modality === 'Presencial' ? '🏢 Presencial' : '🌐 En Línea'}
                                        </span>
                                    </div>
                                    <span className={`ev-status ${evento.status.toLowerCase()}`}>{evento.status}</span>
                                </div>

                                <h3 className="evento-title">{evento.title}</h3>

                                {/* Indicador de lugar físico o canal digital */}
                                <div className="evento-location">
                                    <strong>Donde:</strong> {evento.location}
                                </div>

                                <p className="evento-desc">{evento.desc}</p>

                                {/* Botón de acción dinámico */}
                                <a href={evento.link} target={evento.link.startsWith('http') ? '_blank' : '_self'} rel="noopener noreferrer" className="evento-cta-btn">
                                    {evento.btnText}
                                </a>
                            </div>

                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}