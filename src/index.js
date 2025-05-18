// src/index.js (veya main.jsx)
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Global stiller
import App from './App'; // Ana uygulama bileşeni

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);