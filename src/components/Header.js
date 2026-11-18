import React, { useEffect, useState } from 'react';
import { git } from '../lib/anim';

const linkler = [
    { id: 'projeler', ad: 'Projeler' },
    { id: 'yetkinlikler', ad: 'Yetkinlikler' },
    { id: 'hakkimda', ad: 'Hakkımda' },
    { id: 'iletisim', ad: 'İletişim' },
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
            <a href="#basa" className="logo" onClick={(e) => tikla(e, '#basa')}>Melih Başdemir</a>
            <button
                type="button"
                className="menu-dugme"
                aria-expanded={acik}
                aria-controls="ana-menu"
                onClick={() => setAcik((a) => !a)}
            >
                {acik ? 'Kapat' : 'Menü'}
            </button>
            <nav id="ana-menu" className="menu" aria-label="Ana menü">
                <ul>
                    {linkler.map((l) => (
                        <li key={l.id}>
                            <a href={`#${l.id}`} onClick={(e) => tikla(e, `#${l.id}`)}>
                                <span data-metin={l.ad}>{l.ad}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
