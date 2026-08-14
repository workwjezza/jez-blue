'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface SwipeableMediaProps {
  media: { src: string; alt: string }[];
}

export default function SwipeableMedia({ media }: SwipeableMediaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const itemWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / itemWidth);
      setCurrentIndex(newIndex);
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToIndex = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    
    const itemWidth = container.offsetWidth;
    container.scrollTo({
      left: index * itemWidth,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full overflow-x-scroll overflow-y-hidden flex"
        style={{
          height: '60vh',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        {media.map((item, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-full h-full flex items-center justify-center"
            style={{
              scrollSnapAlign: 'center',
              padding: '0 15%'
            }}
          >
            <div className="relative w-full h-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain"
                priority={index === 0}
                sizes="70vw"
              />
            </div>
          </div>
        ))}
      </div>
      
      {media.length > 1 && (
        <div className="flex justify-center gap-2 py-6">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className="rounded-full transition-colors select-none user-select-none"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: index === currentIndex ? '#000' : '#CCCCCC',
              }}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
