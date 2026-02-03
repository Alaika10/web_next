'use client';
import React, { useEffect } from 'react';
// @ts-ignore
import { track } from '@vercel/analytics';

export default function BlogClientActions({ title }: { title: string }) {
  useEffect(() => {
    // Pelacakan saat halaman dimuat (Client side)
    track('blog_view_detailed', { title });
  }, [title]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    track('scroll_to_top_clicked', { post_title: title });
  };

  return (
    <button 
      onClick={handleScrollTop}
      className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
    >
      Return to Top
    </button>
  );
}