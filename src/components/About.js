import React from 'react';
import '../styles/About.css'; // About bölümüne özel stiller

const About = () => {
    return (
        <section id="hakkimda" className="bolum">
            <div className="container">
                {/* Genel Bölüm Başlığı (Merkezlenmiş) */}
                {/* Orijinal HTML'de bu başlık yoktu, ancak genellikle bölümlerin bir başlığı olur. */}
                {/* Eğer orijinal tasarımdaki gibi sadece sağ tarafta "Ben Kimim?" başlığı isteniyorsa, aşağıdaki satırı kaldırın. */}
                {/* <h2 className="bolum-baslik">Hakkımda</h2> */}

                <div className="hakkimda-ust-kisim">
                    <div className="hakkimda-sol">
                        {/* Resim yolunu public klasörüne göre ayarlayın */}
                        <img src="/images/WhatsApp Görsel 2025-05-16 saat 11.26.28_c64b5e18.jpg" alt="Melih Başdemir" />
                    </div>
                    <div className="hakkimda-sag">
                        <div>
                            {/* Sağ taraftaki özel başlık */}
                            <h2 className="hakkimda-bolum-baslik">Ben Kimim?</h2>
                        </div>
                        <div className="hakkimda-metin">
                            <h3>Merhaba, ben Melih Başdemir. Kodlar ve algoritmalarla çalışarak geleceğe katkı sağlamayı hedefleyen bir öğrenciyim.</h3>
                            <p>
                                Bilgisayar Mühendisliği 2. sınıf öğrencisiyim. Yazılım geliştirmeye ilgi duyuyor, bu alanda kendimi sürekli geliştirmeye çalışıyorum.
                                Kod yazarken problem çözmeye ve mantıklı yapılar kurmaya odaklanıyorum. Aynı zamanda kullanıcı deneyimi ve tasarım gibi alanlara da ilgi duyuyorum. Öğrenmeye açık biriyim ve projelere hem teknik hem de görsel açıdan katkı sağlamayı önemsiyorum.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bilgiler-alt-satir">
                    <div className="bilgi-kutusu">
                        <h4>Kısa Bilgiler</h4>
                        <ul>
                            <li><strong>Doğum Tarihi:</strong> 19.05.2004</li>
                            <li><strong>Doğum Yeri:</strong> Sivas/Merkez</li>
                            <li>
                                <strong>E-posta:</strong>
                                <a href="mailto:basdemirmelih58@gmail.com" style={{ color: 'var(--light-accent)', textDecoration: 'none', marginLeft: '5px' }}>
                                    basdemirmelih58@gmail.com
                                </a>
                            </li>
                            <li><strong>Konum:</strong> Sivas/Merkez & Balıkesir/Bigadiç, Türkiye</li>
                            <li><strong>İlgi Alanları:</strong> Yeni teknolojiler, sinema, seyahat, futbol, politika...</li>
                        </ul>
                        {/* CV bağlantısını güncelleyin */}
                        <a href="/cv/Melih_Basdemir_CV.pdf" className="btn btn-ghost" download="Melih_Basdemir_CV.pdf">CV'mi İndir</a>
                    </div>

                    <div className="bilgi-kutusu">
                        <h4>Eğitim Bilgilerim</h4>
                        <ul className="egitim-listesi">
                            <li>
                                <i className="fas fa-graduation-cap"></i>
                                <div className="okul-detay">
                                    <span className="okul-adi">Balıkesir Üniversitesi</span>
                                    <span className="okul-tarih">2023 - 2027 (?)</span>
                                </div>
                            </li>
                            <li>
                                <i className="fas fa-graduation-cap"></i>
                                <div className="okul-detay">
                                    <span className="okul-adi">Sivas Selçuk Anadolu Lisesi</span>
                                    <span className="okul-tarih">2018 - 2022</span>
                                </div>
                            </li>
                            <li>
                                <i className="fas fa-graduation-cap"></i>
                                <div className="okul-detay">
                                    <span className="okul-adi">Sivas Kanuni Ortaokulu</span>
                                    <span className="okul-tarih">2014 - 2018</span>
                                </div>
                            </li>
                            <li>
                                <i className="fas fa-graduation-cap"></i>
                                <div className="okul-detay">
                                    <span className="okul-adi">Sivas Kanuni İlkokulu</span>
                                    <span className="okul-tarih">2010 - 2014</span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="bilgi-kutusu">
                        <h4>Bildiğim Diller</h4>
                        <ul className="diller-listesi">
                            <li>
                                <i className="fas fa-language"></i>
                                <div className="dil-detay">
                                    <span className="dil-adi">Türkçe</span>
                                    <span className="dil-seviye">Ana Dil</span>
                                </div>
                            </li>
                            <li>
                                <i className="fas fa-language"></i>
                                <div className="dil-detay">
                                    <span className="dil-adi">İngilizce</span>
                                    <span className="dil-seviye">Orta - Üst Seviye</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;