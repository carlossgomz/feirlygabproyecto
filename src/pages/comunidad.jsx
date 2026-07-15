import React, { useState } from 'react';
import '../styles/buttons.css';
import './comunidad.css';

/**
 * Página /comunidad — muro de la comunidad (solo lectura), galería de fan arts
 * y un formulario para dejar un mensaje.
 *
 * IMPORTANTE: el formulario de mensajes guarda las respuestas solo en memoria
 * (useState). Al recargar la página se pierden. Para que persistan de verdad
 * hace falta conectarlo a un backend / base de datos (Firebase, Supabase,
 * una API propia, etc.). Cuando quieras dar ese paso, avísame.
 */

const WALL_POSTS = [
    {
        id: 'w1',
        author: 'valemartz',
        text: '¡El stream de anoche estuvo increíble! Esa remontada en la última partida no me la esperaba 🔥',
        likes: 64,
        date: '1 día',
    },
    {
        id: 'w2',
        author: 'kevin.ram',
        text: 'Alguien más está esperando la colab con otros streamers? necesitamos eso ya',
        likes: 41,
        date: '2 días',
    },
    {
        id: 'w3',
        author: 'sofi_bg',
        text: 'Gracias por el consejo de configuración que diste en el directo, mi setup ya no tiene lag 🙌',
        likes: 87,
        date: '3 días',
    },
    {
        id: 'w4',
        author: 'andre.tv',
        text: 'La comunidad de Discord se siente como una familia, gracias por crear este espacio',
        likes: 132,
        date: '4 días',
    },
];

const FAN_ARTS = [
    {
        id: 'f1',
        artist: 'renn.ok',
        image: 'https://picsum.photos/seed/fanart1/500/620',
    },
    {
        id: 'f2',
        artist: 'lupitasosa',
        image: 'https://picsum.photos/seed/fanart2/500/500',
    },
    {
        id: 'f3',
        artist: 'dan_ruizz',
        image: 'https://picsum.photos/seed/fanart3/500/680',
    },
    {
        id: 'f4',
        artist: 'isa.moreno',
        image: 'https://picsum.photos/seed/fanart4/500/560',
    },
    {
        id: 'f5',
        artist: 'camimedina',
        image: 'https://picsum.photos/seed/fanart5/500/620',
    },
    {
        id: 'f6',
        artist: 'andre.tv',
        image: 'https://picsum.photos/seed/fanart6/500/500',
    },
];

function HeartIcon() {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
            <path d="M12 21s-6.7-4.3-9.5-8.1C.6 10.2 1 6.9 3.6 5.1c2.2-1.5 4.9-1 6.6.9L12 7.8l1.8-1.8c1.7-1.9 4.4-2.4 6.6-.9 2.6 1.8 3 5.1 1.1 7.8C18.7 16.7 12 21 12 21z" />
        </svg>
    );
}

function WallPost({ post }) {
    return (
        <article className="wall-post">
            <div className="wall-post-header">
                <span className="wall-post-avatar" aria-hidden="true">
                    {post.author.charAt(0)}
                </span>
                <div className="wall-post-header-info">
                    <span className="wall-post-author">{post.author}</span>
                    <span className="wall-post-date">{post.date}</span>
                </div>
            </div>
            <p className="wall-post-text">{post.text}</p>
            <div className="wall-post-meta">
                <span className="wall-post-likes">
                    <HeartIcon />
                    {post.likes.toLocaleString('es')}
                </span>
            </div>
        </article>
    );
}

export default function Comunidad() {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [submittedMessages, setSubmittedMessages] = useState([]);
    const [status, setStatus] = useState(null); // null | 'success' | 'error'

    function handleSubmit(e) {
        e.preventDefault();

        if (!name.trim() || !message.trim()) {
            setStatus('error');
            return;
        }

        const newMessage = {
            id: `local-${Date.now()}`,
            name: name.trim(),
            message: message.trim(),
        };

        setSubmittedMessages((prev) => [newMessage, ...prev]);
        setName('');
        setMessage('');
        setStatus('success');
    }

    return (
        <div className="community-viewport">
            <div className="community-glow community-glow-pink"></div>
            <div className="community-glow community-glow-cyan"></div>

            <div className="community-content-wrapper">
                {/* Encabezado de la página */}
                <header className="community-header">
                    <span className="community-eyebrow">@feirlygab</span>
                    <h1 className="community-title">Comunidad</h1>
                    <p className="community-subtitle">
                        Todo lo que comparten los fans: reacciones, fan arts y mensajes
                        para el resto de la comunidad.
                    </p>
                </header>

                {/* Muro de la comunidad */}
                <section className="community-section" aria-labelledby="wall-heading">
                    <h2 id="wall-heading" className="community-section-title">
                        Muro de la comunidad
                    </h2>
                    <div className="wall-feed">
                        {WALL_POSTS.map((post) => (
                            <WallPost key={post.id} post={post} />
                        ))}
                    </div>
                </section>

                {/* Fan arts */}
                <section className="community-section" aria-labelledby="fanart-heading">
                    <h2 id="fanart-heading" className="community-section-title">
                        Fan arts
                    </h2>
                    <div className="fanart-grid">
                        {FAN_ARTS.map((art) => (
                            <figure key={art.id} className="fanart-card">
                                <img src={art.image} alt="" loading="lazy" />
                                <figcaption className="fanart-credit">por {art.artist}</figcaption>
                            </figure>
                        ))}
                    </div>
                </section>

                {/* Dejar un mensaje */}
                <section className="community-section" aria-labelledby="message-heading">
                    <h2 id="message-heading" className="community-section-title">
                        Déjale un mensaje a la comunidad
                    </h2>

                    <form className="message-form" onSubmit={handleSubmit} noValidate>
                        <div className="message-form-row">
                            <label htmlFor="name" className="message-form-label">
                                Tu nombre
                            </label>
                            <input
                                id="name"
                                type="text"
                                className="message-form-input"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="¿Cómo te llamas?"
                                maxLength={40}
                            />
                        </div>

                        <div className="message-form-row">
                            <label htmlFor="message" className="message-form-label">
                                Tu mensaje
                            </label>
                            <textarea
                                id="message"
                                className="message-form-textarea"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Escribe algo para el resto de la comunidad..."
                                rows={4}
                                maxLength={400}
                            />
                        </div>

                        {status === 'error' && (
                            <p className="message-form-status message-form-status-error">
                                Completa tu nombre y tu mensaje antes de enviarlo.
                            </p>
                        )}
                        {status === 'success' && (
                            <p className="message-form-status message-form-status-success">
                                ¡Gracias por tu mensaje!
                            </p>
                        )}

                        <button type="submit" className="btn-primary-neon message-form-submit">
                            Enviar mensaje
                        </button>
                    </form>

                    {submittedMessages.length > 0 && (
                        <ul className="message-list">
                            {submittedMessages.map((m) => (
                                <li key={m.id} className="message-list-item">
                                    <span className="message-list-name">{m.name}</span>
                                    <p className="message-list-text">{m.message}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </div>
    );
}