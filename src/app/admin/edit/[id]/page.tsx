'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    content: '',
    mediaSrc: '',
    mediaAlt: '',
    tags: '',
    status: 'draft' as 'published' | 'draft',
  });

  useEffect(() => {
    if (params.id) {
      const foundPost = storage.getPost(params.id as string);
      if (foundPost) {
        setPost(foundPost);
        setFormData({
          code: foundPost.code,
          title: foundPost.title,
          content: foundPost.content || '',
          mediaSrc: foundPost.media[0]?.src || '',
          mediaAlt: foundPost.media[0]?.alt || '',
          tags: foundPost.tags?.join(', ') || '',
          status: foundPost.status,
        });
      }
    }
  }, [params.id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!post || !formData.code || !formData.title || !formData.mediaSrc) {
      alert('code, title, and at least one media item are required');
      return;
    }

    storage.updatePost(post.id, {
      code: formData.code,
      title: formData.title,
      content: formData.content || undefined,
      media: [{ src: formData.mediaSrc, alt: formData.mediaAlt || formData.title }],
      status: formData.status,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
    });

    router.push('/admin');
  };

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
      <div className="pt-12 max-w-[640px] mx-auto p-4">
        <h1 className="text-2xl mb-6 pb-4 border-b border-black">edit post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1 opacity-60">code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="w-full px-3 py-2 border border-black bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1 opacity-60">title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border border-black bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1 opacity-60">content</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-3 py-2 border border-black bg-white text-black resize-none"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 opacity-60">media url *</label>
            <input
              type="url"
              value={formData.mediaSrc}
              onChange={(e) => setFormData({ ...formData, mediaSrc: e.target.value })}
              className="w-full px-3 py-2 border border-black bg-white text-black"
              required
            />
          </div>

          <div>
            <label className="block text-xs mb-1 opacity-60">media alt text</label>
            <input
              type="text"
              value={formData.mediaAlt}
              onChange={(e) => setFormData({ ...formData, mediaAlt: e.target.value })}
              className="w-full px-3 py-2 border border-black bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 opacity-60">tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-black bg-white text-black"
            />
          </div>

          <div>
            <label className="block text-xs mb-1 opacity-60">status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
              className="w-full px-3 py-2 border border-black bg-white text-black"
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-black text-white hover:opacity-80 transition-opacity"
            >
              save changes
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-4 py-3 border border-black hover:bg-black hover:text-white transition-colors"
            >
              cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
