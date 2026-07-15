import React, { useState, useEffect } from 'react';
import './mediakit.css';

// Al estar la función serverless en el mismo proyecto de Vercel (carpeta
// /api), la ruta es relativa: no hace falta poner el dominio completo.
const STATS_API_URL = '/api/twitch-stats';

// Valores de respaldo por si la API aún no cargó o falla, para que la
// página nunca se vea "rota" de cara a una marca.
const FALLBACK_STATS = {
    followers: '500K+',
    viewers: '2.5K+',
};

function formatNumber(n) {
    if (n === undefined || n === null) return '—';
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K+`;
    return `${n}`;
}

export default function MediaKit() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        proposal: ''
    });
    const [submitted, setSubmitted] = useState(false);

    // Estado de estadísticas reales de Twitch
    const [twitchStats, setTwitchStats] = useState(null);
    const [statsError, setStatsError] = useState(false);

    useEffect(() => {
        let cancelled = false;

        async function loadStats() {
            try {
                const res = await fetch(STATS_API_URL);
                if (!res.ok) throw new Error(`Respuesta no válida (${res.status})`);
                const data = await res.json();
                if (!cancelled) {
                    setTwitchStats(data);
                    setStatsError(false);
                }
            } catch (err) {
                console.error('No se pudieron cargar las estadísticas de Twitch:', err);
                if (!cancelled) setStatsError(true);
            }
        }

        loadStats();
        // Refresca automáticamente cada 5 minutos mientras alguien tenga la página abierta
        const interval = setInterval(loadStats, 5 * 60 * 1000);

        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    // Estadísticas mostradas: reales cuando están disponibles, fallback si no
    const followersValue = twitchStats
        ? formatNumber(twitchStats.followers)
        : (statsError ? FALLBACK_STATS.followers : '...');

    // Cuando Redis ya acumuló muestras (avgSampleCount > 0), usamos el
    // promedio real. Si todavía no hay muestras (recién configurado, o
    // pocos días desde que activaste el cron), caemos a una cifra fija
    // editable a mano mientras se acumula historial suficiente.
    const AVERAGE_VIEWERS_MANUAL = '⏳ sin datos aún';
    const hasRealAverage = twitchStats && twitchStats.avgViewers !== null && twitchStats.avgSampleCount > 0;

    const audienceLabel = twitchStats?.isLive ? 'Espectadores en Vivo (real)' : 'Audiencia Twitch Promedio';
    const audienceValue = twitchStats
        ? (twitchStats.isLive
            ? formatNumber(twitchStats.currentViewers)
            : (hasRealAverage ? formatNumber(twitchStats.avgViewers) : AVERAGE_VIEWERS_MANUAL))
        : (statsError ? FALLBACK_STATS.viewers : '...');

    const stats = [
        { id: 1, label: 'Seguidores en Twitch', value: followersValue, color: 'purple' },
        { id: 2, label: audienceLabel, value: audienceValue, color: 'cyan' },
        { id: 3, label: 'Impresiones Mensuales', value: '4M+', color: 'pink' },
        { id: 4, label: 'Engagement Rate', value: '18.4%', color: 'white' }
    ];

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí se integraría la lógica de envío (ej. EmailJS o una API propia)
        console.log('Propuesta corporativa recibida:', formData);
        setSubmitted(true);
    };

    return (
        <div className="mediakit-page">
            <div className="mediakit-glow"></div>

            <div className="mediakit-container">

                {/* Encabezado Corporativo */}
                <div className="mediakit-header">
                    <span className="executive-tag">BUSINESS & PARTNERSHIPS</span>
                    <h1 className="mediakit-title">MEDIA <span>KIT</span></h1>
                    <p className="mediakit-subtitle">
                        Conecta tu marca con una de las comunidades más activas y leales del ecosistema gaming en Latinoamérica.
                        Revisa nuestras métricas e inicia una colaboración de alto impacto.
                    </p>
                </div>

                {/* Cuadrícula de Métricas Clave */}
                <div className="stats-grid">
                    {stats.map(stat => (
                        <div key={stat.id} className={`stat-card ${stat.color}`}>
                            <p className="stat-value">{stat.value}</p>
                            <p className="stat-label">{stat.label}</p>
                        </div>
                    ))}
                </div>
                {twitchStats && (
                    <p className="stats-updated-note">
                        Estadísticas de Twitch actualizadas automáticamente · {new Date(twitchStats.updatedAt).toLocaleString('es-ES')}
                    </p>
                )}

                {/* Bloque de Contacto y Demografía */}
                <div className="business-content">

                    {/* Información Demográfica */}
                    <div className="demo-info">
                        <h2 className="section-subtitle">Nuestra <span>Audiencia</span></h2>
                        <p className="demo-text">
                            El contenido conecta principalmente con un público joven apasionado por los videojuegos competitivos,
                            la tecnología y la cultura pop digital.
                        </p>
                        <div className="bar-chart-wrapper">
                            <div className="chart-row">
                                <span className="chart-label">Latinoamérica (VEN, COL, MEX)</span>
                                <div className="chart-bar"><div className="bar-fill" style={{ width: '75%' }}></div></div>
                                <span className="chart-percentage">75%</span>
                            </div>
                            <div className="chart-row">
                                <span className="chart-label">Edad (18 - 27 años)</span>
                                <div className="chart-bar"><div className="bar-fill pink" style={{ width: '82%' }}></div></div>
                                <span className="chart-percentage">82%</span>
                            </div>
                        </div>
                    </div>

                    {/* Formulario de Propuestas */}
                    <div className="contact-form-wrapper">
                        <h2 className="section-subtitle">Contacto <span>Ejecutivo</span></h2>

                        {submitted ? (
                            <div className="form-success">
                                <p className="success-icon">✉️</p>
                                <h3>¡Propuesta Recibida!</h3>
                                <p>El equipo de representación revisará tu mensaje y se pondrá en contacto en un plazo menor a 48 horas laborales.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="corporate-form">
                                <div className="form-group">
                                    <label>Nombre del Representante</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej. Juan Pérez"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Empresa / Marca</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.company}
                                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                        placeholder="Ej. Red Bull Latam"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Correo Electrónico de Negocios</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="ejemplo@marca.com"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Detalles de la Propuesta</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.proposal}
                                        onChange={(e) => setFormData({ ...formData, proposal: e.target.value })}
                                        placeholder="Describe el alcance de la campaña, objetivos y presupuesto estimado..."
                                    ></textarea>
                                </div>
                                <button type="submit" className="submit-corp-btn">Enviar Solicitud de Alianza</button>
                            </form>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}