import { gsap, ScrollTrigger } from '../lib/anim';

// Palet: kömür ve kar. Sayfa yalnızca iki kez "nefes alır": koyudan sise, sisten tekrar koyuya.
// zemin/yazi/soluk/vurgu/sinyal sayfa renkleri; pk/pa parçacıkların gölge ve ışık renkleri;
// isik: sayfanın arkasında süzülen yumuşak ışık.
export const PALET = {
    komur: { zemin: '#121316', yazi: '#ECEAE4', soluk: '#8F9095', vurgu: '#9DB4C8', sinyal: '#9DB4C8', pk: '#25272D', pa: '#ECEAE4', isik: '#2C3038' },
    sis: { zemin: '#C3C7CD', yazi: '#15161A', soluk: '#4B4F57', vurgu: '#304B66', sinyal: '#304B66', pk: '#2A2D33', pa: '#FFFFFF', isik: '#E4E7EB' },
    kar: { zemin: '#B9BEC5', yazi: '#131417', soluk: '#454951', vurgu: '#304B66', sinyal: '#304B66', pk: '#2A2D33', pa: '#FFFFFF', isik: '#D5D9DE' },
    gece: { zemin: '#0F1012', yazi: '#ECEAE4', soluk: '#8F9095', vurgu: '#9DB4C8', sinyal: '#9DB4C8', pk: '#25272D', pa: '#ECEAE4', isik: '#262A31' },
};

const ZEMIN_ALANLARI = ['zemin', 'vurgu', 'pk', 'pa', 'isik'];
const YAZI_ALANLARI = ['yazi', 'soluk', 'sinyal'];

// Anlık renkler; parçacık sahnesi her karede buradan okur.
export const renk = { ...PALET.komur };


// Göreli parlaklık; GSAP'in ara değerleri "rgba(r, g, b, a)" biçiminde gelebilir.
const parlaklik = (deger) => {
    let rr; let gg; let bb;
    if (deger[0] === '#') {
        const n = parseInt(deger.slice(1), 16);
        rr = n >> 16; gg = (n >> 8) & 255; bb = n & 255;
    } else {
        [rr, gg, bb] = (deger.match(/[\d.]+/g) || [0, 0, 0]).map(Number);
    }
    return (0.2126 * rr + 0.7152 * gg + 0.0722 * bb) / 255;
};

// Akıcılık: kökteki CSS değişkenlerini kaydırmanın her karesinde yazmak, tarayıcıyı her karede bütün
// sayfanın stilini yeniden hesaplamaya ve ekranı baştan boyamaya zorluyordu (telefonda geçiş takılıyordu).
// Şimdi:
//  - Zemin: her palet için sabit, tek renkli bir katman vardır; geçişte yalnızca katmanın saydamlığı değişir.
//    Bu işi doğrudan ekran kartı yapar, sayfa yeniden boyanmaz.
//  - Yazı ve vurgu renkleri: geçişin ortasında bir kez değişir (zemin o anda ara tondadır).
//  - Kar dokusu ve arka plan ışığı: değişken yalnızca kendi öğelerine yazılır, bütün sayfaya değil.
//  - Parçacıklar renkleri her karede JS nesnesinden (renk) okumaya devam eder.
const yazilan = {};
const yaz = (ad, deger) => {
    if (yazilan[ad] === deger) return;
    yazilan[ad] = deger;
    document.documentElement.style.setProperty(ad, deger);
};
const sayfaRenkleri = (p) => {
    yaz('--zemin', p.zemin);
    yaz('--vurgu', p.vurgu);
    yaz('--isik', p.isik);
};
const yaziRenkleri = (p) => {
    yaz('--yazi', p.yazi);
    yaz('--soluk', p.soluk);
    yaz('--sinyal', p.sinyal);
};

// Öğeye özel değişkenler (yalnızca o öğe yeniden hesaplanır)
const ogeYaz = (el, ad, deger) => {
    if (!el || el.__son?.[ad] === deger) return;
    el.__son = { ...(el.__son || {}), [ad]: deger };
    el.style.setProperty(ad, deger);
};
let karOgeleri = [];
const dokulariGuncelle = () => {
    // Karlı zemin dokusu yalnızca açık zeminde görünür: parlaklık arttıkça belirginleşir.
    const g = Math.max(0, Math.min(1, (parlaklik(renk.zemin) - 0.3) / 0.35)).toFixed(2);
    karOgeleri.forEach((el) => {
        ogeYaz(el, '--kar-goster', g);
        // Koyu bölümlerde kar katmanları tamamen kapatılır: ekran kartı onları hiç birleştirmez
        const v = g === '0.00' ? 'hidden' : 'visible';
        if (el.style.visibility !== v) el.style.visibility = v;
    });
    // (Arka plan ışığı artık zemin katmanlarının içinde; her karede boyanmıyor.)
};

// Geriye uyumluluk: tüm renkleri bir kerede uygular (açılışta)
export function uygula() {
    sayfaRenkleri(renk);
    yaziRenkleri(renk);
    dokulariGuncelle();
}

const sec = (p, alanlar) => Object.fromEntries(alanlar.map((a) => [a, p[a]]));

