import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { SEKIL_URETICILERI, ornekle, bulut } from './sekiller';

const VERTEX = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec3 aNFrom;
attribute vec3 aNTo;
attribute float aRand;
uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uMaxSize;
uniform float uFogNear;
uniform float uFogFar;
varying float vLight;
varying float vFog;
varying float vAccent;

float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }

void main() {
    // Her parçacık biraz gecikmeli yola çıkar; böylece şekil dalga halinde dağılıp toplanır.
    float gecikme = aRand * 0.45;
    float p = clamp((uProgress - gecikme) / 0.55, 0.0, 1.0);
    float e = ease(p);
    float ucus = sin(3.14159 * p);

    vec3 pos = mix(aFrom, aTo, e);
    vec3 n = normalize(mix(aNFrom, aNTo, e) + 0.0001);

    // Girdap: uçuştaki parçacıklar dikey eksen etrafında döner, yükselir ve açılır.
    pos.xz = rot(ucus * (2.2 + aRand * 4.0)) * pos.xz;
    pos.xz *= 1.0 + ucus * (0.5 + aRand * 0.9);
    pos.y += ucus * (0.4 + aRand * 1.6);

    // Duran şekilde hafif kıpırtı
    pos += n * 0.018 * sin(uTime * 1.7 + aRand * 60.0);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float boy = 0.65 + fract(aRand * 7.31) * 0.7;
    gl_PointSize = min(uSize * boy / -mv.z, uMaxSize);

    vec3 nv = normalize(normalMatrix * n);
    float isik = clamp(dot(nv, normalize(vec3(-0.35, 0.55, 0.75))), 0.0, 1.0);
    vLight = 0.3 + isik * 0.75 + ucus * 0.5;
    vFog = smoothstep(uFogNear, uFogFar, -mv.z);
    vAccent = step(0.996, aRand);
}
`;

const FRAGMENT = /* glsl */ `
uniform vec3 uKoyu;
uniform vec3 uAcik;
uniform vec3 uVurgu;
uniform vec3 uZemin;
varying float vLight;
varying float vFog;
varying float vAccent;

