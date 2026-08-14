'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/post';
import { storage } from '@/lib/storage';

interface PostGridProps {
  posts: Post[];
}

interface PostCardProps {
  post: Post;
}

function PostCard({ post }: PostCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchedCardId, setTouchedCardId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchTargetRef = useRef<HTMLDivElement>(null);

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

  const handleTouchStart = () => {
    setTouchedCardId(post.id);
  };

  const handleTouchEnd = () => {
    setTouchedCardId(null);
  };

  // Determine if this post has multiple cards
  const hasMultipleCards = post.media && post.media.length > 1;
  const cards = hasMultipleCards ? post.media : null;

  return (
    <div style={{ marginBottom: '48px' }}>
      <Link
        href={`/post/${post.id}`}
        className="block w-full select-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {hasMultipleCards && cards ? (
          // Multiple cards - horizontal scroll
          <div
            ref={containerRef}
            className="relative w-full flex"
            style={{
              overflowX: 'scroll',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-x',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {cards.map((item, index) => (
              <div
                key={index}
                ref={index === 0 ? touchTargetRef : null}
                className={`relative flex-shrink-0 w-full ${touchedCardId === post.id ? 'glass-effect' : ''}`}
                style={{
                  flex: '0 0 100%',
                  scrollSnapAlign: 'center',
                }}
              >
                <div className="relative w-full">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={1200}
                    height={800}
                    className="w-full h-auto object-contain"
                    style={{ maxWidth: '100%', height: 'auto' }}
                    sizes="calc(100vw - 40px)"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : post.postType === 'text' ? (
          // Single text card
          <div 
            ref={touchTargetRef}
            className={`w-full aspect-square flex items-center justify-center bg-white border border-black ${touchedCardId === post.id ? 'glass-effect' : ''}`}
            style={{ padding: '40px' }}
          >
            <p 
              className="text-center"
              style={{
                fontSize: post.textSize === 'small' ? '14px' : post.textSize === 'large' ? '24px' : '18px',
                lineHeight: '1.4'
              }}
            >
              {post.content}
            </p>
          </div>
        ) : (
          // Single media card
          <div 
            ref={touchTargetRef}
            className={`relative w-full ${touchedCardId === post.id ? 'glass-effect' : ''}`}
          >
            <Image
              src={post.media?.[0]?.src || ''}
              alt={post.media?.[0]?.alt || post.title}
              width={1200}
              height={800}
              className="w-full h-auto object-contain"
              style={{ maxWidth: '100%', height: 'auto' }}
              sizes="calc(100vw - 40px)"
            />
          </div>
        )}
      </Link>
      
      {/* Post number and pagination dots */}
      <div className="text-center" style={{ marginTop: '16px' }}>
        <p className="text-xs uppercase tracking-[0.08em] font-normal font-mono">
          {storage.formatPostNumber(post.number)}
        </p>
        {hasMultipleCards && cards && cards.length > 1 && (
          <div className="flex justify-center gap-2" style={{ marginTop: '8px' }}>
            {cards.map((_, index) => (
              <div
                key={index}
                className="rounded-full"
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: index === currentIndex ? '#000' : '#CCCCCC',
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PostGrid({ posts }: PostGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .glass-effect {
          position: relative;
          backdrop-filter: blur(8px) saturate(1.2);
          -webkit-backdrop-filter: blur(8px) saturate(1.2);
          will-change: backdrop-filter;
          transition: backdrop-filter 300ms ease-out;
        }
        
        .glass-effect::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.1),
            rgba(240, 248, 255, 0.15),
            rgba(255, 240, 245, 0.1),
            rgba(255, 255, 255, 0.1)
          );
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>
      <div className="w-full" style={{ padding: '80px 20px 0 20px', touchAction: 'pan-y' }}>
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}
