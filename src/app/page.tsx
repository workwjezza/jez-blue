'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PostGrid from '@/components/PostGrid';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    storage.initializeMockData();
    const publishedPosts = storage.getPosts()
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); // Reverse chronological
    setPosts(publishedPosts);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div style={{ paddingTop: 'calc(56px + env(safe-area-inset-top))' }}>
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
