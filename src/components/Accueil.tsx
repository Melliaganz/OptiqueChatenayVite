import React from "react";
import Horaires from "./Horaires";
import hero800 from "../img/youngsmilyingwomen/image_2026-01-03_020928644_xinep3_c_scale,w_804.webp";
import hero1400 from "../img/youngsmilyingwomen/image_2026-01-03_020928644_xinep3_c_scale,w_1400.webp";
import { RiMapPin2Fill } from "react-icons/ri";
import { FaPhoneFlip } from "react-icons/fa6";

function Accueil() {
  return (
    <section className="accueil" id="accueil">
      <div className="accueil-image-container">
        <img
          src={hero1400}
          srcSet={`${hero800} 800w, ${hero1400} 1400w`}
          sizes="100vw"
          alt="Jeune femme souriante portant des lunettes de soleil"
          className="accueil-lcp-image"
          fetchPriority="high"
          decoding="async"
          width="1400"
          height="788"
        />
      </div>
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
                Venez découvrir notre magasin d'optique, où
                <br />
                notre équipe de professionnels vous accueillera
                <br />
                avec le sourire pour vous offrir les meilleurs
                <br />
                conseils et soins pour vos yeux.
              </p>
            </div>
            <div className="bouttonDecouvrir">
              <a href="#decouvrir" className="bouttonDecouvrirLien button">
                Découvrir notre magasin
              </a>
            </div>
          </div>
          <div className="PositionBlocHoraire">
            <Horaires />
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(Accueil);
