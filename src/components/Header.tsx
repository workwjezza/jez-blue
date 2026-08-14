'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PostCategory } from '@/types/post';

interface HeaderProps {
  activeCategory?: PostCategory | 'all';
  onCategoryChange?: (category: PostCategory | 'all') => void;
}

const categories: (PostCategory | 'all')[] = ['all', 'text', 'media', 'links'];

export default function Header({ activeCategory, onCategoryChange }: HeaderProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="flex items-center justify-between h-10 px-6">
        <Link href="/" className="text-base hover:opacity-50 transition-opacity select-none">
          +
        </Link>
        
        {isHome && activeCategory && onCategoryChange && (
          <div className="flex gap-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`text-[11px] uppercase tracking-[0.08em] font-normal transition-colors select-none ${
                  activeCategory === category ? 'text-black' : 'text-[#CCCCCC] hover:text-black'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        <Link 
          href={isAdmin ? '/' : '/admin'} 
          className="text-sm hover:opacity-50 transition-opacity opacity-40 select-none"
        >
          {isAdmin ? '×' : '☰'}
        </Link>
      </div>
    </header>
  );
}
