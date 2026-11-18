import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Lenis örneği App içinde kurulur; menü ve "başa dön" buradan erişir.
export const kaydirici = { lenis: null };

export const hareketAzalt = () =>
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function git(hedef) {
    const el = typeof hedef === 'string' ? document.querySelector(hedef) : hedef;
    if (kaydirici.lenis) kaydirici.lenis.scrollTo(el ?? 0, { duration: 1.4 });
    else if (el) el.scrollIntoView({ behavior: hareketAzalt() ? 'auto' : 'smooth' });
    else window.scrollTo(0, 0);
}

export { gsap, ScrollTrigger, useGSAP };
