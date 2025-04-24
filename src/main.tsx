
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './styles/base.css';
import './i18n';
import './styles/components.css';
import './styles/utilities.css';
import './styles/map.css';
import './styles/forms.css';

// Ensure React is available globally for debugging
window.React = React;

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Failed to find the root element");
} else {
  const root = createRoot(rootElement);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
