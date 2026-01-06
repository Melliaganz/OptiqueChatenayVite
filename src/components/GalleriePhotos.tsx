import React from "react";
import { Link } from "react-router-dom";

function GalleriePhotos() {
  const firebaseBucketUrl =
    "https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/";

  const getResizedUrl = (fullPath: string, size: string) => {
    const dotIndex = fullPath.lastIndexOf('.');
    const name = fullPath.substring(0, dotIndex);
    const ext = fullPath.substring(dotIndex);
    const resizedPath = `${name}_${size}${ext}`;
    const encodedPath = encodeURIComponent(resizedPath);
    return `${firebaseBucketUrl}${encodedPath}?alt=media`;
  };

  const img1Path = "ImagesHorizon/Vitrine.webp";
  const img2Path = "ImagesHorizon/Interieur.webp";
  const imgVerticalPath = "ImagesVertical/imagesVertical.webp";

  return (
    <section id="decouvrez" className="sectionGallerieBento">
      <div className="bentoContainer">
        <div className="bentoGrid">
          
          <Link to="/gallerie" className="bentoItem item-main" title="Voir la galerie">
            <div className="bentoTag">Le Magasin</div>
            <img
              src={getResizedUrl(img1Path, "800x600")}
              srcSet={`${getResizedUrl(img1Path, "400x300")} 400w, ${getResizedUrl(img1Path, "800x600")} 800w`}
              sizes="(max-width: 768px) 100vw, 740px"
              alt="Vitrine Optique Chatenay"
              loading="eager"
              fetchpriority="high"
              decoding="async"
              width="740"
              height="400"
            />
          </Link>

          <Link to="/gallerie" className="bentoItem item-side" title="Voir la galerie">
            <div className="bentoTag">Collections</div>
            <img
              src={getResizedUrl(imgVerticalPath, "400x800")}
              srcSet={`${getResizedUrl(imgVerticalPath, "200x400")} 200w, ${getResizedUrl(imgVerticalPath, "400x800")} 400w`}
              sizes="(max-width: 768px) 50vw, 420px"
              alt="Montures de lunettes"
              loading="lazy"
              decoding="async"
              width="420"
              height="840"
            />
          </Link>

          <Link to="/gallerie" className="bentoItem item-bottom" title="Voir la galerie">
            <div className="bentoTag">Expertise</div>
            <img
              src={getResizedUrl(img2Path, "200x400")}
              srcSet={`${getResizedUrl(img2Path, "200x400")} 200w, ${getResizedUrl(img2Path, "400x200")} 400w`}
              sizes="(max-width: 768px) 100vw, 400px"
              alt="Intérieur du magasin"
              loading="lazy"
              decoding="async"
              width="400"
              height="420"
            />
          </Link>

          <div className="bentoInfo">
            <div className="bentoText">
              <span>Immersion</span>
              <h2>Notre Galerie</h2>
              <p>Explorez notre espace et nos dernières collections en un clic.</p>
            </div>
            <Link to="/gallerie" className="bentoBtn">
              Découvrir
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}

export default React.memo(GalleriePhotos);
