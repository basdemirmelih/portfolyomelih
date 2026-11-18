import React, { useRef } from 'react';
import { gsap, useGSAP, hareketAzalt } from '../lib/anim';

// Çizgi ikonlar (48x48, tek renk). Kartların görseli bunlardan çizilir.
const IKONLAR = {
    bayrak: <><path d="M12 42V6" /><path d="M12 8c6-4 12 4 18 0s10-2 10-2v18s-4-2-10 2-12-4-18 0" /></>,
    kupa: <><path d="M16 8h16v10a8 8 0 0 1-16 0z" /><path d="M16 11H9a6 6 0 0 0 7 8M32 11h7a6 6 0 0 1-7 8" /><path d="M24 26v8M17 40h14M19 34h10v6H19z" /></>,
    radar: <><circle cx="24" cy="24" r="18" /><circle cx="24" cy="24" r="11" /><circle cx="24" cy="24" r="4" /><path d="M24 24L38 12" /><circle cx="33" cy="30" r="1.6" fill="currentColor" /><circle cx="15" cy="17" r="1.6" fill="currentColor" /></>,
    madalya: <><path d="M16 5l6 12M32 5l-6 12" /><circle cx="24" cy="29" r="12" /><path d="M21 25.5c1-2 6-2 6 1s-3 2.5-3 2.5 3 0 3 2.8c0 3.2-5 3.2-6 1" /></>,
    kep: <><path d="M4 18l20-9 20 9-20 9z" /><path d="M12 22v9c0 3 6 6 12 6s12-3 12-6v-9" /><path d="M44 18v12" /></>,
    goz: <><path d="M4 24s7-12 20-12 20 12 20 12-7 12-20 12S4 24 4 24z" /><circle cx="24" cy="24" r="6" /><circle cx="24" cy="24" r="2" fill="currentColor" /></>,
    matris: <>{[0, 1, 2, 3].map((r) => [0, 1, 2, 3].map((c) => (
        <rect key={`${r}${c}`} x={6 + c * 9.5} y={6 + r * 9.5} width="7" height="7" rx="1.2"
            fill={(r * 4 + c) % 5 === 1 || (r * 4 + c) % 7 === 3 ? 'currentColor' : 'none'} />
    )))}</>,
    ag: <><circle cx="10" cy="12" r="4" /><circle cx="38" cy="10" r="4" /><circle cx="24" cy="26" r="5" /><circle cx="10" cy="38" r="4" /><circle cx="38" cy="38" r="4" /><path d="M13 14l7 8M35 12l-8 10M20 29l-7 6M28 29l7 6M14 38h20" /></>,
    hedef: <><circle cx="24" cy="24" r="17" /><circle cx="24" cy="24" r="9" /><path d="M24 2v10M24 36v10M2 24h10M36 24h10" /><circle cx="24" cy="24" r="2" fill="currentColor" /></>,
    terminal: <><rect x="4" y="8" width="40" height="32" rx="4" /><path d="M4 15h40" /><path d="M11 23l6 5-6 5M21 33h10" /></>,
};

