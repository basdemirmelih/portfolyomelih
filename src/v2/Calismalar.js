import React, { useEffect, useRef, useState } from 'react';
import { ScrollTrigger, gsap, hareketAzalt, kaydirici } from '../lib/anim';
import Izgara from './Izgara';

// İlk üçü çalışma (açık renkli geçiş kartı), son üçü başarı (koyu kart).
// Arka yüz kartın boyuna göre yazıldı: kısa bir cümle, en fazla üç etiket, bir bağlantı.
const KARTLAR = [
    {
        id: 'CTI', tur: 'calisma', ust: 'Staj', buyuk: '40', buyukAlt: 'iş günü',
        baslik: 'CoreSynapseAI', rol: 'Cyber Threat Intelligence stajyeri', tarih: 'Tem–Eyl 2026',
        metin: 'OSINT ve dark web kaynaklarından tehdit aktörlerini araştırdım; IOC’leri MITRE ATT&CK ile analiz edip raporladım.',
        etiketler: ['OSINT', 'IOC', 'ATT&CK'],
    },
    {
        id: 'CTF', tur: 'basari', ust: 'Yarışma', buyuk: 'Final', buyukAlt: '',
        baslik: 'Siber Vatan', rol: 'CTF Türkiye finalisti', tarih: 'Türkiye finali',
        metin: 'Siber Vatan programında CTF yarı finalini geçip Türkiye finaline kaldım.',
        etiketler: ['CTF', 'Türkiye finali'],
    },
    {
        id: 'OYUN', tur: 'calisma', ust: 'GameJam', buyuk: '3.', buyukAlt: 'derece',
        baslik: '3D yarış oyunu', rol: 'Balıkesir Teknokent GameJam', tarih: 'Unity, C#',
        metin: 'Kısıtlı sürede ekiple geliştirdiğimiz, üçüncülük alan 3D araba oyunu.',
        etiketler: ['Unity', 'C#', 'Takım'],
    },
    {
        id: 'LAB', tur: 'calisma', ust: 'Laboratuvar', buyuk: 'LAB', buyukAlt: '',
        baslik: 'Siber güvenlik laboratuvarı', rol: 'Zafiyet analizi ve sızma testi', tarih: 'Sürüyor',
        metin: 'Laboratuvar makinelerinde keşiften yetki yükseltmeye uçtan uca zafiyet analizi.',
        etiketler: ['Nmap', 'Wireshark', 'Metasploit'],
    },
    {
        id: 'HACK', tur: 'basari', ust: 'Hackathon', buyuk: '1.', buyukAlt: 'derece',
        baslik: 'TREX × Uludağ Üni.', rol: 'Yapay Zekâ Hackathonu', tarih: 'Birincilik',
        metin: 'TREX ile Uludağ Üniversitesi’nin Yapay Zekâ Hackathonu’nda ekibimle birinci olduk.',
        etiketler: ['Yapay zekâ', 'Takım'],
    },
    {
        id: 'EGT', tur: 'basari', ust: 'Eğitim', buyuk: 'SEC', buyukAlt: '',
        baslik: 'Siber güvenlik eğitimi', rol: 'Balıkesir Büyükşehir Belediyesi', tarih: 'Sertifika',
        metin: 'Balıkesir Büyükşehir Belediyesi Teknoloji Eğitim Merkezi’nin siber güvenlik eğitimi.',
        etiketler: ['Siber güvenlik', 'Sertifika'],
    },
];

