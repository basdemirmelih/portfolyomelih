import React, { useRef } from 'react';
import { gsap, useGSAP, hareketAzalt } from '../lib/anim';

const About = () => {
    const kok = useRef(null);

    useGSAP(() => {
        if (hareketAzalt()) return;
        gsap.fromTo('.hakkimda-foto',
            { clipPath: 'inset(18% 18% 18% 18%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: '.hakkimda-foto', start: 'top 90%', end: 'top 30%', scrub: true } });
        gsap.fromTo('.hakkimda-foto img',
            { scale: 1.35 },
            { scale: 1, ease: 'none', scrollTrigger: { trigger: '.hakkimda-foto', start: 'top 90%', end: 'bottom 20%', scrub: true } });
    }, { scope: kok });

    return (
        <section className="hakkimda" id="hakkimda" ref={kok} aria-labelledby="hakkimda-baslik">
            <div className="kap hakkimda-ic">
                <div className="hakkimda-foto">
                    <img src="/images/melih.jpg" alt="Melih Başdemir" loading="lazy" />
                </div>
                <div className="hakkimda-metin">
                    <h2 id="hakkimda-baslik">Hakkımda</h2>
                    <p className="hakkimda-giris">
                        Güvenliği sonradan eklenen bir katman olarak değil, yazılımın baştan parçası olarak görüyorum.
                    </p>
                    <p>
                        Balıkesir Üniversitesi’nde bilgisayar mühendisliği okuyorum. Linux ortamlarında çalışıyor,
                        savunma ve saldırı tarafını birlikte öğreniyorum. Problem çözmeyi, analitik düşünmeyi ve düzenli
                        yapılar kurmayı seviyorum. Ekip projelerinde hem teknik hem de analitik tarafta katkı vermek istiyorum.
                    </p>
                    <dl className="kunye">
                        <div><dt>Eğitim</dt><dd>Balıkesir Üniversitesi, Bilgisayar Mühendisliği (2023–2027)</dd></div>
                        <div><dt>Konum</dt><dd>Sivas ve Balıkesir</dd></div>
                        <div><dt>Diller</dt><dd>Türkçe (ana dil), İngilizce (orta-üst seviye)</dd></div>
                        <div><dt>Boş zamanlarımda</dt><dd>Sinema, seyahat, futbol, siyaset</dd></div>
                    </dl>
                </div>
            </div>
        </section>
    );
};

export default About;