// Sıra önemli: kartlar dört sütuna sırayla dağıtılır (0,4,8 → 1. sütun; 1,5,9 → 2. sütun ...).
const KARTLAR = [
    { id: 'siber-vatan', tur: 'basari', ikon: 'bayrak', buyuk: 'Final', ad: 'Siber Vatan CTF', etiket: 'Türkiye finalisti', metin: 'Sanayi ve Teknoloji Bakanlığı’nın Siber Vatan programında CTF yarı finalini geçip Türkiye finaline kaldım.' },
    { id: 'trex', tur: 'basari', ikon: 'kupa', buyuk: '1.', ad: 'TREX Hackathon', etiket: 'Birincilik', metin: 'TREX ile Uludağ Üniversitesi’nin düzenlediği Yapay Zekâ Hackathonu’nda ekibimle birinci olduk.' },
    { id: 'coresynapse', tur: 'basari', ikon: 'radar', buyuk: '40', alt: 'iş günü', ad: 'CoreSynapseAI', etiket: 'CTI stajı, 2026', metin: 'OSINT ve dark web kaynaklarından tehdit aktörü araştırması, IOC analizi ve MITRE ATT&CK eşlemesiyle aksiyona dönük CTI raporları hazırladım.' },
    { id: 'gamejam', tur: 'basari', ikon: 'madalya', buyuk: '3.', ad: 'Teknokent GameJam', etiket: 'Üçüncülük', metin: 'Balıkesir Teknokent GameJam’inde kısıtlı sürede ekiple geliştirdiğimiz Unity yarış oyunuyla üçüncü olduk.' },
    { id: 'osint', tur: 'arac', ikon: 'goz', ad: 'OSINT', etiket: 'Bilgi toplama', metin: 'Aktif ve pasif bilgi toplama; açık kaynak ve dark web üzerinden tehdit aktörü ve veri sızıntısı takibi.' },
    { id: 'mitre', tur: 'arac', ikon: 'matris', ad: 'MITRE ATT&CK', etiket: 'CTI metodolojisi', metin: 'Tehdit davranışlarını ATT&CK teknikleri ve Cyber Kill Chain aşamalarıyla sınıflandırıp ilişkilendiriyorum.' },
    { id: 'ag', tur: 'arac', ikon: 'ag', ad: 'Nmap ve Wireshark', etiket: 'Ağ savunması', metin: 'Ağ keşfi, servis tespiti ve TCP/IP trafiğinin paket düzeyinde incelenmesi.' },
    { id: 'metasploit', tur: 'arac', ikon: 'hedef', ad: 'Metasploit', etiket: 'Zafiyet analizi', metin: 'Laboratuvar makinelerinde zafiyet doğrulama ve temel sızma testi akışı.' },
    { id: 'egitim', tur: 'basari', ikon: 'kep', ad: 'Siber güvenlik eğitimi', etiket: 'Sertifika', metin: 'Balıkesir Büyükşehir Belediyesi Teknoloji Eğitim Merkezi’nin siber güvenlik eğitimini tamamladım.' },
    { id: 'kali', tur: 'arac', ikon: 'terminal', ad: 'Kali Linux ve HTB', etiket: 'Laboratuvar', metin: 'Hack The Box ve Hackviser makinelerinde Kali Linux ile keşiften yetki yükseltmeye pratik.' },
];

const SUTUN = 4;

const Kart = ({ k }) => (
    <li className={`vitrin-kart vitrin-kart--${k.tur}`} tabIndex={0}>
        <div className="vitrin-kart-ic">
            <div className="vitrin-gorsel" aria-hidden="true">
                <svg className="vitrin-ikon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    {IKONLAR[k.ikon]}
                </svg>
                {k.buyuk && (
                    <span className="vitrin-buyuk">
                        {k.buyuk}
                        {k.alt && <small>{k.alt}</small>}
                    </span>
                )}
                <span className="vitrin-tarama" />
            </div>
            <p className="vitrin-ad">{k.ad}</p>
            <p className="vitrin-hikaye">{k.metin}</p>
            <div className="vitrin-etiket">
                <span className="vitrin-tur">{k.etiket}</span>
            </div>
        </div>
    </li>
);

const Vitrin = () => {
    const kok = useRef(null);

    useGSAP(() => {
        if (hareketAzalt()) return;
        const mm = gsap.matchMedia();
        // Sütunlar farklı hızlarda kayar: Lando'daki kask ızgarasındaki derinlik.
        mm.add('(min-width: 900px)', () => {
            gsap.utils.toArray('.vitrin-sutun').forEach((s, i) => {
                const hiz = [70, -40, 110, -10][i % 4];
                gsap.fromTo(s, { y: hiz }, {
                    y: -hiz,
                    ease: 'none',
                    scrollTrigger: { trigger: kok.current, start: 'top bottom', end: 'bottom top', scrub: true },
                });
            });
        });
        gsap.from('.vitrin-kart', {
            y: 60,
            opacity: 0,
            duration: 1.1,
            stagger: { each: 0.06, from: 'start' },
            ease: 'power3.out',
            scrollTrigger: { trigger: '.vitrin-izgara', start: 'top 85%' },
        });
        return () => mm.revert();
    }, { scope: kok });

    const sutunlar = Array.from({ length: SUTUN }, (_, s) => KARTLAR.filter((_, i) => i % SUTUN === s));

    return (
        <section className="vitrin" id="basarilar" ref={kok} data-renk="kozmos" aria-labelledby="vitrin-baslik">
            <div className="vitrin-ust">
                <h2 id="vitrin-baslik" className="karisik-baslik karisik-baslik--sol">
                    <span className="kb-kalin">Başarılar</span>
                    <span className="kb-serif">ve yetenekler</span>
                </h2>
                <p className="vitrin-giris">
                    Yarışmalardan, stajdan ve laboratuvarlardan gelen kanıtlar. Ayrıntısını görmek için bir kartın üzerine gel.
                </p>
            </div>
            <div className="vitrin-izgara">
                {sutunlar.map((liste, s) => (
                    <ul className="vitrin-sutun" key={s}>
                        {liste.map((k) => <Kart key={k.id} k={k} />)}
                    </ul>
                ))}
            </div>
        </section>
    );
};

export default Vitrin;
