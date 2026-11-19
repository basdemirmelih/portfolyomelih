import React, { useEffect, useRef } from 'react';
import { gsap, useGSAP, hareketAzalt, git } from '../lib/anim';

// İ harfi, I + yazı tipinin gövdesiyle aynı genişlikte, yatay ve daha alçak bir noktayla çizilir (v2.css .harf--i).
const harfler = (metin) => metin.split('').map((h, i) => (
    h === 'İ'
        ? <span className="harf harf--i" key={i} aria-hidden="true">I</span>
        : <span className="harf" key={i} aria-hidden="true">{h}</span>
));

// Giriş: ad ekranı enlemesine doldurur. "BAŞDEMİR" (üstte) yüz hizasında görselin arkasında kalır,
// "MELİH" (altta) boyun hizasında önden geçer; yüz hiçbir yazının altında kalmaz.
// fare hareketinde üç katman farklı miktarda kayar ve derinlik hissi verir.
// Hayalet satırın harfleri ayrı sınıfta: parçacık örneklemesi (.isim .harf) onları saymaz.
const hayaletHarfler = (metin) => metin.split('').map((h, i) => (
    h === 'İ' ? <span className="harf-h harf--i" key={i}>I</span> : <span className="harf-h" key={i}>{h}</span>
));

const Hero = () => {
    const kok = useRef(null);

    // En uzun satır ("BAŞDEMİR", üstte) tam genişliğe otursun diye yazı boyutu ölçülerek ayarlanır.
    useEffect(() => {
        const isim = kok.current.querySelector('.isim');
        const alt = kok.current.querySelector('.isim-satir--ust .isim-ic');
        const ayarla = () => {
            isim.style.setProperty('--isim-boyut', '100px');
            const genislik = alt.getBoundingClientRect().width;
            const hedef = isim.getBoundingClientRect().width;
            // Yatay telefonda tam genişlik adı ekrana sığmayacak kadar büyütür: yüksekliğe göre sınırlanır.
            const yatayKisa = window.innerHeight < 520 && window.innerWidth > window.innerHeight;
            const tavan = yatayKisa ? window.innerHeight * 0.16 : Infinity;
            if (genislik > 0) isim.style.setProperty('--isim-boyut', `${Math.min((hedef / genislik) * 100 * 0.995, tavan)}px`);
        };
        ayarla();
        document.fonts?.ready.then(ayarla);
        window.addEventListener('resize', ayarla);
        return () => window.removeEventListener('resize', ayarla);
    }, []);

    useGSAP((_, contextSafe) => {
        if (hareketAzalt()) return undefined;

        gsap.timeline({ defaults: { ease: 'power4.out' } })
            .fromTo('.giris-gorsel', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'power4.inOut' }, 0.15)
            .from('.giris-gorsel img', { scale: 1.2, duration: 2.4, ease: 'power3.out' }, 0.15)
            .from('.isim .harf', { yPercent: 105, duration: 1.4, stagger: 0.045 }, 0.35)
            .from('.isim .harf-h', { yPercent: 105, duration: 1.4, stagger: 0.045 }, 0.35)
            .from('.giris-alt > *, .giris-dip > *', { y: 16, opacity: 0, duration: 1, stagger: 0.08 }, 1.2);

        const katman = (sec, kat) => {
            const el = kok.current.querySelector(sec);
            return {
                x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
                y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
                kat,
            };
        };
        const katmanlar = [katman('.isim-satir--ust', -10), katman('.isim-satir--hayalet', -10), katman('.giris-gorsel-ic', 16), katman('.isim-satir--alt', -26)];
        const hareket = contextSafe((e) => {
            const nx = e.clientX / window.innerWidth - 0.5;
            const ny = e.clientY / window.innerHeight - 0.5;
            katmanlar.forEach((k) => { k.x(nx * k.kat); k.y(ny * k.kat * 0.5); });
        });
        kok.current.addEventListener('pointermove', hareket);

        // Aşağı kaydırırken görsel ve yan yazılar söner; ad parçacıklara dönüşmek üzere yerinde kalır.
        gsap.fromTo('.giris-gorsel', { opacity: 1 }, {
            opacity: 0,
            scale: 0.94,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: kok.current, start: 'top top', end: '55% top', scrub: true },
        });
        gsap.fromTo('.giris-alt, .giris-dip', { opacity: 1 }, {
            opacity: 0,
            y: -24,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: { trigger: kok.current, start: '3% top', end: '30% top', scrub: true },
        });

        // Telefon: ad parçacığa dönüşmez; sayfayla yukarı kayarken, zemin açık renge dönmeden yumuşakça söner
        // (satırlar kendi katmanında: yalnızca saydamlık değişir).
        if (window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 700) {
            gsap.fromTo('.isim .isim-satir', { opacity: 1 }, {
                opacity: 0,
                ease: 'power1.in',
                immediateRender: false,
                scrollTrigger: { trigger: kok.current, start: '12% top', end: '50% top', scrub: true },
            });
        }

        return () => kok.current?.removeEventListener('pointermove', hareket);
    }, { scope: kok });

    return (
        <section className="giris" id="basa" ref={kok} data-renk="komur">
            <div className="giris-gorsel">
                <div className="giris-gorsel-ic">
                    <picture>
                        {/* Ekran boyu ve piksel yoğunluğuna göre uygun boy indirilir (görselin ekranda kapladığı alana göre) */}
                        <source
                            srcSet="/images/melih-portre-800.webp 800w, /images/melih-portre-1200.webp 1200w, /images/melih-portre.webp 1600w"
                            sizes="(max-width: 860px) 130vw, 58vw"
                            type="image/webp"
                        />
                        <img
                            src="/images/melih-portre.jpg"
                            alt="Melih Başdemir’in portresi: yüzünün bir yarısı devre kartı ve kod ekranlarına dönüşen dijital illüstrasyon"
                            fetchpriority="high"
                        />
                    </picture>
                </div>
            </div>

            {/* Ad ve altındaki yazılar tek bir akışta: hiçbir ekran boyunda üst üste binmez. */}
            <div className="giris-icerik">
                <h1 className="isim" aria-label="Melih Başdemir">
                    <span className="isim-satir isim-satir--ust"><span className="isim-ic">{harfler('BAŞDEMİR')}</span></span>
                    <span className="isim-satir isim-satir--alt"><span className="isim-ic">{harfler('MELİH')}</span></span>
                    <span className="isim-satir isim-satir--hayalet" aria-hidden="true"><span className="isim-ic">{hayaletHarfler('BAŞDEMİR')}</span></span>
                </h1>
                <div className="giris-alt">
                    <p className="giris-cumle">
                        Kodun iki tarafındayım: yazan da, kıran da. Tehditleri okuyor,
                        güvenli sistemler kuruyorum.
                    </p>
                    <div className="giris-baglantilar">
                        <a className="kare-link" href="#iletisim" onClick={(e) => { e.preventDefault(); git('#iletisim'); }}>
                            Bana ulaş <span aria-hidden="true" />
                        </a>
                        <a className="kare-link kare-link--ince" href="/cv/Melih_Basdemir_CV.pdf" download>
                            CV’mi indir <span aria-hidden="true" />
                        </a>
                    </div>
                </div>
            </div>

            <div className="giris-dip">
                <p>Balıkesir Üniversitesi, Bilgisayar Mühendisliği</p>
                <p className="kaydir-ipucu" aria-hidden="true">Kaydır <span className="kaydir-cizgi" /></p>
            </div>
        </section>
    );
};

export default Hero;
