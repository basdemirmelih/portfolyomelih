import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Loader from './components/Loader';
import Header from './components/Header';
import Hero from './components/Hero';
import Manifesto from './components/Manifesto';
import Projects from './components/Projects';
import Skills from './components/Skills';
import About from './components/About';
import Contact from './components/Contact';
import { gsap, ScrollTrigger, kaydirici, hareketAzalt } from './lib/anim';

function App() {
    const azalt = hareketAzalt();
    const [hazir, setHazir] = useState(azalt);

    // Akıcı kaydırma (Lenis) ve GSAP ScrollTrigger aynı saatle çalışır.
    useEffect(() => {
        if (azalt) return undefined;
        const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
        kaydirici.lenis = lenis;
        lenis.on('scroll', ScrollTrigger.update);
        const tik = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(tik);
        gsap.ticker.lagSmoothing(0);
        return () => {
            gsap.ticker.remove(tik);
            lenis.destroy();
            kaydirici.lenis = null;
        };
    }, [azalt]);

    // Yükleme perdesi kalkana kadar sayfa kaydırılmaz.
    useEffect(() => {
        if (hazir) {
            kaydirici.lenis?.start();
            document.documentElement.classList.remove('kilitli');
            ScrollTrigger.refresh();
        } else {
            kaydirici.lenis?.stop();
            document.documentElement.classList.add('kilitli');
        }
    }, [hazir]);

    // Yazı tipleri yüklenince ölçüler değişir; tetikleyicileri yeniden hesapla.
    useEffect(() => {
        if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
        window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
    }, []);

    return (
        <>
            {!azalt && <Loader bitti={() => setHazir(true)} />}
            <a className="atla" href="#projeler">İçeriğe geç</a>
            <Header />
            <main>
                <Hero hazir={hazir} />
                <Manifesto />
                <Projects />
                <Skills />
                <About />
            </main>
            <Contact />
        </>
    );
}

export default App;
