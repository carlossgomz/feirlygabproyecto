import React from 'react';
import './socials.css';

export default function Socials() {
    const platforms = [
        { name: 'Twitch', handle: '@FeirlyGab', color: 'twitch', link: 'https://twitch.tv/feirlygab', count: 'Live Stream' },
        { name: 'TikTok', handle: '@FeirlyGab', color: 'tiktok', link: 'https://tiktok.com', count: '300K+ Fans' },
        { name: 'Instagram', handle: '@FeirlyGab', color: 'instagram', link: 'https://instagram.com', count: '80K+ Followers' },
        { name: 'Discord', handle: 'El Cyber-Espacio', color: 'discord', link: 'https://discord.com', count: 'Únete a la Comunidad' }
    ];

    return (
        <section className="socials-section">
            <div className="socials-container">
                <h2 className="section-title-neon">CONECTA EN <span>REDES</span></h2>
                <div className="socials-grid">
                    {platforms.map((social, index) => (
                        <a key={index} href={social.link} target="_blank" rel="noopener noreferrer" className={`social-card ${social.color}`}>
                            <div className="social-icon-box">⚡</div>
                            <div className="social-info">
                                <h3>{social.name}</h3>
                                <p className="handle">{social.handle}</p>
                                <span className="count-tag">{social.count}</span>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
}