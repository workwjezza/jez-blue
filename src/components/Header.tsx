'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-black z-50">
      <div className="flex items-center justify-between h-12 px-4">
        <div className="flex items-center gap-4">
          {!isHome && (
            <Link href="/" className="text-xl hover:opacity-50 transition-opacity">
              ←
            </Link>
          )}
          <Link href="/" className="text-base font-normal">
            jez.blue
          </Link>
        </div>
        <Link 
          href={isAdmin ? '/' : '/admin'} 
          className="text-xl hover:opacity-50 transition-opacity"
        >
          {isAdmin ? '×' : '☰'}
        </Link>
      </div>
    </header>
  );
}
