import React from 'react';
import '../styles/Footer.css'; // Footer bölümüne özel stiller

const Footer = () => {
    const currentYear = new Date().getFullYear(); // JavaScript ile mevcut yılı al

    return (
        <footer id="footer">
            <div className="container">
                <div className="sosyal-medya" style={{ marginBottom: '25px' }}> {/* Orijinaldeki inline stil JSX'e uyarlandı */}
                    <a href="https://github.com/melihbasdemir" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/melih-ba%C5%9Fdemir-215057285/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter"> {/* Bu linki güncelleyin */}
                        <i className="fab fa-twitter"></i>
                    </a>
                    <a href="https://www.instagram.com/melihbasdemir/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                        <i className="fab fa-instagram"></i>
                    </a>
                </div>
                <p>&copy; {currentYear} Melih Başdemir. Tüm hakları saklıdır.</p>
            </div>
        </footer>
    );
};

export default Footer;