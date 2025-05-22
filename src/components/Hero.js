import React from 'react';
import CustomTypedText from './CustomTypedText';
// Resim yolunun projenizdeki konumuna göre doğru olduğundan emin olun.
import HeroBackgroundImage from '../images1/RSS.jpg'; //
import '../styles/Hero.css'; // Hero bölümüne özel stiller

const Hero = () => {
    const typedStrings = [
        'Bilgisayar Mühendisi Adayı',
        'Web Geliştirici',
        'Sürekli Öğrenci',
        'Teknoloji Tutkunu',
    ]; //

    const heroStyle = {
        backgroundImage: `linear-gradient(rgba(24, 24, 24, 0.75), rgba(24, 24, 24, 0.90)), url(${HeroBackgroundImage})`,
    }; //

    return (
        <section id="ana-sayfa" className="bolum" style={heroStyle}>
            <div className="container">
                <div className="hero-icerik">
                    <h1>Melih <span>Başdemir</span></h1>
                    <p className="hero-altbaslik">
                        Ben bir <CustomTypedText strings={typedStrings} />
                    </p>
                    <div className="hero-buttons-wrapper">
                        {/* İlk buton orijinal rengine döndürüldü (sadece 'btn' sınıfı) */}
                        <a href="#portfolyo" className="btn">Çalışmalarıma Göz Atın</a>
                        {/* İkinci buton ghost stilinde kalıyor */}
                        <a href="#hakkimda" className="btn btn-ghost">Daha Fazla Bilgi</a>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;