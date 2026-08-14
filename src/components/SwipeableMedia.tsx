'use client';

import { useState, useRef, TouchEvent } from 'react';
import Image from 'next/image';

interface SwipeableMediaProps {
  media: { src: string; alt: string }[];
}

export default function SwipeableMedia({ media }: SwipeableMediaProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(0);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentIndex < media.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
    if (isRightSwipe && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full aspect-square overflow-hidden"
        style={{ touchAction: 'pan-y' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex transition-transform duration-300 ease-out h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {media.map((item, index) => (
            <div key={index} className="relative min-w-full h-full">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-cover"
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>
      
      {media.length > 1 && (
        <div className="flex justify-center gap-2 py-6">
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className="w-1.5 h-1.5 rounded-full transition-colors select-none"
              style={{
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
