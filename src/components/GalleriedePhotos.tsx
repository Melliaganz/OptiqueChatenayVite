import React from "react";
import { Link } from "react-router-dom";
import Gallery from "./Gallery.tsx";
import { MdArrowBackIos } from "react-icons/md";
import "../styles/galleryPage.css";

function GalleriedePhotos() {
  return (
    <div>
      <div className="bouttonRetour3">
        <Link to="/" title="Retour à l'accueil">
          <span>
            <MdArrowBackIos />
          </span>
          Retour
        </Link>
      </div>
      <Gallery />
    </div>
  );
}

export default React.memo(GalleriedePhotos);
