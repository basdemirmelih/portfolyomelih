export const VERTEX = /* glsl */ `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute vec3 aNFrom;
attribute vec3 aNTo;
attribute float aRand;

uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uMaxSize;
uniform vec3 uFromOff;
uniform vec3 uToOff;
uniform float uFromRot;
uniform float uToRot;
uniform float uDonus;
uniform vec2 uMouse;
uniform float uPush;
uniform float uRadius;
uniform float uFogNear;
uniform float uFogFar;

varying float vLight;
varying float vFog;
varying float vAccent;

float ease(float t) { return t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0; }
mat2 rot(float a) { float c = cos(a), s = sin(a); return mat2(c, -s, s, c); }
vec3 donY(vec3 v, float a) { v.xz = rot(a) * v.xz; return v; }

void main() {
    // Parçacıklar biraz gecikmeli yola çıkar: şekil dalga halinde dağılıp toplanır.
    float p = clamp((uProgress - aRand * 0.35) / 0.65, 0.0, 1.0);
    float e = ease(p);
    float ucus = sin(3.14159 * p);

    vec3 a = donY(aFrom, uDonus * uFromRot) + uFromOff;
    vec3 b = donY(aTo, uDonus * uToRot) + uToOff;
    vec3 na = donY(aNFrom, uDonus * uFromRot);
    vec3 nb = donY(aNTo, uDonus * uToRot);

    vec3 pos = mix(a, b, e);
    vec3 n = normalize(mix(na, nb, e) + 0.0001);

    // Girdap: uçuştaki parçacıklar şeklin merkezi etrafında döner ve açılır.
    vec3 merkez = mix(uFromOff, uToOff, e);
    vec3 r = pos - merkez;
    r.xz = rot(ucus * (1.8 + aRand * 3.2)) * r.xz;
    r *= 1.0 + ucus * (0.3 + aRand * 0.7);
    pos = merkez + r;
    pos.y += ucus * (aRand - 0.3) * 1.4;

    // Duran şekilde hafif kıpırtı
    pos += n * 0.016 * sin(uTime * 1.6 + aRand * 60.0);

    // Fare: imlecin çevresindeki parçacıklar dışarı savrulur.
    vec2 d = pos.xy - uMouse;
    float uzak = length(d);
    float f = smoothstep(uRadius, 0.0, uzak) * uPush;
    pos.xy += normalize(d + 0.0001) * f * (0.45 + aRand * 1.1);
    pos.z += f * (aRand - 0.5) * 2.2;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    float boy = 0.65 + fract(aRand * 7.31) * 0.7;
    gl_PointSize = min(uSize * boy / -mv.z, uMaxSize);

    vec3 nv = normalize(normalMatrix * n);
    float isik = clamp(dot(nv, normalize(vec3(-0.35, 0.55, 0.75))), 0.0, 1.0);
    vLight = 0.28 + isik * 0.78 + ucus * 0.45 + f * 0.5;
    vFog = smoothstep(uFogNear, uFogFar, -mv.z);
    vAccent = step(0.993, aRand);
}
`;

export const FRAGMENT = /* glsl */ `
uniform vec3 uKoyu;
uniform vec3 uAcik;
uniform vec3 uVurgu;
uniform vec3 uZemin;
uniform float uOpaklik;
varying float vLight;
varying float vFog;
varying float vAccent;

void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (length(c) > 0.5) discard;
    vec3 renk = mix(uKoyu, uAcik, clamp(vLight, 0.0, 1.0));
    renk = mix(renk, uVurgu, vAccent * 0.85);
    renk = mix(renk, uZemin, vFog);
    gl_FragColor = vec4(renk, uOpaklik);
}
`;
