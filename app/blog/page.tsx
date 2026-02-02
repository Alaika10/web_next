'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '../../types';
import { supabase } from '../../lib/supabase';
import { BookOpen, Hash, Clock, ArrowUpRight, Filter, Zap, Share2, Search, Star } from 'lucide-react';

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
          // Map snake_case from DB to camelCase for the app
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

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-mono-tech text-[10px] uppercase tracking-[0.3em] text-slate-400">Fetching Research Data...</p>
    </div>
  );

  // Logika Headline: Cari yang bertanda isHeadline, jika tidak ada gunakan yang terbaru
  const featuredPost = blogs.find(b => b.isHeadline) || blogs[0];
  
  // Logika Trending: Ambil yang bertanda isTrending
  const trendingPosts = blogs.filter(b => b.isTrending).slice(0, 4);
  
  // Daftar artikel reguler (selain headline)
  const regularPosts = blogs.filter(b => b.id !== featuredPost?.id);

  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto animate-in space-y-20">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-200 dark:border-slate-800 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono-tech text-[10px] uppercase tracking-[0.4em]">
            < BookOpen size={14} /> The Research Journal / Vol. 24
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">
            Deep <span className="text-slate-400">Insights.</span>
          </h1>
        </div>
        <div className="flex flex-col items-end gap-4">
          <p className="text-right text-slate-500 font-medium max-w-[300px] text-sm leading-relaxed">
            Exploring the intersection of neural architectures, algorithmic ethics, and large-scale data systems.
          </p>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <input type="text" placeholder="Search entry..." className="bg-transparent border-none outline-none text-[10px] font-bold uppercase tracking-widest w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-24">
          
          {/* Featured Article - Headline Style */}
          {featuredPost && (
            <section className="group">
              <Link href={`/blog/${featuredPost.id}`} className="space-y-8 block">
                <div className="aspect-[21/9] rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative shadow-2xl transition-all duration-700 group-hover:shadow-indigo-500/10">
                  <img 
                    src={featuredPost.imageUrl} 
                    alt={featuredPost.title} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="px-3 py-1 bg-indigo-600 text-white font-mono-tech text-[8px] uppercase tracking-widest rounded-full w-fit flex items-center gap-2">
                        <Star size={10} fill="white" /> Featured_Entry
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors">
                        {featuredPost.title}
                      </h2>
                    </div>
                    <div className="hidden md:flex w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 items-center justify-center text-white">
                      <ArrowUpRight size={24} />
                    </div>
                  </div>
                </div>
                <div className="px-4 space-y-4">
                   <div className="flex items-center gap-6 font-mono-tech text-[10px] text-slate-400 uppercase tracking-widest">
                     <span className="flex items-center gap-1.5"><Clock size={12} /> 6 MIN_READ</span>
                     <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                     <span>{featuredPost.date}</span>
                     <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                     <span className="text-indigo-500 font-black">#HEADLINE</span>
                   </div>
                   <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
                     {featuredPost.excerpt}
                   </p>
                </div>
              </Link>
            </section>
          )}

          {/* Regular Feed - Grid Style */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-slate-100 dark:border-slate-800">
            {regularPosts.map((post, idx) => (
              <article key={post.id} className="group space-y-6">
                <Link href={`/blog/${post.id}`} className="block space-y-6">
                  <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title} 
                      className="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                    />
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono-tech text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em]">
                        {post.tags?.[0] || 'RESEARCH'}
                      </span>
                      <span className="font-mono-tech text-[9px] text-slate-400">ID: #{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="text-2xl font-black tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-16">
          {/* Trending Section */}
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

          {/* Categories / Tags */}
          <div className="space-y-6">
            <h4 className="font-mono-tech text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] flex items-center gap-2 px-4">
              <Hash size={14} className="text-indigo-600" /> Subject_Indexing
            </h4>
            <div className="flex flex-wrap gap-2 px-4">
              {['Neural_Nets', 'Data_Mining', 'Algorithm', 'Ethics', 'MLOps', 'Visualization'].map(tag => (
                <button key={tag} className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-xl font-mono-tech text-[9px] font-bold hover:border-indigo-500 transition-all uppercase tracking-widest">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter / Lab Update */}
          <div className="p-10 bg-indigo-600 rounded-[2.5rem] text-white space-y-6 shadow-2xl shadow-indigo-100 dark:shadow-none relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-12 translate-x-12 blur-2xl"></div>
            <Share2 size={32} />
            <h5 className="text-2xl font-black leading-tight">Join the Neural<br/>Network.</h5>
            <p className="text-indigo-100 text-xs leading-relaxed opacity-80 font-medium">Get the latest white papers and code implementations delivered to your lab inbox every Sunday.</p>
            <div className="space-y-3 pt-4">
               <input type="email" placeholder="RESEARCHER_EMAIL" className="w-full px-5 py-3 bg-white/10 border border-white/20 rounded-xl text-xs font-bold placeholder:text-white/40 focus:bg-white/20 outline-none transition-all" />
               <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors">Subscribe_Feed</button>
            </div>
          </div>
        </aside>

      </div>

      {blogs.length === 0 && (
        <div className="py-32 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
          <p className="font-mono-tech text-xs uppercase tracking-[0.2em] text-slate-400">No data entries indexed in the journal</p>
        </div>
      )}
    </div>
  );
}