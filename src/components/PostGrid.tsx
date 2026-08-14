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
  const [isMobile, setIsMobile] = useState(false);
  const touchStartDistance = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
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

  const getHorizontalDistance = (e: TouchEvent) => {
    if (e.touches.length < 2) return 0;
    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    // Only measure horizontal distance
    return Math.abs(touch2.clientX - touch1.clientX);
  };

  const changeColumns = (newColumns: 1 | 2 | 3) => {
    const now = Date.now();
    if (now - lastChangeTime.current < 300) return;
    
    setColumns(newColumns);
    localStorage.setItem(COLUMN_STORAGE_KEY, newColumns.toString());
    lastChangeTime.current = now;
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!isMobile || e.touches.length !== 2) return;
    touchStartDistance.current = getHorizontalDistance(e);
    touchStartTime.current = Date.now();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isMobile || e.touches.length !== 2 || touchStartDistance.current === 0) return;
    
    // Check if pinch has been held for minimum duration
    const now = Date.now();
    if (now - touchStartTime.current < 150) return;
    
    // Prevent iOS Safari native zoom
    e.preventDefault();
    
    const currentDistance = getHorizontalDistance(e);
    const change = currentDistance - touchStartDistance.current;
    
    // Increased threshold from 50px to 80px
    if (Math.abs(change) > 80) {
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
    touchStartTime.current = 0;
  };

  const gridClass = columns === 1 ? 'grid-cols-1' : columns === 2 ? 'grid-cols-2' : 'grid-cols-3';
  const gap = columns === 1 ? '0px' : columns === 2 ? '32px' : '24px';

  return (
    <div
      ref={containerRef}
      className={`grid ${gridClass} transition-all duration-300 ease-in-out`}
      style={{ 
        touchAction: 'pan-y',
        gap: gap,
        padding: columns === 1 ? '80px 0' : '80px 40px'
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
          <div 
            className="relative w-full aspect-square flex items-center justify-center"
            style={{
              width: columns === 1 ? '85%' : '100%',
              margin: columns === 1 ? '0 auto' : '0'
            }}
          >
            <Image
              src={post.media[0].src}
              alt={post.media[0].alt}
              fill
              className="object-contain"
              sizes={columns === 1 ? '85vw' : columns === 2 ? '45vw' : '30vw'}
            />
          </div>
          <p className="text-xs uppercase tracking-[0.08em] font-normal text-center font-mono">
            {post.code}
          </p>
        </Link>
      ))}
    </div>
  );
}
