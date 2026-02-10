
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { BookOpen, Clock, Zap, Star, Database } from 'lucide-react';
import { BlogPost } from '../../types';

export const revalidate = 60;

export default async function BlogPage() {
  let blogs: BlogPost[] = [];
  let connectionError = false;

  if (supabase) {
    try {
      const { data, error } = await supabase.from('blogs').select('*').order('date', { ascending: false });
      if (error) throw error;
      if (data) {
        blogs = data.map((b: any) => ({
          ...b,
          imageUrl: b.image_url,
          isHeadline: b.is_headline,
          isTrending: b.is_trending
        }));
      }
    } catch (e) {
      console.error('Blog fetch error:', e);
      connectionError = true;
    }
  } else {
    connectionError = true;
  }

  if (blogs.length === 0) {
    return (
      <div className="py-20 px-6 max-w-7xl mx-auto text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto text-slate-400">
          <Database size={32} />
        </div>
        <h1 className="text-3xl font-black">No Articles Published</h1>
        <p className="text-slate-500 max-w-md mx-auto">
          {connectionError
            ? 'Database tidak terhubung. Periksa konfigurasi Supabase Anda di .env.local.'
            : 'Belum ada artikel yang dipublikasikan di jurnal penelitian ini.'}
        </p>
        <Link href="/" className="text-indigo-600 font-bold hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const featuredPost = blogs.find((b) => b.isHeadline) || blogs[0];
  const trendingPosts = blogs.filter((b) => b.isTrending).slice(0, 6);
  const regularPosts = blogs.filter((b) => b.id !== featuredPost?.id);

  return (
    <div className="py-10 md:py-16 px-5 md:px-10 max-w-7xl mx-auto animate-in space-y-12 md:space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 dark:border-slate-800 pb-8 md:pb-10">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] uppercase tracking-[0.35em]">
            <BookOpen size={14} /> The Research Journal / Vol. 25
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none">
            Deep <span className="text-slate-400">Insights.</span>
          </h1>
        </div>
        <p className="md:text-right text-slate-500 font-medium max-w-[360px] text-sm leading-relaxed">
          Exploring neural architectures, algorithmic ethics, and large-scale data systems.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        <div className="lg:col-span-8 space-y-10 md:space-y-12">
          {featuredPost && (
            <section className="group">
              <Link href={`/blog/${featuredPost.id}`} className="space-y-5 block">
                <div className="aspect-[16/8.5] md:aspect-[16/7.5] rounded-[1.5rem] md:rounded-[2.25rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 relative shadow-xl transition-all duration-700 group-hover:shadow-indigo-500/10">
                  {featuredPost.imageUrl && (
                    <Image
                      src={featuredPost.imageUrl}
                      alt={featuredPost.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 70vw"
                      className="object-cover grayscale-[25%] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                      priority
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/35 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-8 md:left-8 md:right-8 flex items-end">
                    <div className="space-y-2.5 max-w-3xl">
                      <div className="px-3 py-1 bg-indigo-600 text-white font-mono text-[8px] uppercase tracking-widest rounded-full w-fit flex items-center gap-2">
                        <Star size={10} fill="white" /> Featured_Entry
                      </div>
                      <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight group-hover:text-indigo-300 transition-colors line-clamp-3 md:line-clamp-2">
                        {featuredPost.title}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="px-1 md:px-2 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 md:gap-5 font-mono text-[9px] md:text-[10px] text-slate-400 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><Clock size={12} /> 6 MIN_READ</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                    <span>{featuredPost.date}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full hidden sm:block"></span>
                    <span className="text-indigo-500 font-black hidden sm:block">#HEADLINE</span>
                  </div>
                  <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                </div>
              </Link>
            </section>
          )}

          <section className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-[10px] uppercase text-slate-400 font-black tracking-[0.25em]">More_Insights</h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest">{regularPosts.length} articles</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
              {regularPosts.map((post, idx) => (
                <article key={post.id} className="group h-full">
                  <Link href={`/blog/${post.id}`} className="block h-full rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 p-3 md:p-4 space-y-4 shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="aspect-[16/10] relative rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-900">
                      {post.imageUrl && (
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[9px] text-indigo-500 font-black uppercase tracking-[0.2em]">{post.tags?.[0] || 'RESEARCH'}</span>
                        <span className="font-mono text-[9px] text-slate-400">#{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <h4 className="text-base md:text-lg font-black tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{post.title}</h4>
                      <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>

        <aside className="lg:col-span-4 space-y-8 mt-2 lg:mt-0">
          <div className="p-6 md:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm space-y-6">
            <h4 className="font-mono text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] flex items-center gap-2">
              <Zap size={14} className="text-amber-500" /> Trending_Research
            </h4>
            <div className="space-y-5">
              {trendingPosts.length > 0 ? (
                trendingPosts.map((post, i) => (
                  <Link href={`/blog/${post.id}`} key={post.id} className="group cursor-pointer flex gap-3">
                    <span className="font-mono text-lg text-slate-200 dark:text-slate-800 font-black">{String(i + 1).padStart(2, '0')}</span>
                    <p className="text-xs font-black leading-relaxed group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-2">{post.title}</p>
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
