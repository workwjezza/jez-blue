'use client';

import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/types/post';

interface PostGridProps {
  posts: Post[];
}

export default function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="grid grid-cols-3 gap-px bg-black">
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/post/${post.id}`}
          className="relative aspect-square bg-white hover:opacity-80 transition-opacity"
        >
          <Image
            src={post.media[0].src}
            alt={post.media[0].alt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 33vw, 213px"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-black p-2">
            <p className="text-xs truncate">{post.code}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
