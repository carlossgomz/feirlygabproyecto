import React from 'react';
import './setup.css';

export default function Setup() {
    // Todo el hardware resumido en especificaciones clave de una sola línea
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
        <section className="setup-compact-section" id="setup">
            <div className="setup-compact-container">

                <div className="setup-compact-header">
                    <span className="setup-tag">BATTLESTATION</span>
                    <h2>ESPECIFICACIONES DEL <span>SETUP</span></h2>
                    <p>El hardware y equipo de transmisión que hace posible cada transmisión en vivo y producción de contenido.</p>
                </div>

                {/* Matriz técnica limpia en dos columnas */}
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

            </div>
        </section>
    );
}