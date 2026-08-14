'use client';

import type { PostCategory } from '@/types/post';

interface CategoryFilterProps {
  activeCategory: PostCategory | 'all';
  onCategoryChange: (category: PostCategory | 'all') => void;
}

const categories: (PostCategory | 'all')[] = ['all', 'new', 'text', 'media', 'links'];

export default function CategoryFilter({ activeCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="flex gap-4 px-4 py-3 border-b border-black overflow-x-auto">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`text-sm whitespace-nowrap transition-opacity ${
            activeCategory === category ? 'opacity-100' : 'opacity-30 hover:opacity-60'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
