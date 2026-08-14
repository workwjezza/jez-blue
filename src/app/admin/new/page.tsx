'use client';

import { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedImages, setSelectedImages] = useState<{ src: string; alt: string }[]>([]);
  const [textCards, setTextCards] = useState<TextCard[]>([{ id: '1', content: '' }]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [activeCardIndex, setActiveCardIndex] = useState(0);

  useEffect(() => {
    // Auto-focus the textarea on mount
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

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
    const remainingSlots = maxFiles - selectedImages.length;
    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    const compressedImages = await Promise.all(
      filesToProcess.map(async (file) => {
        const compressed = await compressImage(file);
        return { src: compressed, alt: '' };
      })
    );
    
    setSelectedImages([...selectedImages, ...compressedImages]);
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

  const removeImage = (index: number) => {
    const newImages = [...selectedImages];
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  const handleTextChange = (value: string) => {
    const newCards = [...textCards];
    newCards[activeCardIndex].content = value;

    // Auto-split if over 300 characters
    if (value.length > 300) {
      const overflow = value.slice(300);
      newCards[activeCardIndex].content = value.slice(0, 300);
      
      // Add overflow to next card or create new one
      if (activeCardIndex + 1 < newCards.length) {
        newCards[activeCardIndex + 1].content = overflow + newCards[activeCardIndex + 1].content;
      } else {
        newCards.push({ id: `${Date.now()}`, content: overflow });
      }
      setActiveCardIndex(activeCardIndex + 1);
    }

    setTextCards(newCards);
  };

  const handleAddTextCard = () => {
    // Save current card and create a new one
    const newCards = [...textCards];
    newCards.push({ id: `${Date.now()}`, content: '' });
    setTextCards(newCards);
    setActiveCardIndex(newCards.length - 1);
    
    // Focus the textarea after state update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleSubmit = () => {
    const hasContent = textCards.some(card => card.content.trim()) || selectedImages.length > 0;
    
    if (!hasContent) {
      return;
    }

    const postNumber = storage.getNextPostNumber();
    const formattedNumber = storage.formatPostNumber(postNumber);

    // Auto-generate alt text for images
    const mediaWithAlt = selectedImages.map((img, index) => ({
      src: img.src,
      alt: `${formattedNumber} image ${index + 1}`
    }));

    // Determine post type
    let postType: 'media' | 'text' | 'link' = 'text';
    let content = '';
    let media = undefined;

    if (selectedImages.length > 0 && textCards.every(card => !card.content.trim())) {
      // Media only
      postType = 'media';
      media = mediaWithAlt;
    } else if (selectedImages.length === 0 && textCards.some(card => card.content.trim())) {
      // Text only
      postType = 'text';
      content = textCards.map(card => card.content).filter(c => c.trim()).join('\n\n');
    } else if (selectedImages.length > 0 && textCards.some(card => card.content.trim())) {
      // Mixed - treat as media with text cards
      postType = 'media';
      const textContent = textCards.map(card => card.content).filter(c => c.trim()).join('\n\n');
      content = textContent;
      media = mediaWithAlt;
    }

    const newPost: Post = {
      id: Date.now().toString(),
      number: postNumber,
      title: `post ${formattedNumber}`,
      content: content || undefined,
      postType: postType,
      media: media,
      status: 'published',
      createdAt: new Date().toISOString(),
    };

    storage.addPost(newPost);
    router.push('/');
  };

  const hasContent = textCards.some(card => card.content.trim()) || selectedImages.length > 0;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Fixed top bar */}
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
          <button
            onClick={() => router.push('/admin')}
            className="text-xs lowercase font-mono hover:opacity-50 transition-opacity"
          >
            cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!hasContent}
            className="lowercase font-mono text-xs text-white transition-opacity"
            style={{
              background: hasContent ? '#000' : '#CCCCCC',
              padding: '8px 20px',
              borderRadius: '20px',
            }}
          >
            post
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div 
        className="flex-1"
        style={{ 
          paddingTop: 'calc(56px + env(safe-area-inset-top))',
          paddingBottom: selectedImages.length > 0 ? 'calc(140px + env(safe-area-inset-bottom))' : 'calc(80px + env(safe-area-inset-bottom))',
        }}
      >
        <div style={{ position: 'relative' }}>
          <textarea
            ref={textareaRef}
            value={textCards[activeCardIndex]?.content || ''}
            onChange={(e) => handleTextChange(e.target.value)}
            placeholder="what is happening"
            className="w-full font-mono lowercase resize-none"
            style={{
              padding: '20px',
              paddingBottom: '60px',
              fontSize: '18px',
              lineHeight: '1.4',
              border: 'none',
              outline: 'none',
              background: 'transparent',
              minHeight: '200px',
            }}
          />
          
          {/* Character counter and add card button */}
          <div className="px-5 flex items-center justify-between" style={{ marginTop: '-40px', position: 'relative', zIndex: 1 }}>
            <div style={{ flex: 1 }} />
            <div className="flex items-center gap-3">
              {textCards[activeCardIndex]?.content && (
                <span className="text-[11px] font-mono" style={{ color: '#999999' }}>
                  {textCards[activeCardIndex].content.length}/300
                </span>
              )}
              <button
                onClick={handleAddTextCard}
                className="text-base hover:opacity-50 transition-opacity"
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                aria-label="Add new text card"
              >
                +
              </button>
            </div>
          </div>
        </div>
        
        {/* Text card indicators */}
        {textCards.length > 1 && (
          <div className="flex justify-center gap-2 px-5" style={{ marginTop: '16px' }}>
            {textCards.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveCardIndex(index)}
                className="rounded-full transition-colors"
                style={{
                  width: '6px',
                  height: '6px',
                  backgroundColor: index === activeCardIndex ? '#000' : '#CCCCCC',
                }}
                aria-label={`Edit card ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom toolbar with thumbnail strip */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-black"
        style={{ 
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Thumbnail strip */}
        {selectedImages.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto px-5 py-3 border-b border-black">
            <div className="flex gap-2">
              {selectedImages.map((img, index) => (
                <div
                  key={index}
                  draggable
                  onDragStart={(e) => handleImageDragStart(e, index)}
                  onDragOver={handleImageDragOver}
                  onDrop={(e) => handleImageDrop(e, index)}
                  className="relative flex-shrink-0 cursor-move"
                  style={{ width: '80px', height: '80px' }}
                >
                  <Image
                    src={img.src}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-5 h-5 bg-black text-white flex items-center justify-center text-xs font-mono"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <span className="text-xs font-mono whitespace-nowrap" style={{ color: '#999999' }}>
              {selectedImages.length}/20
            </span>
          </div>
        )}

        {/* Photo picker button */}
        <div className="flex items-center px-5 py-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="hover:opacity-50 transition-opacity"
            disabled={selectedImages.length >= 20}
            style={{
              minWidth: '44px',
              minHeight: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" />
              <circle cx="8.5" cy="8.5" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
