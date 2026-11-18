import { gsap, ScrollTrigger } from '../lib/anim';

// Her bölümün kendi paleti var; kaydırdıkça bir sonrakine akıcı geçilir.
// zemin/yazi/soluk/vurgu sayfa renkleri, pk/pa parçacıkların gölge ve ışık renkleri,
// isik: sayfanın arkasında süzülen yumuşak ışığın rengi.
// Tek bir soğuk aile: gece laciverti → sis grisi → açık buz → mavi gri → tekrar gece.
// Beyaz yok: açık bölümler bile çelik grisi. Sayfa aşağı indikçe adım adım koyulaşır,
// sonunda girişteki geceye geri döner. sinyal: siber detaylar (terminal, kod etiketi) için camgöbeği;
// açık zeminde okunabilsin diye koyusu kullanılır.
export const PALET = {
    gece: { zemin: '#050B17', yazi: '#E9EDF5', soluk: '#8A95AB', vurgu: '#5B8DEF', sinyal: '#22D3EE', pk: '#1B2740', pa: '#E9EDF5', isik: '#1D3F86' },
    sis: { zemin: '#BCC5D0', yazi: '#0D131F', soluk: '#465163', vurgu: '#1F5FD6', sinyal: '#0B6E82', pk: '#222934', pa: '#FFFFFF', isik: '#E6ECF4' },
    buz: { zemin: '#AEB8C6', yazi: '#0B111C', soluk: '#3F4A5B', vurgu: '#1A56C4', sinyal: '#085E70', pk: '#222934', pa: '#FFFFFF', isik: '#D3DDEB' },
    arduvaz: { zemin: '#98A5B7', yazi: '#0A101B', soluk: '#323D4D', vurgu: '#174DB0', sinyal: '#06505F', pk: '#222934', pa: '#FFFFFF', isik: '#7E95BD' },
    kozmos: { zemin: '#0B1628', yazi: '#E9EDF5', soluk: '#8C98AE', vurgu: '#7FA8F5', sinyal: '#22D3EE', pk: '#1B2740', pa: '#E9EDF5', isik: '#1F4C9A' },
    derin: { zemin: '#08111F', yazi: '#E9EDF5', soluk: '#8C98AE', vurgu: '#7FA8F5', sinyal: '#22D3EE', pk: '#1B2740', pa: '#E9EDF5', isik: '#24509F' },
};

const ZEMIN_ALANLARI = ['zemin', 'vurgu', 'pk', 'pa', 'isik'];
const YAZI_ALANLARI = ['yazi', 'soluk', 'sinyal'];

// Anlık renkler; parçacık sahnesi her karede buradan okur.
export const renk = { ...PALET.gece };

const kok = () => document.documentElement.style;

export function uygula() {
    const s = kok();
    s.setProperty('--zemin', renk.zemin);
    s.setProperty('--yazi', renk.yazi);
    s.setProperty('--soluk', renk.soluk);
    s.setProperty('--vurgu', renk.vurgu);
    s.setProperty('--isik', renk.isik);
    s.setProperty('--sinyal', renk.sinyal);
}

const parlaklik = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return (0.2126 * (n >> 16) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
};
const sec = (p, alanlar) => Object.fromEntries(alanlar.map((a) => [a, p[a]]));

// [data-renk] taşıyan bölümler sırayla bir önceki paletten kendi paletlerine geçer.
// Zemin uzun ve yumuşak bir aralıkta akar. Açıktan koyuya (ya da tersi) geçişte yazı rengi ise
// kısa bir aralıkta, zeminin ortadan geçtiği anda döner; böylece ara tonda yazı bulanıklaşmaz.
export function renkYolculugu() {
    const bolumler = gsap.utils.toArray('[data-renk]');
    const tetikler = [];
    let onceki = PALET[bolumler[0]?.dataset.renk] || PALET.gece;
    Object.assign(renk, onceki);
    uygula();

    bolumler.slice(1).forEach((el) => {
        const hedef = PALET[el.dataset.renk];
        if (!hedef) return;
        const ters = Math.abs(parlaklik(onceki.zemin) - parlaklik(hedef.zemin)) > 0.4;

        tetikler.push(gsap.fromTo(renk, sec(onceki, ZEMIN_ALANLARI), {
            ...sec(hedef, ZEMIN_ALANLARI),
            ease: 'none',
            immediateRender: false,
            onUpdate: uygula,
            scrollTrigger: { trigger: el, start: 'top 90%', end: 'top 10%', scrub: true },
        }));
        tetikler.push(gsap.fromTo(renk, sec(onceki, YAZI_ALANLARI), {
            ...sec(hedef, YAZI_ALANLARI),
            ease: 'none',
            immediateRender: false,
            onUpdate: uygula,
            scrollTrigger: ters
                ? { trigger: el, start: 'top 56%', end: 'top 44%', scrub: true }
                : { trigger: el, start: 'top 90%', end: 'top 10%', scrub: true },
        }));
        onceki = hedef;
    });

    ScrollTrigger.refresh();
    return () => tetikler.forEach((t) => { t.scrollTrigger?.kill(); t.kill(); });
}
