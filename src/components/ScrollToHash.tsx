import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Fait défiler la page vers l'ancre de l'URL, en réessayant le temps
// que les sections chargées en lazy soient montées dans le DOM
function ScrollToHash() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    let attempts = 0;
    const interval = setInterval(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        clearInterval(interval);
      } else if (++attempts > 50) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [location]);

  return null;
}

export default ScrollToHash;
