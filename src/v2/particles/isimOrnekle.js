// Giriş ekranındaki adın harflerini aynı yazı tipiyle (geniş, kalın Archivo) bir tuvale çizer,
// dolu piksellerden "adet" kadar nokta seçip kamera düzlemindeki dünya koordinatına çevirir.
// Konumlar sayfa en üstteyken (scrollY = 0) ekranda göründükleri yere göredir.
export function isimOrnekle(adet, gorunur) {
    const harfler = [...document.querySelectorAll('.isim .harf')];
    if (!harfler.length) return null;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const olcek = 0.5;
    const sy = window.scrollY;
    // Tuval yalnızca adın kapladığı şerit kadar: bütün ekranı çizip taramak telefonda yavaştı.
    const kutular = harfler.map((h) => h.getBoundingClientRect());
    const pay = 40;
    const x0 = Math.max(0, Math.min(...kutular.map((k) => k.left)) - pay);
    const y0 = Math.min(...kutular.map((k) => k.top)) + sy - pay;
    const x1 = Math.min(W, Math.max(...kutular.map((k) => k.right)) + pay);
    const y1 = Math.max(...kutular.map((k) => k.bottom)) + sy + pay;
    const tuval = document.createElement('canvas');
    tuval.width = Math.max(1, Math.ceil((x1 - x0) * olcek));
    tuval.height = Math.max(1, Math.ceil((y1 - y0) * olcek));
    const ctx = tuval.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.scale(olcek, olcek);
    ctx.translate(-x0, -y0);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    if ('fontStretch' in ctx) ctx.fontStretch = 'expanded';

    harfler.forEach((h, hi) => {
        const r = kutular[hi];
        const stil = getComputedStyle(h);
        const boyut = parseFloat(stil.fontSize);
        // Kutunun üst dolgusu (İ noktası için) hesaba katılmaz: yalnızca harfin kendi alanı
        const ust = parseFloat(stil.paddingTop) || 0;
        const kutuUst = r.top + ust;
        const kutuYuk = r.height - ust;
        ctx.font = `800 ${boyut}px "Archivo"`;
        const olcum = ctx.measureText(h.textContent);
        const cx = r.left + r.width / 2;
        // Harf kutusunun ortasını yazının görsel ortasına hizala
        const yukseklik = olcum.actualBoundingBoxAscent + olcum.actualBoundingBoxDescent;
        const taban = kutuUst + sy + kutuYuk / 2 + yukseklik / 2 - olcum.actualBoundingBoxDescent;
        ctx.save();
        ctx.translate(cx, taban);
        if (olcum.width > 0) ctx.scale((r.width * 0.97) / olcum.width, 1);
        ctx.fillText(h.textContent, 0, 0);
        // İ: sayfadaki noktanın aynısı (v2.css .harf--i): gövde genişliğinde (.202em), .075em kalınlığında,
        // büyük harfin (.70em) .065em üstünde. Çizim harfin ortasına göre yapıldığı için gövde merkezine kaydırılır.
        if (h.classList.contains('harf--i')) {
            const merkez = (-olcum.actualBoundingBoxLeft + olcum.actualBoundingBoxRight) / 2;
            ctx.fillRect(merkez - 0.101 * boyut, -(0.70 + 0.065 + 0.075) * boyut, 0.202 * boyut, 0.075 * boyut);
        }
        ctx.restore();
    });

    const veri = ctx.getImageData(0, 0, tuval.width, tuval.height).data;
    const dolu = [];
    const tw = tuval.width;
    for (let i = 3, n = veri.length; i < n; i += 4) {
        if (veri[i] > 140) { const p = (i - 3) >> 2; dolu.push(p % tw, (p / tw) | 0); }
    }
    if (!dolu.length) return null;

    const konum = new Float32Array(adet * 3);
    const normal = new Float32Array(adet * 3);
    const toplam = dolu.length / 2;
    for (let i = 0; i < adet; i += 1) {
        const k = ((Math.random() * toplam) | 0) * 2;
        const ex = (dolu[k] + Math.random()) / olcek + x0;
        const ey = (dolu[k + 1] + Math.random()) / olcek + y0;
        konum[i * 3] = (ex / W - 0.5) * gorunur.w;
        konum[i * 3 + 1] = -(ey / H - 0.5) * gorunur.h;
        konum[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
        normal[i * 3 + 2] = 1;
    }
    return { konum, normal };
}
