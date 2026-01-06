import React, { useState, useEffect } from "react";
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage";
import { storage } from "../lib/firebase";
import { MdClose, MdChevronLeft, MdChevronRight } from "react-icons/md";
import "../styles/gallery.css";

interface GalleryImage {
  url: string;
  alt: string;
  description: string;
  uploadDate: string;
}

const Spinner = () => (
  <div className="loadingScreen">
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

        setImages(filteredImages);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedImage(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.url === selectedImage.url);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setSelectedImage(images[prevIndex]);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = images.findIndex((img) => img.url === selectedImage.url);
    const nextIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(images[nextIndex]);
  };

  const imagesPerPage = 9;
  const totalPages = Math.ceil(images.length / imagesPerPage);
  const startIndex = (currentPage - 1) * imagesPerPage;
  const currentImages = images.slice(startIndex, startIndex + imagesPerPage);

  if (loading) return <Spinner />;
  if (error) return <div className="galleriePhotoContainer"><p>Erreur: {error.message}</p></div>;

  return (
    <div className="galleriePhotoContainer">
      <div className="titreGalleriePhotosPage">
        <h1>Galerie de Photos</h1>
      </div>

      <div className="image-grid" id="grilleImages">
        {currentImages.map((image, index) => (
          <div key={startIndex + index} className="image-container">
            <img
              src={image.url}
              alt={image.alt}
              className="image"
              onClick={() => setSelectedImage(image)}
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
            {selectedImage.description && <p className="title">{selectedImage.description}</p>}
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
