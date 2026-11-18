import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, hareketAzalt } from '../lib/anim';
import { renk } from './renk';

// Sıra motor.js'teki SEKILLER ile aynıdır: kalkan, nişangâh, </>, oyun kolu.
const ALANLAR = [
    {
        kod: 'CTI',
        ad: 'Tehdit istihbaratı',
        metin: 'OSINT, açık kaynaklar ve dark web üzerinden tehdit aktörlerini ve veri sızıntılarını araştırıyor; IOC’leri MITRE ATT&CK ve Cyber Kill Chain ile analiz edip rapora döküyorum.',
        etiketler: ['OSINT', 'MITRE ATT&CK', 'IOC analizi', 'Kill Chain'],
    },
    {
        kod: 'VULN',
        ad: 'Zafiyet analizi',
        metin: 'Hack The Box ve Hackviser laboratuvarlarında aktif ve pasif bilgi toplama, güvenlik taraması ve temel sızma testi çalışıyorum. Wireshark ile paket inceliyorum.',
        etiketler: ['Nmap', 'Metasploit', 'Wireshark', 'Kali Linux'],
    },
    {
        kod: 'DEV',
        ad: 'Yazılım geliştirme',
        metin: 'C#, Java ve Python ile nesne yönelimli yazılım; Flutter ile mobil, React ile web arayüzleri geliştiriyorum. SQL ile veri tarafını kuruyorum.',
        etiketler: ['C#', 'Python', 'Java', 'React', 'Flutter'],
    },
    {
        kod: 'GAME',
        ad: 'Oyun geliştirme',
        metin: 'Unity ve C# ile 3D oyunlar yapıyorum. Balıkesir Teknokent GameJam’inde ekibimle geliştirdiğimiz yarış oyunu üçüncü oldu.',
        etiketler: ['Unity', 'C#', 'GameJam 3.’lüğü'],
    },
];

// motor.js'teki sahneDurumu ile aynı hesap: hangi şekil öne çıktıysa onun başlığı görünür.
// (motor.js'i buraya almıyoruz; Three.js ana pakete girmesin.)
const SON = ALANLAR.length - 1;
const aktifAlan = (q) => {
    const j = Math.min(SON - 1, Math.floor(q * SON));
    const ilerleme = (q * SON - j - 0.3) / 0.5;
    return ilerleme > 0.5 ? j + 1 : j;
};

const ParticleStage = ({ fontlarHazir }) => {
    const bolum = useRef(null);
    const tuval = useRef(null);
    const motor = useRef(null);
    const [aktif, setAktif] = useState(0);
    const [q, setQ] = useState(0);
    const azalt = hareketAzalt();

    useEffect(() => {
        if (!fontlarHazir) return undefined;
        const mobil = window.matchMedia('(max-width: 899px)').matches;

        const tetik = azalt ? null : ScrollTrigger.create({
            trigger: bolum.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * 3.6}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                setQ(self.progress);
                setAktif(aktifAlan(self.progress));
            },
        });

        const giris = document.getElementById('basa');
        const isim = document.querySelector('.isim');
        let sonIsimOpaklik = -1;

        const kaydirma = () => {
            const y = window.scrollY;
            const girisYuk = giris ? giris.offsetHeight : window.innerHeight;
            const sahne = tetik ? tetik.progress : 0;
            const sonrasi = tetik ? Math.max(0, y - tetik.end) : 0;
            return {
                scrollY: y,
                giris: Math.min(1, y / girisYuk),
                sahne: tetik && y >= tetik.start ? Math.max(sahne, 0.0001) : 0,
                sonrasi,
                isimOpaklik: (o) => {
                    if (!isim || Math.abs(o - sonIsimOpaklik) < 0.01) return;
                    sonIsimOpaklik = o;
                    isim.style.opacity = String(o);
                    isim.style.filter = o < 1 ? `blur(${(1 - o) * 8}px)` : '';
                },
            };
        };

        let iptal = false;
        if (!azalt) {
            import('./particles/motor').then(({ motorKur }) => {
                if (iptal) return;
                motor.current = motorKur(tuval.current, { renk, kaydirma, mobil, hareketAzalt: azalt });
            });
        }

        return () => {
            iptal = true;
            motor.current?.yokEt();
            motor.current = null;
            tetik?.kill();
            if (isim) { isim.style.opacity = ''; isim.style.filter = ''; }
        };
    }, [fontlarHazir, azalt]);

    return (
        <>
            <div className="parcacik-tuval" ref={tuval} aria-hidden="true" />
            <section className="sahne" id="yetkinlikler" ref={bolum} data-renk="sis" aria-labelledby="sahne-baslik">
                <div className="sahne-ic">
                    <div className="sahne-yazi">
                        <h2 id="sahne-baslik" className="sahne-ust">Neler yapıyorum</h2>
                        <p className="sahne-sayac" aria-hidden="true">
                            <span>{String(aktif + 1).padStart(2, '0')}</span> / {String(ALANLAR.length).padStart(2, '0')}
                        </p>
                        <div className="sahne-alanlar">
                            {ALANLAR.map((a, i) => (
                                <article
                                    key={a.ad}
                                    className={`sahne-alan ${i === aktif || azalt ? 'sahne-alan--aktif' : ''}`}
                                    aria-hidden={!azalt && i !== aktif}
                                >
                                    <p className="sahne-kod">[{a.kod}]</p>
                                    <h3>{a.ad}</h3>
                                    <p>{a.metin}</p>
                                    <ul>{a.etiketler.map((e) => <li key={e}>{e}</li>)}</ul>
                                </article>
                            ))}
                        </div>
                        <div className="sahne-ilerleme" aria-hidden="true">
                            <span style={{ transform: `scaleX(${q})` }} />
                        </div>
                    </div>
                    <p className="sahne-ipucu" aria-hidden="true">Fareyi parçacıkların üzerinde gezdir</p>
                </div>
            </section>
        </>
    );
};

export default ParticleStage;
