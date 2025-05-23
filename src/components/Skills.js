import React from 'react';
import '../styles/Skills.css'; // Skills bölümüne özel stiller

// Mevcut beceri ikonları için veri (C#, HTML vb.)
const skillsData = [
    { id: 'csharp', name: 'C#', iconClass: 'fas fa-code', itemClassName: 'skill-logo-item' },
    { id: 'html', name: 'HTML', iconClass: 'fab fa-html5', itemClassName: 'skill-logo-item' },
    { id: 'css', name: 'CSS', iconClass: 'fab fa-css3-alt', itemClassName: 'skill-logo-item' },
    { id: 'javascript', name: 'JavaScript', iconClass: 'fab fa-js-square', itemClassName: 'skill-logo-item' },
    { id: 'react', name: 'React', iconClass: 'fab fa-react', itemClassName: 'skill-logo-item' },
    { id: 'unity', name: 'Unity', iconClass: 'fab fa-unity', itemClassName: 'skill-logo-item' },
    { id: 'python', name: 'Python', iconClass: 'fab fa-python', itemClassName: 'skill-logo-item' },
    { id: 'sqlite', name: 'SQLite', iconClass: 'fas fa-database', itemClassName: 'skill-logo-item' },
];

// YENİ: Kartlar için yetkinlik verileri (Aleyna'nın yapısına benzer)
const capabilitiesDataMelih = [
    {
        id: 'web-dev',
        title: 'Etkileşimli Web Uygulamaları',
        description: 'HTML, CSS, JavaScript ve React kullanarak modern, kullanıcı dostu ve duyarlı web arayüzleri geliştiriyorum. API entegrasyonları ve bileşen tabanlı mimarilerle verimli projeler üretebilirim.',
        iconClass: 'fas fa-laptop-code', // Font Awesome ikonu
        accentName: 'accent-1' // CSS'te tanımlanacak renk teması için
    },
    {
        id: 'game-dev',
        title: 'Oyun Geliştirme',
        description: 'Unity oyun motoru ve C# programlama dili ile 2D ve 3D oyunlar geliştirme yetkinliğine sahibim. Oyun mekanikleri, kullanıcı arayüzü ve seviye tasarımı konularında çalışabilirim.',
        iconClass: 'fas fa-gamepad',
        accentName: 'accent-2'
    },
    {
        id: 'python-data',
        title: 'Python ile Uygulama ve Veri İşleme',
        description: 'Python dilini kullanarak çeşitli otomasyon betikleri, veri işleme araçları geliştirebilir ve SQLite gibi veritabanları ile etkileşimli basit uygulamalar oluşturabilirim.',
        iconClass: 'fas fa-cogs', // fab fa-python da olabilirdi
        accentName: 'accent-3'
    },

];

const Skills = () => {
    return (
        <section id="neler-yapabilirim" className="bolum">
            <div className="container">
                {/* Mevcut Teknik Beceriler İkonları Bölümü */}
                <h2 className="bolum-baslik">Neler Yapabilirim?</h2>
                <div className="capabilities-grid">
                    {capabilitiesDataMelih.map((capability) => (
                        <div key={capability.id} className="capability-card">
                            <div className={`capability-card-icon-wrapper ${capability.accentName}`}>
                                <i className={`${capability.iconClass} capability-card-icon`}></i>
                            </div>
                            <h4 className="capability-card-title">{capability.title}</h4>
                            <p className="capability-card-description">{capability.description}</p>
                            {/*  */}
                            {/* <SomeDecorativeSVG className="decorative-svg-on-card" /> */}
                        </div>
                    ))}
                </div>


                {/* === YENİ KART TABANLI "NELER YAPABİLİRİM?" (YETKİNLİKLER) BÖLÜMÜ === */}
                <div className="capabilities-section">
                    <h3 className="bolum-baslik">Teknik Becerilerim</h3>
                    <div className="yetkinlikler-liste skill-logos-container yetkinlikler-liste-4x2">
                        {skillsData.map((skill) => (
                            <div className={`yetkinlik-item ${skill.itemClassName || ''}`} key={skill.id}>
                                {skill.iconClass && (
                                    <div className="skill-logo-wrapper">
                                        <i className={`${skill.iconClass} skill-icon-large`}></i>
                                    </div>
                                )}
                                <h4>{skill.name}</h4>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Skills;