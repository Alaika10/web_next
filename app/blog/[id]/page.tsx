import React from 'react';
import { supabase } from '../../../lib/supabase';
import { BlogPost } from '../../../types';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SocialShare from '../../../components/SocialShare';
import BlogClientActions from '../../../components/BlogClientActions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getSiteUrl } from '../../../lib/site';

export const dynamicParams = true;
export const revalidate = 300;

// Static Site Generation: Membuat halaman detail menjadi HTML statis saat build
export async function generateStaticParams() {
  if (!supabase) return [];
  const { data: blogs } = await supabase.from('blogs').select('id');
  return (blogs || []).map((blog) => ({ id: blog.id }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  if (!supabase) return {};

  const { data: post } = await supabase
    .from('blogs')
    .select('title, excerpt')
    .eq('id', params.id)
    .single();

  if (!post) return { title: 'Not Found' };

  const siteUrl = getSiteUrl();
  const description = post.excerpt || 'Baca artikel terbaru di DataLabs.';
  const ogImageUrl = `${siteUrl}/api/og/blog/${params.id}`;

  return {
    title: post.title,
    description,
    alternates: { canonical: `/blog/${params.id}` },
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      url: `${siteUrl}/blog/${params.id}`,
      siteName: 'DataLabs by Alaika Izatul Ilmi',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function BlogDetailPage({ params }: { params: { id: string } }) {
  if (!supabase) return notFound();
  
  // Hanya ambil kolom yang benar-benar dibutuhkan, pastikan menyertakan 'tags'
  const { data: post, error } = await supabase.from('blogs').select('id, title, excerpt, content, content_html, image_url, date, author, tags').eq('id', params.id).single();
  
  if (error || !post) return notFound();
  const blogPost: BlogPost = { ...post, imageUrl: post.image_url, tags: post.tags || [] };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 selection:bg-indigo-100 selection:text-indigo-900">
      <header className="relative h-[40vh] md:h-[60vh] w-full overflow-hidden">
        {blogPost.imageUrl && (
          <Image 
            src={blogPost.imageUrl} 
            fill 
            priority 
            // @ts-ignore
            fetchPriority="high" 
            className="object-cover" 
            alt={blogPost.title} 
            sizes="100vw" 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-900/20 to-transparent"></div>
        <div className="absolute top-8 left-6 md:left-12">
           <Link href="/blog" className="group flex items-center gap-2 px-5 py-2.5 bg-white/20 backdrop-blur-xl text-white rounded-full font-bold text-xs uppercase tracking-widest border border-white/20 hover:bg-white/40 transition-all">
             <ArrowLeft size={16} /> Back
           </Link>
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 -mt-16 md:-mt-24 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 shadow-2xl border border-slate-200/50 dark:border-slate-800/50 space-y-12">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-400">
              <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full"><Calendar size={14} className="text-indigo-600" id="calendar-icon"/> {blogPost.date}</span>
              <span className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 rounded-full"><User size={14} className="text-indigo-600" id="user-icon"/> {blogPost.author}</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tighter text-slate-900 dark:text-white">{blogPost.title}</h1>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 italic leading-relaxed border-l-4 border-indigo-600 pl-6 py-2">{blogPost.excerpt}</p>
          </div>
          <div 
            className="rich-text-content prose prose-xl dark:prose-invert max-w-none prose-headings:font-black"
            dangerouslySetInnerHTML={{ __html: post.content_html || blogPost.content }}
          />
          <div className="pt-16 border-t border-slate-100 dark:border-slate-800">
            <SocialShare title={blogPost.title} />
            <div className="mt-10 flex justify-between items-center">
               <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl">{blogPost.author.charAt(0)}</div>
                 <div><p className="text-lg font-black">{blogPost.author}</p><p className="text-xs text-slate-400 uppercase font-bold tracking-widest">Thought Leader & Engineer</p></div>
               </div>
               <BlogClientActions title={blogPost.title} />
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
