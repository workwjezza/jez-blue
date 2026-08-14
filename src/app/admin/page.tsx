'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    setPosts(storage.getPosts());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm('delete this post?')) {
      storage.deletePost(id);
      setPosts(storage.getPosts());
    }
  };

  const toggleStatus = (id: string, currentStatus: 'published' | 'draft') => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    storage.updatePost(id, { status: newStatus });
    setPosts(storage.getPosts());
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-12 max-w-[640px] mx-auto p-4">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-black">
          <h1 className="text-2xl">admin</h1>
          <Link
            href="/admin/new"
            className="w-10 h-10 border border-black hover:bg-black hover:text-white transition-colors flex items-center justify-center text-xl"
          >
            +
          </Link>
        </div>

        <div className="space-y-px bg-black">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs opacity-60">{post.code}</span>
                  <span
                    className={`text-xs px-2 py-0.5 border border-black ${
                      post.status === 'published' ? 'bg-black text-white' : ''
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="text-sm truncate">{post.title}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                  onClick={() => toggleStatus(post.id, post.status)}
                  className="text-xs py-3 sm:py-2 sm:px-3 border border-black hover:bg-black hover:text-white transition-colors"
                >
                  {post.status === 'published' ? 'unpublish' : 'publish'}
                </button>
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="text-xs py-3 sm:py-2 sm:px-3 border border-black hover:bg-black hover:text-white transition-colors text-center"
                >
                  edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs py-3 sm:py-2 sm:px-3 border border-black hover:bg-black hover:text-white transition-colors"
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm opacity-60">no posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
