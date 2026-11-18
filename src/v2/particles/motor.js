import * as THREE from 'three';
import { VERTEX, FRAGMENT } from './shaders';
import { isimOrnekle } from './isimOrnekle';
import { SEKIL_URETICILERI, ornekle } from '../../three/sekiller';

const egri = (t) => t * t * (3 - 2 * t);
const sinirla = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

// Sahne sırası: kalkan (tehdit istihbaratı) → nişangâh (zafiyet analizi) → </> (yazılım) → oyun kolu
export const SEKILLER = [SEKIL_URETICILERI[1], SEKIL_URETICILERI[4], SEKIL_URETICILERI[2], SEKIL_URETICILERI[3]];
const SON = SEKILLER.length - 1;

// Sabit sahnedeki ilerleme (0..1) şekil çiftine ve geçiş oranına çevrilir.
// Her aralığın başında şekil bir süre durur, sonra bir sonrakine akar.
export function sahneDurumu(q) {
    const j = Math.min(SON - 1, Math.floor(q * SON));
    const u = q * SON - j;
    return { a: j, b: j + 1, ilerleme: sinirla((u - 0.3) / 0.5) };
}

function renkOku(hedef, deger) {
    // GSAP renkleri "rgba(r, g, b, a)" ya da "#rrggbb" olarak verir.
    if (deger[0] === '#') { hedef.set(deger); return; }
    const s = deger.match(/[\d.]+/g);
    if (s) hedef.setRGB(s[0] / 255, s[1] / 255, s[2] / 255, THREE.SRGBColorSpace);
}


