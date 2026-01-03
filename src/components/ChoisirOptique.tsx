import React, { ReactElement } from "react";
import { FaUserMd, FaGlasses } from "react-icons/fa";
import { MdOutlineAccountBalanceWallet, MdOutlineVisibility } from "react-icons/md";

interface Feature {
  icon: ReactElement;
  cls: string;
  title: string;
  text?: string;
  items?: string[];
}

const FEATURES: Feature[] = [
  {
    icon: <FaUserMd />,
    cls: "docteur",
    title: "Des spécialistes à votre écoute",
    text: "Une équipe de professionnels de l'optique pour vous accompagner dans votre choix. Nous choisissons avec vous l'équipement qui vous convient en conformité avec vos besoins esthétiques, optiques et dans le respect de votre budget",
  },
  {
    icon: <FaGlasses />,
    cls: "glasses",
    title: "Un large choix",
    items: [
      'Lentilles journalières et "freshlook colors" en stock magasin',
      "Plus de 1200 montures de marques pour femme, homme et enfant et la deuxième paire à 1€*",
      "OFFRE 100% SANTE: 300 modèles Femmes Hommes et enfants pris en charge à 100%",
    ],
  },
  {
    icon: <MdOutlineVisibility />,
    cls: "services",
    title: "Nos services",
    items: ["Examen de vue*", "Remise en état et nettoyage", "Ajustage de vos lunettes"],
  },
  {
    icon: <MdOutlineAccountBalanceWallet />,
    cls: "glasses",
    title: "Paiement sur mesure",
    items: [
      "Nous vous proposons un paiement en 3 ou 4 fois sans frais en carte bancaire avec notre partenaire ONEY*",
      "Un paiement en plusieurs chèques est également possible*",
    ],
  },
];

const ChoisirOptique = () => {
  return (
    <section id="decouvrir" className="choisirOptiqueChatenaySection">
      <div className="choisirOptiqueContainer">
        <div className="textChoisirOptique">
          <div className="titreChoisirOptique">
            <h2 className="choisirOptiqueh2">
              Pourquoi choisir <b>Optique Chatenay ?</b>
            </h2>
          </div>
          {FEATURES.map((f, i) => (
            <div className="paragrapheTextChoisir" key={i}>
              <div className="paragraphe1">
                <span className={f.cls}>{f.icon}</span>
                <h3 className="rose">{f.title}</h3>
              </div>
              <div className="liste">
                <ul>
                  {f.text ? <li>{f.text}</li> : f.items?.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
        <div className="imagesContainerChoisir">
          <div className="imagesCadreContainer">
            <div className="imagesLargeContainer">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/ImagesHorizon%2FImagesHorizon_IMG-20221116-WA0001.webp?alt=media"
                alt="Intérieur magasin"
                className="zoomed"
                loading="lazy"
              />
            </div>
            <div className="imageNormContainer">
              <img
                src="https://firebasestorage.googleapis.com/v0/b/optiquechatenay-44520.appspot.com/o/ImagesHorizon%2Fimage_2026-01-04_000751218.webp?alt=media"
                alt="Présentoir"
                className="zoomed2"
                loading="lazy"
              />
            </div>
          </div>
          <div className="rondRoseContainer">
            <div className="rondRose3"></div>
          </div>
        </div>
      </div>
      <div className="voirConditions">
        <p>Voir conditions en magasin *</p>
      </div>
    </section>
  );
};

export default React.memo(ChoisirOptique);
