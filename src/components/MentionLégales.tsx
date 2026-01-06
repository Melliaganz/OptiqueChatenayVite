import React from "react";
import { MdArrowBackIos } from "react-icons/md";
import { Link } from "react-router-dom";
import "../styles/mentions.css";

function MentionLegales() {
  return (
    <section className="MentionsSection">
      <div className="bouttonRetour">
        <Link to="/" title="Retour à l'accueil">
          <span>
            <MdArrowBackIos />
          </span>
          Retour
        </Link>
      </div>
      <div className="MentionsLegalesTexte">
        <div className="titreMention">
          <h3>Mentions Légales</h3>
        </div>
        <div className="contenuMentionsLegales">
          <div className="titreEtTexteMentions">
            <div className="titreCatégoriesMentions">
              <h2>PROPRIÉTAIRE DU SITE :</h2>
            </div>
            <div className="texteCatégoriesMentions">
              <p className="blocProprietaire">
                Le site OPTIQUE CHATENAY est édité par SAS OPTIQUE CHATENAY,
                <br />
                432 AV DE LA DIVISION LECLERC 92290 CHATENAY MALABRY
                <br />
                SAS au capital de 5000 €<br />
                RCS 820757011
                <br />
                TVA FR56820757011
                <br />
              </p>
              <p className="contactMentions">
                Tél. +33 9 72 57 31 31
                <br />
                Email : optiquechatenay@free.fr
                <br />
              </p>
              <p className="directeur">
                <b>Directeur de la publication :</b> Bernard Deltil
                <br />
              </p>
            </div>
          </div>
          <div className="titreEtTexteMentions">
            <div className="titreCatégoriesMentions">
              <h2>CONCEPTION DU SITE :</h2>
            </div>
            <div className="texteCatégoriesMentions">
              <h4>RÉALISATION TECHNIQUE :</h4>
              <p>Développeur/intégrateur web: Lengrand Lucas</p>
              <p>UX Design: HecateStudio </p>
            </div>
          </div>
          <div className="titreEtTexteMentions">
            <div className="titreCatégoriesMentions">
              <h2>GESTION ET HÉBERGEMENT DU SITE :</h2>
            </div>
            <div className="texteCatégoriesMentions">
              <h4>RESPONSABLE DE LA PUBLICATION :</h4>
              <br />
              <p>Bernard Deltil</p>
              <h4>Hébergeur du site :</h4>
              <b>Lengrand Lucas</b>
              <p>
                24 rue de verville <br />
                91680 Bruyères-le-châtel
              </p>
              <p className="siteLucas">
                <a
                  href="https://www.lengrandlucas.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://www.lengrandlucas.com/
                </a>
              </p>
            </div>
          </div>
          <div className="titreEtTexteMentionsfin">
            <div className="titreCatégoriesMentions">
              <h2>MODE DE RÈGLEMENT DES LITIGES</h2>
            </div>
            <div className="texteCatégoriesMentions">
              <p>
                En cas de litige, nous vous invitons à nous adresser votre
                demande par courrier électronique sur optiquechatenay@free.fr.
                <br />
                Vous pouvez également envoyer votre demande par courrier postal
                à l’adresse :<br />
                OPTIQUE CHATENAY
                <br />
                432 AV DE LA DIVISION LECLERC
                <br />
                92290 CHATENAY MALABRY
                <br />
                Dans le cas où vous n'obtenez pas de réponse satisfaisante à
                votre demande, vous pouvez saisir gratuitement le Médiateur du
                Commerce Coopératif et Associé par :<br />
                - Courrier à l'adresse suivante :<br />
                Médiateur du Commerce Coopératif et Associé - FCA, 77 rue de
                Lourmel à 75015 Paris,
                <br />
                - Ou sur le site internet du Médiateur www.mcca-mediation.fr sur
                lequel se trouvent la Charte de la Médiation du Commerce
                Coopératif et Associé et les pièces justificatives
                <br /> à fournir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default React.memo(MentionLegales);
