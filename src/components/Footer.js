import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer id="footer">
            <div className="container">
                <div className="sosyal-medya" style={{ marginBottom: '25px' }}>
                    <a href="https://github.com/basdemirmelih" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                        <i className="fab fa-github"></i>
                    </a>
                    <a href="https://www.linkedin.com/in/melih-ba%C5%9Fdemir-215057285/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                        <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href="https://x.com/melihbsdmr" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
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