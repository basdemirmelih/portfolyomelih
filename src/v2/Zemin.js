import React, { useEffect, useRef } from 'react';

// Hangi kar dokusu kullanılsın: 'kar' (önceki doku + Igloo'daki gibi büyük kar tepeleri),
// 'igloo' (üç katmanlı deneme) ya da
// 'eski' (bir önceki tek katmanlı rölyef). Geri dönmek için yalnızca bunu değiştirmek yeterli.
export const DOKU = 'kar';

// Arka plan katmanları (hepsi sabit ve içeriğin altında):
// kar-zemin: açık bölümlerde kar dokusu, kar-sis: üstte uzak sis.

// Igloo'daki gibi büyük, yumuşak kar tepeleri. SVG filtresi 8 bitlik gürültüyü kabarttığında
// kontur çizgileri (basamaklanma) bırakıyor; bu yüzden yükseklik tam hassasiyetle JS'te hesaplanır,
// sol üstten gelen ışıkla gölgelenir ve döşenebilir bir doku görseline çevrilir (tek sefer, ~50 ms).
function tepeDokusu(boyut = 640) {
    const c = document.createElement('canvas');
    c.width = boyut;
    c.height = boyut;
    const ctx = c.getContext && c.getContext('2d');
    if (!ctx) return null;

    // Döşenebilir değer gürültüsü: ızgara kenarları sarılır, yumuşak (smootherstep) aradeğer.
    let tohum = 1337;
    const rastgele = () => { tohum = (tohum * 16807) % 2147483647; return tohum / 2147483647; };
    const katman = (p) => {
        const izgara = Array.from({ length: p * p }, rastgele);
        return (x, y) => {
            const gx = (x / boyut) * p;
            const gy = (y / boyut) * p;
            const x0 = Math.floor(gx);
            const y0 = Math.floor(gy);
            const tx = gx - x0;
            const ty = gy - y0;
            const sx = tx * tx * tx * (tx * (tx * 6 - 15) + 10);
            const sy = ty * ty * ty * (ty * (ty * 6 - 15) + 10);
            const d = (i, j) => izgara[((j % p) + p) % p * p + (((i % p) + p) % p)];
            const a = d(x0, y0) + (d(x0 + 1, y0) - d(x0, y0)) * sx;
            const b = d(x0, y0 + 1) + (d(x0 + 1, y0 + 1) - d(x0, y0 + 1)) * sx;
            return a + (b - a) * sy;
        };
    };
    // Yatayda biraz daha geniş tepeler: rüzgârın uzattığı kar yığınları
    const k1 = katman(3);
    const k2 = katman(6);
    const k3 = katman(12);
    const yukseklik = (x, y) => k1(x, y * 1.0) * 0.62 + k2(x, y) * 0.28 + k3(x, y) * 0.1;

    const veri = ctx.createImageData(boyut, boyut);
    const isik = [-0.55, -0.62, 0.56]; // sol üstten, alçak açıyla
    const kabartma = 46;
    for (let y = 0; y < boyut; y += 1) {
        for (let x = 0; x < boyut; x += 1) {
            const dx = (yukseklik(x + 1, y) - yukseklik(x - 1, y)) * kabartma;
            const dy = (yukseklik(x, y + 1) - yukseklik(x, y - 1)) * kabartma;
            const u = Math.hypot(dx, dy, 1);
            const golge = Math.max(0, (-dx * isik[0] - dy * isik[1] + isik[2]) / u);
            // Aydınlık sırtlar neredeyse beyaz, vadiler yumuşak soğuk gri
            const v = Math.min(1, 0.7 + golge * 0.42);
            const i = (y * boyut + x) * 4;
            // Saydam koyu katman: zemini (1 - v) oranında karartır; çarpma karışımıyla aynı sonuç.
            veri.data[i] = 13;
            veri.data[i + 1] = 20;
            veri.data[i + 2] = 32;
            veri.data[i + 3] = (1 - v) * 255;
        }
    }
    ctx.putImageData(veri, 0, 0);
    return c;
}

// Beğenilen önceki kar rölyefi ve ince tane: SVG filtreleri bir kez çizilir, parlaklığı
// saydamlığa çevrilir. Böylece kaydırırken ne filtre ne de karışım modu hesaplanır.
const ROLYEF = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='1200'><filter id='z' x='0' y='0' width='100%25' height='100%25'><feTurbulence type='fractalNoise' baseFrequency='.0065 .009' numOctaves='6' seed='11' stitchTiles='stitch' result='n'/><feDiffuseLighting in='n' lighting-color='%23ffffff' surfaceScale='4.2' diffuseConstant='1.05' result='l'><feDistantLight azimuth='225' elevation='42'/></feDiffuseLighting><feColorMatrix in='l' type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23z)'/></svg>";
const TANE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='i'><feTurbulence type='fractalNoise' baseFrequency='.08' numOctaves='3' seed='4' stitchTiles='stitch' result='n'/><feDiffuseLighting in='n' lighting-color='%23ffffff' surfaceScale='1.6'><feDistantLight azimuth='225' elevation='50'/></feDiffuseLighting><feColorMatrix type='saturate' values='0'/></filter><rect width='100%25' height='100%25' filter='url(%23i)'/></svg>";

async function svgSaydam(url, boyut) {
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = boyut;
    c.height = boyut;
    const ctx = c.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, boyut, boyut);
    const veri = ctx.getImageData(0, 0, boyut, boyut);
    const d = veri.data;
    for (let k = 0; k < d.length; k += 4) {
        const v = d[k] / 255;
        d[k] = 13; d[k + 1] = 20; d[k + 2] = 32;
        d[k + 3] = (1 - v) * 255;
    }
    ctx.putImageData(veri, 0, 0);
    return c;
}

// Tuvali blob adresine çevir (base64'ten hızlı, bellekte tek kopya)
const adres = (c) => new Promise((coz) => c.toBlob((b) => coz(b ? URL.createObjectURL(b) : null), 'image/png'));

const Zemin = () => {
    const zemin = useRef(null);

    useEffect(() => {
        if (DOKU !== 'kar') return undefined;
        let iptal = false;
        const adresler = [];
        const bosta = window.requestIdleCallback || ((f) => setTimeout(f, 60));
        const koy = (ad, url) => {
            if (!url || iptal || !zemin.current) return;
            adresler.push(url);
            zemin.current.style.setProperty(ad, `url(${url})`);
        };
        bosta(async () => {
            if (iptal) return;
            try {
                const tepe = tepeDokusu();
                if (tepe) koy('--kar-tepe', await adres(tepe));
                koy('--kar-rolyef', await adres(await svgSaydam(ROLYEF, 1200)));
                koy('--kar-tane', await adres(await svgSaydam(TANE, 360)));
            } catch (e) {
                // Doku üretilemezse zemin sade kalır; sayfa çalışmaya devam eder.
            }
        });
        return () => { iptal = true; adresler.forEach((u) => URL.revokeObjectURL(u)); };
    }, []);

    return (
        <>
            <div className="kar-zemin" ref={zemin} data-doku={DOKU} aria-hidden="true" />
            <div className="kar-sis" aria-hidden="true" />
        </>
    );
};

export default Zemin;
