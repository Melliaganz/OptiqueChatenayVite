import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import "./styles/variables.css";
import "./styles/base.css";
import "./App.css";

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
if (typeof window !== 'undefined') {
  const optimizeCSS = () => {
    document.querySelectorAll('link[rel="stylesheet"]').forEach((link) => {
      const sheet = link as HTMLLinkElement;
      if (sheet.media !== 'all') {
        sheet.media = 'all';
      }
    });
  };
  window.addEventListener('load', optimizeCSS);
}
