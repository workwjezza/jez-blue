'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';

export default function AdminPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const router = useRouter();

  useEffect(() => {
    setPosts(storage.getPosts());
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/admin/login');
  };

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
      <header 
        className="fixed top-0 left-0 right-0 z-[100]" 
        style={{ 
          paddingTop: 'env(safe-area-inset-top)',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <div className="flex items-center justify-between h-[56px] px-5">
          <div className="flex items-center gap-3">
            <Link 
              href="/" 
              className="text-base hover:opacity-50 transition-opacity"
              style={{
                minWidth: '44px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ←
            </Link>
            <h1 className="text-sm lowercase font-mono">admin</h1>
            <button
              onClick={handleLogout}
              className="text-xs lowercase font-mono hover:opacity-50 transition-opacity"
            >
              logout
            </button>
          </div>
          <Link 
            href="/" 
            className="text-sm hover:opacity-50 transition-opacity"
            style={{
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ☰
          </Link>
        </div>
      </header>

      <div style={{ paddingTop: 'calc(56px + env(safe-area-inset-top))', padding: '0 20px' }}>
        <div style={{ paddingTop: '40px' }}>
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white"
              style={{ marginBottom: '32px' }}
            >
              <div style={{ marginBottom: '16px' }}>
                <div className="flex items-center gap-2" style={{ marginBottom: '8px' }}>
                  <span className="text-xs font-mono opacity-60">{storage.formatPostNumber(post.number)}</span>
                  <span
                    className="text-xs font-mono bg-black text-white"
                    style={{ padding: '2px 4px' }}
                  >
                    {post.status}
                  </span>
                </div>
                <p className="text-sm font-mono lowercase truncate">{post.title}</p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => toggleStatus(post.id, post.status)}
                  className="text-xs font-mono lowercase border border-black bg-white hover:bg-black hover:text-white transition-colors"
                  style={{ flex: 1, minHeight: '48px' }}
                >
                  {post.status === 'published' ? 'unpublish' : 'publish'}
                </button>
                <Link
                  href={`/admin/edit/${post.id}`}
                  className="text-xs font-mono lowercase border border-black bg-white hover:bg-black hover:text-white transition-colors flex items-center justify-center"
                  style={{ flex: 1, minHeight: '48px' }}
                >
                  edit
                </Link>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-xs font-mono lowercase border border-black bg-white hover:bg-black hover:text-white transition-colors"
                  style={{ flex: 1, minHeight: '48px' }}
                >
                  delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm font-mono lowercase opacity-60">no posts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
