import { render } from 'preact';
import App from './App.tsx';
import './index.css';
import "./styles/variables.css";
import "./styles/base.css";
import "./App.css";

const container = document.getElementById('root');

if (container) {
  render(<App />, container);
}
