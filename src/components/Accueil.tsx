import React from "react";
import Horaires from "./Horaires";
import { RiMapPin2Fill } from "react-icons/ri";
import { FaPhoneFlip } from "react-icons/fa6";
import "../styles/accueil.css";

function Accueil() {
  return (
    <section className="accueil" id="accueil">
      <img
        src="/assets/imageJolie.webp"
        srcSet="/assets/image_2026-01-03_020928644_xinep3_c_scale,w_804.webp 800w, /assets/imageJolie.webp"
        sizes="100vw"
        width="1400"
        height="800"
        alt="Jeune femme souriante portant des lunettes de soleil"
        className="accueil-lcp-image"
        {...{ fetchpriority: "high" }}
      />
      <div className="accueilContainer">
        <div className="accueilBlocText">
          <div className="titreEtTextetBoutton">
            <h1 className="titreAccueil">
              Voir net
              <br />
              Vivre mieux
            </h1>
            <div className="adressesEtTelBloc">
              <div className="adresseEtTel">
                <span aria-hidden="true">
                  <RiMapPin2Fill />
                </span>
                <a
                  className="adresse"
                  href="https://goo.gl/maps/5D3itaxq6TTFxw9z6"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  432 Avenue de la Division Leclerc <br />
                  92290 CHATENAY MALABRY
                </a>
              </div>
              <div className="telephones">
                <span aria-hidden="true">
                  <FaPhoneFlip />
                </span>
                <a className="telephone" href="tel:+33146300359">
                  01 46 30 03 59
                </a>
              </div>
            </div>
            <div className="paragrapheAccueil">
              <p>
                Venez découvrir notre magasin d'optique, où notre équipe de
                professionnels vous accueillera avec le sourire.
              </p>
            </div>
            <div className="bouttonDecouvrir">
              <a href="#decouvrir" className="bouttonDecouvrirLien button">
                Découvrir notre magasin
              </a>
            </div>
          </div>
        </div>
        <div className="PositionBlocHoraire">
          <Horaires />
        </div>
      </div>
    </section>
  );
}

export default React.memo(Accueil);
