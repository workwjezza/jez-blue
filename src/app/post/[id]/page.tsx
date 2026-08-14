'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SwipeableMedia from '@/components/SwipeableMedia';
import InformationSection from '@/components/InformationSection';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';

export default function PostDetail() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (params.id) {
      const foundPost = storage.getPost(params.id as string);
      setPost(foundPost || null);
    }
  }, [params.id]);

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm opacity-60">post not found</p>
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
        className="fixed left-6 text-xl z-50 hover:opacity-50 transition-opacity select-none user-select-none"
        style={{ top: 'calc(env(safe-area-inset-top) + 1.5rem)' }}
      >
        ←
      </button>

      {post.postType === 'text' ? (
        <div 
          className="w-full aspect-square flex items-center justify-center bg-white border border-black mx-auto"
          style={{ padding: '40px', maxWidth: '100vw' }}
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
        post.media && <SwipeableMedia media={post.media} />
      )}
      
      <div className="text-center px-6 space-y-4">
        <p className="text-sm uppercase tracking-[0.08em] font-normal font-mono select-none user-select-none">
          {post.code}
        </p>
        <p className="text-xs text-gray-500 select-none user-select-none">
          {formattedDate}
        </p>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="text-[28px] hover:opacity-50 transition-opacity select-none user-select-none"
          style={{ 
            minWidth: '48px',
            minHeight: '48px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label={isSaved ? 'Unsave post' : 'Save post'}
        >
          {isSaved ? '−' : '+'}
        </button>
      </div>

      <InformationSection
        content={post.content}
        createdAt={post.createdAt}
        tags={post.tags}
      />
    </div>
  );
}
