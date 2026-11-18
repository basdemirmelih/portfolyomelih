import React, { useRef, useState } from 'react';
import { kisi, baglantilar } from '../data';
import { gsap, useGSAP, hareketAzalt, git } from '../lib/anim';

const Contact = () => {
    const kok = useRef(null);
    const [ad, setAd] = useState('');
    const [mesaj, setMesaj] = useState('');

    useGSAP(() => {
        if (hareketAzalt()) return;
        gsap.from('.iletisim-baslik .isim-satir > span', {
            yPercent: 115,
            duration: 1.3,
            stagger: 0.1,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.iletisim-baslik', start: 'top 85%' },
        });
    }, { scope: kok });

    // Sunucu gerektirmeden: mesajı ziyaretçinin kendi e-posta uygulamasında hazır açar.
    const gonder = (e) => {
        e.preventDefault();
        const konu = encodeURIComponent(`Portfolyo üzerinden mesaj: ${ad}`);
        const govde = encodeURIComponent(`${mesaj}\n\n${ad}`);
        window.location.href = `mailto:${kisi.eposta}?subject=${konu}&body=${govde}`;
    };

    const [kullanici, alan] = kisi.eposta.split('@');

    return (
        <footer className="iletisim" id="iletisim" ref={kok} aria-labelledby="iletisim-baslik">
            <div className="kap">
                <h2 className="iletisim-baslik" id="iletisim-baslik">
                    <span className="isim-satir"><span>Bir merhaba</span></span>
                    <span className="isim-satir"><span>yeter.</span></span>
                </h2>

                <div className="iletisim-izgara">
                    <div>
                        <p className="iletisim-giris">Staj, ortak bir proje ya da sadece tanışmak için yazabilirsin.</p>
                        <a className="eposta" href={`mailto:${kisi.eposta}`}>{kullanici}<wbr />@{alan}</a>
                        <ul className="baglantilar">
                            <li><a href={kisi.telefonHref}>{kisi.telefon}</a></li>
                            {baglantilar.map((b) => (
                                <li key={b.ad}>
                                    <a href={b.href} target="_blank" rel="noopener noreferrer">{b.ad}</a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <form className="form" onSubmit={gonder}>
                        <label>
                            <span>Adın</span>
                            <input value={ad} onChange={(e) => setAd(e.target.value)} required autoComplete="name" />
                        </label>
                        <label>
                            <span>Mesajın</span>
                            <textarea value={mesaj} onChange={(e) => setMesaj(e.target.value)} required rows={4} />
                        </label>
                        <button className="dugme" type="submit"><span>E-postayla gönder</span></button>
                        <p className="form-not">Butona basınca e-posta uygulaman bu mesajla hazır açılır.</p>
                    </form>
                </div>

                <div className="alt-satir">
                    <p>© {new Date().getFullYear()} Melih Başdemir</p>
                    <a href="https://github.com/basdemirmelih/portfolyomelih" target="_blank" rel="noopener noreferrer">Kaynak kodu</a>
                    <button type="button" onClick={() => git('#basa')}>Başa dön</button>
                </div>
            </div>
        </footer>
    );
};

export default Contact;
