'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '../../types';
import { supabase } from '../../lib/supabase';
import { BookOpen, Hash, Clock, ArrowUpRight, Zap, Share2, Search, Star } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase.from('blogs').select('*').order('date', { ascending: false });
        if (data) {
          const mapped = data.map((b: any) => ({
            ...b,
            imageUrl: b.image_url,
            isHeadline: b.is_headline,
            isTrending: b.is_trending
          }));
          setBlogs(mapped);
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <BlogSkeleton />;

  const featuredPost = blogs.find(b => b.isHeadline) || blogs[0];
  const trendingPosts = blogs.filter(b => b.isTrending).slice(0, 4);
  const regularPosts = blogs.filter(b => b.id !== featuredPost?.id);

  return (
    <div className="py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto animate-in space-y-16 md:space-y-24">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-200 dark:border-slate-800 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono-tech text-[10px] uppercase tracking-[0.4em]">
            <BookOpen size={14} /> The Research Journal / Vol. 25
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            Deep <span className="text-slate-400">Insights.</span>
          </h1>
        </div>
        <div className="flex flex-col items-start md:items-end gap-4 w-full md:w-auto">
          <p className="md:text-right text-slate-500 font-medium max-w-[320px] text-sm leading-relaxed">
            Exploring neural architectures, algorithmic ethics, and large-scale data systems.
          </p>
          <div className="w-full md:w-auto px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <Search size={14} className="text-slate-400" />
            <input type="text" placeholder="Search entry..." className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest flex-1 md:w-24" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-8 space-y-16 md:space-y-24">
          {featuredPost && (
            <section className="group">
              <Link href={`/blog/${featuredPost.id}`} className="space-y-8 block">
                <div className="aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative shadow-2xl transition-all duration-700 group-hover:shadow-indigo-500/10">
                  <img src={featuredPost.imageUrl} alt={featuredPost.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="px-3 py-1 bg-indigo-600 text-white font-mono-tech text-[8px] uppercase tracking-widest rounded-full w-fit flex items-center gap-2">
                        <Star size={10} fill="white" /> Featured_Entry
                      </div>
                      <h2 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors">
                        {featuredPost.title}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="px-2 md:px-4 space-y-4">
                   <div className="flex items-center gap-4 md:gap-6 font-mono-tech text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><Clock size={12} /> 6 MIN_READ</span>
                     <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                     <span>{featuredPost.date}</span>
                     <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
                     <span className="text-indigo-500 font-black hidden sm:block">#HEADLINE</span>
                   </div>
                   <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                     {featuredPost.excerpt}
                   </p>
                </div>
              </Link>
            </section>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-12 border-t border-slate-100 dark:border-slate-800">
            {regularPosts.map((post, idx) => (
              <article key={post.id} className="group space-y-6">
                <Link href={`/blog/${post.id}`} className="block space-y-6">
                  <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                    <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em]">{post.tags?.[0] || 'RESEARCH'}</span>
                      <span className="font-mono-tech text-[9px] text-slate-400">ID: #{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-black tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        <aside className="lg:col-span-4 space-y-16 mt-12 lg:mt-0">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm space-y-8">
            <h4 className="font-mono-tech text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Trending_Research
            </h4>
            <div className="space-y-8">
              {trendingPosts.length > 0 ? (
                trendingPosts.map((post, i) => (
                  <Link href={`/blog/${post.id}`} key={post.id} className="group cursor-pointer flex gap-4">
                    <span className="font-mono-tech text-xl text-slate-200 dark:text-slate-800 font-black">0{i+1}</span>
                    <p className="text-xs font-black leading-relaxed group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{post.title}</p>
                  </Link>
                ))
              ) : (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No active trends</p>
              )}
            </div>
          </div>

          <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-white space-y-6 shadow-2xl relative overflow-hidden group">
            <Share2 size={32} />
            <h5 className="text-2xl font-black leading-tight">Join the Neural<br/>Network.</h5>
            <p className="text-indigo-100 text-xs leading-relaxed opacity-80 font-medium">Get the latest white papers and code implementations delivered to your lab inbox.</p>
            <div className="space-y-3 pt-4">
               <input type="email" placeholder="RESEARCHER_EMAIL" className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold placeholder:text-white/40 focus:bg-white/20 outline-none transition-all" />
               <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors">Subscribe_Feed</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function BlogSkeleton() {
  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-20">
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 pb-12 border-b">
        <div className="space-y-4 w-full">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-20 w-3/4" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-8 space-y-24">
          <div className="space-y-8">
            <Skeleton className="aspect-[21/9] w-full rounded-[3rem]" />
            <div className="px-4 space-y-4">
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-6 w-5/6" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {[1, 2].map(i => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-[16/10] w-full rounded-[2rem]" />
                <div className="space-y-3">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4 space-y-16">
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          <Skeleton className="h-48 w-full rounded-[2.5rem]" />
        </div>
      </div>
    </div>
  );
}