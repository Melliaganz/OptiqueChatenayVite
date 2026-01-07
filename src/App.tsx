import { Suspense, lazy, useState, useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import ScrollTopButton from "./components/ScrollTopButton";

const Footer = lazy(() => import("./components/Footer"));
const Mentions = lazy(() => import("./components/Mentions"));
const Administration = lazy(() => import("./components/Administration"));
const GalleriedePhotos = lazy(() => import("./components/GalleriedePhotos"));
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
      <Header />
      <main className="mainContenu">
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mentions-legales" element={<Mentions />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="/gallerie" element={<GalleriedePhotos />} />
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
