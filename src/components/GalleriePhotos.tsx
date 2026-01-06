import React from "react";
import { Link } from "react-router-dom";
import "../styles/bento.css";

interface ImageConfig {
  path: string;
  alt: string;
  width: number;
  height: number;
  priority?: "high" | "low" | "auto";
}

const GalleriePhotos: React.FC = () => {
  const firebaseBucketUrl =
    "https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/";

  const getResizedUrl = (fullPath: string, size: string) => {
    const dotIndex = fullPath.lastIndexOf(".");
    const name = fullPath.substring(0, dotIndex);
    const ext = fullPath.substring(dotIndex);
    const resizedPath = `${name}_${size}${ext}`;
    const encodedPath = encodeURIComponent(resizedPath);
    return `${firebaseBucketUrl}${encodedPath}?alt=media`;
  };

  const images: Record<string, ImageConfig> = {
    vitrine: {
      path: "ImagesHorizon/Vitrine.webp",
      alt: "Façade du magasin Optique Chatenay",
      width: 800,
      height: 600,
      priority: "high",
    },
    collections: {
      path: "ImagesVertical/Vertical.webp",
      alt: "Sélection de montures de lunettes",
      width: 400,
      height: 800,
      priority: "low",
    },
    expertise: {
      path: "ImagesHorizon/Interieur.webp",
      alt: "Intérieur du magasin et zone d'expertise",
      width: 400,
      height: 350, // Ajusté selon ton "Rendered size"
      priority: "low",
    },
  };

  return (
    <section id="decouvrez" className="sectionGallerieBento">
      <div className="bentoContainer">
        <header className="bentoHeader">
          <span className="subtitle">Immersion</span>
          <h2 className="title">Notre Galerie</h2>
          <p className="description">
            Découvrez l'ambiance de votre opticien à Châtenay-Malabry.
          </p>
        </header>

        <div className="bentoGrid">
          <Link to="/gallerie" className="bentoItem item-main" title="Voir le magasin">
            <div className="bentoOverlay">
              <span className="bentoTag">Le Magasin</span>
              <span className="bentoAction">Agrandir</span>
            </div>
            <img
              src={getResizedUrl(images.vitrine.path, "800x600")}
              srcSet={`${getResizedUrl(images.vitrine.path, "400x300")} 400w, ${getResizedUrl(images.vitrine.path, "800x600")} 800w`}
              sizes="(max-width: 1200px) 740px, 800px"
              alt={images.vitrine.alt}
              width={800}
              height={600}
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
          </Link>

          <Link to="/gallerie" className="bentoItem item-side" title="Nos collections">
            <div className="bentoOverlay">
              <span className="bentoTag">Collections</span>
              <span className="bentoAction">Voir</span>
            </div>
            <img
              src={getResizedUrl(images.collections.path, "400x800")}
              srcSet={`${getResizedUrl(images.collections.path, "200x400")} 200w, ${getResizedUrl(images.collections.path, "400x800")} 400w`}
              sizes="(max-width: 1200px) 350px, 400px"
              alt={images.collections.alt}
              width={400}
              height={800}
              loading="lazy"
              decoding="async"
            />
          </Link>

          <Link to="/gallerie" className="bentoItem item-bottom" title="Notre savoir-faire">
            <div className="bentoOverlay">
              <span className="bentoTag">Expertise</span>
              <span className="bentoAction">Détails</span>
            </div>
            <img
              src={getResizedUrl(images.expertise.path, "800x700")}
              srcSet={`
                ${getResizedUrl(images.expertise.path, "800x600")} 400w,
                ${getResizedUrl(images.expertise.path, "800x700")} 800w
              `}
              sizes="(max-width: 1200px) 383px, 400px"
              alt={images.expertise.alt}
              width={383} 
              height={350}
              loading="lazy"
              decoding="async"
            />
          </Link>

          <div className="bentoCTA">
            <Link to="/gallerie" className="bentoBtnLarge">
              Découvrir toute la galerie
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(GalleriePhotos);
