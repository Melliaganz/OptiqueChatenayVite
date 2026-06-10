import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, BrowserRouter, useLocation } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import ScrollTopButton from "./components/ScrollTopButton";

// Fait défiler la page vers l'ancre de l'URL, en réessayant le temps
// que les sections chargées en lazy soient montées dans le DOM
function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    let attempts = 0;
    const interval = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        clearInterval(interval);
      } else if (++attempts > 50) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [location]);

  return null;
}

const Footer = lazy(() => import("./components/Footer"));
const MentionsLegales = lazy(() => import("./components/MentionsLegales"));
const Administration = lazy(() => import("./components/Administration"));
const GalleriePage = lazy(() => import("./components/GalleriePage"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
  const [loadFooter, setLoadFooter] = useState(false);

  useEffect(() => {
    const triggerFooter = () => {
      setLoadFooter(true);
    };

    window.addEventListener("scroll", triggerFooter, { once: true, passive: true });
    window.addEventListener("mousemove", triggerFooter, { once: true, passive: true });
    window.addEventListener("touchstart", triggerFooter, { once: true, passive: true });

    return () => {
      window.removeEventListener("scroll", triggerFooter);
      window.removeEventListener("mousemove", triggerFooter);
      window.removeEventListener("touchstart", triggerFooter);
    };
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
