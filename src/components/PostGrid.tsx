'use client';

import { useState, useEffect, useRef, TouchEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/post';

interface PostGridProps {
  posts: Post[];
}

const COLUMN_STORAGE_KEY = 'jez-blue-column-count';

export default function PostGrid({ posts }: PostGridProps) {
  const [columns, setColumns] = useState<1 | 2 | 3>(3);
  const [showIndicator, setShowIndicator] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartDistance = useRef<number>(0);
  const lastChangeTime = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Detect if mobile/touch device
    const checkMobile = () => {
      const mobile = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(mobile);
      
      // Load saved preference or use default
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(COLUMN_STORAGE_KEY);
        if (saved) {
          setColumns(parseInt(saved) as 1 | 2 | 3);
        } else {
          setColumns(mobile ? 2 : 3); // Default mobile: 2 columns
        }
      }
    };
    
    checkMobile();
  }, []);

  const getDistance = (e: TouchEvent) => {
    if (e.touches.length < 2) return 0;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    return Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);
  };

  const changeColumns = (newColumns: 1 | 2 | 3) => {
    const now = Date.now();
    if (now - lastChangeTime.current < 300) return;
    
    setColumns(newColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, newColumns.toString());
    lastChangeTime.current = now;
    
    // Show indicator
    setShowIndicator(true);
    setTimeout(() => setShowIndicator(false), 500);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile || e.touches.length !== 2) return;
    touchStartDistance.current = getDistance(e);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || e.touches.length !== 2 || touchStartDistance.current === 0) return;
    
    const currentDistance = getDistance(e);
    const change = currentDistance - touchStartDistance.current;
    
    if (Math.abs(change) > 50) {
      if (change > 0) {
        // Pinch out - expand
        if (columns === 1) changeColumns(2);
        else if (columns === 2) changeColumns(3);
      } else {
        // Pinch in - collapse
        if (columns === 3) changeColumns(2);
        else if (columns === 2) changeColumns(1);
      }
      touchStartDistance.current = currentDistance;
    }
  };

  const handleTouchEnd = () => {
    touchStartDistance.current = 0;
  };

  const gridClass = columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : 'grid-cols-3';

  return (
    <>
      <div
        ref={containerRef}
        className={`grid ${gridClass} transition-all duration-300 ease-in-out`}
        style={{ 
          touchAction: 'pan-y',
          gap: '80px',
          padding: '80px 40px'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/post/${post.id}`}
            className="flex flex-col items-center select-none"
            style={{ gap: '16px' }}
          >
            <div className="relative w-full aspect-square flex items-center justify-center">
              <div className="relative w-[60%] h-[60%]">
                <Image
                  src={post.media[0].src}
                  alt={post.media[0].alt}
                  fill
                  className="object-contain"
                  sizes={columns === 1 ? '60vw' : columns === 2 ? '30vw' : '20vw'}
                />
              </div>
            </div>
            <p className="text-xs uppercase tracking-[0.08em] font-normal text-center font-mono">
              {post.code}
            </p>
          </Link>
        ))}
      </div>
      
      {showIndicator && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
          <div className="bg-black text-white px-4 py-2 text-xs uppercase tracking-[0.08em] animate-fade">
            {columns} col
          </div>
        </div>
      )}
    </>
  );
}
