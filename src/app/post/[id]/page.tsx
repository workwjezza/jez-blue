'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import SwipeableMedia from '@/components/SwipeableMedia';
import InformationSection from '@/components/InformationSection';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';

export default function PostDetail() {
  const params = useParams();
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
      <div className="min-h-screen">
        <Header />
        <div className="pt-12 flex items-center justify-center h-[calc(100vh-3rem)]">
          <p className="text-sm opacity-60">post not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-12 max-w-[640px] mx-auto">
        <SwipeableMedia media={post.media} />
        
        <div className="text-center py-6 px-4">
          <p className="text-xs opacity-60 mb-1">{post.code}</p>
          <h1 className="text-2xl mb-4">{post.title}</h1>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="w-10 h-10 border border-black hover:bg-black hover:text-white transition-colors text-xl"
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
    </div>
  );
}
