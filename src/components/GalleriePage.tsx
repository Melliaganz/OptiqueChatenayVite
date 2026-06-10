import React from "react";
import Gallery from "./Gallery.tsx";
import BackButton from "./BackButton";
import { usePageTitle } from "../lib/usePageTitle";
import "../styles/galleryPage.css";

function GalleriePage() {
  usePageTitle("Galerie de photos");

  return (
    <div>
      <BackButton className="bouttonRetour3" />
      <Gallery />
    </div>
  );
}

export default React.memo(GalleriePage);
