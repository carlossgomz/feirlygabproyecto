import React, { useState } from 'react';
import './mediakit.css';

export default function MediaKit() {
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        email: '',
        proposal: ''
    });
    const [submitted, setSubmitted] = useState(false);

    // Estadísticas reales simuladas para el perfil de la streamer
    const stats = [
        { id: 1, label: 'Seguidores Totales', value: '500K+', color: 'purple' },
        { id: 2, label: 'Audiencia Twitch Promedio', value: '2.5K+', color: 'cyan' },
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