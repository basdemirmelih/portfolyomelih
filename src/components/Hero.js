import React from 'react';
import CustomTypedText from './CustomTypedText'; // Veya TypedText.js (hangisini kullanıyorsan)
// DİKKAT: Resim yolu! Eğer Hero.js dosyanız src/components/ içindeyse
// ve resim src/images1/ içindeyse, yol '../images1/1.jpeg' olmalı.
// Eğer Hero.js doğrudan src/ içindeyse, yol './images1/1.jpeg' olur.
// Klasör yapınıza göre bu yolu doğru ayarlamanız ÇOK ÖNEMLİ.
// Varsayılan olarak src/components/Hero.js ve src/images1/1.jpeg kabul ediyorum:
import HeroBackgroundImage from '../images1/RSS.jpg';
import '../styles/Hero.css'; // Hero bölümüne özel stiller

const Hero = () => {
    const typedStrings = [
        'Bilgisayar Mühendisliği Öğrencisi',
        'Web Geliştirici',
        'Sürekli Öğrenci',
        'Teknoloji Tutkunu',
    ];

    // Arka plan stilini JavaScript objesi olarak tanımla
    const heroStyle = {
        backgroundImage: `linear-gradient(rgba(24, 24, 24, 0.75), rgba(24, 24, 24, 0.90)), url(${HeroBackgroundImage})`,
        // Diğer background özellikleri (no-repeat, center center, cover) Hero.css'ten gelebilir
        // veya buraya da eklenebilir. CSS'te bırakmak genellikle daha temizdir.
    };

    return (
        // 'ana-sayfa' section'ına inline style ile arka planı veriyoruz
        <section id="ana-sayfa" className="bolum" style={heroStyle}>
            <div className="container">
                <div className="hero-icerik">
                    <h1>Melih <span>Başdemir</span></h1>
                    <p className="hero-altbaslik">
                        Ben bir <CustomTypedText strings={typedStrings} />
                    </p>
                    <a href="#portfolyo" className="btn">Çalışmalarıma Göz Atın</a>
                    <a href="#hakkimda" className="btn btn-ghost" style={{ marginLeft: '15px' }}>Daha Fazla Bilgi</a>
                </div>
            </div>
        </section>
    );
};

export default Hero;