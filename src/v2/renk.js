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
let atmosfer = null;
const dokulariGuncelle = () => {
    // Karlı zemin dokusu yalnızca açık zeminde görünür: parlaklık arttıkça belirginleşir.
    const g = Math.max(0, Math.min(1, (parlaklik(renk.zemin) - 0.3) / 0.35)).toFixed(2);
    karOgeleri.forEach((el) => ogeYaz(el, '--kar-goster', g));
    if (atmosfer) ogeYaz(atmosfer, '--isik', renk.isik);
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
    const atm = document.querySelector('.atmosfer');
    atmosfer = atm && getComputedStyle(atm).display !== 'none' ? atm : null;

    // Zemin katmanları: en altta ilk paletin rengi, üstünde her geçişin hedef rengi (saydamlığı 0..1)
    const kap = document.createElement('div');
    kap.className = 'renk-katmanlar';
    kap.setAttribute('aria-hidden', 'true');
    const katman = (r, op) => {
        const d = document.createElement('div');
        d.className = 'renk-katman';
        d.style.background = r;
        d.style.opacity = op;
        kap.appendChild(d);
        return d;
    };
    katman(onceki.zemin, '1');
    document.body.prepend(kap);
    uygula();

    bolumler.slice(1).forEach((el) => {
        const hedef = PALET[el.dataset.renk];
        if (!hedef || hedef === onceki) return;
        const kaynak = onceki;
        const ters = Math.abs(parlaklik(kaynak.zemin) - parlaklik(hedef.zemin)) > 0.4;
        const k = katman(hedef.zemin, '0');
        let sonOp = '';

        tetikler.push(gsap.fromTo(renk, sec(kaynak, ZEMIN_ALANLARI), {
            ...sec(hedef, ZEMIN_ALANLARI),
            ease: 'none',
            immediateRender: false,
            onUpdate() {
                const p = this.progress();
                const op = p.toFixed(3);
                if (op !== sonOp) { k.style.opacity = op; sonOp = op; }
                sayfaRenkleri(p >= 0.5 ? hedef : kaynak);
                dokulariGuncelle();
            },
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 15%', scrub: true },
        }));
        tetikler.push(gsap.fromTo(renk, sec(kaynak, YAZI_ALANLARI), {
            ...sec(hedef, YAZI_ALANLARI),
            ease: 'none',
            immediateRender: false,
            onUpdate() { yaziRenkleri(this.progress() >= 0.5 ? hedef : kaynak); },
            scrollTrigger: ters
                ? { trigger: el, start: 'top 58%', end: 'top 46%', scrub: true }
                : { trigger: el, start: 'top 95%', end: 'top 15%', scrub: true },
        }));
        onceki = hedef;
    });

    ScrollTrigger.refresh();
    return () => {
        tetikler.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
        kap.remove();
    };
}
