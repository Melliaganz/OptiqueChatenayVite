import React from "react";
import logoalthigh from "../img/logoaltHighlyCompressed.webp";

function Header() {
  return (
    <header className="header">
      <a
        className="logo"
        href="/#accueil"
        aria-label="Retour à l'accueil"
        rel="home"
      >
        <img
          src={logoalthigh}
          className="header-logo-img"
          alt="logo Optique Chatenay"
          title="Accueil"
          loading="eager"
          fetchPriority="high"
          width="96" 
          height="19" 
        />
      </a>
    </header>
  );
}

export default React.memo(Header);
