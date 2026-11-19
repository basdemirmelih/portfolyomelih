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
        metin: 'Laboratuvar ortamlarında aktif ve pasif bilgi toplama, güvenlik taraması ve temel sızma testi çalışıyorum; Wireshark ile ağ trafiğini paket düzeyinde inceliyorum.',
        etiketler: ['Nmap', 'Metasploit', 'Wireshark', 'Kali Linux'],
    },
    {
        kod: 'DEV',
        ad: 'Yazılım geliştirme',
        metin: 'C#, Java ve Python ile nesne yönelimli yazılım geliştiriyorum. Flutter ile mobil uygulamalar; HTML, CSS, JavaScript ve React ile web arayüzleri kuruyor, veri tarafını SQL ile yönetiyorum.',
        etiketler: ['C#', 'Python', 'Java', 'Flutter', 'React', 'JavaScript', 'SQL'],
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
    const ilerleme = useRef(null);
    const azalt = hareketAzalt();

    useEffect(() => {
        if (!fontlarHazir) return undefined;
        // Telefon kararı dokunmatik ekrana göre (ya da çok dar ekrana): dar bir bilgisayar penceresi
        // telefon moduna (az parçacık) düşmesin.
        const mobil = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 700;

        const tetik = azalt ? null : ScrollTrigger.create({
            trigger: bolum.current,
            start: 'top top',
            // Telefonda dört alan arasında daha az kaydırma (ekranın 3 katı); masaüstünde 3,6 katı
            end: () => `+=${window.innerHeight * (mobil ? 3 : 3.6)}`,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
                if (ilerleme.current) ilerleme.current.style.transform = `scaleX(${self.progress.toFixed(4)})`;
                const yeni = aktifAlan(self.progress);
                setAktif((a) => (a === yeni ? a : yeni));
            },
        });

        const giris = document.getElementById('basa');
        // Ad, parçacıklara dönüşürken satır satır söner. Opaklık her satıra ayrı yazılır: satırlar kendi
        // katmanındadır (v2.css), böylece sönme ekran kartında olur ve büyük degrade yazı yeniden boyanmaz.
        const isimSatirlari = [...document.querySelectorAll('.isim .isim-satir')];
        let sonIsimOpaklik = -1;

        // Giriş bölümünün yüksekliği her karede ölçülmez (her ölçüm, renk geçişi sırasında tarayıcıyı
        // sayfa düzenini yeniden hesaplamaya zorluyordu); yalnızca boyut değişince güncellenir.
        let girisYuk = giris ? giris.offsetHeight : window.innerHeight;
        const girisOlc = () => { girisYuk = giris ? giris.offsetHeight : window.innerHeight; };
        ScrollTrigger.addEventListener('refresh', girisOlc);

        const kaydirma = () => {
            const y = window.scrollY;
            const sahne = tetik ? tetik.progress : 0;
            const sonrasi = tetik ? Math.max(0, y - tetik.end) : 0;
            return {
                scrollY: y,
                giris: Math.min(1, y / girisYuk),
                sahne: tetik && y >= tetik.start ? Math.max(sahne, 0.0001) : 0,
                sonrasi,
                isimOpaklik: (o) => {
                    if (!isimSatirlari.length || Math.abs(o - sonIsimOpaklik) < 0.01) return;
                    sonIsimOpaklik = o;
                    const v = String(o);
                    isimSatirlari.forEach((el) => { el.style.opacity = v; });
                },
            };
        };

        let iptal = false;
        if (!azalt) {
            import('./particles/motor').then(({ motorKur }) => {
                if (iptal) return;
                if (!tuval.current) return;
                motor.current = motorKur(tuval.current, { renk, kaydirma, mobil, hareketAzalt: azalt });
            });
        }

        return () => {
            iptal = true;
            motor.current?.yokEt();
            motor.current = null;
            ScrollTrigger.removeEventListener('refresh', girisOlc);
            tetik?.kill(true); // sabitlemeyi geri al: bölüm DOM'daki yerine döner
            isimSatirlari.forEach((el) => { el.style.opacity = ''; });
        };
    }, [fontlarHazir, azalt]);

    return (
        <>
            <div className="parcacik-tuval" ref={tuval} aria-hidden="true" />
            {/* ScrollTrigger sabitlerken bölümü bir "pin-spacer" içine taşır. Sarmalayıcı sayesinde React
                kaldırma sırasında hep kendi bildiği düğümü kaldırır (yoksa removeChild hatası). */}
            <div className="sahne-sarmal">
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
                            <span ref={ilerleme} style={{ transform: 'scaleX(0)' }} />
                        </div>
                    </div>
                    <p className="sahne-ipucu" aria-hidden="true">Fareyi parçacıkların üzerinde gezdir</p>
                </div>
            </section>
            </div>
        </>
    );
};

export default ParticleStage;
