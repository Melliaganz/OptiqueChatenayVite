import React, { Suspense, lazy } from "react";
import "../styles/carousel.css";

const NosMarques = lazy(() => import("./NosMarques"));

const Carousel = () => {
  return (
    <section className="sectionCarouselMarques">
      <div className="carouselMarquesContainer">
        <div className="headerCarouselMarques">
          <div className="rondRose"></div>
          <div className="titreCarousel">
            <h2 className="h2CarouselMarques">
              Plus de 30 marques de lunettes
            </h2>
          </div>
          <div className="rondRose2"></div>
        </div>
        <div className="carouselMarquesInterieur">
          <Suspense fallback={<div className="suspense-loader"></div>}>
            <NosMarques />
          </Suspense>
        </div>
      </div>
    </section>
  );
};

export default React.memo(Carousel);
