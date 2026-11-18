import React, { useRef } from 'react';
import { gsap, useGSAP, hareketAzalt, git } from '../lib/anim';

const harfler = (metin) => metin.split('').map((h, i) => (
    <span className="harf" key={i} aria-hidden="true">{h}</span>
));

const Hero = () => {
    const kok = useRef(null);

    useGSAP((_, contextSafe) => {
        if (hareketAzalt()) return undefined;

        // Açılış: görsel alttan açılır, "Melih" harfleri maskeden yükselir,
        // "BAŞDEMİR" harfleri incecik başlayıp kalınlaşarak belirir.
        gsap.timeline({ defaults: { ease: 'power4.out' } })
            .fromTo('.giris-gorsel', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'power4.inOut' }, 0)
            .from('.giris-gorsel img', { scale: 1.18, duration: 2.4, ease: 'power3.out' }, 0)
            .from('.isim-melih .harf', { yPercent: 110, rotate: 6, duration: 1.3, stagger: 0.05 }, 0.45)
            .fromTo('.isim-basdemir .harf',
                { '--w': 100, '--g': 125, opacity: 0 },
                { '--w': 800, '--g': 75, opacity: 1, duration: 1.6, stagger: 0.05, ease: 'power3.out' }, 0.6)
            .from('.giris-ust, .giris-ozet, .giris-rozetler li, .giris-alt > *', { y: 18, opacity: 0, duration: 1, stagger: 0.08 }, 1.1);

        // Fare BAŞDEMİR'in üzerinde gezerken yakındaki harfler incelir ve genişler.
        const basdemir = gsap.utils.toArray('.isim-basdemir .harf');
        const kalinlik = basdemir.map((h) => gsap.quickTo(h, '--w', { duration: 0.6, ease: 'power3.out' }));
        const genislik = basdemir.map((h) => gsap.quickTo(h, '--g', { duration: 0.6, ease: 'power3.out' }));
        const isim = kok.current.querySelector('.isim');

        const hareket = contextSafe((e) => {
            basdemir.forEach((h, i) => {
                const r = h.getBoundingClientRect();
                const dx = e.clientX - (r.left + r.width / 2);
                const dy = e.clientY - (r.top + r.height / 2);
                const f = Math.exp(-((dx * dx) / 14000 + (dy * dy) / 40000));
                kalinlik[i](800 - 620 * f);
                genislik[i](75 + 45 * f);
            });
        });
        const ayril = contextSafe(() => {
            kalinlik.forEach((k) => k(800));
            genislik.forEach((g) => g(75));
        });
        isim.addEventListener('pointermove', hareket);
        isim.addEventListener('pointerleave', ayril);

        // Görsel fareye göre hafifçe derinlik kazanır.
        const gorsel = kok.current.querySelector('.giris-gorsel-ic');
        const gx = gsap.quickTo(gorsel, 'x', { duration: 1.2, ease: 'power3.out' });
        const gy = gsap.quickTo(gorsel, 'y', { duration: 1.2, ease: 'power3.out' });
        const gr = gsap.quickTo(gorsel, 'rotationY', { duration: 1.2, ease: 'power3.out' });
        const sahneHareket = contextSafe((e) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            gx(nx * -22);
            gy(ny * -14);
            gr(nx * 5);
        });
        kok.current.addEventListener('pointermove', sahneHareket);

        // Aşağı kaydırırken görsel uzaklaşıp söner; zemin sise dönerken arkada koyu blok kalmaz.
        gsap.fromTo('.giris-gorsel', { opacity: 1 }, {
            yPercent: 8,
            scale: 0.94,
            opacity: 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: kok.current, start: 'top top', end: '55% top', scrub: true },
        });
        gsap.fromTo('.giris-ust, .giris-ozet, .giris-rozetler, .giris-alt', { opacity: 1 }, {
            opacity: 0,
            y: -30,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: kok.current, start: '5% top', end: '35% top', scrub: true },
        });

        return () => {
            isim.removeEventListener('pointermove', hareket);
            isim.removeEventListener('pointerleave', ayril);
        };
    }, { scope: kok });

    return (
        <section className="giris" id="basa" ref={kok} data-renk="gece">
            <div className="giris-gorsel" aria-hidden="true">
                <div className="giris-gorsel-ic">
                    <img src="/images/melih-portre.jpg" alt="" fetchpriority="high" />
                </div>
            </div>

            <div className="giris-metin">
                <p className="giris-ust">
                    <span className="durum-nokta" aria-hidden="true" />
                    <span>Siber tehdit istihbaratı (CTI) / OSINT / Zafiyet analizi</span>
                </p>
                <h1 className="isim" aria-label="Melih Başdemir">
                    <span className="isim-melih">{harfler('Melih')}</span>
                    <span className="isim-basdemir">{harfler('BAŞDEMİR')}</span>
                </h1>
                <p className="giris-ozet">
                    Tehdit aktörlerini izliyor, açık kaynaklardan istihbarat topluyor ve zafiyetleri analiz ediyorum.
                    Balıkesir Üniversitesi’nde 4. sınıf bilgisayar mühendisliği öğrencisiyim; yazılım altyapımı
                    siber güvenlik çalışmalarımla birleştiriyorum.
                </p>
                <ul className="giris-rozetler" aria-label="Öne çıkanlar">
                    <li><b>CoreSynapseAI</b> CTI stajyeri</li>
                    <li><b>Siber Vatan</b> CTF Türkiye finalisti</li>
                    <li><b>TREX</b> Hackathon 1.’si</li>
                </ul>
                <div className="giris-alt">
                    <a className="hap" href="#projeler" onClick={(e) => { e.preventDefault(); git('#projeler'); }}>
                        Projelerime bak
                    </a>
                    <span className="kaydir-ipucu" aria-hidden="true">
                        <span className="kaydir-cizgi" /> Kaydır
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Hero;
