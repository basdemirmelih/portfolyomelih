import React, { useRef } from 'react';
import { gsap, useGSAP, ScrollTrigger, hareketAzalt } from '../lib/anim';

// Siber güvenlik ve yazılım tarafı dengeli: iki şerit, ters yönlerde.
const SATIR_1 = ['C#', 'Python', 'Java', 'Flutter', 'React', 'JavaScript', 'HTML', 'CSS', 'SQL', 'Unity'];
const SATIR_2 = ['OSINT', 'MITRE ATT&CK', 'Nmap', 'Wireshark', 'Metasploit', 'Kali Linux', 'IOC analizi', 'Linux'];

const Serit = ({ ogeler, cizgili }) => (
    <div className={`serit ${cizgili ? 'serit--cizgili' : ''}`} aria-hidden="true">
        <div className="serit-ic">
            {[0, 1].map((k) => (
                <span className="serit-grup" key={k}>
                    {ogeler.map((o) => <span key={o}>{o}<i>/</i></span>)}
                </span>
            ))}
        </div>
    </div>
);

// Şeritler kendi hızında akar; sayfa kaydırıldıkça kaydırma hızıyla hızlanır ve o yöne döner.
const Seritler = () => {
    const kok = useRef(null);

    useGSAP(() => {
        if (hareketAzalt()) return;
        const [ust, alt] = gsap.utils.toArray('.serit-ic');
        const a1 = gsap.fromTo(ust, { xPercent: 0 }, { xPercent: -50, duration: 40, ease: 'none', repeat: -1 });
        const a2 = gsap.fromTo(alt, { xPercent: -50 }, { xPercent: 0, duration: 46, ease: 'none', repeat: -1 });
        // Kaydırma hızı tek bir hedef değere yazılır; her karede yumuşakça ona yaklaşılır.
        // (Her kaydırma adımında yeni animasyon nesnesi üretilmez.)
        let yon = 1;
        let hedef = 1;
        let simdiki = 1;
        let gorunur = false;
        const st = ScrollTrigger.create({
            trigger: kok.current,
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => { gorunur = self.isActive; a1.paused(!gorunur); a2.paused(!gorunur); },
            onUpdate: (self) => {
                yon = self.direction;
                hedef = (1 + Math.min(Math.abs(self.getVelocity()) / 250, 6)) * yon;
            },
        });
        a1.pause();
        a2.pause();
        const tik = () => {
            if (!gorunur) return;
            hedef += (yon - hedef) * 0.04; // hız zamanla normale döner
            simdiki += (hedef - simdiki) * 0.12;
            a1.timeScale(simdiki);
            a2.timeScale(simdiki);
        };
        gsap.ticker.add(tik);
        return () => { st.kill(); gsap.ticker.remove(tik); };
    }, { scope: kok });

    return (
        <section className="seritler" ref={kok} data-renk="sis" aria-label="Kullandığım teknolojiler">
            <Serit ogeler={SATIR_1} />
            <Serit ogeler={SATIR_2} cizgili />
            <p className="sr-only">Kullandığım teknolojiler: {[...SATIR_1, ...SATIR_2].join(', ')}.</p>
        </section>
    );
};

export default Seritler;
