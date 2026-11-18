import * as THREE from 'three';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import fontVerisi from 'three/examples/fonts/helvetiker_bold.typeface.json';

// Parçacıkların toplanacağı şekiller kodla üretilir; dışarıdan model gerekmez.

const font = new FontLoader().parse(fontVerisi);

const BEVEL = { bevelEnabled: true, bevelThickness: 0.05, bevelSize: 0.03, bevelSegments: 3, curveSegments: 10 };

function hazirla(geo) {
    let g = geo.index ? geo.toNonIndexed() : geo;
    ['uv', 'uv1', 'uv2'].forEach((a) => g.hasAttribute(a) && g.deleteAttribute(a));
    g.computeVertexNormals();
    return g;
}

// Şekli ortalar ve 3.6 x 3.0 birimlik kutuya sığdırır.
function sigdir(geo, genislik = 3.6, yukseklik = 3.0) {
    geo.computeBoundingBox();
    const b = geo.boundingBox;
    const boyut = new THREE.Vector3();
    b.getSize(boyut);
    const merkez = new THREE.Vector3();
    b.getCenter(merkez);
    geo.translate(-merkez.x, -merkez.y, -merkez.z);
    const olcek = Math.min(genislik / boyut.x, yukseklik / boyut.y);
    geo.scale(olcek, olcek, olcek);
    return geo;
}

function yazi(metin, derinlik = 0.38) {
    return new TextGeometry(metin, { font, size: 1, depth: derinlik, ...BEVEL });
}

function kalkan() {
    const s = new THREE.Shape();
    s.moveTo(0, 1.25);
    s.bezierCurveTo(0.45, 1.08, 0.82, 1.02, 1.05, 0.98);
    s.lineTo(1.05, 0.15);
    s.bezierCurveTo(1.05, -0.55, 0.55, -1.0, 0, -1.3);
    s.bezierCurveTo(-0.55, -1.0, -1.05, -0.55, -1.05, 0.15);
    s.lineTo(-1.05, 0.98);
    s.bezierCurveTo(-0.82, 1.02, -0.45, 1.08, 0, 1.25);

    // Anahtar deliği: daire ve altında bir yarık
    const daire = new THREE.Path();
    daire.absarc(0, 0.28, 0.24, 0, Math.PI * 2, true);
    const yarik = new THREE.Path();
    yarik.moveTo(-0.1, 0.0);
    yarik.lineTo(-0.17, -0.58);
    yarik.lineTo(0.17, -0.58);
    yarik.lineTo(0.1, 0.0);
    yarik.lineTo(-0.1, 0.0);
    s.holes.push(daire, yarik);

    return new THREE.ExtrudeGeometry(s, { depth: 0.42, ...BEVEL });
}

function oyunKolu() {
    const parcalar = [];
    const govde = new THREE.Shape();
    govde.moveTo(-0.8, 0.55);
    govde.lineTo(0.8, 0.55);
    govde.absarc(0.8, 0, 0.55, Math.PI / 2, -Math.PI / 2, true);
    govde.lineTo(-0.8, -0.55);
    govde.absarc(-0.8, 0, 0.55, -Math.PI / 2, Math.PI / 2, true);
    parcalar.push(new THREE.ExtrudeGeometry(govde, { depth: 0.5, ...BEVEL }));

    [-1, 1].forEach((yon) => {
        const tutma = new THREE.Shape();
        tutma.absellipse(0, 0, 0.42, 0.55, 0, Math.PI * 2, false, 0);
        const g = new THREE.ExtrudeGeometry(tutma, { depth: 0.46, ...BEVEL });
        g.rotateZ(yon * 0.45);
        g.translate(yon * 1.05, -0.55, 0.02);
        parcalar.push(g);
    });

    // Yön tuşu (artı)
    const yatay = new THREE.BoxGeometry(0.5, 0.16, 0.12);
    yatay.translate(-0.8, 0.02, 0.6);
    const dikey = new THREE.BoxGeometry(0.16, 0.5, 0.12);
    dikey.translate(-0.8, 0.02, 0.6);
    parcalar.push(yatay, dikey);

    // Dört düğme
    [[0, 0.22], [0.22, 0], [0, -0.22], [-0.22, 0]].forEach(([x, y]) => {
        const d = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 20);
        d.rotateX(Math.PI / 2);
        d.translate(0.8 + x, 0.02 + y, 0.6);
        parcalar.push(d);
    });

    return mergeGeometries(parcalar.map(hazirla));
}

// Nişangâh: iç içe iki halka, dört kılavuz çizgisi ve merkez noktası (zafiyet analizi / hedef)
function nisangah() {
    const halka = (r, kalinlik) => {
        const s = new THREE.Shape();
        s.absarc(0, 0, r, 0, Math.PI * 2, false);
        const delik = new THREE.Path();
        delik.absarc(0, 0, r - kalinlik, 0, Math.PI * 2, true);
        s.holes.push(delik);
        return new THREE.ExtrudeGeometry(s, { depth: 0.3, ...BEVEL, curveSegments: 48 });
    };
    const parcalar = [halka(1.25, 0.16), halka(0.72, 0.12)];
    [0, 1, 2, 3].forEach((k) => {
        const cubuk = new THREE.BoxGeometry(0.14, 0.62, 0.3);
        cubuk.translate(0, 1.18, 0.15);
        cubuk.rotateZ((k * Math.PI) / 2);
        parcalar.push(cubuk);
    });
    const merkez = new THREE.CylinderGeometry(0.15, 0.15, 0.32, 24);
    merkez.rotateX(Math.PI / 2);
    merkez.translate(0, 0, 0.15);
    parcalar.push(merkez);
    return mergeGeometries(parcalar.map(hazirla));
}

export const SEKIL_URETICILERI = [
    () => yazi('MB', 0.42),
    () => kalkan(),
    () => yazi('</>', 0.38),
    () => oyunKolu(),
    () => nisangah(),
];

// Şeklin yüzeyinden "adet" kadar nokta ve normal örnekler.
export function ornekle(uretici, adet) {
    const geo = sigdir(hazirla(uretici()));
    const sampler = new MeshSurfaceSampler(new THREE.Mesh(geo)).build();
    const konum = new Float32Array(adet * 3);
    const normal = new Float32Array(adet * 3);
    const p = new THREE.Vector3();
    const n = new THREE.Vector3();
    for (let i = 0; i < adet; i += 1) {
        sampler.sample(p, n);
        p.toArray(konum, i * 3);
        n.toArray(normal, i * 3);
    }
    geo.dispose();
    return { konum, normal };
}

// Açılıştaki dağınık bulut.
export function bulut(adet) {
    const konum = new Float32Array(adet * 3);
    const normal = new Float32Array(adet * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < adet; i += 1) {
        v.randomDirection().multiplyScalar(3 + Math.random() * 6);
        v.y = v.y * 0.6 + 3;
        v.toArray(konum, i * 3);
        v.randomDirection().toArray(normal, i * 3);
    }
    return { konum, normal };
}