// Parçacık motoru: sabit tam ekran tuval. Hangi şekilden hangisine, ne kadar geçildiğini
// her karede kaydırma konumundan hesaplar; böylece geri kaydırınca da doğru çalışır.
export function motorKur(kap, { renk, kaydirma, mobil, hareketAzalt }) {
    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
    } catch (e) {
        return null;
    }
    const ADET = mobil ? 12000 : 30000;
    // Nokta bulutunda 1.5 üstü çözünürlük gözle fark edilmez ama GPU yükünü ikiye katlar.
    const dpr = Math.min(window.devicePixelRatio || 1, mobil ? 1.25 : 1.5);
    renderer.setPixelRatio(dpr);
    kap.appendChild(renderer.domElement);

    const sahne = new THREE.Scene();
    const kamera = new THREE.PerspectiveCamera(35, 1, 0.1, 80);
    const gorunur = { w: 1, h: 1 };

    // Şekil noktaları: ilk şekil hemen, diğerleri tarayıcı boştayken hazırlanır.
    const onbellek = {};
    const sekil = (anahtar) => {
        if (onbellek[anahtar]) return onbellek[anahtar];
        if (anahtar === 'isim') return null;
        onbellek[anahtar] = ornekle(SEKILLER[anahtar], ADET);
        return onbellek[anahtar];
    };
    sekil(0);
    const bosta = window.requestIdleCallback || ((f) => setTimeout(f, 300));
    let iptal = false;
    // Kalan şekiller sırayla, tarayıcı boştayken hazırlanır.
    const sonrakiniHazirla = (i) => {
        if (i > SON) return;
        bosta(() => {
            if (iptal) return;
            sekil(i);
            sonrakiniHazirla(i + 1);
        });
    };
    sonrakiniHazirla(1);

    const geo = new THREE.BufferGeometry();
    const ilk = sekil(0);
    const yap = (dizi) => new THREE.BufferAttribute(new Float32Array(dizi), 3);
    const from = yap(ilk.konum);
    const to = yap(ilk.konum);
    const nFrom = yap(ilk.normal);
    const nTo = yap(ilk.normal);
    const rand = new Float32Array(ADET);
    for (let i = 0; i < ADET; i += 1) rand[i] = Math.random();
    geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ADET * 3), 3));
    geo.setAttribute('aFrom', from);
    geo.setAttribute('aTo', to);
    geo.setAttribute('aNFrom', nFrom);
    geo.setAttribute('aNTo', nTo);
    geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 50);

    const u = {
        uProgress: { value: 0 },
        uTime: { value: 0 },
        uSize: { value: 30 },
        uMaxSize: { value: 9 * dpr },
        uFromOff: { value: new THREE.Vector3() },
        uToOff: { value: new THREE.Vector3() },
        uFromRot: { value: 1 },
        uToRot: { value: 1 },
        uDonus: { value: 0 },
        uMouse: { value: new THREE.Vector2(999, 999) },
        uPush: { value: 0 },
        uRadius: { value: 1.1 },
        uFogNear: { value: 9 },
        uFogFar: { value: 20 },
        uKoyu: { value: new THREE.Color() },
        uAcik: { value: new THREE.Color() },
        uVurgu: { value: new THREE.Color() },
        uZemin: { value: new THREE.Color() },
        uOpaklik: { value: 1 },
    };
    const malzeme = new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms: u,
    });
    sahne.add(new THREE.Points(geo, malzeme));

    let W = 1;
    let H = 1;
    let sekilKaydir = new THREE.Vector3();
    let kaymaPx = 0; // telefonda görüntü kamerayla yukarı kaydırılır (şekil eğilmeden)
    let dar = false;
    let isimGecersiz = true;

    const boyutla = () => {
        W = kap.clientWidth;
        H = kap.clientHeight;
        renderer.setSize(W, H, false);
        kamera.aspect = W / H;
        const yarimTan = Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2));
        // Dar ve dikey ekran: şekil üstte. Yatay telefon masaüstü gibi davranır (yazı solda, şekil sağda).
        dar = W < 900 && H > W * 0.75;
        // Telefonda şekiller biraz daha uzakta: ekranın kenarlarına taşmaz.
        const z = Math.max(10, (dar ? 2.7 : 2.6) / (yarimTan * kamera.aspect));
        kamera.position.set(0, 0, z);
        kamera.lookAt(0, 0, 0);
        // Telefonda şekil üst yarıda durur. Şekli yukarı taşımak onu alttan görünür ve eğik yapıyordu;
        // bunun yerine kameranın görüntüsü kaydırılır, şekil tam karşıdan görünür.
        kaymaPx = dar ? H * 0.25 : 0;
        if (kaymaPx) kamera.setViewOffset(W, H, 0, kaymaPx, W, H); else kamera.clearViewOffset();
        kamera.updateProjectionMatrix();
        gorunur.h = 2 * z * yarimTan;
        gorunur.w = gorunur.h * kamera.aspect;
        // Masaüstünde şekil sağa yaslanır (solda yazılar var), telefonda üst yarıya çıkar.
        sekilKaydir = dar ? new THREE.Vector3(0, 0, 0) : new THREE.Vector3(gorunur.w * (kamera.aspect > 1.9 ? 0.24 : 0.16), -0.1, 0); // çok geniş ekranda (yatay telefon) daha sağa
        u.uFogNear.value = z - 1.6;
        u.uFogFar.value = z + 9;
        const pikselBirim = (H * dpr) / (2 * yarimTan);
        u.uSize.value = (dar ? 0.04 : 0.031) * pikselBirim;
        u.uRadius.value = dar ? 0.9 : 1.15;
        isimGecersiz = true;
    };
    boyutla();
    window.addEventListener('resize', boyutla);

    // Fare dünya koordinatına çevrilir; sayfadan çıkınca etki söner.
    const fare = { x: 999, y: 999, icinde: 0 };
    const fareHareket = (e) => {
        fare.x = (e.clientX / W - 0.5) * gorunur.w;
        fare.y = -((e.clientY + kaymaPx) / H - 0.5) * gorunur.h;
        fare.icinde = 1;
    };
    const fareCik = () => { fare.icinde = 0; };
    window.addEventListener('pointermove', fareHareket, { passive: true });
    document.documentElement.addEventListener('pointerleave', fareCik);
    window.addEventListener('blur', fareCik);

    // Hangi çift yüklü? Değişince diziler kopyalanır.
    let ciftAnahtar = '';
    const ciftYukle = (a, b) => {
        const anahtar = `${a}>${b}`;
        if (anahtar === ciftAnahtar) return true;
        const sa = a === 'isim' ? onbellek.isim : sekil(a);
        const sb = sekil(b);
        if (!sa || !sb) return false;
        from.array.set(sa.konum); nFrom.array.set(sa.normal);
        to.array.set(sb.konum); nTo.array.set(sb.normal);
        [from, to, nFrom, nTo].forEach((x) => { x.needsUpdate = true; });
        ciftAnahtar = anahtar;
        return true;
    };

    const saat = new THREE.Clock();
    let raf = 0;
    let gorunurlukSon = -1;

    const kare = () => {
        raf = requestAnimationFrame(kare);
        const k = kaydirma();
        const t = saat.getElapsedTime();
        const wpp = gorunur.h / H; // bir pikselin dünya birimi

        // Renkler sayfanın renk yolculuğunu izler
        renkOku(u.uKoyu.value, renk.pk);
        renkOku(u.uAcik.value, renk.pa);
        renkOku(u.uVurgu.value, renk.vurgu);
        renkOku(u.uZemin.value, renk.zemin);

        let opaklik = 1;
        let ilerleme = 0;
        u.uFromOff.value.copy(sekilKaydir);
        u.uToOff.value.copy(sekilKaydir);
        u.uFromRot.value = 1;
        u.uToRot.value = 1;
        let isimOpaklik = 1;

        if (k.sahne <= 0) {
            // A) Giriş: isim dağılıp kalkana akar. İsim sayfayla birlikte yukarı kayar.
            if (k.giris > 0.005 && (isimGecersiz || !onbellek.isim)) {
                const o = isimOrnekle(ADET, gorunur);
                if (o) { onbellek.isim = o; isimGecersiz = false; ciftAnahtar = ''; }
            }
            const hazir = onbellek.isim && ciftYukle('isim', 0);
            if (!hazir) {
                opaklik = 0;
            } else {
                // Ad ekrandaki yerinde kalsın: telefondaki görüntü kaydırması geri alınır.
                u.uFromOff.value.set(0, (k.scrollY - kaymaPx) * wpp, 0);
                u.uFromRot.value = 0;
                ilerleme = egri(sinirla((k.giris - 0.06) / 0.86));
                opaklik = sinirla((k.giris - 0.004) / 0.03);
                isimOpaklik = 1 - sinirla((k.giris - 0.01) / 0.06);
            }
        } else if (k.sahne < 1) {
            // B) Sabit sahne: şekiller sırayla birbirine dönüşür
            const dz = sahneDurumu(k.sahne);
            ciftYukle(dz.a, dz.b);
            ilerleme = dz.ilerleme;
            isimOpaklik = 0;
        } else {
            // C) Sahne bitti: şekil sayfayla yukarı kayar ve söner.
            ciftYukle(SON - 1, SON);
            ilerleme = 1;
            const fazla = k.sonrasi;
            u.uToOff.value.y += fazla * wpp;
            opaklik = 1 - sinirla(fazla / (H * 0.55));
            isimOpaklik = 0;
        }

        u.uProgress.value = ilerleme;
        u.uOpaklik.value = 1;
        u.uTime.value = t;
        // Telefonda salınım daha az: dar ekranda büyük açılar şekli yamultuyordu.
        u.uDonus.value = hareketAzalt ? 0 : Math.sin(t * 0.32) * (dar ? 0.2 : 0.42);
        const hedefItme = hareketAzalt ? 0 : fare.icinde;
        u.uPush.value += (hedefItme - u.uPush.value) * 0.08;
        u.uMouse.value.set(fare.x, fare.y);

        k.isimOpaklik(isimOpaklik);
        if (opaklik !== gorunurlukSon) {
            kap.style.opacity = String(opaklik);
            gorunurlukSon = opaklik;
        }
        if (opaklik > 0.001) renderer.render(sahne, kamera);
    };
    kare();

    return {
        isimiYenile: () => { isimGecersiz = true; },
        yokEt: () => {
            iptal = true;
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', boyutla);
            window.removeEventListener('pointermove', fareHareket);
            document.documentElement.removeEventListener('pointerleave', fareCik);
            window.removeEventListener('blur', fareCik);
            geo.dispose();
            malzeme.dispose();
            renderer.dispose();
            renderer.domElement.remove();
        },
    };
}
