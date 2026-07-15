import React from 'react';
import Hero from '../components/sections/hero';
import Feed from '../components/sections/feed';
import MediaHub from '../components/sections/mediahub';
import '../styles/sectiondivider.css';

export default function Home() {
    return (
        <main id="hub">
            <Hero />
            <div className="section-divider"></div>
            <MediaHub />
            <div className="section-divider"></div>
            <Feed />
        </main>
    );
}