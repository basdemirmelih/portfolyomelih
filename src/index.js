import React from 'react';
import ReactDOM from 'react-dom/client';
// Site: src/v2. Önceki tasarımlar git geçmişinde (yeni-tasarim dalı, afedda7).
import './v2/v2.css';
import App from './v2/App';

// Sayfa her yenilemede en üstten, giriş ekranından başlar.
// Tarayıcının eski kaydırma konumunu geri yüklemesi, sabitlenen parçacık bölümü henüz kurulmadan
// (sayfa daha kısayken) yanlış bir yere inip animasyonları ve renkleri birbirine karıştırıyordu.
if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('beforeunload', () => window.scrollTo(0, 0));

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
