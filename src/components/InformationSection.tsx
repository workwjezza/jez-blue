'use client';

import { useState } from 'react';

interface InformationSectionProps {
  content?: string;
  createdAt: string;
}

export default function InformationSection({ content }: InformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
        </div>
      </div>
    </div>
  );
}