void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    vec3 renk = mix(uKoyu, uAcik, clamp(vLight, 0.0, 1.0));
    renk = mix(renk, uVurgu, vAccent * 0.9);
    renk = mix(renk, uZemin, vFog);
    gl_FragColor = vec4(renk, 1.0);
}
`;

const TOZ_VERTEX = /* glsl */ `
attribute float aHiz;
uniform float uTime;
uniform float uSize;
varying float vAlpha;
void main() {
    vec3 p = position;
    p.y = mod(p.y + uTime * aHiz + 4.0, 9.0) - 4.0;
    p.x += sin(uTime * 0.2 + aHiz * 40.0) * 0.15;
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize / -mv.z;
    vAlpha = 0.35 * smoothstep(16.0, 6.0, -mv.z);
}
`;

const TOZ_FRAGMENT = /* glsl */ `
varying float vAlpha;
void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(0.93, 0.91, 0.89, vAlpha * (1.0 - d * 2.0));
}
`;

const ParticleScene = forwardRef(({ hareketAzalt, onHazir }, ref) => {
    const kapRef = useRef(null);
    const api = useRef(null);

    useImperativeHandle(ref, () => ({
        goster: (i) => (api.current ? api.current.goster(i) : Promise.resolve()),
    }));

    useEffect(() => {
        const kap = kapRef.current;
        const mobil = window.matchMedia('(max-width: 760px)').matches;
        const ADET = mobil ? 12000 : 32000;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ antialias: false, alpha: true, powerPreference: 'high-performance' });
        } catch (e) {
            return undefined; // WebGL yoksa sahne hiç kurulmaz; sayfa yine çalışır.
        }
        const dpr = Math.min(window.devicePixelRatio || 1, mobil ? 1.5 : 2);
        renderer.setPixelRatio(dpr);
        kap.appendChild(renderer.domElement);

        const sahne = new THREE.Scene();
        const kamera = new THREE.PerspectiveCamera(35, 1, 0.1, 60);
        const grup = new THREE.Group();
        sahne.add(grup);

        // Şekillerin noktaları gerektiğinde hesaplanır; ilk şekilden sonra kalanlar boşta hazırlanır.
        const sekiller = [];
        const sekil = (i) => {
            if (!sekiller[i]) sekiller[i] = ornekle(SEKIL_URETICILERI[i], ADET);
            return sekiller[i];
        };
        const bostaCalis = window.requestIdleCallback || ((f) => setTimeout(f, 200));
        let iptal = false;
        const onHazirla = (i) => {
            if (iptal || i >= SEKIL_URETICILERI.length) return;
            bostaCalis(() => { if (!iptal) { sekil(i); onHazirla(i + 1); } });
        };
        const baslangic = bulut(ADET);

        const geo = new THREE.BufferGeometry();
        const from = new THREE.BufferAttribute(new Float32Array(baslangic.konum), 3);
        const to = new THREE.BufferAttribute(new Float32Array(baslangic.konum), 3);
        const nFrom = new THREE.BufferAttribute(new Float32Array(baslangic.normal), 3);
        const nTo = new THREE.BufferAttribute(new Float32Array(baslangic.normal), 3);
        const rand = new Float32Array(ADET);
        for (let i = 0; i < ADET; i += 1) rand[i] = Math.random();
        geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ADET * 3), 3));
        geo.setAttribute('aFrom', from);
        geo.setAttribute('aTo', to);
        geo.setAttribute('aNFrom', nFrom);
        geo.setAttribute('aNTo', nTo);
        geo.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));
        geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 20);

        const malzeme = new THREE.ShaderMaterial({
            vertexShader: VERTEX,
            fragmentShader: FRAGMENT,
            uniforms: {
                uProgress: { value: 1 },
                uTime: { value: 0 },
                uSize: { value: 30 },
                uMaxSize: { value: 8 * dpr },
                uFogNear: { value: 8 },
                uFogFar: { value: 17 },
                uKoyu: { value: new THREE.Color('#353C48') },
                uAcik: { value: new THREE.Color('#EDE9E3') },
                uVurgu: { value: new THREE.Color('#FF5A1F') },
                uZemin: { value: new THREE.Color('#12161D') },
            },
        });
        const noktalar = new THREE.Points(geo, malzeme);
        grup.add(noktalar);

        // Platform: şeklin altında ince halkalar
        const halka = (r, opaklik) => {
            const m = new THREE.Mesh(
                new THREE.RingGeometry(r, r + 0.012, 160),
                new THREE.MeshBasicMaterial({ color: '#EDE9E3', transparent: true, opacity: opaklik, side: THREE.DoubleSide, depthWrite: false })
            );
            m.rotation.x = -Math.PI / 2;
            m.position.y = -1.95;
            sahne.add(m);
            return m;
        };
        const halkalar = [halka(2.0, 0.32), halka(2.7, 0.12), halka(3.6, 0.06)];

        // Havada süzülen toz
        const TOZ = mobil ? 220 : 500;
        const tozKonum = new Float32Array(TOZ * 3);
        const tozHiz = new Float32Array(TOZ);
        for (let i = 0; i < TOZ; i += 1) {
            tozKonum[i * 3] = (Math.random() - 0.5) * 18;
            tozKonum[i * 3 + 1] = Math.random() * 9 - 4;
            tozKonum[i * 3 + 2] = Math.random() * -10 + 3;
            tozHiz[i] = 0.03 + Math.random() * 0.08;
        }
        const tozGeo = new THREE.BufferGeometry();
        tozGeo.setAttribute('position', new THREE.BufferAttribute(tozKonum, 3));
        tozGeo.setAttribute('aHiz', new THREE.BufferAttribute(tozHiz, 1));
        const tozMalzeme = new THREE.ShaderMaterial({
            vertexShader: TOZ_VERTEX,
            fragmentShader: TOZ_FRAGMENT,
            transparent: true,
            depthWrite: false,
            uniforms: { uTime: { value: 0 }, uSize: { value: 30 } },
        });
        sahne.add(new THREE.Points(tozGeo, tozMalzeme));

        // Boyut: telefonda şekil sığsın diye kamera geri çekilir.
        const boyutla = () => {
            const w = kap.clientWidth;
            const h = kap.clientHeight;
            renderer.setSize(w, h, false);
            kamera.aspect = w / h;
            const yarimTan = Math.tan(THREE.MathUtils.degToRad(kamera.fov / 2));
            const dar = kamera.aspect < 0.9;
            const z = Math.max(9.5, 2.15 / (yarimTan * kamera.aspect));
            kamera.position.set(0, dar ? 0.4 : 0.7, z);
            // Dar ekranda şekil ekranın üst yarısına çıkar, yazılarla çakışmaz.
            kamera.lookAt(0, dar ? -1.4 : -0.15, 0);
            kamera.updateProjectionMatrix();
            malzeme.uniforms.uFogNear.value = z - 1.5;
            malzeme.uniforms.uFogFar.value = z + 8;
            // Nokta boyutu: dünya ölçüsünde ~0.032 birim (dar ekranda biraz daha iri)
            const pikselBirim = (h * dpr) / (2 * yarimTan);
            malzeme.uniforms.uSize.value = (dar ? 0.042 : 0.032) * pikselBirim;
            tozMalzeme.uniforms.uSize.value = 0.022 * pikselBirim;
        };
        boyutla();
        window.addEventListener('resize', boyutla);

        const fare = { x: 0, y: 0, hx: 0, hy: 0 };
        const fareHareket = (e) => {
            fare.x = (e.clientX / window.innerWidth) * 2 - 1;
            fare.y = (e.clientY / window.innerHeight) * 2 - 1;
        };
        window.addEventListener('pointermove', fareHareket, { passive: true });

        let aktif = -1;
        let gecis = null;

        // i numaralı şekle geçiş: mevcut hedef başlangıç olur, yeni şekil hedef olur.
        const goster = (i) => new Promise((coz) => {
            if (i === aktif) { coz(); return; }
            if (gecis) gecis.progress(1);
            from.array.set(to.array);
            nFrom.array.set(nTo.array);
            const hedef = sekil(i);
            to.array.set(hedef.konum);
            nTo.array.set(hedef.normal);
            onHazirla(1);
            [from, to, nFrom, nTo].forEach((a) => { a.needsUpdate = true; });
            aktif = i;
            malzeme.uniforms.uProgress.value = 0;
            if (hareketAzalt) {
                malzeme.uniforms.uProgress.value = 1;
                coz();
                return;
            }
            gecis = gsap.to(malzeme.uniforms.uProgress, {
                value: 1,
                duration: 2.6,
                ease: 'none',
                onComplete: () => { gecis = null; coz(); },
            });
        });
        api.current = { goster };

        let gorunur = true;
        const gozlemci = new IntersectionObserver(([g]) => { gorunur = g.isIntersecting; });
        gozlemci.observe(kap);

        const saat = new THREE.Clock();
        let raf = 0;
        const ciz = () => {
            raf = requestAnimationFrame(ciz);
            if (!gorunur) return;
            const t = saat.getElapsedTime();
            malzeme.uniforms.uTime.value = t;
            tozMalzeme.uniforms.uTime.value = t;
            fare.hx += (fare.x - fare.hx) * 0.05;
            fare.hy += (fare.y - fare.hy) * 0.05;
            if (!hareketAzalt) {
                grup.rotation.y = Math.sin(t * 0.3) * 0.38 + fare.hx * 0.3;
                grup.rotation.x = fare.hy * 0.08;
                halkalar.forEach((h, k) => { h.rotation.z = t * (0.05 + k * 0.03); });
            }
            renderer.render(sahne, kamera);
        };
        if (hareketAzalt) {
            goster(0).then(() => renderer.render(sahne, kamera));
            renderer.render(sahne, kamera);
        } else {
            ciz();
        }
        onHazir && onHazir();

        return () => {
            iptal = true;
            cancelAnimationFrame(raf);
            if (gecis) gecis.kill();
            gozlemci.disconnect();
            window.removeEventListener('resize', boyutla);
            window.removeEventListener('pointermove', fareHareket);
            geo.dispose();
            malzeme.dispose();
            tozGeo.dispose();
            tozMalzeme.dispose();
            halkalar.forEach((h) => { h.geometry.dispose(); h.material.dispose(); });
            renderer.dispose();
            renderer.domElement.remove();
            api.current = null;
        };
    }, [hareketAzalt, onHazir]);

    return <div className="parcacik-sahne" ref={kapRef} aria-hidden="true" />;
});

export default ParticleScene;
