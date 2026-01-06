import './index.css';
import "./styles/variables.css";
import "./styles/base.css";
import "./App.css";
import { createRoot } from 'react-dom/client';
import { Suspense, lazy } from 'react';

const App = lazy(() => import('./App.tsx'));

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <Suspense fallback={<div className="accueil" aria-hidden="true"></div>}>
      <App />
    </Suspense>
  );
}
