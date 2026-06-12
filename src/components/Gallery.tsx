import React, { useState, useEffect, useCallback, useRef } from "react";
import { isResizedVariant, listFiles, getFileUrl, getFileMetadata } from "../lib/firebaseImages";
import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import "../styles/gallery.css";

interface GalleryImage {
  url: string;
  thumbUrl: string;
  alt: string;
  description: string;
  uploadDate: string;
}

const Spinner = () => (
  <div className="loading-wrapper">
    <div className="loaderDeux" />
  </div>
);

const Gallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Le bucket est public : les URLs se construisent sans requête, seule
    // la liste (1 appel) et les métadonnées des originales (1 appel chacune,
    // pour la description et la date) touchent le réseau
    listFiles("images/")
      .then(async (paths) => {
        const names = paths.map((p) => p.replace(/^images\//, ""));

        // Regroupe les variantes par image d'origine ("nom" -> [nom_400x300, ...])
        const variantsByStem = new Map<string, { name: string; width: number }[]>();
        for (const name of names) {
          const m = name.match(/^(.+)_(\d+)x\d+\.[^.]+$/);
          if (!m) continue;
          const list = variantsByStem.get(m[1]) ?? [];
          list.push({ name, width: parseInt(m[2]) });
          variantsByStem.set(m[1], list);
        }

        const originals = names.filter((name) => !isResizedVariant(name));
        const imagePromises = originals.map(async (name) => {
          try {
            // Vignette : la variante la plus proche de 400px de large ;
            // à défaut (anciennes images sans variantes), l'originale
            const stem = name.replace(/\.[^.]+$/, "");
            const thumb = (variantsByStem.get(stem) ?? []).sort(
              (a, b) => Math.abs(a.width - 400) - Math.abs(b.width - 400)
            )[0];

            const url = getFileUrl(`images/${name}`);
            const metadata = await getFileMetadata(`images/${name}`);

            return {
              url,
              thumbUrl: thumb ? getFileUrl(`images/${thumb.name}`) : url,
              alt: metadata.description || name,
              description: metadata.description,
              uploadDate: metadata.timeCreated,
            };
          } catch (err) {
            return null;
          }
        });

        const resolvedImages = await Promise.all(imagePromises);
        const filteredImages = (resolvedImages.filter((img) => img !== null) as GalleryImage[])
          .sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime());

        if (isMounted) {
          setImages(filteredImages);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateImage = useCallback(
    (delta: number) => {
      setSelectedImage((current) => {
        if (!current) return current;
        const currentIndex = images.findIndex((img) => img.url === current.url);
        return images[(currentIndex + delta + images.length) % images.length];
      });
    },
    [images]
  );

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateImage(-1);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigateImage(1);
  };

  // Navigation clavier du modal : Échap pour fermer, flèches pour naviguer
  useEffect(() => {
    if (!selectedImage) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedImage(null);
      else if (e.key === "ArrowLeft") navigateImage(-1);
      else if (e.key === "ArrowRight") navigateImage(1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedImage, navigateImage]);

  // À l'ouverture du modal, focus sur le bouton Fermer ; à la fermeture,
  // retour du focus sur l'élément déclencheur
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const isModalOpen = selectedImage !== null;
  useEffect(() => {
    if (!isModalOpen) return;
    const trigger = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    return () => trigger?.focus();
  }, [isModalOpen]);

  const imagesPerPage = 12;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  return (
    <div className="galleriePhotoContainer">
      <div className="titreGalleriePhotosPage">
        <h1>Galerie de Photos</h1>
      </div>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="error-message">
          <p>
            Impossible de charger la galerie pour le moment. Veuillez réessayer
            plus tard.
          </p>
        </div>
      ) : (
        <>
          <div className="image-grid" id="grilleImages">
            {currentImages.map((image, index) => (
              <div key={`${image.url}-${index}`} className="image-container">
                <img
                  src={image.thumbUrl}
                  alt={image.alt}
                  className="image"
                  onClick={() => setSelectedImage(image)}
                  loading="lazy"
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => handlePageChange(page)}
                  className={page === currentPage ? "selected-page" : "page"}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {selectedImage && (
        <div className="modal" onClick={() => setSelectedImage(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Photo agrandie"
          >
            <button
              ref={closeButtonRef}
              className="close"
              onClick={() => setSelectedImage(null)}
              aria-label="Fermer la galerie"
              title="Fermer"
              type="button"
            >
              <MdClose />
            </button>
            
            <img src={selectedImage.url} alt={selectedImage.alt} className="modal-image" />
            
            {selectedImage.description && (
              <p className="title">{selectedImage.description}</p>
            )}

            <button 
              className="modal-nav-button prev" 
              onClick={handlePrevImage}
              aria-label="Image précédente"
              title="Précédent"
              type="button"
            >
              <MdChevronLeft size={40} />
            </button>

            <button 
              className="modal-nav-button next" 
              onClick={handleNextImage}
              aria-label="Image suivante"
              title="Suivant"
              type="button"
            >
              <MdChevronRight size={40} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Gallery);
