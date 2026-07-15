import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import './footer.css';
import logo from '../../assets/logo.png';

export default function Footer() {
    return (
        <footer className="cyber-footer">
            <div className="footer-container">

                {/* Columna 1: Marca Principal */}
                <div className="footer-brand-section">
                    <Link to="/" className="footer-logo">
                        <img src={logo} alt="Feirlygab" className="footer-logo-img" />
                    </Link>
                </div>

                {/* Columna 2: Enlaces Rápidos (Páginas) */}
                <div className="footer-links-section">
                    <h4>Navegación</h4>
                    <ul className="footer-menu">
                        <li><NavLink to="/" end>Hub (Inicio)</NavLink></li>
                        <li><NavLink to="/eventos">Eventos Próximos</NavLink></li>
                        <li><NavLink to="/setup">Mi Setup</NavLink></li>
                        <li><NavLink to="/mediakit">Media Kit</NavLink></li>
                    </ul>
                </div>
            </div>

            {/* Barra Inferior de Créditos */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <p className="copyright">
                        &copy; {new Date().getFullYear()} FEIRLYGAB. Todos los derechos reservados.
                    </p>
                    <p className="developer-credit">
                        Hecho por <span>Carloscode_</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}