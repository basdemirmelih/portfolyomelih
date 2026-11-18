import React, { Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import Coz from './Coz';
import { gsap, useGSAP, hareketAzalt, git } from '../lib/anim';

// Three.js ayrı bir parça olarak yüklenir; ilk sayfa açılışını yavaşlatmaz.
const ParticleScene = lazy(() => import('../three/ParticleScene'));

const SEKILLER = [
    { ad: 'Bilgisayar mühendisliği', metin: 'Balıkesir Üniversitesi, 2023–2027.' },
    { ad: 'Siber güvenlik', metin: 'CTF’lerde web güvenliği, tersine mühendislik ve şifre analizi.' },
    { ad: 'Yazılım geliştirme', metin: 'Python ve C# ile uygulamalar, React ile web arayüzleri.' },
    { ad: 'Oyun geliştirme', metin: 'Unity ve C# ile 3D oyunlar ve oyun mekanikleri.' },
];
const OTOMATIK_SURE = 7000;

const Ok = ({ yon }) => (
    <svg viewBox="0 0 48 12" width="48" height="12" aria-hidden="true">
        {yon === 'sol'
            ? <path d="M47 6H2M7 1L2 6l5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />
            : <path d="M1 6h45M41 1l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.2" />}
    </svg>
);

const Hero = ({ hazir }) => {
    const kok = useRef(null);
    const sahne = useRef(null);
    const azalt = hareketAzalt();
    const [sahneHazir, setSahneHazir] = useState(false);
    const [index, setIndex] = useState(0);
    const [mesgul, setMesgul] = useState(false);
    const [duraklat, setDuraklat] = useState(false);

    const sahneKuruldu = useCallback(() => setSahneHazir(true), []);

    // Seçili şekle geçiş; perde kalkmadan başlamaz.
    useEffect(() => {
        if (!hazir || !sahneHazir || !sahne.current) return;
        setMesgul(true);
        sahne.current.goster(index).then(() => setMesgul(false));
    }, [index, hazir, sahneHazir]);

    const degistir = useCallback((adim) => {
        if (mesgul) return;
        setIndex((i) => (i + adim + SEKILLER.length) % SEKILLER.length);
    }, [mesgul]);

    // Otomatik oynatma: fare sahnenin üzerindeyken veya sekme gizliyken durur.
    useEffect(() => {
        if (azalt || duraklat || mesgul || !hazir) return undefined;
        const id = setTimeout(() => { if (!document.hidden) degistir(1); }, OTOMATIK_SURE);
        return () => clearTimeout(id);
    }, [azalt, duraklat, mesgul, hazir, index, degistir]);

    // Klavye okları, giriş ekranı görünürken çalışır.
    useEffect(() => {
        const tus = (e) => {
            if (window.scrollY > window.innerHeight * 0.6) return;
            if (e.target.closest && e.target.closest('input, textarea')) return;
            if (e.key === 'ArrowRight') degistir(1);
            if (e.key === 'ArrowLeft') degistir(-1);
        };
        window.addEventListener('keydown', tus);
        return () => window.removeEventListener('keydown', tus);
    }, [degistir]);

    useGSAP(() => {
        if (!hazir || azalt) return;
        gsap.timeline({ defaults: { ease: 'power4.out' } })
            .from('.isim-satir > span', { yPercent: 115, duration: 1.4, stagger: 0.12 }, 0.5)
            .from('.giris-sekil, .giris-ok', { opacity: 0, duration: 1.2, stagger: 0.1 }, 1.0)
            .from('.parcacik-sahne', { opacity: 0, duration: 1.5, ease: 'power2.out' }, 0);

        gsap.to('.giris-icerik', {
            yPercent: -30,
            ease: 'none',
            scrollTrigger: { trigger: kok.current, start: 'top top', end: 'bottom top', scrub: true },
        });
        gsap.to('.giris-karartma', {
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: kok.current, start: 'top top', end: 'bottom top', scrub: true },
        });
    }, { scope: kok, dependencies: [hazir] });

    const aktif = SEKILLER[index];

    return (
        <section
            className="giris"
            id="basa"
            ref={kok}
            onPointerEnter={() => setDuraklat(true)}
            onPointerLeave={() => setDuraklat(false)}
        >
            <Suspense fallback={null}>
                <ParticleScene ref={sahne} hareketAzalt={azalt} onHazir={sahneKuruldu} />
            </Suspense>
            <div className="giris-karartma" aria-hidden="true" />

            <button type="button" className="giris-ok giris-ok--sol" onClick={() => degistir(-1)} disabled={mesgul} aria-label="Önceki şekil">
                <Ok yon="sol" />
            </button>
            <button type="button" className="giris-ok giris-ok--sag" onClick={() => degistir(1)} disabled={mesgul} aria-label="Sonraki şekil">
                <Ok yon="sag" />
            </button>

            <div className="giris-icerik">
                <h1 className="isim" aria-label="Melih Başdemir">
                    <span className="isim-satir"><span>MELİH</span></span>
                    <span className="isim-satir"><span>BAŞDEMİR</span></span>
                </h1>

                <div className="giris-sekil" aria-live="polite">
                    <p className="giris-sayac">
                        {String(index + 1).padStart(2, '0')} / {String(SEKILLER.length).padStart(2, '0')}
                    </p>
                    <Coz className="giris-sekil-ad" metin={aktif.ad} />
                    <p className="giris-sekil-metin">{aktif.metin}</p>
                    <a href="#manifesto" className="kaydir-ipucu" onClick={(e) => { e.preventDefault(); git('#manifesto'); }}>
                        Aşağı kaydır
                        <span className="kaydir-cizgi" aria-hidden="true" />
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Hero;
