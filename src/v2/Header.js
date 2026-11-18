import React, { useEffect, useState } from 'react';
import { git } from '../lib/anim';
import { baglantilar } from '../data';

const linkler = [
    { id: 'basa', ad: 'Giriş' },
    { id: 'yetkinlikler', ad: 'Yetenekler' },
    { id: 'hakkimda', ad: 'Hakkımda' },
    { id: 'calismalar', ad: 'Çalışmalar' },
    { id: 'iletisim', ad: 'İletişim' },
];

const IKON = {
    LinkedIn: <path d="M6.94 8.5H3.56V20h3.38zM5.25 3a1.96 1.96 0 1 0 0 3.92 1.96 1.96 0 0 0 0-3.92zM20.44 13.4c0-3.07-1.64-4.5-3.83-4.5-1.77 0-2.56.97-3 1.65V8.5h-3.37c.04.96 0 11.5 0 11.5h3.37v-6.42c0-.34.03-.69.13-.93.27-.69.9-1.4 1.95-1.4 1.37 0 1.92 1.05 1.92 2.58V20h3.38z" fill="currentColor" />,
    GitHub: <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.47.09.65-.2.65-.46v-1.6c-2.64.58-3.2-1.12-3.2-1.12-.43-1.1-1.05-1.39-1.05-1.39-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.85 1.45 2.22 1.03 2.76.79.09-.61.33-1.03.6-1.27-2.1-.24-4.32-1.05-4.32-4.68 0-1.03.37-1.88.98-2.54-.1-.24-.43-1.2.09-2.5 0 0 .8-.26 2.6.97a9 9 0 0 1 4.74 0c1.8-1.23 2.6-.97 2.6-.97.52 1.3.19 2.26.1 2.5.6.66.97 1.5.97 2.54 0 3.64-2.22 4.44-4.34 4.67.34.3.64.88.64 1.77v2.63c0 .26.17.55.66.46A9.5 9.5 0 0 0 12 2.5z" fill="currentColor" />,
};

// Mees Verberne'den esinlenen menü: en üstte sade bir satır; kaydırınca bağlantılar ortada,
// buzlu camdan yüzen bir kapsüle dönüşür. Bulunulan bölüm kapsülde vurgulanır.
const Header = () => {
    const [acik, setAcik] = useState(false);
    const [yuzer, setYuzer] = useState(false);
    const [aktif, setAktif] = useState('basa');

    useEffect(() => {
        const kaydir = () => setYuzer(window.scrollY > 80);
        kaydir();
        window.addEventListener('scroll', kaydir, { passive: true });

        const bolumler = linkler.map((l) => document.getElementById(l.id)).filter(Boolean);
        const gozlemci = new IntersectionObserver((girdiler) => {
            girdiler.forEach((g) => { if (g.isIntersecting) setAktif(g.target.id); });
        }, { rootMargin: '-45% 0px -50% 0px' });
        bolumler.forEach((b) => gozlemci.observe(b));

        const esc = (e) => e.key === 'Escape' && setAcik(false);
        window.addEventListener('keydown', esc);
        return () => {
            window.removeEventListener('scroll', kaydir);
            window.removeEventListener('keydown', esc);
            gozlemci.disconnect();
        };
    }, []);

    const tikla = (e, hedef) => {
        e.preventDefault();
        setAcik(false);
        git(hedef);
    };

    return (
        <header className={`ust ${yuzer ? 'ust--yuzer' : ''} ${acik ? 'ust--acik' : ''}`}>
            <a href="#basa" className="ust-logo" onClick={(e) => tikla(e, '#basa')} aria-label="Melih Başdemir, başa dön">
                <span className="ust-logo-isaret" aria-hidden="true">MB</span>
                {/* Squada One'da İ ve Ş yok. İ: I + fontun kendi nokta işareti. Ş: S + fontun Ç harfinden
                    kırpılmış çengel. İkisi de birebir fontun kendi çizimi. */}
                <span className="ust-logo-ad" aria-hidden="true">
                    MEL<span className="harf-nokta">I</span>H BA<span className="harf-cengel">S<i>Ç</i></span>DEM<span className="harf-nokta">I</span>R
                </span>
            </a>

            <nav id="ana-menu" className="ust-menu" aria-label="Ana menü">
                <ul>
                    {linkler.map((l) => (
                        <li key={l.id}>
                            <a
                                href={`#${l.id}`}
                                aria-current={aktif === l.id ? 'true' : undefined}
                                onClick={(e) => tikla(e, `#${l.id}`)}
                            >
                                {l.ad}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="ust-sag">
                {baglantilar.filter((b) => IKON[b.ad]).map((b) => (
                    <a key={b.ad} className="ust-sosyal" href={b.href} target="_blank" rel="noopener noreferrer" aria-label={b.ad}>
                        <svg viewBox="0 0 24 24" width="17" height="17" aria-hidden="true">{IKON[b.ad]}</svg>
                    </a>
                ))}
                <button
                    type="button"
                    className="ust-menu-dugme"
                    aria-expanded={acik}
                    aria-controls="ana-menu"
                    onClick={() => setAcik((a) => !a)}
                >
                    <span className="sr-only">{acik ? 'Menüyü kapat' : 'Menüyü aç'}</span>
                    <span aria-hidden="true" className="ust-cizgiler"><i /><i /></span>
                </button>
            </div>
        </header>
    );
};

export default Header;
