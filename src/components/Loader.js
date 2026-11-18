import React, { useRef } from 'react';
import { gsap, useGSAP } from '../lib/anim';

// Açılışta 0'dan 100'e sayan sayaç; perde yukarı kalkarken site başlar.
const Loader = ({ bitti }) => {
    const kok = useRef(null);
    const sayac = useRef(null);

    useGSAP(() => {
        const s = { d: 0 };
        const tl = gsap.timeline();
        tl.to(s, {
            d: 100,
            duration: 1.3,
            ease: 'power2.inOut',
            onUpdate: () => {
                if (sayac.current) sayac.current.textContent = String(Math.round(s.d)).padStart(3, '0');
            },
        })
            .to('.yukleyici-cizgi', { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
            .to('.yukleyici-ic', { yPercent: -60, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.15')
            .add(() => bitti(), '-=0.1')
            .to(kok.current, { yPercent: -100, duration: 1, ease: 'power4.inOut' }, '<')
            .set(kok.current, { display: 'none' });
    }, { scope: kok });

    return (
        <div className="yukleyici" ref={kok} aria-hidden="true">
            <div className="yukleyici-ic">
                <span className="yukleyici-ad">Melih Başdemir</span>
                <span className="yukleyici-sayac" ref={sayac}>000</span>
            </div>
            <span className="yukleyici-cizgi" />
        </div>
    );
};

export default Loader;
