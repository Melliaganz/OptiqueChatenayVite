import './index.css'
import "./styles/variables.css";
import "./styles/base.css";
import "./App.css";
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <App />
)
