'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/post';

interface PostGridProps {
  posts: Post[];
}

export default function PostGrid({ posts }: PostGridProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full" style={{ padding: '80px 0' }}>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="block w-full mb-20 select-none"
        >
          {post.postType === 'text' ? (
            // Text post - square with centered text
            <div 
              className="w-full aspect-square flex items-center justify-center bg-white border border-black"
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
            // Media post - full width, natural aspect ratio
            <div className="relative w-full">
              <Image
                src={post.media?.[0]?.src || ''}
                alt={post.media?.[0]?.alt || post.title}
                width={1200}
                height={800}
                className="w-full h-auto object-contain"
                style={{ maxWidth: '100%', height: 'auto' }}
                sizes="100vw"
              />
            </div>
          )}
          <p 
            className="text-xs uppercase tracking-[0.08em] font-normal text-center font-mono"
            style={{ marginTop: '16px' }}
          >
            {post.code}
          </p>
        </Link>
      ))}
    </div>
  );
}
