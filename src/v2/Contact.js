import React, { useRef, useState } from 'react';
import { kisi, baglantilar } from '../data';
import { gsap, useGSAP, hareketAzalt, git } from '../lib/anim';

const Contact = () => {
    const kok = useRef(null);
    const [ad, setAd] = useState('');
    const [mesaj, setMesaj] = useState('');

    useGSAP(() => {
        if (hareketAzalt()) return;
        // Dev imza harf harf alttan yükselir.
        gsap.from('.dev-imza span', {
            yPercent: 100,
            duration: 1.4,
            stagger: 0.04,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.dev-imza', start: 'top 95%' },
        });
    }, { scope: kok });

    // Sunucu gerektirmez: mesaj ziyaretçinin e-posta uygulamasında hazır açılır.
    const gonder = (e) => {
        e.preventDefault();
        const konu = encodeURIComponent(`Portfolyo üzerinden mesaj: ${ad}`);
        const govde = encodeURIComponent(`${mesaj}\n\n${ad}`);
        window.location.href = `mailto:${kisi.eposta}?subject=${konu}&body=${govde}`;
    };

    const [kullanici, alan] = kisi.eposta.split('@');

    // Kanal satırları: üzerine gelince satır soldan dolar, ok kayar.
    const kanallar = [
        { tur: 'e-posta', deger: kisi.eposta, href: `mailto:${kisi.eposta}`, kirik: true },
        ...baglantilar
            .filter((b) => b.ad === 'LinkedIn' || b.ad === 'GitHub')
            .map((b) => ({ tur: b.ad.toLowerCase(), deger: b.kullanici, href: b.href, dis: true })),
        { tur: 'telefon', deger: kisi.telefon, href: kisi.telefonHref },
    ];
    const digerleri = baglantilar.filter((b) => b.ad !== 'LinkedIn' && b.ad !== 'GitHub');

    return (
        <footer className="iletisim" id="iletisim" ref={kok} data-renk="derin" aria-labelledby="iletisim-baslik">
            <div className="iletisim-ust">
                <h2 id="iletisim-baslik" className="karisik-baslik karisik-baslik--sol">
                    <span className="kb-kalin">Bana</span>
                    <span className="kb-serif">ulaşabilirsin</span>
                </h2>
                <p className="iletisim-giris">
                    Staj, tehdit istihbaratı ya da güvenlik odaklı bir proje için; ya da sadece tanışmak için yaz.
                    Genelde bir gün içinde dönerim.
                </p>
            </div>

            <div className="iletisim-izgara">
                <ul className="kanallar">
                    {kanallar.map((k) => (
                        <li key={k.tur}>
                            <a
                                className="kanal"
                                href={k.href}
                                {...(k.dis ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                aria-label={`${k.tur}: ${k.deger}`}
                            >
                                <span className="kanal-tur">{k.tur}</span>
                                <span className="kanal-deger">
                                    {k.kirik ? <>{kullanici}<wbr />@{alan}</> : k.deger}
                                </span>
                                <svg className="kanal-ok" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
                                    <path d="M6 18L18 6M9 6h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </a>
                        </li>
                    ))}
                    <li className="kanallar-diger">
                        {digerleri.map((b) => (
                            <a key={b.ad} href={b.href} target="_blank" rel="noopener noreferrer">{b.ad}</a>
                        ))}
                    </li>
                </ul>

                <form className="form" onSubmit={gonder}>
                    <p className="form-baslik">Ya da buradan yaz</p>
                    <label>
                        <span>Adın</span>
                        <input value={ad} onChange={(e) => setAd(e.target.value)} required autoComplete="name" />
                    </label>
                    <label>
                        <span>Mesajın</span>
                        <textarea value={mesaj} onChange={(e) => setMesaj(e.target.value)} required rows={4} />
                    </label>
                    <button className="hap hap--acik" type="submit">E-postayla gönder</button>
                    <p className="form-not">Butona basınca e-posta uygulaman bu mesajla hazır açılır.</p>
                </form>
            </div>

            <p className="dev-imza" aria-hidden="true">
                {'MELİH BAŞDEMİR'.split('').map((h, i) => <span key={i}>{h === ' ' ? ' ' : h}</span>)}
            </p>

            <div className="alt-satir">
                <p>© {new Date().getFullYear()} Melih Başdemir</p>
                <a href="https://github.com/basdemirmelih/portfolyomelih" target="_blank" rel="noopener noreferrer">Kaynak kodu</a>
                <button type="button" onClick={() => git('#basa')}>Başa dön</button>
            </div>
        </footer>
    );
};

export default Contact;