// [data-renk] taşıyan bölümler sırayla bir önceki paletten kendi paletlerine geçer.
// Zemin uzun bir aralıkta akar. Açıktan koyuya (ya da tersi) geçişte yazı rengi kısa bir aralıkta,
// zeminin ortadan geçtiği anda döner; böylece ara tonda yazı bulanıklaşmaz.
export function renkYolculugu() {
    const bolumler = gsap.utils.toArray('[data-renk]');
    const tetikler = [];
    let onceki = PALET[bolumler[0]?.dataset.renk] || PALET.komur;
    Object.assign(renk, onceki);

    karOgeleri = [...document.querySelectorAll('.kar-zemin, .kar-sis')];
    // Masaüstünde arka plandaki yumuşak ışık, her paletin kendi katmanına çizilir (aşağıda); ayrı ışık öğesi
    // (.atmosfer) gizlenir. Böylece renk geçişinde ekran boyu degrade her karede yeniden boyanmaz.
    const atm = document.querySelector('.atmosfer');
    const isikVar = !!atm && getComputedStyle(atm).display !== 'none';
    if (atm) atm.style.display = 'none';

    // Zemin katmanları: en altta ilk paletin rengi, üstünde her geçişin hedef rengi (saydamlığı 0..1)
    const kap = document.createElement('div');
    kap.className = 'renk-katmanlar';
    kap.setAttribute('aria-hidden', 'true');
    const katman = (p, op) => {
        const d = document.createElement('div');
        d.className = 'renk-katman';
        d.style.background = isikVar
            ? `radial-gradient(40% 34% at 22% 22%, color-mix(in srgb, ${p.isik} 70%, transparent), transparent 72%),
               radial-gradient(44% 40% at 82% 78%, color-mix(in srgb, ${p.isik} 45%, transparent), transparent 72%),
               ${p.zemin}`
            : p.zemin;
        d.style.opacity = op;
        kap.appendChild(d);
        katmanListesi.push(d);
        return d;
    };
    // Ekran kartı gereksiz çizim yapmasın: tamamen saydam katmanlar ve üstündeki tam opak bir katmanın
    // örttüğü katmanlar gizlenir (görüntü aynı kalır).
    const katmanListesi = [];
    const gorunurlukleriGuncelle = () => {
        let ortulu = false;
        for (let i = katmanListesi.length - 1; i >= 0; i -= 1) {
            const d = katmanListesi[i];
            const op = Number(d.style.opacity);
            const gizli = ortulu || op <= 0;
            const v = gizli ? 'hidden' : 'visible';
            if (d.style.visibility !== v) d.style.visibility = v;
            if (op >= 1) ortulu = true;
        }
    };
    katman(onceki, '1');
    document.body.prepend(kap);
    gorunurlukleriGuncelle();
    uygula();

    bolumler.slice(1).forEach((el) => {
        const hedef = PALET[el.dataset.renk];
        if (!hedef || hedef === onceki) return;
        const kaynak = onceki;
        const ters = Math.abs(parlaklik(kaynak.zemin) - parlaklik(hedef.zemin)) > 0.4;
        const k = katman(hedef, '0');
        let sonOp = '';

        // Açıktan koyuya geçiş daha uzun bir aralığa yayılır: koyulaşma göze daha sert gelir.
        const koyulasma = parlaklik(hedef.zemin) < parlaklik(kaynak.zemin) - 0.4;
        tetikler.push(gsap.fromTo(renk, sec(kaynak, ZEMIN_ALANLARI), {
            ...sec(hedef, ZEMIN_ALANLARI),
            // Yumuşak giriş-çıkış eğrisi: renk birden kararmaz/açılmaz, başta ve sonda yavaşlar
            ease: 'sine.inOut',
            immediateRender: false,
            onUpdate() {
                const op = this.ratio.toFixed(3);
                if (op !== sonOp) { k.style.opacity = op; sonOp = op; gorunurlukleriGuncelle(); }
                sayfaRenkleri(this.ratio >= 0.5 ? hedef : kaynak);
                dokulariGuncelle();
            },
            // scrub: 0.6 -> renk kaydırmayı yarım saniyelik bir gecikmeyle, pürüzsüzce izler
            // (telefonda dokunmatik kaydırmanın kesik kesik gelen adımları yumuşar)
            scrollTrigger: koyulasma
                ? { trigger: el, start: 'top bottom', end: 'top 5%', scrub: 0.6 }
                : { trigger: el, start: 'top 95%', end: 'top 15%', scrub: 0.6 },
        }));
        tetikler.push(gsap.fromTo(renk, sec(kaynak, YAZI_ALANLARI), {
            ...sec(hedef, YAZI_ALANLARI),
            ease: 'none',
            immediateRender: false,
            onUpdate() { yaziRenkleri(this.progress() >= 0.5 ? hedef : kaynak); },
            // Yazı rengi, zemin ara tondayken döner (zemin de 0,6 sn gecikmeyle geldiği için aynı gecikme)
            scrollTrigger: ters
                ? { trigger: el, start: koyulasma ? 'top 56%' : 'top 58%', end: koyulasma ? 'top 46%' : 'top 46%', scrub: 0.6 }
                : { trigger: el, start: 'top 95%', end: 'top 15%', scrub: true },
        }));
        onceki = hedef;
    });
    gorunurlukleriGuncelle(); // başlangıçta saydam katmanlar gizli

    ScrollTrigger.refresh();
    return () => {
        tetikler.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
        kap.remove();
        if (atm) atm.style.display = '';
    };
}
