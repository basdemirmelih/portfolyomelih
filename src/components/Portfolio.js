import React from 'react';
// Önceki resim importları
import soruBankasiResmi from '../resim/bankasisoru.png';
import notDefteriResmi from '../resim/not_defteri.png';
import havaDurumuResmi from '../resim/hava_durumu.png';
// YENİ: Portfolyo Web Sitesi resmi için import satırı
import webSiteResmi from '../resim/web_site.png'; // .jpg uzantısına dikkat edin

import '../styles/Portfolio.css'; // Portfolio bölümüne özel stiller

// Portfolyo öğeleri için veri.
const portfolioData = [
    {
        id: 4, // Mini Soru Bankası projesi
        imgSrc: soruBankasiResmi,
        imgAlt: 'Mini Soru Bankası Uygulaması Ekran Görüntüsü',
        title: 'Mini Soru Bankası',
        description: 'Python ile geliştirilmiş bir komut satırı tabanlı mini soru bankası uygulaması.',
        detailsLink: 'https://github.com/basdemirmelih/SoruBankasi/blob/master/SoruBankas%C4%B1MelihB.py',
    },
    {
        id: 5, // Not Defteri Projesi
        imgSrc: notDefteriResmi,
        imgAlt: 'Not Defteri Uygulaması Ekran Görüntüsü',
        title: 'Kişisel Not Defteri',
        description: 'Kullanıcı dostu arayüzü ile metin düzenleme ve not alma imkanı sunan bir masaüstü uygulaması.',
        detailsLink: '#',
    },
    {
        id: 6, // Hava Durumu Projesi
        imgSrc: havaDurumuResmi,
        imgAlt: 'Hava Durumu Uygulaması Ekran Görüntüsü',
        title: 'Gerçek Zamanlı Hava Durumu Uygulaması',
        description: 'Belirtilen konum için internet üzerinden anlık hava durumu verilerini (sıcaklık, hissedilen, nem, rüzgar, basınç vb.) ve günlük tahminleri çekerek kullanıcıya sunar.',
        detailsLink: '#',
    },
    // YENİ: Kişisel Portfolyo Web Sitesi Projesi
    {
        id: 7, // Benzersiz bir ID verin
        imgSrc: webSiteResmi, // Yeni import ettiğimiz resmi kullanıyoruz
        imgAlt: 'Kişisel Portfolyo Web Sitesi Ekran Görüntüsü',
        title: 'Kişisel Portfolyo Web Sitesi',
        description: 'React ile geliştirdiğim, projelerimi, yeteneklerimi ve hakkımdaki diğer bilgileri sergilediğim kişisel web sitem.', // Açıklamayı istediğiniz gibi güncelleyebilirsiniz
        detailsLink: '#', // Buraya sitenizin canlı URL'sini veya GitHub deposunun linkini ekleyebilirsiniz
    },
    // Diğer projeleriniz (id: 1, 2, 3)
    {
        id: 1,
        imgSrc: 'https://via.placeholder.com/600x400/FF4A1C/FFFFFF?text=Proje+X',
        imgAlt: 'Proje X Açıklaması',
        title: 'Kurumsal Web Sitesi Yenileme',
        description: 'Modern ve kullanıcı dostu bir arayüzle [Şirket Adı] için geliştirildi.',
        detailsLink: '#',
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
];

const Portfolio = () => {
    return (
        <section id="portfolyo" className="bolum">
            <div className="container">
                <h2 className="bolum-baslik">Portfolyo</h2>
                <div className="portfolyo-galeri">
                    {/* Projeleri ID'ye göre sıralamak isterseniz (örneğin en yeniden en eskiye):
                        portfolioData.sort((a, b) => b.id - a.id).map((proje) => (
                    */}
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