import React from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';
import './styles.css';

// รองรับ: FR-ENR-01, FR-ENR-02, FR-ENR-04
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Missing root element for the camp enrollment frontend.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
