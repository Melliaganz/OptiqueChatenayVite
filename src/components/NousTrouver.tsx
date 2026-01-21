import React, { useState } from "react";
import { IoMailOutline } from "react-icons/io5";
import { MdLocalPhone } from "react-icons/md";
import "../styles/noustrouver.css";
import { LuMapPin } from "react-icons/lu";

function NousTrouver() {
  const formSparkUrl = "https://submit-form.com/VNw27FMx";
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [showMap, setShowMap] = useState<boolean>(false);

  const correctMapUrl =
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2629.563456789!2d2.2645!3d48.7654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDQ1JzU1LjQiTiAywrAxNSc1Mi4yIkU!5e0!3m2!1sfr!2sfr!4v1234567890";

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
              onSubmit={() => setSubmitting(true)}
            >
              <input type="hidden" name="_redirect" value={currentUrl} />
              <label>
                <input placeholder="Nom" type="text" name="nom" required />
              </label>
              <label>
                <input
                  placeholder="Prénom"
                  type="text"
                  name="prénom"
                  required
                />
              </label>
              <label>
                <input
                  placeholder="Numéro de téléphone"
                  type="tel"
                  name="tel"
                  required
                  autoComplete="tel"
                />
              </label>
              <label>
                <input placeholder="Email" type="email" name="email" required autoComplete="name" />
              </label>
              <label>
                <textarea
                  placeholder="Que pouvons-nous faire pour vous ?"
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
                <span>
                  <LuMapPin size={32}/>
                </span>
                <p>Cliquez ici pour charger la carte</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(NousTrouver);
