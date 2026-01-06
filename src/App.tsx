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

      <main className="mainContenu">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={null}>
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/mentions-legales"
            element={
              <Suspense fallback={null}>
                <Mentions />
              </Suspense>
            }
          />
          <Route
            path="/administration"
            element={
              <Suspense fallback={null}>
                <Administration />
              </Suspense>
            }
          />
          <Route
            path="/gallerie"
            element={
              <Suspense fallback={null}>
                <GalleriedePhotos />
              </Suspense>
            }
          />
          <Route
            path="*"
            element={
              <Suspense fallback={null}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </main>

      <Suspense fallback={null}>
        <ScrollTopButton />
        <Footer />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
