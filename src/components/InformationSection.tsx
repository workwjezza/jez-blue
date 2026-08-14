'use client';

import { useState } from 'react';

interface InformationSectionProps {
  content?: string;
  createdAt: string;
  tags?: string[];
}

export default function InformationSection({ content, createdAt, tags }: InformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toLowerCase();

  return (
    <div className="px-6 text-center">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full py-4 flex flex-col items-center gap-1 select-none user-select-none"
      >
        <span className="text-xs lowercase tracking-[0.08em] font-normal text-gray-500">
          information
        </span>
      </button>
      
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? '500px' : '0',
        }}
      >
        <div className="pb-6 space-y-3">
          {content && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
          
          {tags && tags.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-center">
              {tags.map((tag) => (
                <span key={tag} className="text-xs px-2 py-1 opacity-60 uppercase tracking-[0.08em]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
