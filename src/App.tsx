import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import ScrollTopButton from "./components/ScrollTopButton";
import ScrollToHash from "./components/ScrollToHash";

const Footer = lazy(() => import("./components/Footer"));
const MentionsLegales = lazy(() => import("./components/MentionsLegales"));
const Administration = lazy(() => import("./components/Administration"));
const GalleriePage = lazy(() => import("./components/GalleriePage"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
  const [loadFooter, setLoadFooter] = useState(false);

  useEffect(() => {
    // Montage différé sans interaction requise : les moteurs de recherche
    // ne scrollent pas, le footer (et ses liens internes) doit apparaître seul
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setLoadFooter(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const timeout = setTimeout(() => setLoadFooter(true), 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <BrowserRouter>
      <ScrollToHash />
      <Header />
      <main className="mainContenu">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mentions-legales" element={<MentionsLegales />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="/gallerie" element={<GalleriePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <ScrollTopButton />
      
      <Suspense fallback={null}>
        {loadFooter && <Footer />}
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
