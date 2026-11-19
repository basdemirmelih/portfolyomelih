import React, { useEffect, useState } from 'react';
import Lenis from 'lenis';
import Header from './Header';
import Hero from './Hero';
import ParticleStage from './ParticleStage';
import Seritler from './Seritler';
import About from './About';
import Calismalar from './Calismalar';
import Contact from './Contact';
import Zemin from './Zemin';
import { gsap, ScrollTrigger, kaydirici, hareketAzalt } from '../lib/anim';
import { renkYolculugu } from './renk';

function App() {
    const azalt = hareketAzalt();
    const [fontlar, setFontlar] = useState(false);

    // Akıcı kaydırma; GSAP ile aynı saatte çalışır.
    useEffect(() => {
        if (azalt) return undefined;
        // Dokunmatik cihazlar: tarayıcı kaydırmayı kendi iş parçacığında yapar; sabitlenen bölüm ve
        // parçacık tuvali JavaScript'te birkaç kare geriden gelir, bu da takılma/donma gibi görünür.
        // normalizeScroll kaydırmayı JavaScript tarafına alır: sayfa, sabit bölüm ve parçacıklar aynı karede
        // hareket eder, adres çubuğu da kaydırırken zıplamaz. Lenis burada kullanılmaz (dokunmada işi yok).
        if (window.matchMedia('(pointer: coarse)').matches) {
            const norm = ScrollTrigger.normalizeScroll({ allowNestedScroll: true });
            return () => { norm?.kill?.(); ScrollTrigger.normalizeScroll(false); };
        }
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        kaydirici.lenis = lenis;
        lenis.scrollTo(0, { immediate: true, force: true });
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
            <Zemin />
            <div className="atmosfer" aria-hidden="true" />
            <div className="doku" aria-hidden="true" />
            <a className="atla" href="#yetkinlikler">İçeriğe geç</a>
            <Header />
            <main>
                <Hero />
                <ParticleStage fontlarHazir={fontlar} />
                <Seritler />
                <About />
                <Calismalar />
            </main>
            <Contact />
        </>
    );
}

export default App;
