import React, { lazy, Suspense, useState, useEffect } from "react";
import Accueil from "./Accueil";

// On garde ces composants en lazy car ils sont sous la ligne de flottaison
const Carousel = lazy(() => import("./Carousel"));
const ChoisirOptique = lazy(() => import("./ChoisirOptique"));
const NousTrouver = lazy(() => import("./NousTrouver"));
const GalleriePhotos = lazy(() => import("./GalleriePhotos"));

function Home() {
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 2000));
    
    idleCallback(() => {
      const handleScroll = () => {
        if (window.scrollY > 50) {
          setLoadMore(true);
          window.removeEventListener("scroll", handleScroll);
        }
      };
      window.addEventListener("scroll", handleScroll, { passive: true });
    });
  }, []);

  return (
    <>
      <Accueil />
      <Suspense fallback={null}>
        {loadMore && (
          <>
            <Carousel />
            <GalleriePhotos />
            <ChoisirOptique />
            <NousTrouver />
          </>
        )}
      </Suspense>
    </>
  );
}

export default React.memo(Home);
