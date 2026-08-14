'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import CategoryFilter from '@/components/CategoryFilter';
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

  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.tags?.includes(activeCategory));

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-12">
        <CategoryFilter 
          activeCategory={activeCategory} 
          onCategoryChange={setActiveCategory} 
        />
        <PostGrid posts={filteredPosts} />
      </div>
    </div>
  );
}
