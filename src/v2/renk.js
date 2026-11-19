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

const kok = () => document.documentElement.style;

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

// Kökteki CSS değişkenleri değişince tarayıcı bütün sayfanın stilini yeniden hesaplar.
// Bu yüzden yalnızca gerçekten değişen değişkenler yazılır.
const yazilan = {};
// Telefonda renk geçişi kademeli yazılır (her kanal 4'lük adımlarla): göz farkı görmez ama sayfanın
// yeniden boyanma sayısı yaklaşık dörtte birine iner; kaydırma sırasında kasmayı azaltır.
const ADIM = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(max-width: 860px)').matches ? 4 : 1;
const kademele = (deger) => {
    if (ADIM === 1 || deger[0] === '#') return deger;
    const m = deger.match(/[\d.]+/g);
    if (!m || m.length < 3) return deger;
    const k = (v) => Math.min(255, Math.round(Number(v) / ADIM) * ADIM);
    return m.length > 3 && Number(m[3]) < 1
        ? `rgba(${k(m[0])}, ${k(m[1])}, ${k(m[2])}, ${Number(m[3]).toFixed(2)})`
        : `rgb(${k(m[0])}, ${k(m[1])}, ${k(m[2])})`;
};
const yaz = (s, ad, ham) => {
    const deger = ad === '--kar-goster' ? ham : kademele(ham);
    if (yazilan[ad] === deger) return;
    yazilan[ad] = deger;
    s.setProperty(ad, deger);
};

export function uygula() {
    const s = kok();
    yaz(s, '--zemin', renk.zemin);
    yaz(s, '--yazi', renk.yazi);
    yaz(s, '--soluk', renk.soluk);
    yaz(s, '--vurgu', renk.vurgu);
    yaz(s, '--sinyal', renk.sinyal);
    yaz(s, '--isik', renk.isik);
    // Karlı zemin dokusu yalnızca açık zeminde görünür: parlaklık arttıkça belirginleşir.
    const p = parlaklik(renk.zemin);
    yaz(s, '--kar-goster', Math.max(0, Math.min(1, (p - 0.3) / 0.35)).toFixed(2));
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
    uygula();

    bolumler.slice(1).forEach((el) => {
        const hedef = PALET[el.dataset.renk];
        if (!hedef || hedef === onceki) return;
        const ters = Math.abs(parlaklik(onceki.zemin) - parlaklik(hedef.zemin)) > 0.4;

        tetikler.push(gsap.fromTo(renk, sec(onceki, ZEMIN_ALANLARI), {
            ...sec(hedef, ZEMIN_ALANLARI),
            ease: 'none',
            immediateRender: false,
            onUpdate: uygula,
            scrollTrigger: { trigger: el, start: 'top 95%', end: 'top 15%', scrub: true },
        }));
        tetikler.push(gsap.fromTo(renk, sec(onceki, YAZI_ALANLARI), {
            ...sec(hedef, YAZI_ALANLARI),
            ease: 'none',
            immediateRender: false,
            onUpdate: uygula,
            scrollTrigger: ters
                ? { trigger: el, start: 'top 58%', end: 'top 46%', scrub: true }
                : { trigger: el, start: 'top 95%', end: 'top 15%', scrub: true },
        }));
        onceki = hedef;
    });

    ScrollTrigger.refresh();
    return () => tetikler.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
}
