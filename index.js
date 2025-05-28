import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Assuming App.tsx (now App.js or handled by esm.sh) is in the same directory

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("L'élément racine (root) est introuvable dans le DOM.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);