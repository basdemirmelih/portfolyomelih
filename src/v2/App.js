import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Header from './Header';
import Hero from './Hero';
import ParticleStage from './ParticleStage';
import Projects from './Projects';
import About from './About';
import Vitrin from './Vitrin';
import Contact from './Contact';
import { gsap, ScrollTrigger, kaydirici, hareketAzalt } from '../lib/anim';
import { renkYolculugu } from './renk';

function App() {
    const azalt = hareketAzalt();
    const [fontlar, setFontlar] = useState(false);

    // Akıcı kaydırma; GSAP ile aynı saatte çalışır.
    useEffect(() => {
        if (azalt) return undefined;
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
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

    // Yazı tipleri yüklenmeden ölçüm yapılmasın (isim parçacıkları yazının şeklinden örneklenir).
    useEffect(() => {
        const bitti = () => { setFontlar(true); ScrollTrigger.refresh(); };
        if (document.fonts?.ready) document.fonts.ready.then(bitti); else bitti();
    }, []);

    // Sabitlenen sahne kurulduktan sonra renk geçişleri ve tüm tetikleyiciler sayfa sırasına göre yeniden hesaplanır.
    useEffect(() => {
        if (!fontlar) return undefined;
        const temizle = renkYolculugu();
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
        return temizle;
    }, [fontlar]);

    return (
        <>
            <div className="atmosfer" aria-hidden="true" />
            <a className="atla" href="#projeler">İçeriğe geç</a>
            <Header />
            <main>
                <Hero />
                <ParticleStage fontlarHazir={fontlar} />
                <Projects />
                <About />
                <Vitrin />
            </main>
            <Contact />
        </>
    );
}

export default App;
