import React from 'react';
import '../styles/Skills.css'; // Skills bölümüne özel stiller
// C# logosu için SVG/PNG importunu kaldırıyoruz, Devicon kullanılacak.

// Mevcut beceri ikonları için veri
const skillsData = [
    // C# için Devicon sınıfını kullanıyoruz
    { id: 'csharp', name: 'C#', iconClass: 'devicon-csharp-plain', itemClassName: 'skill-logo-item' },
    { id: 'html', name: 'HTML', iconClass: 'fab fa-html5', itemClassName: 'skill-logo-item' }, // Font Awesome kalabilir veya Devicon ile değiştirilebilir: devicon-html5-plain
    { id: 'css', name: 'CSS', iconClass: 'fab fa-css3-alt', itemClassName: 'skill-logo-item' }, // Font Awesome kalabilir veya Devicon ile değiştirilebilir: devicon-css3-plain
    { id: 'javascript', name: 'JavaScript', iconClass: 'fab fa-js-square', itemClassName: 'skill-logo-item' }, // Font Awesome kalabilir veya Devicon ile değiştirilebilir: devicon-javascript-plain
    { id: 'react', name: 'React', iconClass: 'fab fa-react', itemClassName: 'skill-logo-item' }, // Font Awesome kalabilir veya Devicon ile değiştirilebilir: devicon-react-original
    { id: 'unity', name: 'Unity', iconClass: 'fab fa-unity', itemClassName: 'skill-logo-item' }, // Font Awesome kalabilir veya Devicon ile değiştirilebilir: devicon-unity-original
    { id: 'python', name: 'Python', iconClass: 'fab fa-python', itemClassName: 'skill-logo-item' }, // Font Awesome kalabilir veya Devicon ile değiştirilebilir: devicon-python-plain
    { id: 'sqlite', name: 'SQLite', iconClass: 'fas fa-database', itemClassName: 'skill-logo-item' }, // Font Awesome kalabilir veya Devicon ile değiştirilebilir: devicon-sqlite-plain
];

// "Neler Yapabilirim?" kartları için veri
const capabilitiesDataMelih = [
    {
        id: 'web-dev',
        title: 'Etkileşimli Web Uygulamaları',
        description: 'HTML, CSS, JavaScript ve React kullanarak modern, kullanıcı dostu ve duyarlı web arayüzleri geliştiriyorum. API entegrasyonları ve bileşen tabanlı mimarilerle verimli projeler üretebilirim.',
        iconClass: 'fas fa-laptop-code',
        accentName: 'accent-1'
    },
    {
        id: 'game-dev',
        title: 'Oyun Geliştirme',
        description: 'Unity oyun motoru ve C# programlama dili ile 2D ve 3D oyunlar geliştirme yetkinliğine sahibim. Oyun mekanikleri, kullanıcı arayüzü ve seviye tasarımı konularında çalışabilirim.',
        iconClass: 'fas fa-gamepad',
        accentName: 'accent-2'
    },
    {
        id: 'algo-problem-solving',
        title: 'Algoritmik Problem Çözme',
        description: 'Karmaşık problemleri analiz etme, etkili algoritmalar tasarlama ve veri yapılarını kullanarak optimize çözümler geliştirme konularında yetkinim. Özellikle C# dilinde algoritmik düşünme becerilerimi aktif olarak kullanıyorum.',
        iconClass: 'fas fa-brain',
        accentName: 'accent-3'
    },
];

const Skills = () => {
    return (
        <section id="neler-yapabilirim" className="bolum">
            <div className="container">
                <h2 className="bolum-baslik">Neler Yapabilirim?</h2>
                <div className="capabilities-grid">
                    {capabilitiesDataMelih.map((capability) => (
                        <div key={capability.id} className="capability-card">
                            <div className={`capability-card-icon-wrapper ${capability.accentName}`}>
                                <i className={`${capability.iconClass} capability-card-icon`}></i>
                            </div>
                            <h4 className="capability-card-title">{capability.title}</h4>
                            <p className="capability-card-description">{capability.description}</p>
                        </div>
                    ))}
                </div>

                <div className="capabilities-section">
                    <h3 className="bolum-baslik">Teknik Becerilerim</h3>
                    <div className="yetkinlikler-liste skill-logos-container yetkinlikler-liste-4x2">
                        {skillsData.map((skill) => (
                            <div className={`yetkinlik-item ${skill.itemClassName || ''}`} key={skill.id}>
                                <div className="skill-logo-wrapper">
                                    {/* imgSrc kaldırıldığı için sadece iconClass kontrolü yeterli */}
                                    {skill.iconClass ? (
                                        <i className={`${skill.iconClass} skill-icon-large`}></i>
                                    ) : null}
                                </div>
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