import React, { useEffect, useState } from 'react';
import { hareketAzalt } from '../lib/anim';

const KARAKTER = '01<>/{}[]#$%&*+=_';

// Metin değişince harfler önce rastgele karakterlere döner, sonra soldan sağa çözülür.
const Coz = ({ metin, className }) => {
    const [gorunen, setGorunen] = useState(metin);

    useEffect(() => {
        if (hareketAzalt()) { setGorunen(metin); return undefined; }
        let kare = 0;
        const toplam = 22;
        const id = setInterval(() => {
            kare += 1;
            const cozulen = Math.floor((kare / toplam) * metin.length);
            setGorunen(
                metin
                    .split('')
                    .map((h, i) => (i < cozulen || h === ' ' ? h : KARAKTER[(Math.random() * KARAKTER.length) | 0]))
                    .join('')
            );
            if (kare >= toplam) { clearInterval(id); setGorunen(metin); }
        }, 32);
        return () => clearInterval(id);
    }, [metin]);

    return (
        <span className={className}>
            <span aria-hidden="true">{gorunen}</span>
            <span className="sr-only">{metin}</span>
        </span>
    );
};

export default Coz;
