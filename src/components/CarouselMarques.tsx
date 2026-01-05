import React, { useEffect, useState, useCallback } from "react";
import type { ReactNode } from "react";
import { useSwipeable } from "react-swipeable";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

interface CarouselMarquesItemProps {
  children: ReactNode;
}

export const CarouselMarquesItem = ({ children }: CarouselMarquesItemProps) => {
  return <div className="carouselMarques-item">{children}</div>;
};

interface CarouselMarquesProps {
  children: ReactNode;
}

const CarouselMarques = ({ children }: CarouselMarquesProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [paused, setPaused] = useState<boolean>(false);
  const itemCount = React.Children.count(children);

  const updateIndex = useCallback(
    (newIndex: number) => {
      let index = newIndex;
      if (newIndex < 0) {
        index = itemCount - 1;
      } else if (newIndex >= itemCount) {
        index = 0;
      }
      setActiveIndex(index);
    },
    [itemCount]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) {
        updateIndex(activeIndex + 1);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [paused, activeIndex, updateIndex]);

  const handlers = useSwipeable({
    onSwipedLeft: () => updateIndex(activeIndex + 1),
    onSwipedRight: () => updateIndex(activeIndex - 1),
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className="carouselMarques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div 
        className="innerMarques" 
        data-active-index={activeIndex}
      >
        {children}
      </div>
      <div className="indicators">
        <button
          type="button"
          aria-label="Précédent"
          onClick={() => updateIndex(activeIndex - 1)}
        >
          <IoMdArrowBack size={32} />
        </button>
        <button
          type="button"
          aria-label="Suivant"
          onClick={() => updateIndex(activeIndex + 1)}
        >
          <IoMdArrowForward size={32} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(CarouselMarques);
