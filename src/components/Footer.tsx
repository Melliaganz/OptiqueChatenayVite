import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import LogoOptique from "../img/logoaltHighlyCompressed.webp"; 
import { FaFacebook, FaInstagram } from "react-icons/fa";
import "../styles/footer.css";

function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const currentYear = new Date().getFullYear();

  return (
    <section className='footerSection'>
        <div className='headerFooter'>
          <div className='imageHeaderFooter'>
            <Link 
              to={isHomePage ? "#accueil" : "/"} 
              aria-label="Retour à l'accueil"
            >
              <img 
                src={LogoOptique} 
                className="footer-logo-img"
                alt="Optique Chatenay Logo" 
                width="250"
                height="250"
              />
            </Link>
          </div>

          <div className='headerFooterh3'>
            <h1>Optique Chatenay</h1>
          </div>

          <div className='logoReseaux'>
            <div className='facebook'>
              <a 
                href="https://www.facebook.com/optiquechatenay" 
                target="_blank" 
                rel="noopener noreferrer" 
                title="Suivez-nous sur Facebook"
              >
                <FaFacebook size={24} />
              </a>
            </div>
            <div className='instagram'>
              <a href="https://www.instagram.com/optique.chatenay92/" target="_blank" rel='noopener noreferrer' title="Suivez nous sur instagram">
              <FaInstagram size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className='footerListe'>
          <ul>
            <li className='elementListe1'>
              {isHomePage ? (
                <a href="#accueil">Accueil</a>
              ) : (
                <Link to="/">Accueil</Link>
              )}
            </li>
            <li className='elementListe1'>
              <Link to="/mentions-legales">Mentions légales</Link>
            </li>
            <li className='elementListe5'>
              <Link to="/administration">Administration</Link>
            </li>
            <li className='elementListe4'>
              <Link to="/#contact">Contact</Link>
            </li>
          </ul>
        </div>

        <div className='footerDescription'>
          <p>
            Optique Chatenay est votre opticien de référence à Châtenay-Malabry. 
            Notre équipe de professionnels de la santé visuelle est à votre disposition pour vous aider à trouver les meilleures solutions pour votre vue. 
            Venez nous rendre visite en magasin pour découvrir nos produits de qualité supérieure et bénéficier de nos services personnalisés.
          </p>
        </div>

        <div className='copyrightFooter'>
          <p>
            Powered by 
            <a className='lienLengrandLucas' href="https://www.lengrandlucas.com/" target="_blank" rel="noopener noreferrer"> Lengrand Lucas</a> & 
            <a className='lienHécateStudio' href="https://www.malt.fr/profile/valentinebarbier1" target="_blank" rel="noopener noreferrer"> HecateStudio</a> 
            &copy; {currentYear}
          </p>
        </div>
    </section>
  );
}

export default React.memo(Footer);
