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
        <Link 
          href="/admin/new" 
          className="text-base hover:opacity-50 transition-opacity select-none user-select-none"
          style={{
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          +
        </Link>
        
        {isHome && activeCategory && onCategoryChange && (
          <div className="flex gap-4">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`text-[10px] uppercase tracking-[0.08em] font-normal transition-colors select-none user-select-none ${
                  activeCategory === category ? 'text-black' : 'text-[#999999] hover:text-black'
                }`}
                style={{
                  minWidth: '44px',
                  minHeight: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {category}
              </button>
            ))}
          </div>
        )}
        
        <Link 
          href={isAdmin ? '/' : '/admin'} 
          className="text-sm hover:opacity-50 transition-opacity select-none user-select-none"
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
  );
}
