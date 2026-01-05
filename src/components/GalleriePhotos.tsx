import React from "react";
import { Link } from "react-router-dom";

function GalleriePhotos() {
  const firebaseUrl =
    "https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/";

  return (
    <section id="decouvrez" className="sectionGalleriePhotos">
      <div className="gallerieDimageInterieur">
        <h1>Galerie Photos</h1>
        <div className="imagesGalleriesContainer">
          <div className="imagesHorizontalContainer">
            <div className="premiereImageGallerie">
              <Link to="/gallerie" title="Voir la galerie de photos">
                <img
                  src={`${firebaseUrl}ImagesHorizon%2FImagesHorizon_2021-10-15.webp?alt=media`}
                  alt="Intérieur du magasin Optique Chatenay"
                  className="gallery-img-fit"
                  loading="lazy"
                  decoding="async"
                  width="887"
                  height="443"
                  style={{
                    objectFit: "cover",
                    aspectRatio: "887 / 443",
                    width: "100%",
                    maxWidth: "887px",
                    height: "auto",
                  }}
                />
              </Link>
            </div>
            <div className="secondeImageGallerie">
              <Link to="/gallerie" title="Voir la galerie de photos">
                <img
                  src={`${firebaseUrl}ImagesHorizon%2FImagesHorizon_IMG-20221116-WA0001.webp?alt=media`}
                  alt="Rayonnage de lunettes de vue"
                  className="gallery-img-fit"
                  loading="lazy"
                  decoding="async"
                  width="572"
                  height="191"
                  style={{
                    objectFit: "cover",
                    aspectRatio: "572 / 191",
                    width: "100%",
                    maxWidth: "572px",
                    height: "auto",
                  }}
                />
              </Link>
            </div>
            <div className="troisiemeImageGallerie">
              <Link to="/gallerie" title="Voir la galerie de photos">
                <img
                  src={`${firebaseUrl}ImagesHorizon%2FImagesHorizon_IMG-20221116-WA0001.webp?alt=media`}
                  alt="Espace accueil du magasin"
                  className="gallery-img-fit"
                  loading="lazy"
                  decoding="async"
                  width="572"
                  height="191"
                  style={{
                    objectFit: "cover",
                    aspectRatio: "572 / 191",
                    width: "100%",
                    maxWidth: "572px",
                    height: "auto",
                  }}
                />
              </Link>
            </div>
          </div>
          <div className="imagesVerticales">
            <Link to="/gallerie" title="Voir la galerie de photos">
              <img
                src={`${firebaseUrl}ImagesVertical%2FImagesVertical_5bd0d265-3e52-41ce-919f-ee2b72194ea9%20(3).webp?alt=media`}
                alt="Détail de montures optiques"
                className="gallery-img-fit"
                loading="lazy"
                decoding="async"
                width="591"
                height="443"
                style={{
                  objectFit: "cover",
                  aspectRatio: "591 / 443",
                  width: "100%",
                  maxWidth: "591px",
                  height: "auto",
                }}
              />
            </Link>
          </div>
        </div>
        <div className="titreGalleriePhotos">
          <h3>Cliquez sur une image et découvrez notre galerie photo</h3>
        </div>
      </div>
    </section>
  );
}

export default React.memo(GalleriePhotos);
