import React from 'react';
import ReactDOM from 'react-dom/client';
// Yeni tasarım (v2). Önceki sinematik koyu tasarım src/App.js ve src/index.css içinde duruyor.
import './v2/v2.css';
import App from './v2/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
