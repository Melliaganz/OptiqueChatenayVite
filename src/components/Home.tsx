import React, { lazy, Suspense, useState, useEffect } from "react";
import Accueil from "./Accueil";

// On garde ces composants en lazy car ils sont sous la ligne de flottaison
const Carousel = lazy(() => import("./Carousel"));
const ChoisirOptique = lazy(() => import("./ChoisirOptique"));
const NousTrouver = lazy(() => import("./NousTrouver"));
const GallerieBento = lazy(() => import("./GallerieBento"));

function Home() {
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    // Une ancre dans l'URL cible une section lazy : on la monte tout de suite
    if (window.location.hash) {
      setLoadMore(true);
      return;
    }

    // Montage différé après le rendu initial, sans condition de scroll :
    // les moteurs de recherche ne scrollent pas, le contenu doit apparaître seul
    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(() => setLoadMore(true), { timeout: 2000 });
      return () => window.cancelIdleCallback(id);
    }
    const timeout = setTimeout(() => setLoadMore(true), 2000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Accueil />
      <Suspense fallback={null}>
        {loadMore && (
          <>
            <Carousel />
            <GallerieBento />
            <ChoisirOptique />
            <NousTrouver />
          </>
        )}
      </Suspense>
    </>
  );
}

export default React.memo(Home);
