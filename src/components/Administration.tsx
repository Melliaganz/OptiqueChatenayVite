import React, { useState, useEffect, useCallback } from "react";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  listAll,
  getDownloadURL,
  getMetadata,
  deleteObject,
  updateMetadata,
  uploadBytesResumable,
} from "firebase/storage";
import { FaSpinner } from "react-icons/fa";
import { MdArrowBackIosNew, MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const Spinner = () => (
  <div className="admin-spinner-container">
    <FaSpinner className="fa-spin spinner-icon" />
  </div>
);

const Administration = () => {
  const [password, setPassword] = useState<string>("");
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loadingImages, setLoadingImages] = useState<boolean>(true);
  const imagesPerPage = 4;

  const fetchUploadedImages = useCallback(async () => {
    const storageRef = ref(storage, "images");
    try {
      const imageList = await listAll(storageRef);
      const imagesWithMetadata = await Promise.all(
        imageList.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          return { url, metadata };
        })
      );
      setUploadedImages(imagesWithMetadata.slice().reverse());
      setLoadingImages(false);
    } catch (error) {
      console.error("Erreur :", error);
      setLoadingImages(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthorized) {
      fetchUploadedImages();
    }
  }, [isAuthorized, fetchUploadedImages]);

  const handleImageClick = async (action: string, imageUrl: string) => {
    const imageRef = ref(storage, imageUrl);
    if (action === "Supprimer") {
      if (window.confirm("Voulez-vous vraiment supprimer cette image ?")) {
        try {
          await deleteObject(imageRef);
          fetchUploadedImages();
        } catch (error) {
          console.error("Erreur suppression :", error);
        }
      }
    } else if (action === "Modifier") {
      const selectedImageMetadata = uploadedImages.find(
        (image) => image.url === imageUrl
      );
      const description = prompt(
        "Nouvelle description :",
        selectedImageMetadata.metadata.customMetadata?.description || ""
      );
      if (description !== null) {
        try {
          await updateMetadata(imageRef, { customMetadata: { description } });
          fetchUploadedImages();
        } catch (error) {
          console.error("Erreur metadata :", error);
        }
      }
    }
  };

  const handlePasswordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      alert("Mot de passe incorrect");
    }
    setPassword("");
  };

  const handleFileSelect = (event: any) => {
    const fileList = event.target.files;
    setSelectedFiles(fileList);
    if (fileList && fileList.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result as string);
      reader.readAsDataURL(fileList[0]);
    }
  };

  const handleFileUpload = () => {
    if (!selectedFiles) return;
    Array.from(selectedFiles).forEach((file) => {
      const imageRef = ref(storage, `images/${file.name}`);
      const uploadTask = uploadBytesResumable(imageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setUploadProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        (error) => console.error(error),
        () => {
          setUploadProgress(0);
          setSelectedFiles(null);
          setImagePreview(null);
          fetchUploadedImages();
        }
      );
    });
  };

  const indexOfLastImage = currentPage * imagesPerPage;
  const currentImages = uploadedImages.slice(
    indexOfLastImage - imagesPerPage,
    indexOfLastImage
  );
  const pageNumbers = Array.from(
    { length: Math.ceil(uploadedImages.length / imagesPerPage) },
    (_, i) => i + 1
  );

  return (
    <div className="adminBlock">
      <div className="bouttonRetour2">
        <a href="/">
          <span className="back-icon-wrapper">
            <MdArrowBackIosNew size={20} />
          </span>
          Retour
        </a>
      </div>
      {!isAuthorized ? (
        <div className="blockMotDePasseContainer">
          <form onSubmit={handlePasswordSubmit} className="motDePasseForm">
            <label htmlFor="password-input">Entrez le mot de passe :</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                id="bouttonVisibilite"
                onClick={() => setShowPassword(!showPassword)}
                className="visibility-toggle"
              >
                {showPassword ? <MdOutlineVisibilityOff size={20} /> : <MdOutlineVisibility size={20} />}
              </button>
            </div>
            <button type="submit" className="bouttonValider">
              Valider
            </button>
          </form>
        </div>
      ) : (
        <div
          className="blockMotDePasseContainer"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            handleFileSelect({ target: { files: e.dataTransfer.files } });
          }}
        >
          {loadingImages ? (
            <Spinner />
          ) : (
            <div className="containeruploadFichier">
              <h5>Glissez une image pour l'uploader</h5>
              <input
                type="file"
                id="file-input"
                multiple
                onChange={handleFileSelect}
              />
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
              {selectedFiles && (
                <div>
                  <progress value={uploadProgress} max="100" />
                  <button type="button" onClick={handleFileUpload}>
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFiles(null);
                      setImagePreview(null);
                    }}
                  >
                    Annuler
                  </button>
                </div>
              )}
            </div>
          )}
          {currentImages.length > 0 && (
            <div className="uploaded-images-container">
              <h3>Images déjà téléchargées :</h3>
              <div className="uploaded-images">
                {currentImages.map((image, index) => (
                  <div key={index} className="uploaded-image">
                    <img src={image.url} alt="Uploaded" />
                    <div className="image-info">
                      {image.metadata?.customMetadata?.description && (
                        <div className="image-description">
                          <p>{image.metadata.customMetadata.description}</p>
                        </div>
                      )}
                      <div className="image-buttons">
                        <button
                          onClick={() =>
                            handleImageClick("Modifier", image.url)
                          }
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() =>
                            handleImageClick("Supprimer", image.url)
                          }
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pagination">
                {pageNumbers.map((number) => (
                  <button
                    key={number}
                    onClick={() => setCurrentPage(number)}
                    className={currentPage === number ? "active" : ""}
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(Administration);
