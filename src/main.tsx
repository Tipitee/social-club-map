
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/base.css';
import './i18n';
import './styles/components.css';
import './styles/utilities.css';
import './styles/map.css';
import './styles/forms.css';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
