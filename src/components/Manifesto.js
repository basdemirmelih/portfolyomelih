import React, { useRef } from 'react';
import { gsap, useGSAP, hareketAzalt } from '../lib/anim';

const METIN =
    'Bir sistemin nasıl çalıştığını anlamakla yetinmiyorum. Nasıl kırıldığını ve nasıl korunduğunu da öğreniyorum. ' +
    'Python ve C# ile uygulamalar, Unity ile oyunlar yazıyor; CTF’lerde web güvenliği ve tersine mühendislik üzerine çalışıyorum.';

// Kaydırdıkça kelimeler sırayla aydınlanır.
const Manifesto = () => {
    const kok = useRef(null);

    useGSAP(() => {
        if (hareketAzalt()) return;
        gsap.fromTo('.manifesto-kelime',
            { opacity: 0.14 },
            {
                opacity: 1,
                stagger: 0.1,
                ease: 'none',
                scrollTrigger: { trigger: '.manifesto-metin', start: 'top 80%', end: 'bottom 55%', scrub: true },
            });
    }, { scope: kok });

    return (
        <section className="manifesto" id="manifesto" ref={kok} aria-label="Kısaca ben">
            <p className="manifesto-metin">
                {METIN.split(' ').map((k, i) => (
                    <span className="manifesto-kelime" key={i}>{k} </span>
                ))}
            </p>
        </section>
    );
};

export default Manifesto;
