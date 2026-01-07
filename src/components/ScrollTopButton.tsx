import React, { useState, useEffect } from "react";
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
        <svg
          stroke="currentColor"
          fill="currentColor"
          strokeWidth="0"
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m4 12 1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z"></path>
        </svg>
      </button>
    </div>
  );
};

export default React.memo(ScrollTopButton);
