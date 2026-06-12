import React, { useState } from "react";
import "../styles/marques.css";

// Tous les logos du dossier, résolus au build (URL hashée + optimisation Vite)
const LOGOS = import.meta.glob<string>("../img/marques/*.webp", {
  eager: true,
  import: "default",
});

interface Marque {
  file: string;
  title: string;
  href: string;
}

// Ajouter une marque : déposer le webp dans img/marques/ + une ligne ici
const MARQUES: Marque[] = [
  { file: "whistler.webp", title: "Whistler Hills", href: "https://www.adcl.fr/whistler-hills" },
  { file: "paragraphe.webp", title: "Paragraphe", href: "https://www.facebook.com/profile.php?id=100054421093253" },
  { file: "woodys.webp", title: "Woodys", href: "https://woodyseyewear.com/fr/" },
  { file: "Ray-Ban_logo.svg.webp", title: "Ray-Ban", href: "https://www.ray-ban.com/france" },
  { file: "nafnaf.webp", title: "Naf Naf", href: "https://www.nafnaf.com/" },
  { file: "xaviergarcia.webp", title: "Xavier Garcia", href: "https://www.xaviergarcia.design/" },
  { file: "vogue.webp", title: "Vogue Eyewear", href: "https://www.vogue-eyewear.com/fr" },
  { file: "ripcurl.webp", title: "Rip Curl", href: "https://www.ripcurl.eu/fr/mens/sunglasses.html" },
  { file: "armani.webp", title: "Emporio Armani", href: "https://www.armani.com/fr-fr/emporio-armani/homme/lunettes/lunettes-de-soleil" },
  { file: "ralphlauren.webp", title: "Ralph Lauren", href: "https://www.ralphlauren.fr/fr/femmes/accessoires/lunettes-de-soleil/20305" },
  { file: "stepper.webp", title: "Stepper", href: "https://www.steppereyewear.com/fr/" },
  { file: "mauboussin.webp", title: "Mauboussin", href: "https://www.mauboussin-eyewear.com/" },
  { file: "morel.webp", title: "Koali", href: "https://morel-france.com/en/collections/koali" },
  { file: "kaleos.webp", title: "Kaleos", href: "https://kaleoscollection.com/fr_FR/" },
  { file: "Logo-bensimon.webp", title: "Bensimon", href: "https://www.bensimon.com/" },
  { file: "seiko.webp", title: "SeikoVision", href: "https://www.seikovision.com/fr/montures/seiko/" },
  { file: "airlight.webp", title: "Airlight", href: "https://www.airlight.com/" },
  { file: "vistan.webp", title: "Vistan", href: "https://vistan-brillen.de/fr" },
  { file: "invu.webp", title: "INVU", href: "https://www.invushop.com/fr-ch/" },
  { file: "lacost.webp", title: "Lacoste", href: "https://www.lacoste.com/fr/lacoste/homme/accessoires/lunettes-de-soleil/" },
];

interface ListeProps {
  clone?: boolean;
}

// Le bandeau contient la liste deux fois pour boucler sans rupture ;
// la copie est invisible pour les lecteurs d'écran et le clavier
const ListeMarques = ({ clone = false }: ListeProps) => (
  <ul className="marqueeListe" aria-hidden={clone || undefined}>
    {MARQUES.map((marque) => (
      <li key={marque.title}>
        <a
          href={marque.href}
          target="_blank"
          rel="noopener noreferrer"
          title={marque.title}
          tabIndex={clone ? -1 : undefined}
        >
          {/* Pas de loading="lazy" : tous les logos défilent dans le
              viewport, le lazy ne ferait que du pop-in pendant l'animation */}
          <img
            src={LOGOS[`../img/marques/${marque.file}`]}
            alt={`Logo ${marque.title}`}
            width="150"
            height="80"
            decoding="async"
          />
        </a>
      </li>
    ))}
  </ul>
);

function NosMarques() {
  // Le CSS gère la pause au survol et au focus ; le toucher n'a ni l'un
  // ni l'autre de façon fiable, d'où ces deux handlers
  const [touchPaused, setTouchPaused] = useState(false);

  return (
    <section className="nosMarquesContainer" aria-label="Nos marques de lunettes">
      <div
        className={`marquee${touchPaused ? " estEnPause" : ""}`}
        onTouchStart={() => setTouchPaused(true)}
        onTouchEnd={() => setTouchPaused(false)}
        onTouchCancel={() => setTouchPaused(false)}
      >
        <div className="marqueeTrack">
          <ListeMarques />
          <ListeMarques clone />
        </div>
      </div>
    </section>
  );
}

export default React.memo(NosMarques);
