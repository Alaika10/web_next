import React from 'react';

export default function Loading() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-slate-400">Initializing Lab Session...</p>
    </div>
  );
}