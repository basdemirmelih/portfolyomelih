import React, { useEffect, useRef, useState } from 'react';
import { projeler } from '../data';
import { gsap, useGSAP, ScrollTrigger, hareketAzalt } from '../lib/anim';

const ORTA = Math.floor(projeler.length / 2);
const SON = projeler.length - 1;
const BEKLE_MS = 380; // Kartın üzerinde bu kadar durunca ortaya gelir

// Lando Norris sitesindeki yelpazeden ölçülen oranlar (kart genişliği cinsinden).
// Odaktan uzaklık 0, 1, 2, 3, 4 için yatay kayma, aşağı iniş ve ölçek.
const X = [0, 0.93, 1.86, 2.53, 3.03];
const Y = [0, 0.11, 0.34, 0.61, 0.9];
const S = [1, 0.935, 0.85, 0.776, 0.7];
const ara = (dizi, a) => {
    const i = Math.min(Math.floor(a), dizi.length - 2);
    const t = Math.min(a - i, 1);
    return dizi[i] + (dizi[i + 1] - dizi[i]) * t;
};

// Bir kartın hedef konumu. hover: imlecin üzerinde olduğu kart (odaktan farklıysa).
function hedefKonum(i, odak, hover, w) {
    const o = i - odak;
    const a = Math.min(Math.abs(o), 4);
    const yon = Math.sign(o);
    const k = { x: yon * ara(X, a) * w, y: ara(Y, a) * w, r: o * 7, s: ara(S, a) };

    if (hover !== null && hover !== odak) {
        if (i === hover) {
            // Üzerine gelinen kart kalkar, büyür ve biraz düzleşir.
            k.y -= 0.14 * w;
            k.s *= 1.09;
            k.r *= 0.6;
        } else {
            // Komşular iki yana açılarak yer verir.
            const uzaklik = Math.abs(i - hover);
            k.x += Math.sign(i - hover) * 0.26 * w * Math.exp(-(uzaklik - 1) * 0.9);
        }
    }
    return k;
}

// Görseli olmayan siber güvenlik kartları kodla çizilir.
const TerminalKart = () => (
    <span className="kod-kart" aria-hidden="true">
        <span className="kod-ust"><i /><i /><i /><b>kali@lab: ~</b></span>
        <span className="kod-satir"><em>$</em> nmap -sV -p- 10.10.11.42</span>
        <span className="kod-satir kod-soluk">PORT&nbsp;&nbsp;&nbsp;STATE SERVICE</span>
        <span className="kod-satir">22/tcp <u>open</u>&nbsp; ssh</span>
        <span className="kod-satir">80/tcp <u>open</u>&nbsp; http</span>
        <span className="kod-satir"><em>$</em> msfconsole -q</span>
        <span className="kod-satir kod-yesil">[+] Session 1 opened</span>
        <span className="kod-satir"><em>#</em> whoami</span>
        <span className="kod-satir">root<span className="kod-imlec" /></span>
    </span>
);

const KILL_CHAIN = ['Keşif', 'Silahlanma', 'İletim', 'İstismar', 'Kurulum', 'C2', 'Eylem'];
const RaporKart = () => (
    <span className="rapor-kart" aria-hidden="true">
        <span className="rapor-ust"><b>TLP:AMBER</b><span>CTI RAPORU</span></span>
        <span className="rapor-baslik">Tehdit aktörü profili</span>
        <span className="rapor-satir"><i>Aktör</i><span className="rapor-sansur">█████ ████</span></span>
        <span className="rapor-satir"><i>Teknik</i><span>T1566 · T1059 · T1071</span></span>
        <span className="rapor-satir"><i>IOC</i><span>14 IP · 6 alan adı</span></span>
        <span className="rapor-satir"><i>Kaynak</i><span>OSINT · dark web</span></span>
        <span className="rapor-zincir">
            {KILL_CHAIN.map((k, i) => <span key={k} className={i < 5 ? 'dolu' : ''} title={k} />)}
        </span>
        <span className="rapor-alt">Cyber Kill Chain · 5/7 aşama eşleşti</span>
    </span>
);

