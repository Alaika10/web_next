
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { BlogPost } from '../../../types';
import { ArrowLeft, Calendar, User, Tag, Clock, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!supabase || !id) return;
      try {
        const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) setPost(data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!post) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-black">Article Missing</h2>
      <Link href="/blog" className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold">Return to Journal</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Immersive Header */}
      <header className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
        <img 
          src={post.imageUrl || (post as any).image_url} 
          className="w-full h-full object-cover scale-105" 
          alt={post.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-900/40 to-transparent"></div>
        
        <div className="absolute top-8 left-6 md:left-12">
           <Link href="/blog" className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white rounded-full font-bold text-xs uppercase tracking-widest border border-white/20 hover:bg-white/30 transition-all">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back
           </Link>
        </div>
      </header>

      {/* Article Content Area */}
      <article className="max-w-4xl mx-auto px-6 -mt-24 md:-mt-40 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-12">
          
          {/* Metadata Section */}
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 md:gap-8 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <Calendar size={14} className="text-indigo-600"/> {post.date}
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <User size={14} className="text-indigo-600"/> {post.author}
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <Tag size={14} className="text-indigo-600"/> {post.tags?.[0] || 'Tech'}
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-slate-900 dark:text-white">
              {post.title}
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 italic leading-relaxed border-l-4 border-indigo-600 pl-6 md:pl-8 py-2">
              {post.excerpt}
            </p>
          </div>

          {/* Main Body */}
          <div 
            className="rich-text-content prose prose-xl dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 dark:prose-headings:text-white
            prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-[1.8] 
            prose-img:rounded-[2rem] prose-img:shadow-2xl prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-indigo-600 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:rounded-r-2xl"
            dangerouslySetInnerHTML={{ __html: (post as any).content_html || post.content }}
          />
          
          {/* Footer of Article */}
          <div className="pt-16 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                 {post.author.charAt(0)}
               </div>
               <div>
                 <p className="text-lg font-black">{post.author}</p>
                 <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Thought Leader & Engineer</p>
               </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="px-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
                Scroll to Top
              </button>
              <button onClick={() => navigator.share({title: post.title, url: window.location.href})} className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl hover:scale-110 transition-transform">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
