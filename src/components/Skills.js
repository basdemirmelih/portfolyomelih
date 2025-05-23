// basdemirmelih/portfolyomelih/portfolyomelih-4826ecf528031c12bcf3d98ad770e1f0a16e2fe3/src/components/Skills.js
import React from 'react';
import '../styles/Skills.css'; // Skills bölümüne özel stiller

const skillsData = [
    { id: 'csharp', name: 'C#', iconClass: 'fas fa-code', itemClassName: 'skill-logo-item' },
    { id: 'html', name: 'HTML', iconClass: 'fab fa-html5', itemClassName: 'skill-logo-item' },
    { id: 'css', name: 'CSS', iconClass: 'fab fa-css3-alt', itemClassName: 'skill-logo-item' },
    { id: 'javascript', name: 'JavaScript', iconClass: 'fab fa-js-square', itemClassName: 'skill-logo-item' },
    { id: 'react', name: 'React', iconClass: 'fab fa-react', itemClassName: 'skill-logo-item' },
    { id: 'unity', name: 'Unity', iconClass: 'fab fa-unity', itemClassName: 'skill-logo-item' },
    { id: 'python', name: 'Python', iconClass: 'fab fa-python', itemClassName: 'skill-logo-item' },
    { id: 'sqlite', name: 'SQLite', iconClass: 'fas fa-database', itemClassName: 'skill-logo-item' }, // SQLite eklendi
    // Dilerseniz burayı 8'e tamamlamak için boş bir item veya başka bir yetenek ekleyebilirsiniz.
    // Örnek boş item: { id: 'empty', name: '', iconClass: '', itemClassName: 'skill-logo-item empty-skill-item' },
];

const Skills = () => {
    return (
        <section id="neler-yapabilirim" className="bolum">
            <div className="container">
                <h2 className="bolum-baslik">Teknik Beceriler</h2>
                {/* Grid'i 4x2 yapmak için özel bir sınıf ekleyebiliriz */}
                <div className="yetkinlikler-liste skill-logos-container yetkinlikler-liste-4x2">
                    {skillsData.map((skill) => (
                        <div className={`yetkinlik-item ${skill.itemClassName || ''}`} key={skill.id}>
                            {skill.iconClass && ( // Sadece iconClass varsa ikonu göster
                                <div className="skill-logo-wrapper">
                                    <i className={`${skill.iconClass} skill-icon-large`}></i>
                                </div>
                            )}
                            <h4>{skill.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;