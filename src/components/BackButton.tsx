import { Link } from "react-router-dom";
import { MdArrowBackIos } from "react-icons/md";

interface BackButtonProps {
  className?: string;
}

function BackButton({ className = "bouttonRetour" }: BackButtonProps) {
  return (
    <div className={className}>
      <Link to="/" title="Retour à l'accueil">
        <span>
          <MdArrowBackIos />
        </span>
        Retour
      </Link>
    </div>
  );
}

export default BackButton;
