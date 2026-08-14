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

  return (
    <div className="min-h-screen bg-white">
      <button
        onClick={() => router.push('/')}
        className="fixed left-6 text-xl z-50 hover:opacity-50 transition-opacity select-none"
        style={{ top: 'calc(env(safe-area-inset-top) + 1.5rem)' }}
      >
        ←
      </button>

      <SwipeableMedia media={post.media} />
      
      <div className="text-center px-6 py-6 space-y-3">
        <p className="text-xs uppercase tracking-[0.08em] font-normal select-none">{post.code}</p>
        <h1 className="text-sm tracking-[0.02em] font-normal">{post.title}</h1>
        <button
          onClick={() => setIsSaved(!isSaved)}
          className="text-2xl hover:opacity-50 transition-opacity select-none"
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
