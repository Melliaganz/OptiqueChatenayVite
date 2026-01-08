import { render } from 'preact';
import App from './App.tsx';
import './styles/all.css';

const container = document.getElementById('root');

if (container) {
  render(<App />, container);
}