const Rozet = ({ k, cevrik, olaylar }) => (
    <div
        className={`rozet rozet--${k.tur} ${cevrik ? 'rozet--cevrik' : ''}`}
        role="button"
        tabIndex={0}
        aria-pressed={cevrik}
        aria-label={`${k.baslik}, ${k.rol}. Ayrıntılar için çevir.`}
        {...olaylar}
    >
        <div className="rozet-ic">
            <div className="rozet-yuz rozet-on" aria-hidden={cevrik}>
                <span className="rozet-yuva" />
                <p className="rozet-ust"><span>Erişim / {k.ust}</span><b>{k.id}</b></p>
                <p className="rozet-buyuk">{k.buyuk}{k.buyukAlt && <small>{k.buyukAlt}</small>}</p>
                <p className="rozet-baslik">{k.baslik}</p>
                <p className="rozet-rol">{k.rol}</p>
                <span className="rozet-holo" />
                <div className="rozet-dip">
                    <span className="rozet-kimlik">MB-26-{k.id}</span>
                    <em>{k.tarih}</em>
                </div>
            </div>
            <div className="rozet-yuz rozet-arka" aria-hidden={!cevrik}>
                <span className="rozet-yuva" />
                <p className="rozet-ust"><span>Dosya / {k.ust}</span><b>{k.id}</b></p>
                <p className="rozet-arka-baslik">{k.baslik}</p>
                <p className="rozet-metin">{k.metin}</p>
                <div className="rozet-arka-dip">
                    <ul className="rozet-etiketler">{k.etiketler.map((e) => <li key={e}>{e}</li>)}</ul>
                    {k.link && (
                        <a
                            className="rozet-link"
                            href={k.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={cevrik ? 0 : -1}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {k.linkMetni} ↗
                        </a>
                    )}
                </div>
            </div>
        </div>
    </div>
);

// Kartlar bir raya iple asılı. Hepsi tek bir sarkaç/yay fiziğine uyar:
// iniş (sırayla, soldan sağa), kaydırma hızıyla aynı yöne sallanma, imlece doğru hafif eğilme.
// Fareyle üzerine gelince kart kendiliğinden döner; dokunmatikte dokununca döner.
const Calismalar = () => {
    const kok = useRef(null);
    const askilar = useRef([]);
    const durum = useRef(KARTLAR.map(() => ({ aci: 0, w: 0, hedefAci: 0, y: -900, vy: 0, indi: false })));
    const [cevrik, setCevrik] = useState(() => KARTLAR.map(() => false));
    const azalt = hareketAzalt();

    useEffect(() => {
        const d0 = durum.current;
        // Telefonda (dokunmatik/dar ekran) kartlar düşmez ve sallanmaz: yerlerinde sabit asılı durur.
        // Kaydırma sırasında her karede dönüşüm yazmak hem kasma yapıyordu hem de yana kaydırmayı bozuyordu.
        const sabit = azalt || window.matchMedia('(pointer: coarse), (max-width: 860px)').matches;
        if (sabit) {
            d0.forEach((d, i) => {
                d.y = 0; d.indi = true;
                const el = askilar.current[i];
                if (el) { el.style.transform = ''; el.style.opacity = '1'; }
            });
            return undefined;
        }

        let gorunur = false;
        const gozlemci = new IntersectionObserver(([g]) => { gorunur = g.isIntersecting; }, { rootMargin: '200px' });
        gozlemci.observe(kok.current);

        const st = azalt ? null : ScrollTrigger.create({
            trigger: kok.current.querySelector('.askilar'),
            start: 'top 75%',
            once: true,
            onEnter: () => {
                d0.forEach((d, i) => {
                    gsap.delayedCall(0.1 + i * 0.11, () => { d.indi = true; d.w = 26; });
                });
            },
        });

        // Hepsi durulunca karede hiçbir şey yazılmaz (gereksiz stil güncellemesi olmaz).
        const son = d0.map(() => '');
        const tik = (_t, dtMs) => {
            if (!gorunur) return;
            const dt = Math.min(dtMs / 1000, 1 / 30);
            const hiz = kaydirici.lenis ? kaydirici.lenis.velocity : 0;
            d0.forEach((d, i) => {
                const el = askilar.current[i];
                if (!el) return;
                if (!azalt) {
                    // Sarkaç: hedef açıya yayla çekilir, sönümlenir; kaydırma hızı aynı yönde, sınırlı tork verir.
                    const itme = Math.max(-45, Math.min(45, hiz)) * 9;
                    const tork = -95 * (d.aci - d.hedefAci) - 5.5 * d.w + itme;
                    d.w += tork * dt;
                    d.aci += d.w * dt;
                    if (Math.abs(d.aci) > 14) { d.aci = Math.sign(d.aci) * 14; d.w *= -0.3; }
                    // İniş: yukarıdan yayla gelip hafifçe esneyerek oturur.
                    const hedefY = d.indi ? 0 : -900;
                    d.vy += (150 * (hedefY - d.y) - 13 * d.vy) * dt;
                    d.y += d.vy * dt;
                }
                const tr = `translate3d(0, ${d.y.toFixed(1)}px, 0) rotate(${d.aci.toFixed(2)}deg)`;
                if (tr !== son[i]) {
                    el.style.transform = tr;
                    el.style.opacity = d.indi ? '1' : '0';
                    son[i] = tr;
                }
            });
        };
        gsap.ticker.add(tik);

        return () => {
            gsap.ticker.remove(tik);
            gozlemci.disconnect();
            st?.kill();
        };
    }, [azalt]);

    const ayarla = (i, deger) => setCevrik((c) => (c[i] === deger ? c : c.map((v, j) => (j === i ? deger : v))));

    // Her kart yalnızca kendi imleç olaylarını dinler (tüm kartları her harekette ölçmek gerekmez).
    // Olaylar dönmeyen askı kutusunda dinlenir: kart dönerken bir an incelir ve imleç
    // "karttan çıkmış" sayılırsa geri dönüp titrerdi.
    const rozetEl = (e) => e.currentTarget.querySelector('.rozet');
    const askiOlaylari = (i) => ({
        onPointerEnter: (e) => { if (e.pointerType === 'mouse') ayarla(i, true); },
        onPointerLeave: (e) => {
            const r = rozetEl(e);
            durum.current[i].hedefAci = 0;
            r.style.setProperty('--ry', '0deg');
            r.style.setProperty('--rx', '0deg');
            r.classList.remove('rozet--egik');
            if (e.pointerType === 'mouse') ayarla(i, false);
        },
        onPointerMove: (e) => {
            if (e.pointerType !== 'mouse' || azalt) return;
            const el = rozetEl(e);
            const r = e.currentTarget.getBoundingClientRect();
            const px = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
            const py = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
            durum.current[i].hedefAci = (px - 0.5) * -7;
            el.style.setProperty('--ry', `${((px - 0.5) * 14).toFixed(2)}deg`);
            el.style.setProperty('--rx', `${((0.5 - py) * 8).toFixed(2)}deg`);
            el.style.setProperty('--hx', `${(px * 100).toFixed(1)}%`);
            el.classList.add('rozet--egik');
        },
    });
    const rozetOlaylari = (i) => ({
        // Dokunmatik ve klavye: dokununca / Enter ile çevrilir
        onClick: (e) => { if (e.nativeEvent.pointerType !== 'mouse') setCevrik((c) => c.map((v, j) => (j === i ? !v : v))); },
        onKeyDown: (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setCevrik((c) => c.map((v, j) => (j === i ? !v : v)));
            }
        },
    });

    const sira = (bas, son) => (
        <div className="askilar-sira">
            <span className="ray" aria-hidden="true" />
            <ul>
                {KARTLAR.slice(bas, son).map((k, j) => {
                    const i = bas + j;
                    return (
                        <li className="aski" key={k.id} ref={(el) => { askilar.current[i] = el; }} {...askiOlaylari(i)}>
                            <span className="aski-ip" aria-hidden="true" />
                            <span className="aski-klips" aria-hidden="true" />
                            <Rozet k={k} cevrik={cevrik[i]} olaylar={rozetOlaylari(i)} />
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <section className="calismalar" id="calismalar" ref={kok} data-renk="gece" aria-labelledby="calismalar-baslik">
            <Izgara />
            <div className="calismalar-ust">
                <h2 id="calismalar-baslik" className="genis-baslik">
                    <span>Çalışmalar</span>
                    <span className="genis-baslik-ince">ve başarılar</span>
                </h2>
                <p className="calismalar-giris">
                    Staj, laboratuvar ve yarışmalardan kanıtlar. Ayrıntısını görmek için bir kartın üzerine gel ya da dokun.
                </p>
            </div>
            <div className="askilar">
                {sira(0, 3)}
                {sira(3, 6)}
            </div>
        </section>
    );
};

export default Calismalar;
