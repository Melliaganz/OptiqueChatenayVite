import React, { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { storage } from "../lib/firebase";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import "../styles/administration.css"

function Administration() {
  const [password, setPassword] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

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
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const storageRef = ref(storage, `images/${file.name}`);
    
    const metadata = {
      customMetadata: {
        description: description,
      },
    };

    try {
      await uploadBytes(storageRef, file, metadata);
      alert("Image uploadée avec succès !");
      setFile(null);
      setDescription("");
      const fileInput = document.getElementById("fileInput") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Erreur upload:", error);
      alert("Erreur lors de l'envoi");
    } finally {
      setUploading(false);
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
                aria-label="Mot de passe"
              />
              <button
                type="button"
                id="bouttonVisibilite"
                className={showPassword ? "activeButton" : ""}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Masquer" : "Afficher"}
              >
                {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
              </button>
            </div>
            <button type="submit" className="bouttonValider">Valider</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="adminBlock">
      <div className="blockMotDePasseContainer">
        <h1>Dashboard</h1>
        <form onSubmit={handleUpload} className="containeruploadFichier">
          <div className="formulaire">
            <input
              id="fileInput"
              type="file"
              onChange={handleFileChange}
              accept="image/*"
              required
              title="Choisir une image"
              aria-label="Choisir une image"
            />
            <textarea
              placeholder="Description de l'image..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              aria-label="Description de l'image"
            />
          </div>
          <button 
            type="submit" 
            className="bouttonRose" 
            disabled={uploading || !file}
          >
            {uploading ? "Envoi en cours..." : "Ajouter à la galerie"}
          </button>
        </form>
        <button onClick={() => setIsLoggedIn(false)} className="cancelButton">
          Déconnexion
        </button>
      </div>
    </div>
  );
}

export default React.memo(Administration);
