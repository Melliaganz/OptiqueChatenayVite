import React from "react";
import CarouselMarques, { CarouselMarquesItem } from "./CarouselMarques";
import "../styles/marques.css";

import raybanLogo from "../img/marques/Ray-Ban_logo.svg.webp";
import bensimonLogo from "../img/marques/Logo-bensimon.webp";
import airlightLogo from "../img/marques/airlight.webp";
import armaniLogo from "../img/marques/armani.webp";
import invuLogo from "../img/marques/invu.webp";
import lacostLogo from "../img/marques/lacost.webp";
import kaleosLogo from "../img/marques/kaleos.webp";
import mauboussinLogo from "../img/marques/mauboussin.webp";
import morelLogo from "../img/marques/morel.webp";
import nafnafLogo from "../img/marques/nafnaf.webp";
import paragrapheLogo from "../img/marques/paragraphe.webp";
import ralphlaurenLogo from "../img/marques/ralphlauren.webp";
import ripcurlLogo from "../img/marques/ripcurl.webp";
import seikoLogo from "../img/marques/seiko.webp";
import stepperLogo from "../img/marques/stepper.webp";
import vistanLogo from "../img/marques/vistan.webp";
import vogueLogo from "../img/marques/vogue.webp";
import whistlerLogo from "../img/marques/whistler.webp";
import woodysLogo from "../img/marques/woodys.webp";
import xavierGarciaLogo from "../img/marques/xaviergarcia.webp";

interface Marque {
  href: string;
  title: string;
  src: string;
}

const MARQUES_DATA: Marque[][] = [
  [
    { href: "https://www.adcl.fr/whistler-hills", title: "Whistler Hills", src: whistlerLogo },
    { href: "https://www.facebook.com/profile.php?id=100054421093253", title: "Paragraphe", src: paragrapheLogo },
    { href: "https://woodyseyewear.com/fr/", title: "Woodys", src: woodysLogo },
    { href: "https://www.ray-ban.com/france", title: "Ray-Ban", src: raybanLogo },
  ],
  [
    { href: "https://www.nafnaf.com/", title: "Naf Naf", src: nafnafLogo },
    { href: "https://www.xaviergarcia.design/", title: "Xavier Garcia", src: xavierGarciaLogo },
    { href: "https://www.vogue-eyewear.com/fr", title: "Vogue Eyewear", src: vogueLogo },
    { href: "https://www.ripcurl.eu/fr/mens/sunglasses.html", title: "Rip Curl", src: ripcurlLogo },
  ],
  [
    { href: "https://www.armani.com/fr-fr/emporio-armani/homme/lunettes/lunettes-de-soleil", title: "Emporio Armani", src: armaniLogo },
    { href: "https://www.ralphlauren.fr/fr/femmes/accessoires/lunettes-de-soleil/20305", title: "Ralph Lauren", src: ralphlaurenLogo },
    { href: "https://www.steppereyewear.com/fr/", title: "Stepper", src: stepperLogo },
    { href: "https://www.mauboussin-eyewear.com/", title: "Mauboussin", src: mauboussinLogo },
  ],
  [
    { href: "https://morel-france.com/en/collections/koali", title: "Koali", src: morelLogo },
    { href: "https://kaleoscollection.com/fr_FR/", title: "Kaleos", src: kaleosLogo },
    { href: "https://www.bensimon.com/", title: "Bensimon", src: bensimonLogo },
    { href: "https://www.seikovision.com/fr/montures/seiko/", title: "SeikoVision", src: seikoLogo },
  ],
  [
    { href: "https://www.airlight.com/", title: "Airlight", src: airlightLogo },
    { href: "https://vistan-brillen.de/fr", title: "Vistan", src: vistanLogo },
    { href: "https://www.invushop.com/fr-ch/", title: "INVU", src: invuLogo },
    { href: "https://www.lacoste.com/fr/lacoste/homme/accessoires/lunettes-de-soleil/", title: "Lacoste", src: lacostLogo },
  ],
];

function NosMarques() {
  return (
    <section className="nosMarquesContainer">
      <CarouselMarques>
        {MARQUES_DATA.map((group, index) => (
          <CarouselMarquesItem key={index}>
            <div className="carousel-marques-group">
              {group.map((marque) => (
                <a
                  key={marque.title}
                  href={marque.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={marque.title}
                >
                  <img
                    src={marque.src}
                    alt={`Logo ${marque.title}`}
                    width="150"
                    height="80"
                    loading="lazy"
                    decoding="async"
                  />
                </a>
              ))}
            </div>
          </CarouselMarquesItem>
        ))}
      </CarouselMarques>
    </section>
  );
}

export default React.memo(NosMarques);
