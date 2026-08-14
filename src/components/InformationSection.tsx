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
    <div className="border-t border-black">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-4 py-3 hover:bg-black hover:text-white transition-colors flex justify-between items-center"
      >
        <span>information</span>
        <span className="text-xl">{isExpanded ? '−' : '+'}</span>
      </button>
      
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{
          maxHeight: isExpanded ? '500px' : '0',
        }}
      >
        <div className="px-4 py-4 border-t border-black space-y-3">
          {content && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
          
          <div className="text-xs opacity-60">
            <p>published: {formattedDate}</p>
          </div>
          
          {tags && tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag) => (
                <span key={tag} className="text-xs border border-black px-2 py-1">
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
