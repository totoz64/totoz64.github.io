import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Will resolve to App.js

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