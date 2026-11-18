import React, { useEffect, useRef, useState } from 'react';
import { kisi, baglantilar } from '../data';
import { gsap, useGSAP, hareketAzalt, git } from '../lib/anim';

const saatMetni = () => new Date().toLocaleTimeString('tr-TR', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit' });

const Contact = () => {
    const kok = useRef(null);
    const [ad, setAd] = useState('');
    const [mesaj, setMesaj] = useState('');
    const [gonderen, setGonderen] = useState('');
    const [tuzak, setTuzak] = useState(''); // botlar için gizli alan; insanlar boş bırakır
    const [durum, setDurum] = useState('bos'); // bos | gonderiliyor | gonderildi | onay | hata
    const [kopyalandi, setKopyalandi] = useState(false);
    const [saat, setSaat] = useState(saatMetni);

    useEffect(() => {
        const id = setInterval(() => setSaat(saatMetni()), 20000);
        return () => clearInterval(id);
    }, []);

    // "BANA ULAŞABİLİRSİN" satırı tam genişliğe otursun (uzun olduğu için kendiliğinden küçülür).
    useEffect(() => {
        const baslik = kok.current.querySelector('.iletisim-dev');
        const ic = baslik.querySelector('.iletisim-dev-ic');
        const ayarla = () => {
            baslik.style.setProperty('--dev-boyut', '100px');
            const w = ic.getBoundingClientRect().width;
            const hedef = baslik.getBoundingClientRect().width;
            if (w > 0) baslik.style.setProperty('--dev-boyut', `${(hedef / w) * 100 * 0.995}px`);
        };
        ayarla();
        document.fonts?.ready.then(ayarla);
        window.addEventListener('resize', ayarla);
        return () => window.removeEventListener('resize', ayarla);
    }, []);

    useGSAP(() => {
        if (hareketAzalt()) return;
        gsap.from('.iletisim-dev .harf', {
            yPercent: 105,
            duration: 1.3,
            stagger: 0.04,
            ease: 'power4.out',
            scrollTrigger: { trigger: '.iletisim-dev', start: 'top 85%' },
        });
    }, { scope: kok });

    const kopyala = async () => {
        try {
            await navigator.clipboard.writeText(kisi.eposta);
            setKopyalandi(true);
            setTimeout(() => setKopyalandi(false), 2200);
        } catch (e) {
            window.location.href = `mailto:${kisi.eposta}`;
        }
    };

    // Mesaj FormSubmit üzerinden doğrudan e-posta kutusuna gönderilir (hesap gerektirmez).
    // İlk gönderimde FormSubmit, adrese bir kez "Activate" onay e-postası yollar; onaylandıktan
    // sonra bütün mesajlar doğrudan gelir. Servis yanıt vermezse e-posta uygulamasıyla açılır.
    const gonder = async (e) => {
        e.preventDefault();
        if (durum === 'gonderiliyor') return;
        setDurum('gonderiliyor');
        // Servis 15 saniyede yanıt vermezse istek iptal edilir; ziyaretçi sonsuza kadar beklemez.
        const iptal = new AbortController();
        const zamanAsimi = setTimeout(() => iptal.abort(), 15000);
        try {
            const yanit = await fetch(`https://formsubmit.co/ajax/${kisi.eposta}`, {
                method: 'POST',
                signal: iptal.signal,
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({
                    ad,
                    eposta: gonderen,
                    mesaj,
                    _subject: `Portfolyo üzerinden mesaj: ${ad}`,
                    _replyto: gonderen,
                    _template: 'table',
                    _honey: tuzak,
                }),
            });
            const veri = await yanit.json().catch(() => ({}));
            const basarisiz = !yanit.ok || veri.success === 'false' || veri.success === false;
            // Form henüz onaylanmamışsa FormSubmit "Activation" yanıtı döner: mesaj iletilmez.
            if (basarisiz && /activat/i.test(veri.message || '')) { setDurum('onay'); return; }
            if (basarisiz) throw new Error(veri.message || 'gönderilemedi');
            setDurum('gonderildi');
            setAd('');
            setGonderen('');
            setMesaj('');
        } catch (hata) {
            setDurum('hata');
        } finally {
            clearTimeout(zamanAsimi);
        }
    };

    const epostaUygulamasi = () => {
        const konu = encodeURIComponent(`Portfolyo üzerinden mesaj: ${ad}`);
        const govde = encodeURIComponent(`${mesaj}\n\n${ad}${gonderen ? ` (${gonderen})` : ''}`);
        window.location.href = `mailto:${kisi.eposta}?subject=${konu}&body=${govde}`;
    };

    const kanallar = [
        ...baglantilar.map((b) => ({ ad: b.ad, deger: b.kullanici, href: b.href, dis: true })),
        { ad: 'Telefon', deger: kisi.telefon, href: kisi.telefonHref },
    ];

    return (
        <footer className="iletisim" id="iletisim" ref={kok} data-renk="gece" aria-labelledby="iletisim-baslik">
            <h2 id="iletisim-baslik" className="iletisim-dev" aria-label="Bana ulaşabilirsin">
                <span className="iletisim-dev-ic" aria-hidden="true">
                    {'BANA ULAŞABİLİRSİN'.split('').map((h, i) => (
                        <span className="harf-kap" key={i}><span className="harf">{h === ' ' ? ' ' : h}</span></span>
                    ))}
                </span>
            </h2>

            <div className="iletisim-izgara">
                <div className="iletisim-sol">
                    <p className="durum"><span className="durum-nokta" aria-hidden="true" />Staj ve proje tekliflerine açığım</p>
                    <p className="iletisim-giris">
                        Tehdit istihbaratı, güvenlik ya da yazılım odaklı bir iş için; ya da sadece tanışmak için yaz.
                        Genelde bir gün içinde dönerim.
                    </p>
                    <div className="eposta-kutu">
                        <a className="eposta" href={`mailto:${kisi.eposta}`}>{kisi.eposta}</a>
                        <button type="button" className="kopyala" onClick={kopyala} aria-live="polite">
                            {kopyalandi ? 'Kopyalandı' : 'Kopyala'}
                        </button>
                    </div>
                    <a className="kare-link cv-link" href="/cv/Melih_Basdemir_CV.pdf" download>
                        CV’mi indir (PDF) <span aria-hidden="true" />
                    </a>
                    <dl className="iletisim-bilgi">
                        <div><dt>Konum</dt><dd>Sivas ve Balıkesir, Türkiye</dd></div>
                        <div><dt>Yerel saat</dt><dd>{saat}</dd></div>
                    </dl>
                </div>

                <ul className="kanallar">
                    {kanallar.map((k) => (
                        <li key={k.ad}>
                            <a className="kanal" href={k.href} {...(k.dis ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                                <span className="kanal-tur">{k.ad}</span>
                                <span className="kanal-deger">{k.deger}</span>
                                <svg className="kanal-ok" viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                                    <path d="M6 18L18 6M9 6h9v9" fill="none" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                            </a>
                        </li>
                    ))}
                </ul>

                <form className="form" onSubmit={gonder}>
                    <p className="form-baslik">Mesaj bırak</p>
                    <label>
                        <span>Adın</span>
                        <input value={ad} onChange={(e) => setAd(e.target.value)} required autoComplete="name" />
                    </label>
                    <label>
                        <span>E-posta adresin</span>
                        <input type="email" value={gonderen} onChange={(e) => setGonderen(e.target.value)} required autoComplete="email" />
                    </label>
                    <label>
                        <span>Mesajın</span>
                        <textarea value={mesaj} onChange={(e) => setMesaj(e.target.value)} required rows={3} />
                    </label>
                    <input
                        className="tuzak" type="text" tabIndex={-1} autoComplete="off" aria-hidden="true"
                        value={tuzak} onChange={(e) => setTuzak(e.target.value)}
                    />
                    <button className="kare-link kare-link--dugme" type="submit" disabled={durum === 'gonderiliyor'}>
                        {durum === 'gonderiliyor' ? 'Gönderiliyor…' : 'Gönder'} <span aria-hidden="true" />
                    </button>
                    <p className={`form-not form-not--${durum}`} role="status" aria-live="polite">
                        {durum === 'gonderildi' && 'Mesajın ulaştı, teşekkürler. Genelde bir gün içinde dönerim.'}
                        {(durum === 'hata' || durum === 'onay') && (
                            <>
                                {durum === 'onay'
                                    ? 'Mesaj kutum şu an kurulum aşamasında, mesajın iletilemedi.'
                                    : 'Mesaj şu an gönderilemedi.'}{' '}
                                <button type="button" className="metin-dugme" onClick={epostaUygulamasi}>E-posta uygulamanla gönder</button>
                            </>
                        )}
                        {(durum === 'bos' || durum === 'gonderiliyor') && 'Mesajın doğrudan e-posta kutuma gelir.'}
                    </p>
                </form>
            </div>

            <div className="alt-satir">
                <p>© {new Date().getFullYear()} Melih Başdemir</p>
                <a href="https://github.com/basdemirmelih/portfolyomelih" target="_blank" rel="noopener noreferrer">Kaynak kodu</a>
                <button type="button" onClick={() => git('#basa')}>Başa dön ↑</button>
            </div>
        </footer>
    );
};

export default Contact;
