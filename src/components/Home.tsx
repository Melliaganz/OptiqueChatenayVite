import React, { lazy, Suspense, useState, useEffect } from "react";
import Accueil from "./Accueil";

const Carousel = lazy(() => import("./Carousel"));
const ChoisirOptique = lazy(() => import("./ChoisirOptique"));
const NousTrouver = lazy(() => import("./NousTrouver"));
const GalleriePhotos = lazy(() => import("./GalleriePhotos"));

function Home() {
  const [loadMore, setLoadMore] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setLoadMore(true);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Suspense fallback={<div className="suspense-loader" />}>
        <Accueil />

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
