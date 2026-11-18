import React, { useRef } from 'react';
import { gsap, useGSAP, hareketAzalt } from '../lib/anim';

const About = () => {
    const kok = useRef(null);

    // Büyük cümle kelime kelime maskeden yükselir.
    useGSAP(() => {
        if (hareketAzalt()) return;
        gsap.from('.hakkimda-buyuk .kelime > span', {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.035,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.hakkimda-buyuk', start: 'top 80%' },
        });
    }, { scope: kok });

    const cumle = 'Güvenliği sonradan eklenen bir katman olarak değil, yazılımın en baştan parçası olarak görüyorum.';

    return (
        <section className="hakkimda" id="hakkimda" ref={kok} data-renk="arduvaz" aria-labelledby="hakkimda-baslik">
            <h2 id="hakkimda-baslik" className="sr-only">Hakkımda</h2>
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
                        Balıkesir Üniversitesi’nde 4. sınıf bilgisayar mühendisliği öğrencisiyim. C#, Python, Java ve web
                        teknolojileriyle kurduğum yazılım altyapısını siber güvenlik çalışmalarımla destekliyorum.
                    </p>
                    <p>
                        Odağım siber tehdit istihbaratı: tehdit aktörü analizi, OSINT, ağ güvenliği ve zafiyet analizi.
                        CoreSynapseAI’deki CTI stajımda gerçek tehdit verilerini araştırıp analiz ettim ve raporladım.
                        Laboratuvar ortamlarında pratik yapıyor; yarışmalar ve hackathonlarla kendimi geliştirmeye devam ediyorum.
                    </p>
                </div>
                <dl className="kunye">
                    <div><dt>Deneyim</dt><dd>CoreSynapseAI, CTI stajyeri (Temmuz–Eylül 2026, 40 iş günü)</dd></div>
                    <div><dt>Eğitim</dt><dd>Balıkesir Üniversitesi, Bilgisayar Mühendisliği (2023–2027)</dd></div>
                    <div><dt>Başarılar</dt><dd>Siber Vatan CTF yarı finali ve Türkiye finalistliği; TREX × Uludağ Üniversitesi Yapay Zekâ Hackathonu birinciliği; Balıkesir Teknokent GameJam üçüncülüğü</dd></div>
                    <div><dt>Eğitimler</dt><dd>Siber Güvenlik, Balıkesir Büyükşehir Belediyesi Teknoloji Eğitim Merkezi</dd></div>
                    <div><dt>Araçlar</dt><dd>Kali Linux, Nmap, Metasploit, Wireshark, Hack The Box, Hackviser</dd></div>
                    <div><dt>Diller</dt><dd>Türkçe (ana dil), İngilizce (A2)</dd></div>
                </dl>
            </div>
        </section>
    );
};

export default About;
