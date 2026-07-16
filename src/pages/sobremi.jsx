import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sectiondivider.css';
import './sobremi.css';
import gabimage2 from '../assets/buena1.png';

export default function SobreMi() {
    // Hardware resumido en especificaciones clave de una sola línea
    const hardwareList = [
        { category: 'Procesador', model: 'AMD Ryzen 9 7900X', tag: 'Core del Sistema' },
        { category: 'Gráfica', model: 'NVIDIA RTX 4070 Ti (12GB)', tag: '4K Gaming & Streaming' },
        { category: 'Memoria RAM', model: '32GB DDR5 Kingston Fury 5600MHz', tag: 'Dual Channel' },
        { category: 'Almacenamiento', model: '2TB NVMe M.2 SSD Kingston', tag: 'Cargas Ultra Rápidas' },
        { category: 'Cámara Principal', model: 'Sony Alpha ZV-E10 + Lente 16-50mm', tag: 'Calidad Cinematic' },
        { category: 'Micrófono', model: 'Shure SM7B + Interfaz Focusrite', tag: 'Audio Broadcast' },
        { category: 'Monitor Principal', model: 'ASUS ROG Strix 27" IPS 170Hz', tag: 'Competitivo' },
        { category: 'Iluminación', model: 'Elgato Key Light Air (x2)', tag: 'Estudio Neón' }
    ];

    return (
        <div className="sobremi-page">
            <div className="sobremi-container">

                <header className="sobremi-header">
                    <Link to="/" className="back-btn">← Volver al Inicio</Link>
                </header>

                {/* Foto grande + historia */}
                <section className="sobremi-hero-layout">
                    <div className="sobremi-photo-wrapper">
                        <img src={gabimage2} alt="Feirlygab" className="sobremi-photo" />
                    </div>

                    <div className="sobremi-bio-content">
                        <h2>MI <span>HISTORIA</span></h2>
                        <p className="bio-text">
                            Todo comenzó como un hobby: transmitir un par de horas después del trabajo solo para desconectar y compartir tiempo con quien se pasara por el chat. Con el tiempo, esas transmisiones se convirtieron en una comunidad real, con su propio lenguaje y su propia identidad visual.
                        </p>
                        <p className="bio-text">
                            Hoy el contenido combina gameplay competitivo, vlogs, eventos presenciales y colaboraciones con marcas, siempre manteniendo la misma esencia: cercanía, humor y ese toque oscuro-neón que caracteriza a Feirlygab.
                        </p>
                    </div>
                </section>

                {/* Setup / Battlestation, ahora como sección dentro del mismo scroll */}
                <section className="setup-section" id="setup">
                    <div className="setup-header">
                        <span className="setup-tag">BATTLESTATION</span>
                        <h2>ESPECIFICACIONES DEL <span>SETUP</span></h2>
                        <p>El hardware y equipo de transmisión que hace posible cada transmisión en vivo y producción de contenido.</p>
                    </div>

                    <div className="setup-specs-grid">
                        {hardwareList.map((item, index) => (
                            <div key={index} className="spec-row-card">
                                <div className="spec-meta">
                                    <span className="spec-category">{item.category}</span>
                                    <h3 className="spec-model">{item.model}</h3>
                                </div>
                                <span className="spec-badge">{item.tag}</span>
                            </div>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
}
