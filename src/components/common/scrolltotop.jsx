import React, { useState, useEffect } from 'react';
import './scrolltotop.css';

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    // Escuchar el scroll del usuario para mostrar/ocultar el botón
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 400) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    // Función para subir con efecto suave (smooth)
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <button
            className={`scroll-to-top-btn ${isVisible ? 'show' : ''}`}
            onClick={scrollToTop}
            aria-label="Volver arriba"
        >
            <span className="arrow-up">▲</span>
        </button>
    );
}