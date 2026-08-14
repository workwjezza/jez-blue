'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import PostGrid from '@/components/PostGrid';
import { storage } from '@/lib/storage';
import type { Post, PostCategory } from '@/types/post';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState<PostCategory | 'all'>('all');

  useEffect(() => {
    storage.initializeMockData();
    setPosts(storage.getPosts().filter(p => p.status === 'published'));
  }, []);

  // Filter by post type instead of tags
  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : activeCategory === 'new'
    ? posts.slice(0, 10) // Show latest 10 posts for "new"
    : posts.filter(post => post.postType === activeCategory || (activeCategory === 'links' && post.postType === 'link'));

  return (
    <div className="min-h-screen bg-white">
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
      />
      <div className="pt-12">
        <PostGrid posts={filteredPosts} />
      </div>
    </div>
  );
}
