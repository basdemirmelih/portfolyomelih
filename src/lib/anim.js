import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);
// Telefonda adres çubuğu açılıp kapanınca ekran yüksekliği değişir. Bunu yeniden boyutlanma sayıp
// her şeyi yeniden hesaplamak sabitlenen bölümü zıplatıyordu; yalnızca gerçek boyut değişimleri sayılır.
ScrollTrigger.config({ ignoreMobileResize: true });

// Lenis örneği App içinde kurulur; menü ve "başa dön" buradan erişir.
export const kaydirici = { lenis: null };

export const hareketAzalt = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function git(hedef) {
    const el = typeof hedef === 'string' ? document.querySelector(hedef) : hedef;
    if (kaydirici.lenis) { kaydirici.lenis.scrollTo(el ?? 0, { duration: 1.4 }); return; }
    // Dokunmatikte (Lenis yok, kaydırma normalizeScroll ile JavaScript tarafında) tarayıcının yumuşak
    // kaydırması çalışmaz; aynı süre ve eğriyle GSAP ile kaydırılır.
    const hedefY = el ? el.getBoundingClientRect().top + window.scrollY : 0;
    if (hareketAzalt()) { window.scrollTo(0, hedefY); return; }
    const konum = { y: window.scrollY };
    gsap.to(konum, {
        y: hedefY,
        duration: 1.4,
        ease: 'power3.inOut',
        overwrite: true,
        onUpdate: () => window.scrollTo(0, konum.y),
    });
}

export { gsap, ScrollTrigger, useGSAP };
