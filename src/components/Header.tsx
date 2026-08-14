'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
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
        
        <div style={{ flex: 1 }} />
        
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
