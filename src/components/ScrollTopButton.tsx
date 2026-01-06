import React, { useState, useEffect } from "react";
import { MdArrowUpward } from "react-icons/md";
import "../styles/scrolltop.css";

const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        if (!isVisible) setIsVisible(true);
      } else {
        if (isVisible) setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isVisible]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <div className="scroll-top-wrapper">
      <button
        onClick={scrollToTop}
        className="scroll-top-button"
        aria-label="scroll back to top"
      >
        <MdArrowUpward size={24} />
      </button>
    </div>
  );
};

export default React.memo(ScrollTopButton);
