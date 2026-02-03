import React from 'react';
import { supabase } from '../../lib/supabase';
import { BlogPost } from '../../types';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SocialShare from '../../components/SocialShare';
import BlogClientActions from '../../components/BlogClientActions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

const getAbsoluteUrl = (path: string) => {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://datalab.alex.studio').replace(/\/$/, '');
  if (!path) return `${baseUrl}/og-main.png`;
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  if (!supabase) return {};

  const { data: post } = await supabase
    .from('blogs')
    .select('title, excerpt, image_url')
    .eq('id', id)
    .single();

  if (!post) return { title: 'Article Not Found' };

  const fullUrl = getAbsoluteUrl(`/blog/${id}`);
  
  // MENGGUNAKAN API PROXY UNTUK GAMBAR PREVIEW
  // Ini memastikan gambar berukuran optimal dan berformat file asli, bukan base64
  const optimizedOgImage = getAbsoluteUrl(`/api/og/blog/${id}`);

  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: fullUrl,
      siteName: 'DataLab Alex Sterling',
      images: [
        {
          url: optimizedOgImage,
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
      images: [optimizedOgImage],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  
  if (!supabase) return notFound();

  const { data: post, error } = await supabase
    .from('blogs')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) return notFound();

  const blogPost: BlogPost = {
    ...post,
    imageUrl: post.image_url
  };

  const fullUrl = getAbsoluteUrl(`/blog/${id}`);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="relative h-[50vh] md:h-[65vh] w-full overflow-hidden">
        <Image 
          src={blogPost.imageUrl} 
          fill
          priority
          className="object-cover scale-105" 
          alt={blogPost.title} 
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
                <Calendar size={14} className="text-indigo-600"/> {blogPost.date}
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <User size={14} className="text-indigo-600"/> {blogPost.author}
              </div>
              <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                <Tag size={14} className="text-indigo-600"/> {blogPost.tags?.[0] || 'Tech'}
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-slate-900 dark:text-white">
              {blogPost.title}
            </h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 italic leading-relaxed border-l-4 border-indigo-600 pl-6 md:pl-8 py-2">
              {blogPost.excerpt}
            </p>
          </div>

          <div 
            className="rich-text-content prose prose-xl dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-[1.8] prose-img:rounded-[2rem] prose-img:shadow-2xl prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-indigo-600 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-800/50 prose-blockquote:rounded-r-2xl"
            dangerouslySetInnerHTML={{ __html: (post as any).content_html || blogPost.content }}
          />
          
          <div className="pt-16 border-t border-slate-100 dark:border-slate-800 space-y-10">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800">
              <SocialShare title={blogPost.title} url={fullUrl} />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg">
                   {blogPost.author.charAt(0)}
                 </div>
                 <div>
                   <p className="text-lg font-black">{blogPost.author}</p>
                   <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Thought Leader & Engineer</p>
                 </div>
              </div>
              <BlogClientActions title={blogPost.title} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}