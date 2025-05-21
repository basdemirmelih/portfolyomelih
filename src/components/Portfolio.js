import React from 'react';
// Mevcut resim importları
import soruBankasiResmi from '../resim/bankasisoru.png';
import notDefteriResmi from '../resim/not_defteri.png';
import havaDurumuResmi from '../resim/hava_durumu.png';
import webSiteResmi from '../resim/web_site.png';
import oyunGorseli from '../resim/oyun_gorsel.jpg';
// YENİ HTML/CSS ÖĞRETİCİ GÖRSELİ İÇİN IMPORT SATIRI
import htmlCssOgreticiResmi from '../resim/html_css.png'; // Yeni resim importu

import '../styles/Portfolio.css'; // Portfolio bölümüne özel stiller

// Portfolyo öğeleri için veri.
const portfolioData = [
    {
        id: 4,
        imgSrc: soruBankasiResmi,
        imgAlt: 'Soru Bankası Uygulaması Ekran Görüntüsü',
        title: 'Soru Bankası Uygulaması',
        description: 'Kullanıcıların soru ekleyip, görüntüleyebileceği bir soru bankası uygulaması.',
        detailsLink: 'https://github.com/basdemirmelih/soru__bankasi',
    },
    {
        id: 5,
        imgSrc: notDefteriResmi,
        imgAlt: 'Not Defteri Uygulaması Ekran Görüntüsü',
        title: 'Kişisel Not Defteri',
        description: 'Kullanıcı dostu arayüzü ile metin düzenleme ve not alma imkanı sunan bir masaüstü uygulaması.',
        detailsLink: 'https://github.com/basdemirmelih/not__defteri',
    },
    {
        id: 6,
        imgSrc: havaDurumuResmi,
        imgAlt: 'Hava Durumu Uygulaması Ekran Görüntüsü',
        title: 'Gerçek Zamanlı Hava Durumu Uygulaması',
        description: 'Belirtilen konum için internet üzerinden anlık hava durumu verilerini ve günlük tahminleri çekerek kullanıcıya sunar.',
        detailsLink: 'https://github.com/basdemirmelih/hava__durumu',
    },
    {
        id: 7,
        imgSrc: webSiteResmi,
        imgAlt: 'Kişisel Portfolyo Web Sitesi Ekran Görüntüsü',
        title: 'Kişisel Portfolyo Web Sitesi',
        description: 'React ile geliştirdiğim, projelerimi, yeteneklerimi ve hakkımdaki diğer bilgileri sergilediğim kişisel web sitem.',
        detailsLink: '#', // Bu portfolyo sitesinin GitHub linki veya canlı URL'si eklenebilir
    },
    {
        id: 8,
        imgSrc: oyunGorseli,
        imgAlt: 'Oyun Projesi Ekran Görüntüsü',
        title: 'Oyun Geliştirme Projesi',
        description: 'Unity ile geliştirilmiş bir araba oyunu projesi. Detaylar LinkedIn gönderisinde paylaşılmıştır.',
        detailsLink: 'https://www.linkedin.com/feed/update/urn:li:activity:7275872108751077376/',
    },
    // YENİ EKLENEN HTML/CSS ÖĞRETİCİ PROJESİ
    {
        id: 9, // Benzersiz yeni bir ID
        imgSrc: htmlCssOgreticiResmi, // Yeni import ettiğimiz HTML/CSS öğretici görseli
        imgAlt: 'HTML CSS Öğretici Örnekleri Ekran Görüntüsü',
        title: 'HTML CSS Öğretici Örnekleri',
        description: 'Yorum satırlarıyla zenginleştirilmiş, öğretici ve örnekli HTML/CSS kodları.',
        detailsLink: 'https://github.com/basdemirmelih/html_css_ogretici', // Verdiğiniz GitHub linki
    },
];

const Portfolio = () => {
    return (
        <section id="portfolyo" className="bolum">
            <div className="container">
                <h2 className="bolum-baslik">Portfolyo</h2>
                <div className="portfolyo-galeri">
                    {portfolioData
                        .sort((a, b) => a.id - b.id) // ID'ye göre sıralama
                        .map((proje) => (
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