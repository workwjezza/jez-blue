'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SwipeableMedia from '@/components/SwipeableMedia';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);

  useEffect(() => {
    if (params.id) {
      const foundPost = storage.getPost(params.id as string);
      setPost(foundPost || null);
    }
  }, [params.id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-60 lowercase font-mono">post not found</p>
      </div>
    );
  }

  const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toLowerCase();

  return (
    <div className="min-h-screen bg-white">
      <button
        onClick={() => router.push('/')}
        className="fixed z-50 hover:opacity-50 transition-opacity select-none user-select-none"
        style={{ 
          top: 'calc(env(safe-area-inset-top) + 14px)',
          left: '20px',
          minWidth: '44px',
          minHeight: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ←
      </button>

      <div style={{ paddingTop: 'calc(56px + env(safe-area-inset-top))' }}>
        {post.postType === 'text' ? (
          <div 
            className="w-full aspect-square flex items-center justify-center bg-white mx-auto"
            style={{ padding: '40px', maxWidth: '100vw', maxHeight: '70vh' }}
          >
            <p 
              className="text-center lowercase font-mono"
              style={{
                fontSize: post.textSize === 'small' ? '14px' : post.textSize === 'large' ? '24px' : '18px',
                lineHeight: '1.4'
              }}
            >
              {post.content}
            </p>
          </div>
        ) : (
          post.media && <SwipeableMedia media={post.media} />
        )}
        
        <div className="text-center px-6" style={{ marginTop: '40px' }}>
          <p className="text-xs uppercase tracking-[0.08em] font-normal font-mono select-none user-select-none">
            {storage.formatPostNumber(post.number)}
          </p>
          <p className="text-xs opacity-60 lowercase font-mono select-none user-select-none" style={{ marginTop: '8px' }}>
            {formattedDate}
          </p>
        </div>
      </div>
    </div>
  );
}
