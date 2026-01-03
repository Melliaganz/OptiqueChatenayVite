import React, { useEffect, useState, useCallback, useMemo, ReactNode } from "react";
import { useSwipeable } from "react-swipeable";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";

interface CarouselProps {
  children: ReactNode;
}

export const CarouselMarquesItem = ({ children }: { children: ReactNode }) => {
  return <div className="carouselMarques-item">{children}</div>;
};

const CarouselMarques = ({ children }: CarouselProps) => {
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

  const transformStyle = useMemo(
    () => ({
      transform: `translateX(-${activeIndex * 100}%)`,
    }),
    [activeIndex]
  );

  return (
    <div
      {...handlers}
      className="carouselMarques"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="innerMarques" style={transformStyle}>
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
