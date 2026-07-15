import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './navbar.css';
import gabLogo from '../../assets/logo.png';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="cyber-navbar">
            <div className="nav-container">
                {/* Logo de Marca */}
                <NavLink to="/" className="nav-logo" onClick={() => setIsOpen(false)}>
                    <img src={gabLogo} alt="FeirlyGab" className="nav-logo-img" />
                </NavLink>

                {/* Menú de Hamburguesa para Celulares */}
                <button className={`nav-toggle ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                    <span></span>
                    <span></span>
                    <span></span>
                </button>

                {/* Enlaces de Navegación */}
                <div className={`nav-links ${isOpen ? 'active' : ''}`}>
                    <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setIsOpen(false)}>
                        Inicio
                    </NavLink>
                    <NavLink to="/sobre-mi" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setIsOpen(false)}>
                        Sobre mi
                    </NavLink>
                    <NavLink to="/eventos" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setIsOpen(false)}>
                        Eventos
                    </NavLink>
                    <NavLink to="/comunidad" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setIsOpen(false)}>
                        Comunidad
                    </NavLink>
                    <NavLink to="/setup" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setIsOpen(false)}>
                        Setup
                    </NavLink>
                    <NavLink to="/mediakit" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} onClick={() => setIsOpen(false)}>
                        Media Kit
                    </NavLink>
                    <a href="https://twitch.tv/feirlygab" target="_blank" rel="noopener noreferrer" className="nav-btn-twitch">
                        Twitch Live
                    </a>
                </div>
            </div>
        </nav>
    );
}