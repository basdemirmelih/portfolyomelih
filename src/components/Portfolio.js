import React from 'react';
import '../styles/Portfolio.css'; // Portfolio bölümüne özel stiller

// Portfolyo öğeleri için veri. Gerçek projelerinizle güncelleyin.
const portfolioData = [
    {
        id: 1,
        imgSrc: 'https://via.placeholder.com/600x400/FF4A1C/FFFFFF?text=Proje+X', // Kendi resim yolunuzu ekleyin
        imgAlt: 'Proje X Açıklaması',
        title: 'Kurumsal Web Sitesi Yenileme',
        description: 'Modern ve kullanıcı dostu bir arayüzle [Şirket Adı] için geliştirildi.',
        detailsLink: '#', // Gerçek proje linkinizi ekleyin
    },
    {
        id: 2,
        imgSrc: 'https://via.placeholder.com/600x400/1A1A1A/FFD6C4?text=Proje+Y',
        imgAlt: 'Proje Y Açıklaması',
        title: 'E-Ticaret Platformu',
        description: 'Kapsamlı ürün yönetimi ve güvenli ödeme altyapısı.',
        detailsLink: '#',
    },
    {
        id: 3,
        imgSrc: 'https://via.placeholder.com/600x400/FFD6C4/1A1A1A?text=Proje+Z',
        imgAlt: 'Proje Z Açıklaması',
        title: 'Mobil Uygulama Tasarımı',
        description: 'Sağlık ve fitness takibi için yenilikçi bir mobil uygulama konsepti.',
        detailsLink: '#',
    },
    // Buraya daha fazla proje ekleyebilirsiniz
    // {
    //   id: 4,
    //   imgSrc: 'path/to/your/image4.jpg',
    //   imgAlt: 'Proje 4 Açıklaması',
    //   title: 'Yeni Bir Proje',
    //   description: 'Bu projenin kısa bir açıklaması.',
    //   detailsLink: '#',
    // },
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