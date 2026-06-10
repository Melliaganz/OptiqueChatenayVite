import React, { useState, useEffect, useCallback } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../lib/firebase";
import { getResizedUrl } from "../lib/firebaseImages";
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
    const imagesRef = ref(storage, "images");

    listAll(imagesRef)
      .then(async (res) => {
        const imagePromises = res.items.map(async (itemRef) => {
          try {
            const [url, metadata] = await Promise.all([
              getDownloadURL(itemRef),
              getMetadata(itemRef)
            ]);
            
            return {
              url,
              thumbUrl: getResizedUrl(itemRef.fullPath, "400x300"),
              alt: metadata.name,
              description: metadata.customMetadata?.description || "",
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

  const imagesPerPage = 9;
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
          <p>Erreur: {error.message}</p>
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
                  onError={(e) => {
                    // Pas de miniature générée pour cette image : repli sur l'originale
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = image.url;
                  }}
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
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
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
