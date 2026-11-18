import React, { useRef } from 'react';
import { gsap, useGSAP, hareketAzalt } from '../lib/anim';

const About = () => {
    const kok = useRef(null);

    // Büyük cümle kelime kelime maskeden yükselir.
    useGSAP(() => {
        if (hareketAzalt()) return;
        gsap.from('.hakkimda-buyuk .kelime > span', {
            yPercent: 110,
            duration: 1.2, // başlık açılışları sitede aynı ritimde
            stagger: 0.03,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.hakkimda-buyuk', start: 'top 80%' },
        });
    }, { scope: kok });

    const cumle = 'Sistemleri kuruyor, nasıl kırıldıklarını anlıyor ve onları daha sağlam hale getirmeye çalışıyorum.';

    return (
        <section className="hakkimda" id="hakkimda" ref={kok} data-renk="kar" aria-labelledby="hakkimda-baslik">
            <h2 id="hakkimda-baslik" className="bolum-etiket"><span aria-hidden="true">M.B./ </span>Hakkımda</h2>
            <p className="hakkimda-buyuk">
                {cumle.split(' ').map((k, i) => (
                    <React.Fragment key={i}>
                        <span className="kelime"><span>{k}</span></span>{' '}
                    </React.Fragment>
                ))}
            </p>
            <div className="hakkimda-izgara">
                <div className="hakkimda-metin">
                    <p>
                        Balıkesir Üniversitesi’nde 4. sınıf bilgisayar mühendisliği öğrencisiyim. Yazılımla başladım:
                        C#, Python ve Java ile masaüstü uygulamaları, Flutter ile mobil, HTML, CSS, JavaScript ve React ile
                        web arayüzleri geliştirdim; Unity ile oyunlar yaptım.
                    </p>
                    <p>
                        Bu altyapıyı bugün siber güvenlikle birleştiriyorum. Odağım siber tehdit istihbaratı: tehdit aktörü
                        analizi, OSINT, ağ güvenliği ve zafiyet analizi. CoreSynapseAI’deki stajımda gerçek tehdit verilerini
                        araştırıp analiz ettim ve raporladım.
                    </p>
                </div>
                <dl className="kunye">
                    <div><dt>Deneyim</dt><dd>CoreSynapseAI, CTI stajyeri (Temmuz–Eylül 2026)</dd></div>
                    <div><dt>Eğitim</dt><dd>Balıkesir Üniversitesi, Bilgisayar Mühendisliği (2023–2027)</dd></div>
                    <div><dt>Güvenlik</dt><dd>OSINT, MITRE ATT&amp;CK, Nmap, Wireshark, Metasploit, Kali Linux</dd></div>
                    <div><dt>Yazılım</dt><dd>C#, Python, Java, SQL</dd></div>
                    <div><dt>Mobil ve web</dt><dd>Flutter, React, JavaScript, HTML, CSS</dd></div>
                    <div><dt>Diller</dt><dd>Türkçe (ana dil), İngilizce (A2)</dd></div>
                </dl>
            </div>
        </section>
    );
};

export default About;
