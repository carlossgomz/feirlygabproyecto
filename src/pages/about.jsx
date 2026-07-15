import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/sectiondivider.css';
import './about.css';
import gabimage2 from '../assets/buena1.png';

export default function SobreMi() {

    return (
        <div className="sobremi-page">
            <div className="sobremi-container">

                <header className="sobremi-header">
                    <Link to="/" className="back-btn">← Volver al Inicio</Link>
                </header>
                {/* Foto grande + frase destacada */}
                <section className="sobremi-hero-layout">
                    {/* Foto a la izquierda */}
                    <div className="sobremi-photo-wrapper">
                        <img src={gabimage2} alt="Feirlygab" className="sobremi-photo" />
                    </div>

                    {/* Historia a la derecha */}
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
            </div>
        </div>
    );
}