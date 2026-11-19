import { AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { PageTransition } from '@/components/layout/PageTransition';
import { SmoothScroll } from '@/components/layout/SmoothScroll';
import { ScrollTrigger, scrollToTop } from '@/lib/motion';
import Home from '@/pages/Home';
import Servizi from '@/pages/Servizi';
import Contatti from '@/pages/Contatti';
import BonificaAmianto from '@/pages/service-pages/BonificaAmianto';
import CopertureTetti from '@/pages/service-pages/CopertureTetti';
import ChiaviInMano from '@/pages/service-pages/ChiaviInMano';
import Ristrutturazioni from '@/pages/service-pages/Ristrutturazioni';
import ImpiantiManutenzione from '@/pages/service-pages/ImpiantiManutenzione';
import { CookiePage, NoteLegali, Privacy } from '@/pages/Legal';
import NotFound from '@/pages/NotFound';

export default function App() {
  const location = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  }, []);

  return (
    <>
      <SmoothScroll />
      <a href="#contenuto" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-navy focus:px-4 focus:py-2 focus:text-white">
        Vai al contenuto
      </a>
      <Navbar />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          scrollToTop();
          requestAnimationFrame(() => ScrollTrigger.refresh());
        }}
      >
        <PageTransition key={location.pathname}>
          <main id="contenuto">
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/servizi" element={<Servizi />} />
              <Route path="/servizi/bonifica-amianto" element={<BonificaAmianto />} />
              <Route path="/servizi/coperture-tetti" element={<CopertureTetti />} />
              <Route path="/servizi/costruzioni-chiavi-in-mano" element={<ChiaviInMano />} />
              <Route path="/servizi/ristrutturazioni-finiture" element={<Ristrutturazioni />} />
              <Route path="/servizi/impianti-manutenzione" element={<ImpiantiManutenzione />} />
              <Route path="/contatti" element={<Contatti />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/cookie" element={<CookiePage />} />
              <Route path="/note-legali" element={<NoteLegali />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </PageTransition>
      </AnimatePresence>
    </>
  );
}
