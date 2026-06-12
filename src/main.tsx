import { render } from 'preact';
import { inject } from '@vercel/analytics';
import App from './App.tsx';
import './styles/all.css';

// Vercel Web Analytics : script et beacons servis en same-origin
// (/_vercel/insights/*), déjà couverts par la CSP. Suit aussi les
// navigations SPA du router.
inject();

const container = document.getElementById('root');

if (container) {
  render(<App />, container);
}

