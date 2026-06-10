import { useEffect } from "react";

export const DEFAULT_TITLE = "Optique Châtenay - Votre Opticien à Châtenay-Malabry";

// Titre d'onglet propre à chaque route (SEO et lisibilité des onglets)
export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | Optique Châtenay` : DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}
