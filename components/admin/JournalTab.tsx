
'use client';
import React from 'react';
import { Trash2, FileText, Edit3, Zap, Star, ArrowRight, Calendar, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '../../types';

interface JournalTabProps {
  blogs: BlogPost[];
  onDelete: (id: string) => void;
  onToggleFeature: (id: string, type: 'isHeadline' | 'isTrending') => void;
}

export default function JournalTab({ blogs, onDelete, onToggleFeature }: JournalTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {blogs.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border p-20 text-center space-y-4">
          <FileText className="mx-auto text-slate-200" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No articles published</p>
        </div>
      )}
      
      {blogs.map((post) => (
        <div key={post.id} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border overflow-hidden shadow-sm p-8 transition-all duration-300 group ${post.isHeadline ? 'border-indigo-500/50 ring-4 ring-indigo-500/5' : 'border-slate-200 dark:border-slate-800'}`}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-56 shrink-0 space-y-4">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 relative bg-slate-50 dark:bg-slate-800">
                {post.imageUrl ? (
                  <img src={post.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt={post.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText size={32} /></div>
                )}
                
                <div className="absolute top-2 left-2 flex flex-col gap-1.5">
                   {post.isHeadline && (
                    <div className="px-2 py-0.5 bg-indigo-600 text-white font-mono text-[7px] uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                      <Star size={8} fill="white" /> Headline
                    </div>
                  )}
                  {post.isTrending && (
                    <div className="px-2 py-0.5 bg-amber-500 text-white font-mono text-[7px] uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                      <Zap size={8} fill="white" /> Trending
                    </div>
                  )}
                </div>
              </div>

              <button 
                onClick={() => router.push(`/admin/blogs/${post.id}`)}
                className="w-full py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-black text-[9px] uppercase tracking-[0.2em] hover:opacity-80 transition-all flex items-center justify-center gap-2"
              >
                <Edit3 size={14} /> Open Editor
              </button>
            </div>

            <div className="flex-1 flex flex-col justify-between py-1">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black dark:text-white group-hover:text-indigo-600 transition-colors leading-tight">{post.title}</h3>
                    <div className="flex items-center gap-4 font-mono text-[9px] text-slate-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1"><Calendar size={10} /> {post.date}</span>
                       <span className="flex items-center gap-1"><User size={10} /> {post.author}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => onToggleFeature(post.id, 'isHeadline')}
                      className={`p-2 rounded-xl border transition-all ${post.isHeadline ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent hover:border-indigo-500'}`}
                    >
                      <Star size={16} fill={post.isHeadline ? "white" : "none"} />
                    </button>
                    <button 
                      onClick={() => onToggleFeature(post.id, 'isTrending')}
                      className={`p-2 rounded-xl border transition-all ${post.isTrending ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent hover:border-amber-500'}`}
                    >
                      <Zap size={16} fill={post.isTrending ? "white" : "none"} />
                    </button>
                    <button onClick={() => onDelete(post.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-2 italic">
                  "{post.excerpt || "Draft research note awaiting scientific summary..."}"
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex gap-2">
                  {post.tags && post.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">#{tag}</span>
                  ))}
                </div>
                <button 
                  onClick={() => router.push(`/admin/blogs/${post.id}`)}
                  className="text-[9px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2 group/btn"
                >
                  Configure Research Body <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
