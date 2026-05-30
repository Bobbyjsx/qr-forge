'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LoadingStateProps {
  title?: string;
  description?: string;
  fullScreen?: boolean;
}

export function LoadingState({ 
  title = 'Loading...', 
  description = 'Connecting to our servers...',
  fullScreen = true 
}: LoadingStateProps) {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-8 text-center max-w-sm px-8">
      <div className="relative w-20 h-20 mx-auto">
        <div className="absolute inset-0 bg-orange-100 rounded-2xl animate-ping opacity-20" />
        <div className="relative bg-brand-orange text-white w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl shadow-orange-200">
          <RefreshCw className="animate-spin" size={32} />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-black text-zinc-800 uppercase tracking-tighter">{title}</h3>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">{description}</p>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-white min-h-[80vh] vibrant-dots">
        {content}
      </div>
    );
  }

  return content;
}
