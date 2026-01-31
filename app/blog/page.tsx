
'use client';
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../../types';
import { supabase } from '../../lib/supabase';
import { INITIAL_BLOGS } from '../../constants';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase.from('blogs').select('*').order('date', { ascending: false });
        if (data) setBlogs(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="py-20 px-6 md:px-12 max-w-5xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-black tracking-tight">The Journal</h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Deep dives into software architecture, UI engineering, and the future of creative technology.
        </p>
      </div>

      <div className="space-y-20">
        {blogs.map((post) => (
          <article key={post.id} className="group grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
            <div className="md:col-span-5 aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
              <img 
                src={post.imageUrl || (post as any).image_url} 
                alt={post.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
            </div>
            <div className="md:col-span-7 space-y-6">
              <div className="flex items-center gap-4 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                <span className="bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-full">{post.date}</span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                <span>{post.tags?.[0] || 'Article'}</span>
              </div>
              <h2 className="text-3xl font-bold group-hover:text-indigo-600 transition-colors leading-tight">{post.title}</h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                {post.excerpt}
              </p>
              <div className="pt-2">
                <button className="px-6 py-2 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
                  Read Full Post
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
