import React, { useRef } from 'react';
import { alanlar } from '../data';
import { gsap, useGSAP, hareketAzalt } from '../lib/anim';

const ARAC_SATIR_1 = ['C#', 'Python', 'JavaScript', 'React', 'SQL', 'HTML', 'CSS'];
const ARAC_SATIR_2 = ['Linux', 'Kali Linux', 'Unity', 'SQLite', 'CTF', 'Git'];

const Kayan = ({ ogeler, ters, cizgili }) => (
    <div className={`kayan ${ters ? 'kayan--ters' : ''} ${cizgili ? 'kayan--cizgili' : ''}`} aria-hidden="true">
        <div className="kayan-ic">
            {[0, 1].map((k) => (
                <span className="kayan-grup" key={k}>
                    {ogeler.map((o) => <span key={o}>{o}<i>/</i></span>)}
                </span>
            ))}
        </div>
    </div>
);

const Skills = () => {
    const kok = useRef(null);

    useGSAP(() => {
        if (hareketAzalt()) return;
        gsap.utils.toArray('.alan').forEach((el) => {
            gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%' } })
                .from(el.querySelector('.alan-cizgi'), { scaleX: 0, duration: 1.2, ease: 'power3.inOut' })
                .from(el.querySelectorAll('h3, p'), { yPercent: 40, opacity: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, 0.25);
        });
    }, { scope: kok });

    return (
        <section className="yetkinlikler" id="yetkinlikler" ref={kok} aria-labelledby="yetkinlikler-baslik">
            <Kayan ogeler={ARAC_SATIR_1} />
            <Kayan ogeler={ARAC_SATIR_2} ters cizgili />
            <p className="sr-only">Kullandığım araçlar: {[...ARAC_SATIR_1, ...ARAC_SATIR_2].join(', ')}.</p>

            <div className="kap">
                <h2 id="yetkinlikler-baslik">Neler yapıyorum</h2>
                <div className="alanlar">
                    {alanlar.map((a) => (
                        <div className="alan" key={a.ad}>
                            <span className="alan-cizgi" aria-hidden="true" />
                            <h3>{a.ad}</h3>
                            <p>{a.metin}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;
