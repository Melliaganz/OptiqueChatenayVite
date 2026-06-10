import { Link } from "react-router-dom";
import logoalthigh from "../img/logoaltHighlyCompressed.webp";
import "../styles/header.css";

function Header() {
  return (
    <header className="header">
      <Link
        className="logo"
        to="/#accueil"
        aria-label="Retour à l'accueil"
        rel="home"
      >
        <img
          src={logoalthigh}
          className="header-logo-img"
          alt="logo Optique Chatenay"
          title="Accueil"
          width="96" 
          height="19"
          decoding="sync"
          fetchPriority="high"
        />
      </Link>
    </header>
  );
}

export default Header;
