'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

interface MediaItem {
  src: string;
  alt: string;
  type?: 'image' | 'text';
  content?: string;
}

interface SwipeableMediaProps {
  media: MediaItem[];
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

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full flex"
        style={{
          overflowX: 'scroll',
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          maxHeight: '70vh',
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
            className="relative flex-shrink-0 w-full flex items-center justify-center"
            style={{
              flex: '0 0 100%',
              scrollSnapAlign: 'center',
              maxHeight: '70vh',
            }}
          >
            {item.type === 'text' ? (
              <div 
                className="w-full flex items-center justify-center bg-white"
                style={{ padding: '48px 32px' }}
              >
                <p 
                  className="text-center lowercase font-mono"
                  style={{
                    fontSize: '18px',
                    lineHeight: '1.4'
                  }}
                >
                  {item.content}
                </p>
              </div>
            ) : (
              <div className="relative w-full flex items-center justify-center" style={{ padding: '0 20px', maxHeight: '70vh' }}>
                <div className="relative w-full" style={{ maxHeight: '70vh' }}>
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1200}
                    height={1600}
                    className="w-full h-auto"
                    style={{ objectFit: 'contain', maxHeight: '70vh' }}
                    priority={index === 0}
                    sizes="calc(100vw - 40px)"
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {media.length > 1 && (
        <div className="flex justify-center gap-2" style={{ paddingTop: '40px', paddingBottom: '16px' }}>
          {media.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const container = containerRef.current;
                if (!container) return;
                const itemWidth = container.offsetWidth;
                container.scrollTo({
                  left: index * itemWidth,
                  behavior: 'smooth'
                });
              }}
              className="rounded-full transition-colors select-none user-select-none"
              style={{
                width: '6px',
                height: '6px',
                backgroundColor: index === currentIndex ? '#000' : '#CCCCCC',
              }}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </>
  );
}
