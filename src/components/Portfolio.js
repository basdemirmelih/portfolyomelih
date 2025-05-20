import React from 'react';
import '../styles/Portfolio.css'; // Portfolio bölümüne özel stiller

// Portfolyo öğeleri için veri.
const portfolioData = [
    {
        id: 4, // Mini Soru Bankası projesi
        imgSrc: 'src/images1/sorubankasi.png', // GÜNCELLENMİŞ RESİM YOLU
        imgAlt: 'Mini Soru Bankası Uygulaması Ekran Görüntüsü',
        title: 'Mini Soru Bankası',
        description: 'Python ile geliştirilmiş bir komut satırı tabanlı mini soru bankası uygulaması.',
        detailsLink: 'https://github.com/basdemirmelih/SoruBankasi/blob/master/SoruBankas%C4%B1MelihB.py',
    },
    {
        id: 1,
        imgSrc: 'https://via.placeholder.com/600x400/FF4A1C/FFFFFF?text=Proje+X', // Bu resmi de istersen değiştirebilirsin
        imgAlt: 'Proje X Açıklaması',
        title: 'Kurumsal Web Sitesi Yenileme',
        description: 'Modern ve kullanıcı dostu bir arayüzle [Şirket Adı] için geliştirildi.',
        detailsLink: '#', // Bu linki de güncellemelisin
    },
    {
        id: 2,
        imgSrc: 'https://via.placeholder.com/600x400/1A1A1A/FFD6C4?text=Proje+Y', // Bu resmi de istersen değiştirebilirsin
        imgAlt: 'Proje Y Açıklaması',
        title: 'E-Ticaret Platformu',
        description: 'Kapsamlı ürün yönetimi ve güvenli ödeme altyapısı.',
        detailsLink: '#', // Bu linki de güncellemelisin
    },
    {
        id: 3,
        imgSrc: 'https://via.placeholder.com/600x400/FFD6C4/1A1A1A?text=Proje+Z', // Bu resmi de istersen değiştirebilirsin
        imgAlt: 'Proje Z Açıklaması',
        title: 'Mobil Uygulama Tasarımı',
        description: 'Sağlık ve fitness takibi için yenilikçi bir mobil uygulama konsepti.',
        detailsLink: '#', // Bu linki de güncellemelisin
    },
];

const Portfolio = () => {
    return (
        <section id="portfolyo" className="bolum">
            <div className="container">
                <h2 className="bolum-baslik">Portfolyo</h2>
                <div className="portfolyo-galeri">
                    {portfolioData.map((proje) => (
                        <div className="proje-kart" key={proje.id}>
                            <img src={proje.imgSrc} alt={proje.imgAlt} />
                            <div className="proje-overlay">
                                <h3>{proje.title}</h3>
                                <p>{proje.description}</p>
                                <a href={proje.detailsLink} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
                                    Detaylar
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Portfolio;