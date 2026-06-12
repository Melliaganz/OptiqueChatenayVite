import React, { useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { MdLocalPhone, MdAccessTime, MdDirections, MdMap } from "react-icons/md";
import Horaires from "./Horaires";
import { useMediaQuery } from "../lib/useMediaQuery";
import carteOsm from "../img/carteOsm.webp";
import "../styles/noustrouver.css";

function NousTrouver() {
  const formSparkUrl = "https://submit-form.com/VNw27FMx";
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);
  // Le bloc horaires du héro est masqué sous 768px : on l'affiche ici à la place
  const isMobile = useMediaQuery("(max-width: 768px)");

  const correctMapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2629.620353457193!2d2.261266276856034!3d48.75091480826975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e677053075677b%3A0x6b49910e5494d48a!2s432%20Av.%20de%20la%20Div.%20Leclerc%2C%2092290%20Ch%C3%A2tenay-Malabry!5e0!3m2!1sfr!2sfr!4v1704500000000!5m2!1sfr!2sfr";

  // Ouvre l'app GPS du visiteur (Google Maps, Plans, Waze...) en mode itinéraire
  const itineraireUrl =
    "https://www.google.com/maps/dir/?api=1&destination=Optique+Chatenay%2C+432+Avenue+de+la+Division+Leclerc%2C+92290+Ch%C3%A2tenay-Malabry";

  const currentUrl =
    typeof window !== "undefined" ? window.location.origin : "/";

  return (
    <section className="contactezNousSection" id="contact">
      <div className="nousTrouverContainer">
        <div className="titreEtBouttons">
          <div className="titreNousTrouver">
            <h2 className="titreNousTrouverh2">Contactez-nous</h2>
          </div>
          <div className="textEtFormulaires">
            <div className="texte">
              <p className="textP">
                Nous serions ravis de pouvoir vous aider ! Remplissez simplement
                le formulaire de contact ci-dessous pour toutes vos questions ou
                pour prendre rendez-vous dans notre magasin d'optique.
              </p>
            </div>
          </div>
          <div className="formulaire">
            <form
              className="formulaireContact"
              action={formSparkUrl}
              method="POST"
              onSubmit={() => setSubmitting(true)}
            >
              <input type="hidden" name="_redirect" value={currentUrl} />
              <label>
                <input
                  placeholder="Nom"
                  aria-label="Nom"
                  type="text"
                  name="nom"
                  required
                  autoComplete="family-name"
                />
              </label>
              <label>
                <input
                  placeholder="Prénom"
                  aria-label="Prénom"
                  type="text"
                  name="prénom"
                  required
                  autoComplete="given-name"
                />
              </label>
              <label>
                <input
                  placeholder="Numéro de téléphone"
                  aria-label="Numéro de téléphone"
                  type="tel"
                  name="tel"
                  required
                  autoComplete="tel"
                />
              </label>
              <label>
                <input
                  placeholder="Email"
                  aria-label="Email"
                  type="email"
                  name="email"
                  required
                  autoComplete="email"
                />
              </label>
              <label>
                <textarea
                  placeholder="Que pouvons-nous faire pour vous ?"
                  aria-label="Votre message"
                  name="message"
                  required
                />
              </label>
              <button
                disabled={submitting}
                type="submit"
                className="bouttonRose"
              >
                {submitting ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          </div>
          <div className="infosContact">
            <div className="telephoneInfos">
              <div className="interieurInfosContact">
                <div className="contactTitre">
                  <h3>Téléphone</h3>
                </div>
                <div className="numéroTel">
                  <a className="téléphoneRose" href="tel:+33146300359">
                    +33 1 46 30 03 59
                  </a>
                </div>
              </div>
              <div className="iconeTel">
                <span className="logoTel">
                  <MdLocalPhone />
                </span>
              </div>
            </div>
            <div className="telephoneInfos">
              <div className="interieurInfosContact">
                <div className="contactTitre">
                  <h3>Email</h3>
                </div>
                <div className="numéroTel">
                  <a
                    className="téléphoneRose"
                    href="mailto:optiquechatenay@free.fr"
                  >
                    optiquechatenay@free.fr
                  </a>
                </div>
              </div>
              <div className="iconeTel">
                <span className="logoMel">
                  <IoMailOutline />
                </span>
              </div>
            </div>
            {isMobile && (
              <div className="telephoneInfos horairesInfos">
                <div className="interieurInfosContact">
                  <div className="contactTitre">
                    <h3>Horaires</h3>
                  </div>
                  <Horaires />
                </div>
                <div className="iconeTel">
                  <span className="logoTel">
                    <MdAccessTime />
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mapWrapper">
          <div className="mapLocation" onClick={() => setShowMap(true)}>
            {showMap ? (
              <iframe
                title="googleMaps"
                className="mapContainer"
                src={correctMapUrl}
              />
            ) : (
              <div className="mapPlaceholder">
                {/* Aperçu local (scripts/genere-carte-osm.mjs) : la carte est
                    visible sans clic et sans requête Google */}
                <img
                  src={carteOsm}
                  alt="Plan du quartier : le magasin au 432 avenue de la Division Leclerc à Châtenay-Malabry"
                  width="1024"
                  height="768"
                  loading="lazy"
                  decoding="async"
                />
                <div className="mapActions">
                  <button type="button" className="mapBoutonInteractif">
                    <MdMap size={20} />
                    Carte interactive
                  </button>
                  <a
                    className="mapBoutonItineraire"
                    href={itineraireUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdDirections size={20} />
                    Itinéraire
                  </a>
                </div>
                <span className="mapAttribution">© OpenStreetMap</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(NousTrouver);
