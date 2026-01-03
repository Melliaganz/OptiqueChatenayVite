import React from 'react';
import { Link } from 'react-router-dom';

function GalleriePhotos() {
  return (
    <section id="decouvrez" className='sectionGalleriePhotos'>
      <div className="gallerieDimageInterieur">
        <h1>Galerie Photos</h1>
        <div className='imagesGalleriesContainer'>
          <div className='imagesHorizontalContainer'>
            <div className='premiereImageGallerie'>
              <Link to="/gallerie" title="Voir la galerie de photos">
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/ImagesHorizon%2FImagesHorizon_2021-10-15.webp?alt=media&token=92db8427-b46b-43d7-a0af-b9889c7e36ce" 
                  alt="Intérieur du magasin Optique Chatenay"
                  className="gallery-img-fit"
                  loading="lazy"
                  decoding="async"
                  width="572" 
                  height="191" 
                />
              </Link>
            </div>
            <div className='secondeImageGallerie'>
              <Link to="/gallerie" title="Voir la galerie de photos">
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/ImagesHorizon%2FImagesHorizon_IMG-20221116-WA0001.webp?alt=media" 
                  alt="Rayonnage de lunettes de vue"
                  className="gallery-img-fit"
                  loading="lazy"
                  decoding="async"
                  width="572" 
                  height="191" 
                />
              </Link>
            </div>
            <div className='troisiemeImageGallerie'>
              <Link to="/gallerie" title="Voir la galerie de photos">
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/ImagesHorizon%2FImagesHorizon_IMG-20221116-WA0001.webp?alt=media" 
                  alt="Espace accueil du magasin"
                  className="gallery-img-fit"
                  loading="lazy"
                  decoding="async"
                  width="572" 
                  height="191" 
                />
              </Link>
            </div>
          </div>
          <div className='imagesVerticales'>
            <Link to="/gallerie" title="Voir la galerie de photos">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/ImagesVertical%2FImagesVertical_5bd0d265-3e52-41ce-919f-ee2b72194ea9%20(3).webp?alt=media" 
                alt="Détail de montures optiques" 
                className="gallery-img-fit"
                loading="lazy"
                decoding="async"
                width="568"
                height="426"
              />
            </Link>
          </div>
        </div>
        <div className='titreGalleriePhotos'>
          <h3>Cliquez sur une image et découvrez notre galerie photo</h3>
        </div>
      </div>
    </section>
  );
}

export default React.memo(GalleriePhotos);
