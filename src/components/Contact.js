import React, { useState } from 'react';
import '../styles/Contact.css'; // Contact bölümüne özel stiller

const Contact = () => {
    const [formData, setFormData] = useState({
        adsoyad: '',
        email: '',
        icerik: '',
    });

    const contactInfo = [
        { icon: 'fas fa-envelope', title: 'E-posta', text: 'basdemirmelih58@gmail.com', href: 'mailto:basdemirmelih58@gmail.com' },
        { icon: 'fas fa-phone-alt', title: 'Telefon', text: '+90 533 649 10 58', href: 'tel:+905336491058' },
        { icon: 'fas fa-map-marker-alt', title: 'Konum', text: 'Sivas/Merkez & Balıkesir/Bigadiç, Türkiye' },
        { icon: 'fab fa-linkedin', title: 'LinkedIn', text: 'Melih Başdemir', href: 'https://www.linkedin.com/in/melih-ba%C5%9Fdemir-215057285/', target: '_blank' },
        { icon: 'fab fa-instagram', title: 'Instagram', text: 'melihbasdemir', href: 'https://www.instagram.com/melihbasdemir/', target: '_blank' },
        { icon: 'fab fa-github', title: 'GitHub', text: 'basdemirmelih', href: 'https://github.com/basdemirmelih', target: '_blank' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Burada form verilerini gönderme işlemini yapabilirsiniz.
        // Örneğin: bir API'ye gönderme, EmailJS kullanma vb.
        console.log('Form Verileri:', formData);
        alert('Mesajınız konsola yazdırıldı! (Gerçek gönderim entegre edilmedi)');
        // Formu sıfırla (isteğe bağlı)
        setFormData({
            adsoyad: '',
            email: '',
            icerik: '',
        });
    };

    return (
        <section id="iletisim" className="bolum">
            <div className="container">
                <h2 className="bolum-baslik">İletişim</h2>
                <div className="iletisim-giris">
                    <p>Benimle iletişime geçmek, projeleriniz hakkında konuşmak veya sadece bir merhaba demek için aşağıdaki bilgileri ya da iletişim formunu kullanabilirsiniz.</p>
                </div>

                <div className="iletisim-kartlari">
                    {contactInfo.map((item, index) => (
                        <div className="iletisim-item" key={index}>
                            <i className={item.icon}></i>
                            <h4>{item.title}</h4>
                            {item.href ? (
                                <p><a href={item.href} target={item.target || '_self'} rel={item.target === '_blank' ? 'noopener noreferrer' : ''}>{item.text}</a></p>
                            ) : (
                                <p>{item.text}</p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="iletisim-formu">
                    <h3>Bana Mesaj Gönderin</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-grup">
                            <label htmlFor="adsoyad">Ad Soyad</label>
                            <input
                                type="text"
                                id="adsoyad"
                                name="adsoyad"
                                value={formData.adsoyad}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-grup">
                            <label htmlFor="email">E-posta Adresiniz</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-grup">
                            <label htmlFor="icerik">Mesajınız</label>
                            <textarea
                                id="icerik"
                                name="icerik"
                                value={formData.icerik}
                                onChange={handleChange}
                                required
                            ></textarea>
                        </div>
                        <div className="form-grup">
                            <button type="submit" className="btn">Gönder</button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Contact;