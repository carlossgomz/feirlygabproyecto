import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/navbar';
import ScrollToTop from './components/common/scrolltotop';
import Footer from './components/layout/footer';
import Home from './pages/home';
import Setup from './pages/setup';
import MediaKit from './pages/mediakit';
import Eventos from './pages/eventos';
import SobreMi from './pages/about';
import Comunidad from './pages/comunidad';

function App() {
  return (
    <Router>
      {/* Contenedor flexible para asegurar que el footer siempre empuje hacia abajo */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Componentes globales fijos en la parte superior */}
        <Navbar />
        <ScrollToTop />

        {/* Las secciones cambian dinámicamente según la URL (ocupando el espacio restante) */}
        <main style={{ flex: '1' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/mediakit" element={<MediaKit />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/sobre-mi" element={<SobreMi />} />
            <Route path="/comunidad" element={<Comunidad />} />
          </Routes>
        </main>

        {/* El Footer profesional con tu firma de Carloscode_ al cierre de toda la app */}
        <Footer />

      </div>
    </Router>
  );
}

export default App;