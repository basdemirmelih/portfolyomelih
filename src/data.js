import havaDurumu from './resim/hava_durumu.png';
import soruBankasi from './resim/bankasisoru.png';
import notDefteri from './resim/not_defteri.png';
import oyun from './resim/oyun_gorsel.jpg';
import htmlCss from './resim/html_css.png';

export const kisi = {
    ad: 'Melih Başdemir',
    eposta: 'basdemirmelih58@gmail.com',
    telefon: '+90 533 649 10 58',
    telefonHref: 'tel:+905336491058',
    konum: 'Sivas ve Balıkesir',
};

export const baglantilar = [
    { ad: 'GitHub', kullanici: 'basdemirmelih', href: 'https://github.com/basdemirmelih' },
    { ad: 'LinkedIn', kullanici: 'melih-basdemir', href: 'https://www.linkedin.com/in/melih-basdemir' },
    { ad: 'Instagram', kullanici: 'melihbasdemir', href: 'https://www.instagram.com/melihbasdemir/' },
    { ad: 'X', kullanici: 'melihbsdmr', href: 'https://x.com/melihbsdmr' },
];

// Sıra yelpazedeki sırayı belirler; ortadaki (ORTA = 6 / 2 = 3. indeks) açılışta öne çıkar.
// "terminal" türündeki kartın görseli yok; kart içinde kodla çizilen bir terminal görünür.
export const projeler = [
    {
        id: 'soru-bankasi',
        ad: 'Soru Bankası',
        aciklama: 'Soru ekleyip düzenleyebildiğin, kayıtlı soruları görüntüleyip yazdırabildiğin masaüstü uygulaması.',
        teknoloji: 'Python',
        gorsel: soruBankasi,
        link: 'https://github.com/basdemirmelih/soru__bankasi',
        linkMetni: 'GitHub’da incele',
    },
    {
        id: 'unity-oyun',
        ad: 'GameJam 3.’lüğü: 3D yarış oyunu',
        aciklama: 'Balıkesir Teknokent GameJam’inde kısıtlı sürede ekiple geliştirdiğimiz, üçüncülük alan 3D araba oyunu. Oyun mekanikleri, C# betikleri ve performans optimizasyonu.',
        teknoloji: 'Unity, C#',
        gorsel: oyun,
        link: 'https://www.linkedin.com/feed/update/urn:li:activity:7275872108751077376/',
        linkMetni: 'LinkedIn’de oynanışı izle',
    },
    {
        id: 'cti-staj',
        tur: 'rapor',
        ad: 'CTI stajı: tehdit istihbaratı',
        aciklama: 'CoreSynapseAI’de 40 iş günü boyunca OSINT ve dark web kaynaklarından tehdit aktörlerini ve veri sızıntılarını araştırdım; IOC’leri MITRE ATT&CK ve Cyber Kill Chain ile analiz edip aksiyona dönük raporlara dönüştürdüm.',
        teknoloji: 'OSINT, MITRE ATT&CK, IOC analizi',
        link: 'https://www.linkedin.com/in/melih-basdemir',
        linkMetni: 'LinkedIn’de incele',
    },
    {
        id: 'siber-lab',
        tur: 'terminal',
        ad: 'Siber güvenlik laboratuvarları',
        aciklama: 'Hack The Box ve Hackviser makinelerinde keşiften yetki yükseltmeye uçtan uca zafiyet analizi: Nmap ile tarama, Wireshark ile trafik inceleme, Metasploit ile istismar.',
        teknoloji: 'Kali Linux, Nmap, Metasploit, Wireshark',
        link: 'https://github.com/basdemirmelih',
        linkMetni: 'GitHub’da incele',
    },
    {
        id: 'hava-durumu',
        ad: 'Hava Durumu',
        aciklama: 'Girdiğin şehrin anlık hava durumunu ve günlük tahminlerini internetten çekip tek ekranda gösteren masaüstü uygulaması. Hissedilen sıcaklık, nem, rüzgâr ve gün doğumu gibi ayrıntıları da listeler.',
        teknoloji: 'Python, hava durumu API’si',
        gorsel: havaDurumu,
        link: 'https://github.com/basdemirmelih/hava__durumu',
        linkMetni: 'GitHub’da incele',
    },
    {
        id: 'not-defteri',
        ad: 'Not Defteri',
        aciklama: 'Yazı tipi, boyut ve stil seçenekleriyle metin düzenleme ve dosya kaydetme sunan sade bir not uygulaması.',
        teknoloji: 'Python',
        gorsel: notDefteri,
        link: 'https://github.com/basdemirmelih/not__defteri',
        linkMetni: 'GitHub’da incele',
    },
    {
        id: 'html-css-ogretici',
        ad: 'HTML ve CSS öğretici',
        aciklama: 'Her satırı yorumlarla açıklanmış örnek sayfalar. HTML ve CSS’e yeni başlayanların kodu okuyarak öğrenmesi için hazırladım.',
        teknoloji: 'HTML, CSS',
        gorsel: htmlCss,
        link: 'https://github.com/basdemirmelih/html_css_ogretici',
        linkMetni: 'GitHub’da incele',
    },
];

export const alanlar = [
    {
        ad: 'Siber güvenlik',
        metin: 'CTF yarışmalarına katılıyorum. Web güvenliği, tersine mühendislik, steganografi ve şifre analizi sorularında çalıştım.',
    },
    {
        ad: 'Linux',
        metin: 'Günlük işlerimi ve güvenlik çalışmalarımı Kali Linux başta olmak üzere Linux sistemlerde, komut satırından yürütüyorum.',
    },
    {
        ad: 'Web geliştirme',
        metin: 'HTML, CSS, JavaScript ve React ile duyarlı arayüzler kuruyor, dış servislerden gelen verileri API’lerle bağlıyorum.',
    },
    {
        ad: 'Oyun geliştirme',
        metin: 'Unity ve C# ile 2D ve 3D oyunlarda mekanik, arayüz ve bölüm tasarımı yapıyorum.',
    },
    {
        ad: 'Algoritmalar',
        metin: 'Problemleri parçalara ayırıp uygun veri yapısını seçerek verimli çözümler yazmaya çalışıyorum. Bunun için çoğunlukla C# kullanıyorum.',
    },
];

export const araclar = [
    { grup: 'Diller', ogeler: 'C#, Python, JavaScript, SQL' },
    { grup: 'Web', ogeler: 'HTML, CSS, React' },
    { grup: 'Sistem ve güvenlik', ogeler: 'Linux, Kali Linux, CTF araçları' },
    { grup: 'Oyun ve veri', ogeler: 'Unity, SQLite' },
];
