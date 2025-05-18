import React, { useState, useEffect } from 'react';
import '../styles/Skills.css'; // Skills bölümüne özel stiller

const skillsData = [
    { id: 'csharp', name: 'C#', iconClass: 'fas fa-code', percentage: 80 },
    { id: 'html', name: 'HTML', iconClass: 'fab fa-html5', percentage: 90 },
    { id: 'css', name: 'CSS', iconClass: 'fab fa-css3-alt', percentage: 85 },
    { id: 'javascript', name: 'JavaScript', iconClass: 'fab fa-js-square', percentage: 50 },
    { id: 'react', name: 'React', iconClass: 'fab fa-react', percentage: 50 },
    { id: 'unity', name: 'Unity', iconClass: 'fab fa-unity', percentage: 40 },
    { id: 'python', name: 'Python', iconClass: 'fab fa-python', percentage: 60 },
    // Buraya daha fazla yetenek ekleyebilirsiniz
];

const Skills = () => {
    const [animateProgress, setAnimateProgress] = useState(false);

    useEffect(() => {
        // Bileşen yüklendikten kısa bir süre sonra animasyonu tetikle
        // Bu, CSS transition'ının çalışması için bir başlangıç noktası sağlar.
        // Intersection Observer API ile sadece görünür olduğunda tetiklemek daha gelişmiş bir yöntemdir.
        const timer = setTimeout(() => {
            setAnimateProgress(true);
        }, 100); // 100ms gecikme

        return () => clearTimeout(timer); // Cleanup
    }, []);

    return (
        <section id="neler-yapabilirim" className="bolum">
            <div className="container">
                <h2 className="bolum-baslik">Neler Yapabilirim?</h2>
                <div className="yetkinlikler-liste">
                    {skillsData.map((skill) => (
                        <div className="yetkinlik-item" key={skill.id}>
                            <h4>
                                <i className={skill.iconClass}></i>
                                {skill.name}
                            </h4>
                            <div className="progress-bar-container">
                                <div
                                    className="progress-bar"
                                    style={{ width: animateProgress ? `${skill.percentage}%` : '0%' }}
                                    aria-valuenow={skill.percentage}
                                    aria-valuemin="0"
                                    aria-valuemax="100"
                                    role="progressbar"
                                    aria-label={`${skill.name} yetkinlik seviyesi ${skill.percentage}%`}
                                >
                                    {/* İsteğe bağlı: Yüzdeyi bar içinde göstermek için */}
                                    {/* <span className="progress-percentage">{skill.percentage}%</span> */}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Skills;