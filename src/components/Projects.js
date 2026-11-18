import React, { useRef } from 'react';
import { projeler } from '../data';
import { gsap, useGSAP } from '../lib/anim';

// Masaüstünde bölüm sabitlenir ve projeler yatay olarak akar; telefonda alt alta dizilir.
const Projects = () => {
    const kok = useRef(null);
    const ray = useRef(null);

    useGSAP(() => {
        const mm = gsap.matchMedia();

        mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
            const mesafe = () => ray.current.scrollWidth - window.innerWidth;
            const akis = gsap.to(ray.current, {
                x: () => -mesafe(),
                ease: 'none',
                scrollTrigger: {
                    trigger: kok.current,
                    start: 'top top',
                    end: () => `+=${mesafe()}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                },
            });

            gsap.utils.toArray('.proje-gorsel img').forEach((img) => {
                gsap.fromTo(img, { xPercent: -7 }, {
                    xPercent: 7,
                    ease: 'none',
                    scrollTrigger: { trigger: img.parentElement, containerAnimation: akis, start: 'left right', end: 'right left', scrub: true },
                });
            });

            gsap.to('.proje-ilerleme span', {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: { trigger: kok.current, start: 'top top', end: () => `+=${mesafe()}`, scrub: true },
            });
        });

        mm.add('(max-width: 899px) and (prefers-reduced-motion: no-preference)', () => {
            gsap.utils.toArray('.proje-gorsel').forEach((el) => {
                gsap.from(el, {
                    clipPath: 'inset(100% 0% 0% 0%)',
                    duration: 1.2,
                    ease: 'power4.inOut',
                    scrollTrigger: { trigger: el, start: 'top 85%' },
                });
            });
        });

        return () => mm.revert();
    }, { scope: kok });

    return (
        <section className="projeler" id="projeler" ref={kok} aria-labelledby="projeler-baslik">
            <div className="projeler-ray" ref={ray}>
                <div className="projeler-giris">
                    <h2 id="projeler-baslik">Projeler</h2>
                    <p>Okul dışında kendi merakımla yaptığım işler. Hepsinin kaynak kodu açık.</p>
                    <div className="proje-ilerleme" aria-hidden="true"><span /></div>
                </div>
                {projeler.map((p) => (
                    <article className="proje" key={p.id} id={p.id}>
                        <a className="proje-gorsel" href={p.link} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                            <img src={p.gorsel} alt="" loading="lazy" />
                        </a>
                        <div className="proje-bilgi">
                            <h3>{p.ad}</h3>
                            <p className="proje-teknoloji">{p.teknoloji}</p>
                        </div>
                        <p className="proje-aciklama">{p.aciklama}</p>
                        <a className="cizgili-link" href={p.link} target="_blank" rel="noopener noreferrer">
                            {p.linkMetni}<span className="sr-only"> ({p.ad})</span>
                        </a>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default Projects;