const Projects = () => {
    const kok = useRef(null);
    const yelpaze = useRef(null);
    const kartlar = useRef([]);
    const [odak, setOdak] = useState(ORTA);
    const [yon, setYon] = useState(1);
    const azalt = hareketAzalt();

    // Animasyon durumu React dışında tutulur; her karede yay fiziğiyle güncellenir.
    const d = useRef({
        odak: ORTA,
        hover: null,
        dagitildi: projeler.map(() => azalt),
        yay: projeler.map(() => ({ x: 0, y: 0, r: 0, s: 0.8, vx: 0, vy: 0, vr: 0, vs: 0 })),
        bekle: null,
        kilit: null,
    });

    // Odağı değiştir: kart yaylanarak ortaya gelir.
    const odakla = (i) => {
        const yeni = Math.max(0, Math.min(SON, i));
        const s = d.current;
        if (yeni === s.odak) return;
        setYon(yeni > s.odak ? 1 : -1);
        s.odak = yeni;
        s.hover = null;
        setOdak(yeni);
    };

    useEffect(() => {
        const s = d.current;
        let gorunur = true;
        const gozlemci = new IntersectionObserver(([g]) => { gorunur = g.isIntersecting; }, { rootMargin: '300px' });
        gozlemci.observe(yelpaze.current);

        // Bölüme girince kartlar desteden dağıtılır gibi ortadan dışa doğru sırayla açılır.
        const st = azalt ? null : ScrollTrigger.create({
            trigger: yelpaze.current,
            start: 'top 78%',
            once: true,
            onEnter: () => {
                projeler.forEach((_, i) => {
                    gsap.delayedCall(0.12 + Math.abs(i - ORTA) * 0.11, () => { s.dagitildi[i] = true; });
                });
            },
        });

        const SERTLIK = 190;
        const SONUM = 19;
        const tik = (_t, dtMs) => {
            if (!gorunur) return;
            const el0 = kartlar.current[0];
            if (!el0) return;
            const w = el0.offsetWidth;
            const dt = Math.min(dtMs / 1000, 1 / 30);

            kartlar.current.forEach((el, i) => {
                if (!el) return;
                const y = s.yay[i];
                const dagildi = s.dagitildi[i];
                const h = dagildi
                    ? hedefKonum(i, s.odak, s.hover, w)
                    : { x: 0, y: 0.45 * w, r: (i - ORTA) * 2, s: 0.82 };

                if (azalt) {
                    Object.assign(y, { x: h.x, y: h.y, r: h.r, s: h.s });
                } else {
                    // Yay: hedefe doğru çekilir, sönümle durulur; hafif esneme verir.
                    y.vx += (SERTLIK * (h.x - y.x) - SONUM * y.vx) * dt;
                    y.vy += (SERTLIK * (h.y - y.y) - SONUM * y.vy) * dt;
                    y.vr += (SERTLIK * (h.r - y.r) - SONUM * y.vr) * dt;
                    y.vs += (SERTLIK * (h.s - y.s) - SONUM * y.vs) * dt;
                    y.x += y.vx * dt;
                    y.y += y.vy * dt;
                    y.r += y.vr * dt;
                    y.s += y.vs * dt;
                }

                const o = i - s.odak;
                const yakin = Math.max(0, 1 - Math.abs(y.x) / w);
                el.style.transform = `translate(-50%, 0) translate3d(${y.x.toFixed(2)}px, ${y.y.toFixed(2)}px, 0) rotate(${y.r.toFixed(3)}deg) scale(${y.s.toFixed(4)})`;
                el.style.zIndex = String(100 - Math.round(Math.abs(o) * 10) + (i === s.hover ? 50 : 0));
                el.style.opacity = dagildi ? '1' : '0';
                el.style.setProperty('--yakinlik', yakin.toFixed(3));
                el.style.setProperty('--o', Math.max(-3, Math.min(3, o)).toFixed(3));
            });
        };
        gsap.ticker.add(tik);
        return () => { gsap.ticker.remove(tik); gozlemci.disconnect(); st?.kill(); };
    }, [azalt]);

    // Başlık harfleri maskeden yükselir.
    useGSAP(() => {
        if (azalt) return;
        gsap.from('.projeler .karisik-baslik .harf-ic', {
            yPercent: 110,
            duration: 1.2,
            stagger: 0.03,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.projeler .karisik-baslik', start: 'top 82%' },
        });
    }, { scope: kok });

    // Fare kartın üzerinde: kart kalkar; biraz bekleyince ortaya gelir.
    const ustune = (i, e) => {
        if (e.pointerType !== 'mouse') return;
        const s = d.current;
        if (s.kilit && Math.hypot(e.clientX - s.kilit.x, e.clientY - s.kilit.y) < 40) return;
        s.kilit = null;
        if (i === s.odak) { s.hover = null; clearTimeout(s.bekle); return; }
        if (s.hover === i) return;
        s.hover = i;
        clearTimeout(s.bekle);
        s.bekle = setTimeout(() => {
            if (d.current.hover !== i) return;
            odakla(i);
            // Ortaya gelen kartın altında kalan imleç, hemen yeni bir kartı tetiklemesin.
            d.current.kilit = { x: e.clientX, y: e.clientY };
        }, BEKLE_MS);
    };

    const yelpazedenCik = () => {
        const s = d.current;
        s.hover = null;
        s.kilit = null;
        clearTimeout(s.bekle);
    };

    // Ortadaki kart imlece göre 3D eğilir, üzerinde ışık gezinir.
    const egil = (e, i) => {
        const el = kartlar.current[i];
        if (!el || i !== d.current.odak || e.pointerType !== 'mouse' || azalt) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--rx', `${((0.5 - py) * 12).toFixed(2)}deg`);
        el.style.setProperty('--ry', `${((px - 0.5) * 16).toFixed(2)}deg`);
        el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`);
        el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`);
        el.classList.add('kart--egik');
    };
    const duzelt = (i) => {
        const el = kartlar.current[i];
        if (!el) return;
        el.style.setProperty('--rx', '0deg');
        el.style.setProperty('--ry', '0deg');
        el.classList.remove('kart--egik');
    };

    // Dokunmatik: sürükleyerek kart değiştirme
    const surukle = useRef(null);
    const basla = (e) => { if (e.pointerType !== 'mouse') surukle.current = { x: e.clientX, gecti: false }; };
    const tasi = (e) => {
        const s = surukle.current;
        if (!s) return;
        const fark = e.clientX - s.x;
        if (Math.abs(fark) > 45) {
            odakla(d.current.odak + (fark < 0 ? 1 : -1));
            s.x = e.clientX;
            s.gecti = true;
        }
    };
    const bitir = () => { setTimeout(() => { surukle.current = null; }, 0); };

    const tus = (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); odakla(odak + 1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); odakla(odak - 1); }
        if (e.key === 'Enter') window.open(projeler[odak].link, '_blank', 'noopener');
    };

    const p = projeler[odak];
    const baslikHarfleri = (metin, sinif) => (
        <span className={sinif}>
            {metin.split('').map((h, i) => <span className="harf-kap" key={i}><span className="harf-ic">{h}</span></span>)}
        </span>
    );

    return (
        <section className="projeler" id="projeler" ref={kok} data-renk="buz" aria-labelledby="projeler-baslik">
            <h2 id="projeler-baslik" className="karisik-baslik" aria-label="Seçili projeler">
                {baslikHarfleri('Seçili', 'kb-kalin')}
                {baslikHarfleri('projeler', 'kb-serif')}
            </h2>

            <div
                className="yelpaze"
                ref={yelpaze}
                role="group"
                aria-roledescription="kart dizisi"
                aria-label="Projeler. Ok tuşlarıyla gez, Enter ile aç."
                tabIndex={0}
                onKeyDown={tus}
                onPointerMove={tasi}
                onPointerLeave={(e) => { yelpazedenCik(); bitir(e); }}
                onPointerDown={basla}
                onPointerUp={bitir}
                onPointerCancel={bitir}
            >
                {projeler.map((pr, i) => (
                    <button
                        type="button"
                        key={pr.id}
                        ref={(el) => { kartlar.current[i] = el; }}
                        className={`kart ${i === odak ? 'kart--aktif' : ''}`}
                        tabIndex={-1}
                        aria-label={pr.ad}
                        onPointerEnter={(e) => ustune(i, e)}
                        onPointerMove={(e) => { ustune(i, e); egil(e, i); }}
                        onPointerLeave={() => duzelt(i)}
                        onClick={() => {
                            if (surukle.current?.gecti) return;
                            if (i === odak) window.open(pr.link, '_blank', 'noopener');
                            else odakla(i);
                        }}
                    >
                        <span className={`kart-ic ${pr.tur ? `kart-ic--${pr.tur}` : ''}`}>
                            {pr.tur === 'terminal' && <TerminalKart />}
                            {pr.tur === 'rapor' && <RaporKart />}
                            {!pr.tur && <img src={pr.gorsel} alt="" draggable="false" loading="lazy" />}
                            <span className="kart-isik" aria-hidden="true" />
                            <span className="kart-alt">
                                <span className="kart-ad">{pr.ad}</span>
                                <span className="kart-teknoloji">{pr.teknoloji}</span>
                            </span>
                            <span className="kart-ac" aria-hidden="true">
                                Aç
                                <svg viewBox="0 0 16 16" width="12" height="12"><path d="M4 12L12 4M6 4h6v6" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                            </span>
                        </span>
                    </button>
                ))}
            </div>

            <div className="proje-detay" aria-live="polite">
                <button type="button" className="ok-dugme" onClick={() => odakla(odak - 1)} disabled={odak === 0} aria-label="Önceki proje">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                </button>
                <div className={`proje-detay-metin proje-detay-metin--${yon > 0 ? 'sag' : 'sol'}`} key={p.id}>
                    <p className="proje-detay-sayac">
                        <span>{String(odak + 1).padStart(2, '0')}</span> / {String(projeler.length).padStart(2, '0')}
                    </p>
                    <h3>{p.ad}</h3>
                    <p>{p.aciklama}</p>
                    <a className="hap hap--koyu" href={p.link} target="_blank" rel="noopener noreferrer">{p.linkMetni}</a>
                </div>
                <button type="button" className="ok-dugme" onClick={() => odakla(odak + 1)} disabled={odak === SON} aria-label="Sonraki proje">
                    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path d="M9 5l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="1.6" /></svg>
                </button>
            </div>
        </section>
    );
};

export default Projects;
