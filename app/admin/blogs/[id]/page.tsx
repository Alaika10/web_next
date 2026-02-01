
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { BlogPost } from '../../../../types';
import { ArrowLeft, Calendar, User, Tag } from 'lucide-react';
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
      const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
      if (data) setPost(data);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!post) return <div className="p-20 text-center">Article not found.</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      {/* Header / Hero */}
      <div className="relative h-[60vh] w-full">
        <img 
          src={post.imageUrl || (post as any).image_url} 
          className="w-full h-full object-cover" 
          alt={post.title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 via-slate-900/20 to-transparent"></div>
        
        <div className="absolute top-8 left-8">
           <Link href="/blog" className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-xl text-white rounded-full font-bold text-xs uppercase tracking-widest border border-white/30 hover:bg-white/40 transition-all">
             <ArrowLeft size={16} /> Back to Journal
           </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-6 -mt-32 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 md:p-16 shadow-2xl border border-slate-100 dark:border-slate-800 space-y-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2"><Calendar size={14} className="text-indigo-600"/> {post.date}</div>
              <div className="flex items-center gap-2"><User size={14} className="text-indigo-600"/> {post.author}</div>
              <div className="flex items-center gap-2"><Tag size={14} className="text-indigo-600"/> {post.tags?.[0] || 'Uncategorized'}</div>
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">{post.title}</h1>
            <p className="text-xl text-slate-500 italic border-l-4 border-indigo-600 pl-6 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-p:leading-relaxed prose-img:rounded-[2rem]"
            dangerouslySetInnerHTML={{ __html: (post as any).content_html || post.content }}
          />
          
          <div className="pt-12 border-t flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black">Z</div>
               <div>
                 <p className="text-sm font-black">{post.author}</p>
                 <p className="text-[10px] text-slate-400 uppercase font-bold">Content Creator</p>
               </div>
            </div>
            <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">Scroll to Top</button>
          </div>
        </div>
      </article>
    </div>
  );
}
