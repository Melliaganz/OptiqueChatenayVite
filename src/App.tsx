import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Header from "./components/Header";

const Footer = lazy(() => import("./components/Footer"));
const ScrollTopButton = lazy(() => import("./components/ScrollTopButton"));
const Home = lazy(() => import("./components/Home"));
const Mentions = lazy(() => import("./components/Mentions"));
const Administration = lazy(() => import("./components/Administration"));
const GalleriedePhotos = lazy(() => import("./components/GalleriedePhotos"));
const NotFound = lazy(() => import("./components/NotFound"));

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <BrowserRouter>
      {isLoading && (
        <div className="progress-container" aria-hidden="true">
          <div className="progress-bar" />
        </div>
      )}

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

      <Suspense fallback={null}>
        <ScrollTopButton />
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
