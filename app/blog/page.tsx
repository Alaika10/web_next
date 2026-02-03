import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { BookOpen, Clock, Zap, Star } from 'lucide-react';
import { BlogPost } from '../../types';

export const revalidate = 60;

export default async function BlogPage() {
  let blogs: BlogPost[] = [];

  if (supabase) {
    const { data } = await supabase.from('blogs').select('*').order('date', { ascending: false });
    if (data) {
      blogs = data.map((b: any) => ({
        ...b,
        imageUrl: b.image_url,
        isHeadline: b.is_headline,
        isTrending: b.is_trending
      }));
    }
  }

  const featuredPost = blogs.find(b => b.isHeadline) || blogs[0];
  const trendingPosts = blogs.filter(b => b.isTrending).slice(0, 4);
  const regularPosts = blogs.filter(b => b.id !== featuredPost?.id);

  return (
    <div className="py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto animate-in space-y-16 md:space-y-24">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-b border-slate-200 dark:border-slate-800 pb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em]">
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-8 space-y-16 md:space-y-24">
          {featuredPost && (
            <section className="group">
              <Link href={`/blog/${featuredPost.id}`} className="space-y-8 block">
                <div className="aspect-[21/9] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative shadow-2xl transition-all duration-700 group-hover:shadow-indigo-500/10">
                  {featuredPost.imageUrl && (
                    <Image 
                      src={featuredPost.imageUrl} 
                      alt={featuredPost.title} 
                      fill
                      sizes="100vw"
                      className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 md:right-10 flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="px-3 py-1 bg-indigo-600 text-white font-mono text-[8px] uppercase tracking-widest rounded-full w-fit flex items-center gap-2">
                        <Star size={10} fill="white" /> Featured_Entry
                      </div>
                      <h2 className="text-2xl md:text-5xl font-black text-white tracking-tighter leading-tight group-hover:text-indigo-400 transition-colors">
                        {featuredPost.title}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="px-2 md:px-4 space-y-4">
                   <div className="flex items-center gap-4 md:gap-6 font-mono text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest">
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
                  <div className="aspect-[16/10] relative rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-500 group-hover:shadow-xl">
                    {post.imageUrl && (
                      <Image 
                        src={post.imageUrl} 
                        alt={post.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                      />
                    )}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em]">{post.tags?.[0] || 'RESEARCH'}</span>
                      <span className="font-mono text-[9px] text-slate-400">ID: #{String(idx + 1).padStart(2, '0')}</span>
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
            <h4 className="font-mono text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Trending_Research
            </h4>
            <div className="space-y-8">
              {trendingPosts.length > 0 ? (
                trendingPosts.map((post, i) => (
                  <Link href={`/blog/${post.id}`} key={post.id} className="group cursor-pointer flex gap-4">
                    <span className="font-mono text-xl text-slate-200 dark:text-slate-800 font-black">0{i+1}</span>
                    <p className="text-xs font-black leading-relaxed group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{post.title}</p>
                  </Link>
                ))
              ) : (
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">No active trends</p>
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}