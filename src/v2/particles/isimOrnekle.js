// Giriş ekranındaki adın harflerini aynı yazı tipiyle (geniş, kalın Archivo) bir tuvale çizer,
// dolu piksellerden "adet" kadar nokta seçip kamera düzlemindeki dünya koordinatına çevirir.
// Konumlar sayfa en üstteyken (scrollY = 0) ekranda göründükleri yere göredir.
export function isimOrnekle(adet, gorunur) {
    const harfler = [...document.querySelectorAll('.isim .harf')];
    if (!harfler.length) return null;

    const W = window.innerWidth;
    const H = window.innerHeight;
    const olcek = 0.5;
    const tuval = document.createElement('canvas');
    tuval.width = Math.ceil(W * olcek);
    tuval.height = Math.ceil(H * 1.2 * olcek);
    const ctx = tuval.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    ctx.scale(olcek, olcek);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    if ('fontStretch' in ctx) ctx.fontStretch = 'expanded';

    const sy = window.scrollY;
    harfler.forEach((h) => {
        const r = h.getBoundingClientRect();
        const boyut = parseFloat(getComputedStyle(h).fontSize);
        ctx.font = `800 ${boyut}px "Archivo"`;
        const olcum = ctx.measureText(h.textContent);
        const cx = r.left + r.width / 2;
        // Harf kutusunun ortasını yazının görsel ortasına hizala
        const yukseklik = olcum.actualBoundingBoxAscent + olcum.actualBoundingBoxDescent;
        const taban = r.top + sy + r.height / 2 + yukseklik / 2 - olcum.actualBoundingBoxDescent;
        ctx.save();
        ctx.translate(cx, taban);
        if (olcum.width > 0) ctx.scale((r.width * 0.97) / olcum.width, 1);
        ctx.fillText(h.textContent, 0, 0);
        ctx.restore();
    });

    const veri = ctx.getImageData(0, 0, tuval.width, tuval.height).data;
    const dolu = [];
    for (let y = 0; y < tuval.height; y += 1) {
        for (let x = 0; x < tuval.width; x += 1) {
            if (veri[(y * tuval.width + x) * 4 + 3] > 140) dolu.push(x, y);
        }
    }
    if (!dolu.length) return null;

    const konum = new Float32Array(adet * 3);
    const normal = new Float32Array(adet * 3);
    const toplam = dolu.length / 2;
    for (let i = 0; i < adet; i += 1) {
        const k = ((Math.random() * toplam) | 0) * 2;
        const ex = (dolu[k] + Math.random()) / olcek;
        const ey = (dolu[k + 1] + Math.random()) / olcek;
        konum[i * 3] = (ex / W - 0.5) * gorunur.w;
        konum[i * 3 + 1] = -(ey / H - 0.5) * gorunur.h;
        konum[i * 3 + 2] = (Math.random() - 0.5) * 0.12;
        normal[i * 3 + 2] = 1;
    }
    return { konum, normal };
}
