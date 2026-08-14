'use client';

import { useState, FormEvent, ChangeEvent, useRef, DragEvent } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { storage } from '@/lib/storage';
import type { Post } from '@/types/post';
import Image from 'next/image';

interface TextCard {
  id: string;
  content: string;
}

export default function NewPostPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postType, setPostType] = useState<'media' | 'text' | 'link'>('media');
  const [selectedImages, setSelectedImages] = useState<{ src: string; alt: string }[]>([]);
  const [textCards, setTextCards] = useState<TextCard[]>([{ id: '1', content: '' }]);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkDescription, setLinkDescription] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [status, setStatus] = useState<'published' | 'draft'>('draft');

  const compressImage = async (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;
          
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
          
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const maxFiles = 20;
    const filesToProcess = Array.from(files).slice(0, maxFiles);
    
    const compressedImages = await Promise.all(
      filesToProcess.map(async (file) => {
        const compressed = await compressImage(file);
        return { src: compressed, alt: '' }; // alt will be auto-generated on submit
      })
    );
    
    setSelectedImages(compressedImages);
  };

  const handleImageDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleImageDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleImageDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const newImages = [...selectedImages];
    const draggedImage = newImages[draggedIndex];
    newImages.splice(draggedIndex, 1);
    newImages.splice(dropIndex, 0, draggedImage);
    
    setSelectedImages(newImages);
    setDraggedIndex(null);
  };

  const handleTextChange = (cardId: string, value: string) => {
    const cardIndex = textCards.findIndex(c => c.id === cardId);
    if (cardIndex === -1) return;

    const newCards = [...textCards];
    newCards[cardIndex].content = value;

    // Auto-split if over 300 characters
    if (value.length > 300) {
      const overflow = value.slice(300);
      newCards[cardIndex].content = value.slice(0, 300);
      
      // Add overflow to next card or create new one
      if (cardIndex + 1 < newCards.length) {
        newCards[cardIndex + 1].content = overflow + newCards[cardIndex + 1].content;
      } else {
        newCards.push({ id: `${cardIndex + 1}-${value.length}`, content: overflow });
      }
    }

    setTextCards(newCards);
  };

  const handleTextCardDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleTextCardDrop = (e: DragEvent<HTMLDivElement>, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null) return;
    
    const newCards = [...textCards];
    const draggedCard = newCards[draggedIndex];
    newCards.splice(draggedIndex, 1);
    newCards.splice(dropIndex, 0, draggedCard);
    
    setTextCards(newCards);
    setDraggedIndex(null);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (postType === 'media' && selectedImages.length === 0) {
      alert('please select at least one photo for media posts');
      return;
    }

    if (postType === 'text' && textCards.every(card => !card.content.trim())) {
      alert('please enter content for text posts');
      return;
    }

    if (postType === 'link' && !linkUrl.trim()) {
      alert('please enter a url for link posts');
      return;
    }

    const postNumber = storage.getNextPostNumber();
    const formattedNumber = storage.formatPostNumber(postNumber);

    // Auto-generate alt text for images
    const mediaWithAlt = selectedImages.map((img, index) => ({
      src: img.src,
      alt: `${formattedNumber} image ${index + 1}`
    }));

    // Combine text cards into content
    const textContent = textCards.map(card => card.content).join('\n\n');

    const newPost: Post = {
      id: Date.now().toString(),
      number: postNumber,
      title: postType === 'link' ? linkDescription || linkUrl : `post ${formattedNumber}`,
      content: postType === 'text' ? textContent : (postType === 'link' ? linkUrl : undefined),
      postType: postType,
      media: postType === 'media' ? mediaWithAlt : undefined,
      status: status,
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
              <button
                type="button"
                onClick={() => setPostType('link')}
                className={`flex-1 px-4 py-2 border border-black transition-colors ${
                  postType === 'link' ? 'bg-black text-white' : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                link
              </button>
            </div>
          </div>

          {postType === 'media' && (
            <div>
              <label className="block text-xs mb-1 opacity-60">photos (up to 20)</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
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
              
              {selectedImages.length > 0 && (
                <>
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                    {selectedImages.map((img, index) => (
                      <div
                        key={index}
                        draggable
                        onDragStart={(e) => handleImageDragStart(e, index)}
                        onDragOver={handleImageDragOver}
                        onDrop={(e) => handleImageDrop(e, index)}
                        className="relative flex-shrink-0 w-20 h-20 cursor-move"
                      >
                        <Image
                          src={img.src}
                          alt={`Preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs opacity-60 mt-2">
                    {selectedImages.length} / 20 photos
                  </p>
                </>
              )}
            </div>
          )}

          {postType === 'text' && (
            <div className="space-y-4">
              {textCards.map((card, index) => (
                <div
                  key={card.id}
                  draggable
                  onDragStart={(e) => handleTextCardDragStart(e, index)}
                  onDragOver={handleImageDragOver}
                  onDrop={(e) => handleTextCardDrop(e, index)}
                  className="cursor-move"
                >
                  <textarea
                    value={card.content}
                    onChange={(e) => handleTextChange(card.id, e.target.value)}
                    placeholder="start typing..."
                    rows={6}
                    className="w-full px-3 py-2 bg-white text-black resize-none"
                    style={{ border: 'none', outline: 'none' }}
                  />
                  <p className="text-xs opacity-60 mt-1">
                    {card.content.length} / 300
                  </p>
                </div>
              ))}
            </div>
          )}

          {postType === 'link' && (
            <>
              <div>
                <label className="block text-xs mb-1 opacity-60">url *</label>
                <input
                  type="url"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2 border border-black bg-white text-black"
                  required
                />
              </div>
              <div>
                <label className="block text-xs mb-1 opacity-60">description</label>
                <input
                  type="text"
                  value={linkDescription}
                  onChange={(e) => setLinkDescription(e.target.value)}
                  placeholder="optional description"
                  className="w-full px-3 py-2 border border-black bg-white text-black"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs mb-1 opacity-60">status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
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
