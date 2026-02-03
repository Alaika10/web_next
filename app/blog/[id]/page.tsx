'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { BlogPost } from '../../../types';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import SocialShare from '../../../components/SocialShare';
// @ts-ignore
import { track } from '@vercel/analytics';

/**
 * Metadata Generation (Server Side)
 * Fungsi ini dijalankan oleh Next.js di server untuk mengambil data SEO sebelum halaman dirender.
 */
export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = params.id;
  
  if (!supabase) return {};

  const { data: post } = await supabase
    .from('blogs')
    .select('title, excerpt, image_url')
    .eq('id', id)
    .single();

  if (!post) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: `/blog/${id}`,
      images: [
        {
          url: post.image_url,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [post.image_url],
    },
  };
}

export default function BlogDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (!supabase || !id) return;
      try {
        const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          setPost(data);
          track('blog_view', { 
            title: data.title,
            id: id,
            category: data.tags?.[0] || 'General'
          });
        }
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

      <article className="max-w-4xl mx-auto px-6 -mt-24 md:-mt-40 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-12">
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

          <div 
            className="rich-text-content prose prose-xl dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-[1.8] prose-img:rounded-[2rem] prose-img:shadow-2xl prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-indigo-600 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:rounded-r-2xl"
            dangerouslySetInnerHTML={{ __html: (post as any).content_html || post.content }}
          />
          
          <div className="pt-16 border-t border-slate-100 dark:border-slate-800 space-y-10">
            {/* Social Share Section */}
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
              <SocialShare title={post.title} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                   {post.author.charAt(0)}
                 </div>
                 <div>
                   <p className="text-lg font-black">{post.author}</p>
                   <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Thought Leader & Engineer</p>
                 </div>
              </div>
              <button 
                onClick={() => {
                  window.scrollTo({top: 0, behavior: 'smooth'});
                  track('scroll_to_top_clicked', { post_title: post.title });
                }} 
                className="px-8 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all"
              >
                Return to Top
              </button>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}