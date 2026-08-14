'use client';

import { useState, FormEvent, ChangeEvent, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';
import Image from 'next/image';

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postType, setPostType] = useState<'media' | 'text'>('media');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    content: '',
    mediaSrc: '',
    mediaAlt: '',
    textSize: 'medium' as 'small' | 'medium' | 'large',
    tags: '',
    status: 'draft' as 'published' | 'draft',
  });

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
          // Calculate new dimensions (max 2048px width)
          let width = img.width;
          let height = img.height;
          const maxWidth = 2048;
          
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Convert to base64 with quality compression
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const compressed = await compressImage(file);
    setImagePreview(compressed);
    setFormData({ ...formData, mediaSrc: compressed, mediaAlt: file.name });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!formData.code || !formData.title) {
      alert('code and title are required');
      return;
    }

    if (postType === 'media' && !formData.mediaSrc) {
      alert('please select a photo for media posts');
      return;
    }

    if (postType === 'text' && !formData.content) {
      alert('please enter content for text posts');
      return;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      code: formData.code,
      title: formData.title,
      content: formData.content || undefined,
      postType: postType,
      media: postType === 'media' ? [{ src: formData.mediaSrc, alt: formData.mediaAlt || formData.title }] : undefined,
      textSize: postType === 'text' ? formData.textSize : undefined,
      status: formData.status,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : undefined,
      createdAt: new Date().toISOString(),
    };

    storage.addPost(newPost);
    router.push('/admin');
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="pt-12 max-w-[640px] mx-auto p-4">
        <h1 className="text-2xl mb-6 pb-4 border-b border-black">new post</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs mb-1 opacity-60">post type</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPostType('media')}
                className={`flex-1 px-4 py-2 border border-black transition-colors ${
                  postType === 'media' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                media
              </button>
              <button
                type="button"
                onClick={() => setPostType('text')}
                className={`flex-1 px-4 py-2 border border-black transition-colors ${
                  postType === 'text' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                text
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs mb-1 opacity-60">code *</label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="jb-001"
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
              placeholder="post title"
              className="w-full px-3 py-2 border border-black bg-white text-black"
              required
            />
          </div>

          {postType === 'text' && (
            <>
              <div>
                <label className="block text-xs mb-1 opacity-60">content *</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="post content..."
                  rows={6}
                  className="w-full px-3 py-2 border border-black bg-white text-black resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs mb-1 opacity-60">text size</label>
                <select
                  value={formData.textSize}
                  onChange={(e) => setFormData({ ...formData, textSize: e.target.value as 'small' | 'medium' | 'large' })}
                  className="w-full px-3 py-2 border border-black bg-white text-black"
                >
                  <option value="small">small (14px)</option>
                  <option value="medium">medium (18px)</option>
                  <option value="large">large (24px)</option>
                </select>
              </div>
            </>
          )}

          {postType === 'media' && (
            <>
              <div>
                <label className="block text-xs mb-1 opacity-60">photo *</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full px-4 py-3 border border-black bg-white text-black hover:bg-black hover:text-white transition-colors text-xs"
                >
                  select from photos
                </button>
                
                {imagePreview && (
                  <div className="mt-4 relative w-full aspect-square border border-black">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs mb-1 opacity-60">media alt text</label>
                <input
                  type="text"
                  value={formData.mediaAlt}
                  onChange={(e) => setFormData({ ...formData, mediaAlt: e.target.value })}
                  placeholder="image description"
                  className="w-full px-3 py-2 border border-black bg-white text-black"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs mb-1 opacity-60">tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="new, text, media, links"
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
              create post
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
