import React, { useEffect, useRef } from 'react';
import { hareketAzalt, ScrollTrigger } from '../lib/anim';

// Mees Verberne tarzı mozaik zemin: bölüm boşluksuz karelere bölünür, her kare kendi rastgele
// evresiyle sürekli soluyup parlar (sinüs). Katman çok düşük opaklıkta ve "difference" karışımıyla
// zemine biner (v2.css .izgara); kumlu, titreşen bir piksel dokusu verir. Farenin altındaki kare koyulaşır.
//
// Hızlı olsun diye her kare tuvalde tek bir pikseldir; tuval CSS ile büyütülür (image-rendering: pixelated).
// Bölüm ekranda değilken çizim durur.
const Izgara = () => {
    const tuvalRef = useRef(null);

    useEffect(() => {
        const tuval = tuvalRef.current;
        const kap = tuval?.parentElement;
        if (!tuval || !kap) return undefined;
        const ctx = tuval.getContext('2d');
        if (!ctx || typeof ctx.putImageData !== 'function') return undefined;

        const azalt = hareketAzalt();
        const ince = window.matchMedia('(pointer: fine)').matches;
        let sutun = 0; let satir = 0; let evre = null; let resim = null;
        const fare = { s: -1, r: -1 };

        // Mees: masaüstünde 45 sütun ve ekran yüksekliğinde 20 satır; telefonda 15 sütun, 40 satır.
        const boyutla = () => {
            const r = kap.getBoundingClientRect();
            const dar = window.innerWidth <= 580;
            sutun = dar ? 15 : 45;
            const satirYuk = window.innerHeight / (dar ? 40 : 20);
            // Satırlar sayfaya göre hizalanır: art arda iki bölümde mozaik ek yeri olmadan devam eder
            const kayma = (r.top + window.scrollY) % satirYuk;
            satir = Math.max(1, Math.ceil((r.height + kayma) / satirYuk));
            tuval.width = sutun; tuval.height = satir;
            tuval.style.height = `${satir * satirYuk}px`;
            tuval.style.top = `${-kayma}px`;
            evre = new Float32Array(sutun * satir);
            for (let i = 0; i < evre.length; i++) evre[i] = Math.random() * Math.PI * 2;
            resim = ctx.createImageData(sutun, satir);
        };

        // Koyu zemin için Mees'in fare efekti tersine çevrildi: farenin altındaki kare koyulaşmak yerine
        // aydınlanır ve geride kısa, sönen bir iz bırakır. Kareler tuvalin yarı gücüyle çizilir (v2.css'teki
        // opaklık iki katı); böylece sıradan kareler Mees'teki kadar soluk kalırken farenin karesi iki kat parlar.
        const iz = new Map(); // hücre -> parlaklık (0..1), her karede söner
        const ciz = (t) => {
            const d = resim.data;
            if (fare.s >= 0 && fare.r >= 0) iz.set(fare.r * sutun + fare.s, 1);
            for (let r = 0; r < satir; r++) {
                for (let s = 0; s < sutun; s++) {
                    const i = r * sutun + s; const p = i * 4;
                    // Mees ile aynı eğri: 0.5 * (1.1 + sin(...))
                    const a = Math.min(1, 0.5 * (1.1 + Math.sin(t + evre[i]))) * 0.5;
                    const f = iz.get(i) || 0;
                    d[p] = 230; d[p + 1] = 230; d[p + 2] = 230; d[p + 3] = Math.max(a, f) * 255;
                }
            }
            // iz ~0,5 sn'de söner
            iz.forEach((v, k) => { const y = v - 0.045; if (y <= 0.5 * 0.55) iz.delete(k); else iz.set(k, y); });
            ctx.putImageData(resim, 0, 0);
        };

        // Telefonda saniyede ~15 kare yeter; sayfa kaydırılırken hiç çizilmez (kaydırma akıcı kalsın)
        const aralik = window.matchMedia('(max-width: 860px)').matches ? 66 : 33;
        let sonKaydirma = 0;
        const kaydirildi = () => { sonKaydirma = performance.now(); };
        window.addEventListener('scroll', kaydirildi, { passive: true });
        let raf = 0; let son = 0; const bas = performance.now();
        const dongu = (simdi) => {
            raf = requestAnimationFrame(dongu);
            if (simdi - son < aralik || simdi - sonKaydirma < 140) return;
            son = simdi;
            // Mees 4.8 rad/sn (1,3 sn'lik döngü); koyu zeminde daha sakin dursun diye yarı hızda (~2,6 sn)
            ciz(((simdi - bas) / 1000) * 2.4);
        };

        const fareHareket = (e) => {
            const r = tuval.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
            fare.s = x >= 0 && x < 1 ? Math.floor(x * sutun) : -1;
            fare.r = y >= 0 && y < 1 ? Math.floor(y * satir) : -1;
        };
        const fareCik = () => { fare.s = -1; fare.r = -1; };

        boyutla();
        ciz(0);

        const gozlemci = new IntersectionObserver(([g]) => {
            cancelAnimationFrame(raf);
            if (g.isIntersecting && !azalt) raf = requestAnimationFrame(dongu);
        }, { rootMargin: '100px 0px' });
        gozlemci.observe(kap);

        const yeniden = () => { boyutla(); ciz(0); };
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(yeniden) : null;
        if (ro) ro.observe(kap); else window.addEventListener('resize', yeniden);
        // Üstteki sabitlenen bölüm yerleşince bölümün sayfadaki yeri değişir: satır hizası yeniden hesaplanır
        ScrollTrigger.addEventListener('refresh', yeniden);
        if (ince && !azalt) {
            kap.addEventListener('pointermove', fareHareket, { passive: true });
            kap.addEventListener('pointerleave', fareCik);
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('scroll', kaydirildi);
            gozlemci.disconnect();
            if (ro) ro.disconnect(); else window.removeEventListener('resize', yeniden);
            ScrollTrigger.removeEventListener('refresh', yeniden);
            kap.removeEventListener('pointermove', fareHareket);
            kap.removeEventListener('pointerleave', fareCik);
        };
    }, []);

    return <canvas className="izgara" ref={tuvalRef} aria-hidden="true" />;
};

export default Izgara;
