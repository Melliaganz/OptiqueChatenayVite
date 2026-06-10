import React from "react";
import { Link } from "react-router-dom";
import { MdHandyman } from "react-icons/md";
import BackButton from "./BackButton";
import { usePageTitle } from "../lib/usePageTitle";
import "../styles/notfound.css";

function NotFound() {
  usePageTitle("Page introuvable");

  return (
    <section className="pageNotFoundSection">
      <BackButton />
      <div className="pageNotFoundContainer">
        <div className="erreur404">
          <span className="settingIcon">
            <MdHandyman />
          </span>
          <h1>404: Page Not Found</h1>
          <p>
            Il semble que la page à laquelle vous essayez d'accéder n'existe
            plus ou n'existe pas.
          </p>
          <div className="lienRetour">
            <Link to="/">Retour à l'accueil</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(NotFound);
