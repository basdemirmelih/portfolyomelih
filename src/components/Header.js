import React, { useState, useEffect, useRef } from 'react';
import '../styles/Header.css'; // Header'a özel stiller için

const Header = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuAktif, setMenuAktif] = useState(false);
    const [aktifLink, setAktifLink] = useState('ana-sayfa'); // Başlangıçta ana sayfa aktif
    const headerRef = useRef(null);

    const navLinksData = [
        { href: '#ana-sayfa', text: 'Anasayfa', id: 'ana-sayfa' },
        { href: '#hakkimda', text: 'Ben Kimim?', id: 'hakkimda' },
        { href: '#neler-yapabilirim', text: 'Neler Yapabilirim?', id: 'neler-yapabilirim' },
        { href: '#portfolyo', text: 'Portfolyo', id: 'portfolyo' },
        { href: '#iletisim', text: 'İletişim', id: 'iletisim' },
    ];

    useEffect(() => {
        const handleScroll = () => {
            // Header scroll efekti
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }

            // Navigasyon linklerini aktif yapma
            let currentSectionId = '';
            const headerCurrentHeight = headerRef.current ? headerRef.current.offsetHeight : 80; // Güvenli bir varsayılan
            const sectionActivationOffset = headerCurrentHeight + 50;
            const sections = document.querySelectorAll('.bolum'); // Genel bir seçici, App.js'deki bölümlere erişir

            // En alttaki bölümün kontrolü (sayfa sonuna gelindiğinde)
            const scrollPosition = window.scrollY + window.innerHeight;
            const totalHeight = document.body.offsetHeight;

            if (scrollPosition >= totalHeight - 50 && sections.length > 0) {
                const lastSection = sections[sections.length-1];
                if (lastSection && lastSection.id) { // Son bölüm ve ID'si varsa
                    currentSectionId = lastSection.id;
                }
            } else {
                // Diğer bölümlerin kontrolü
                let foundSection = false;
                for (let i = sections.length - 1; i >= 0; i--) {
                    const section = sections[i];
                    if (section && section.id) { // Bölüm ve ID'si varsa
                        const sectionTop = section.offsetTop - sectionActivationOffset;
                        if (window.scrollY >= sectionTop) {
                            currentSectionId = section.id;
                            foundSection = true;
                            break;
                        }
                    }
                }
                // Eğer hiçbir bölüm aktif değilse (örneğin en tepede) ve ana-sayfa bölümü varsa
                if (!foundSection) {
                    const anaSayfaSection = document.getElementById('ana-sayfa');
                    if (anaSayfaSection) {
                        const anaSayfaBottom = anaSayfaSection.offsetTop + anaSayfaSection.offsetHeight - sectionActivationOffset;
                        if (window.scrollY < anaSayfaBottom) {
                            currentSectionId = 'ana-sayfa';
                        }
                    } else { // Eğer ana-sayfa bölümü yoksa veya bulunamadıysa, ilk linki aktif yap
                        currentSectionId = navLinksData.length > 0 ? navLinksData[0].id : '';
                    }
                }
            }
            setAktifLink(currentSectionId);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Sayfa yüklendiğinde de çalıştır

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [navLinksData]); // navLinksData değişirse (genelde değişmez ama bağımlılık olarak eklenebilir)

    const handleHamburgerClick = () => {
        setMenuAktif(prevMenuAktif => {
            const yeniMenuAktif = !prevMenuAktif;
            document.body.style.overflow = yeniMenuAktif ? "hidden" : "";
            return yeniMenuAktif;
        });
    };

    const handleNavLinkClick = (e, targetId) => {
        // e.preventDefault(); // Eğer sadece scroll yapılacaksa ve sayfa yenilenmeyecekse
        // const targetElement = document.getElementById(targetId.substring(1));
        // if (targetElement) {
        //   targetElement.scrollIntoView({ behavior: 'smooth' });
        // }

        if (menuAktif) {
            setMenuAktif(false);
            document.body.style.overflow = "";
        }
        // Aktif linki hemen güncellemek yerine scroll event'ine bırakmak daha doğal olabilir
        // setAktifLink(targetId.substring(1));
    };

    return (
        <header id="header" ref={headerRef} className={scrolled ? 'scrolled' : ''}>
            <div className="container">
                <nav>
                    <a href="#ana-sayfa" className="logo" onClick={(e) => handleNavLinkClick(e, '#ana-sayfa')}>
                        Melih<span>Başdemir</span>
                    </a>
                    <ul className={`nav-menu ${menuAktif ? 'aktif' : ''}`}>
                        {navLinksData.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    className={`nav-link ${aktifLink === link.id ? 'aktif' : ''}`}
                                    onClick={(e) => handleNavLinkClick(e, link.href)}
                                >
                                    {link.text}
                                </a>
                            </li>
                        ))}
                    </ul>
                    <div
                        className={`hamburger ${menuAktif ? 'aktif' : ''}`}
                        onClick={handleHamburgerClick}
                        onKeyDown={(e) => e.key === 'Enter' && handleHamburgerClick()}
                        role="button"
                        tabIndex={0}
                        aria-expanded={menuAktif}
                        aria-label="Menüyü aç/kapat"
                    >
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default Header;