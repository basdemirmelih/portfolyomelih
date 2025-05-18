import React from 'react';

// Bileşenleri import et
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';

// App bileşenine özel stiller için (isteğe bağlı, çoğunlukla index.css kullanılır)
import './App.css';

// Eğer Typed.js kullanıyorsanız ve Hero.js içinde TypedText.js'i import ediyorsanız,
// App.js'de ayrıca TypedText'i import etmenize gerek yok.
// Ancak, eğer CustomTypedText.js'i kullanıyorsanız ve o da Hero.js içinde import ediliyorsa,
// yine App.js'de ayrıca import etmenize gerek yok.

function App() {
  return (
      // React Fragment (<> </>) kullanarak birden fazla ana elementi gruplayabiliriz
      // veya bir ana <div> sarmalayıcı kullanabiliriz.
      // Eğer App.css'te .App class'ına stil uygulayacaksak bir div kullanmak daha mantıklı.
      <div className="App">
        <Header />
        <main> {/* Ana içerik için <main> etiketi kullanmak semantik açıdan iyidir */}
          <Hero />
          <About />
          <Skills />
          <Portfolio />
          <Contact />
        </main>
        <Footer />
      </div>
  );
}

export default App;