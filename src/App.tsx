import "./App.css";
import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollTopButton from "./components/ScrollTopButton";

const Home = lazy(() => import("./components/Home"));
const Mentions = lazy(() => import("./components/Mentions"));
const Administration = lazy(() => import("./components/Administration"));
const GalleriedePhotos = lazy(() => import("./components/GalleriedePhotos"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (document.readyState === "complete") {
      setIsLoading(false);
      return;
    }
    const handleLoad = () => setIsLoading(false);
    window.addEventListener("load", handleLoad, { once: true });
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <BrowserRouter>
      {isLoading && (
        <div className="progress-container" aria-hidden="true">
          <div className="progress-bar" />
        </div>
      )}

      <Header />
      <ScrollTopButton />

      <main className="mainContenu">
        <Suspense
          fallback={<div className="suspense-loader">Chargement...</div>}
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mentions-legales" element={<Mentions />} />
            <Route path="/administration" element={<Administration />} />
            <Route path="/gallerie" element={<GalleriedePhotos />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </main>
    </BrowserRouter>
  );
}

export default App;
