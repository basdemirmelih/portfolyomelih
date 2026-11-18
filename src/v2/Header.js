import React, { useEffect, useState } from 'react';
import { git } from '../lib/anim';

const linkler = [
    { id: 'yetkinlikler', ad: 'Yetkinlikler' },
    { id: 'projeler', ad: 'Projeler' },
    { id: 'hakkimda', ad: 'Hakkımda' },
    { id: 'basarilar', ad: 'Başarılar' },
];

const Header = () => {
    const [acik, setAcik] = useState(false);

    useEffect(() => {
        const esc = (e) => e.key === 'Escape' && setAcik(false);
        window.addEventListener('keydown', esc);
        return () => window.removeEventListener('keydown', esc);
    }, []);

    const tikla = (e, hedef) => {
        e.preventDefault();
        setAcik(false);
        git(hedef);
    };

    return (
        <header className={`ust ${acik ? 'ust--acik' : ''}`}>
            <a href="#basa" className="ust-logo" onClick={(e) => tikla(e, '#basa')}>
                <em>Melih</em> Başdemir
            </a>
            <nav id="ana-menu" className="ust-menu" aria-label="Ana menü">
                <ul>
                    {linkler.map((l) => (
                        <li key={l.id}>
                            <a href={`#${l.id}`} onClick={(e) => tikla(e, `#${l.id}`)}>{l.ad}</a>
                        </li>
                    ))}
                    <li className="ust-menu-iletisim">
                        <a href="#iletisim" onClick={(e) => tikla(e, '#iletisim')}>İletişim</a>
                    </li>
                </ul>
            </nav>
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
        </header>
    );
};

export default Header;
