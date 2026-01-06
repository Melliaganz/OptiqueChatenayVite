import React, { useState, useEffect, useCallback } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytesResumable, listAll, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "../lib/firebase";
import { MdVisibility, MdVisibilityOff, MdDelete, MdCloudUpload, MdArrowBack } from "react-icons/md";
import "../styles/administration.css";

interface ExistingImage {
  name: string;
  url: string;
}

function Administration() {
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [showManager, setShowManager] = useState<boolean>(false);

  const fetchImages = useCallback(async () => {
    const imagesRef = ref(storage, "images");
    try {
      const res = await listAll(imagesRef);
      const imageList = await Promise.all(
        res.items.map(async (item) => ({
          name: item.name,
          url: await getDownloadURL(item),
        }))
      );
      setExistingImages(imageList);
    } catch (error) {
      console.error("Erreur récupération:", error);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchImages();
    }
  }, [isLoggedIn, fetchImages]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      setIsLoggedIn(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setProgress(0);
    const storageRef = ref(storage, `images/${file.name}`);
    
    const metadata = {
      customMetadata: {
        description: description,
      },
    };

    const uploadTask = uploadBytesResumable(storageRef, file, metadata);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const p = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(Math.round(p));
      },
      (error) => {
        console.error("Erreur upload:", error);
        alert("Erreur lors de l'envoi");
        setUploading(false);
      },
      () => {
        alert("Image uploadée avec succès !");
        setFile(null);
        setPreviewUrl(null);
        setDescription("");
        setUploading(false);
        setProgress(0);
        const fileInput = document.getElementById("fileInput") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
        fetchImages();
      }
    );
  };

  const handleDelete = async (fileName: string) => {
    if (window.confirm(`Supprimer l'image ${fileName} ?`)) {
      const imageRef = ref(storage, `images/${fileName}`);
      try {
        await deleteObject(imageRef);
        setExistingImages(existingImages.filter(img => img.name !== fileName));
      } catch (error) {
        console.error("Erreur suppression:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="adminBlock">
        <div className="blockMotDePasseContainer">
          <form onSubmit={handleLogin} className="motDePasseForm">
            <h1>Administration</h1>
            <div className="motDePasseInputWrapper">
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
              />
              <button
                type="button"
                id="bouttonVisibilite"
                className={showPassword ? "activeButton" : ""}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
            <button type="submit" className="bouttonValider">Valider</button>
          </form>
          <button onClick={() => navigate("/")} className="cancelButton">
           <MdArrowBack /> Retour au site
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="adminBlock">
      <div className="blockMotDePasseContainer">
        <div className="dashboard-header">
          <button onClick={() => navigate("/")} className="back-to-site" title="Retour au site">
             Retour vers l'accueil
          </button>
          <h1>Dashboard Admin</h1>
        </div>
        
        <div className="adminTabs">
          <button 
            className={`tabButton ${!showManager ? "active" : ""}`} 
            onClick={() => setShowManager(false)}
          >
            Ajouter
          </button>
          <button 
            className={`tabButton ${showManager ? "active" : ""}`} 
            onClick={() => setShowManager(true)}
          >
            Gérer ({existingImages.length})
          </button>
        </div>

        {!showManager ? (
          <form onSubmit={handleUpload} className="containeruploadFichier">
            <div className="formulaire">
              <label htmlFor="fileInput" className="custom-file-upload">
                <MdCloudUpload size={24} />
                {file ? file.name : "Choisir une image"}
              </label>
              <input
                id="fileInput"
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                required
                style={{ display: 'none' }}
              />
              
              {previewUrl && (
                <div className="image-preview-container">
                  <img src={previewUrl} alt="Preview" className="image-preview" />
                </div>
              )}

              <textarea
                placeholder="Description de l'image..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {uploading && (
                <div className="progress-container">
                  <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                  <span>{progress}%</span>
                </div>
              )}
            </div>
            <button 
              type="submit" 
              className="bouttonRose" 
              disabled={uploading || !file}
            >
              {uploading ? "Envoi..." : "Ajouter à la galerie"}
            </button>
          </form>
        ) : (
          <div className="image-manager-list">
            {existingImages.length === 0 ? (
              <p>Aucune image.</p>
            ) : (
              existingImages.map((img) => (
                <div key={img.name} className="manager-item">
                  <img src={img.url} alt={img.name} />
                  <span className="file-name">{img.name}</span>
                  <button 
                    onClick={() => handleDelete(img.name)} 
                    className="delete-btn"
                    title="Supprimer l'image"
                  >
                    <MdDelete size={20} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        <button onClick={() => setIsLoggedIn(false)} className="cancelButton">
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default React.memo(Administration);
