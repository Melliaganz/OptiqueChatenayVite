import React, { lazy, Suspense } from "react";
import Accueil from "./Accueil";

const Carousel = lazy(() => import("./Carousel"));
const ChoisirOptique = lazy(() => import("./ChoisirOptique"));
const NousTrouver = lazy(() => import("./NousTrouver"));
const GalleriePhotos = lazy(() => import("./GalleriePhotos"));

function Home() {
  return (
    <>
      <Accueil />

      <Suspense fallback={<div className="suspense-loader" />}>
        <Carousel />
        <GalleriePhotos />
        <ChoisirOptique />
        <NousTrouver />
      </Suspense>
    </>
  );
}

export default React.memo(Home);
