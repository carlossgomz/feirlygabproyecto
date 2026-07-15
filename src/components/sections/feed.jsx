import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/buttons.css';
import './feed.css';

/**
 * Feed — sección de feed de solo visualización, estilo red social, para feirlygab.
 *
 * Uso:
 *   <Feed />                            // usa los posts de ejemplo
 *   <Feed posts={misPosts} />           // usa tus propios posts
 *   <Feed comunidadHref="/comunidad" /> // ruta del botón "Ver más"
 *
 * Formato esperado de cada post:
 *   {
 *     id: string,
 *     type: "image" | "text" | "both",
 *     image?: string,
 *     text?: string,
 *     likes: number,
 *     date: string,       // ya formateada, ej. "2 días"
 *     comments?: [         // comentarios de la comunidad (nunca de la creadora)
 *       { author: string, text: string },
 *     ],
 *   }
 */

const SAMPLE_POSTS = [
  {
    id: 'p1',
    type: 'image',
    image: 'https://picsum.photos/seed/feirlygab1/600/750',
    likes: 482,
    date: '2 días',
    comments: [
      { author: 'valemartz', text: 'esto es todo 😍' },
      { author: 'renn.ok', text: 'necesitaba ver esto hoy' },
    ],
  },
  {
    id: 'p2',
    type: 'text',
    text: 'Grabando contenido nuevo toda la semana. Se viene algo grande para la comunidad 👀',
    likes: 219,
    date: '3 días',
    comments: [{ author: 'camimedina', text: 'el hype es real, no puedo esperar' }],
  },
  {
    id: 'p3',
    type: 'both',
    image: 'https://picsum.photos/seed/feirlygab2/600/500',
    text: 'Detrás de cámaras del último video. Gracias por acompañarme siempre.',
    likes: 731,
    date: '4 días',
    comments: [
      { author: 'dan_ruizz', text: 'se nota el esfuerzo en cada video' },
      { author: 'lupitasosa', text: 'mi parte favorita de la semana' },
    ],
  },
  {
    id: 'p4',
    type: 'image',
    image: 'https://picsum.photos/seed/feirlygab3/600/900',
    likes: 356,
    date: '5 días',
    comments: [{ author: 'andre.tv', text: 'la luz quedó perfecta' }],
  },
  {
    id: 'p5',
    type: 'text',
    text: 'Pregunta del día: ¿qué tipo de contenido quieren ver más este mes?',
    likes: 128,
    date: '6 días',
    comments: [
      { author: 'sofi_bg', text: 'un q&a estaría increíble' },
      { author: 'kevin.ram', text: 'más behind the scenes porfa' },
    ],
  },
  {
    id: 'p6',
    type: 'both',
    image: 'https://picsum.photos/seed/feirlygab4/600/600',
    text: 'Un ratito de descanso antes de seguir editando 🎬',
    likes: 590,
    date: '1 semana',
    comments: [{ author: 'isa.moreno', text: 'te lo mereces, descansa 💛' }],
  },
];

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
      <path d="M12 21s-6.7-4.3-9.5-8.1C.6 10.2 1 6.9 3.6 5.1c2.2-1.5 4.9-1 6.6.9L12 7.8l1.8-1.8c1.7-1.9 4.4-2.4 6.6-.9 2.6 1.8 3 5.1 1.1 7.8C18.7 16.7 12 21 12 21z" />
    </svg>
  );
}

function PostCard({ post }) {
  const hasImage = post.type === 'image' || post.type === 'both';
  const hasText = post.type === 'text' || post.type === 'both';

  return (
    <article className="feed-card">
      <div className="feed-card-header">
        <span className="feed-card-avatar" aria-hidden="true">FG</span>
        <div className="feed-card-header-info">
          <span className="feed-card-author">feirlygab</span>
          <span className="feed-card-date">{post.date}</span>
        </div>
      </div>

      {hasText && (
        <p className={`feed-card-text ${!hasImage ? 'feed-card-text-only' : ''}`}>
          {post.text}
        </p>
      )}

      {hasImage && (
        <div className="feed-card-image">
          <img src={post.image} alt="" loading="lazy" />
        </div>
      )}

      <div className="feed-card-body">
        <div className="feed-card-meta">
          <span className="feed-card-likes">
            <HeartIcon />
            {post.likes.toLocaleString('es')}
          </span>
        </div>

        {/* Comentarios de la comunidad — solo lectura, nunca de la creadora */}
        {post.comments && post.comments.length > 0 && (
          <ul className="feed-card-comments">
            {post.comments.map((comment, i) => (
              <li key={i} className="feed-comment">
                <span className="feed-comment-avatar" aria-hidden="true">
                  {comment.author.charAt(0)}
                </span>
                <p className="feed-comment-text">
                  <span className="feed-comment-author">{comment.author}</span>{' '}
                  {comment.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
}

export default function Feed({
  posts = SAMPLE_POSTS,
  comunidadHref = '/comunidad',
}) {
  return (
    <div className="feed-viewport">
      <div className="feed-glow feed-glow-purple"></div>
      <div className="feed-glow feed-glow-cyan"></div>

      <div className="feed-content-wrapper">
        <div className="feed-header">
          <div className="feed-badge">
            <span className="feed-badge-text">COMUNIDAD</span>
          </div>
          <h2 className="feed-title">Lo último en el feed</h2>
          <p className="feed-subtitle">
            Un vistazo a lo que compartí recientemente. Para ver todo y unirte
            a la conversación, entra a la comunidad.
          </p>
        </div>

        <div className="feed-grid">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="feed-cta-wrapper">
          <Link to={comunidadHref} className="btn-primary-neon feed-cta-btn">
            Ver más en la comunidad
            <span className="feed-cta-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}