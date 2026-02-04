'use client';
import React, { useRef } from 'react';
import { Trash2, Sparkles, FileText, Edit3, ExternalLink, Zap, Star, Camera } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BlogPost } from '../../types';

interface JournalTabProps {
  blogs: BlogPost[];
  isAiLoading: boolean;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onAiRefine: (id: string, topic: string) => void;
  onToggleFeature?: (id: string, type: 'isHeadline' | 'isTrending') => void;
}

export default function JournalTab({ blogs, isAiLoading, onUpdate, onDelete, onAiRefine, onToggleFeature }: JournalTabProps) {
  const router = useRouter();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
      const reader = new FileReader();
      reader.onloadend = () => onUpdate(id, { imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {blogs.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border p-20 text-center space-y-4">
          <FileText className="mx-auto text-slate-200" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No articles found</p>
        </div>
      )}
      {blogs.map((post) => (
        <div key={post.id} className={`bg-white dark:bg-slate-900 rounded-[2.5rem] border overflow-hidden shadow-sm p-8 space-y-6 transition-all duration-500 ${post.isHeadline ? 'border-indigo-500 ring-4 ring-indigo-500/10' : 'border-slate-200 dark:border-slate-800'}`}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 space-y-4">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border relative group/img bg-slate-100 dark:bg-slate-800">
                {post.imageUrl ? (
                  <img src={post.imageUrl} className="w-full h-full object-cover" alt={post.title} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300"><FileText /></div>
                )}
                
                <div 
                  onClick={() => fileInputRefs.current[post.id]?.click()}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                >
                  <Camera size={20} />
                </div>

                {post.isHeadline && (
                  <div className="absolute top-3 left-3 px-3 py-1 bg-indigo-600 text-white font-mono text-[8px] uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                    <Star size={10} fill="white" /> Headline
                  </div>
                )}
                {post.isTrending && (
                  <div className="absolute bottom-3 left-3 px-3 py-1 bg-amber-500 text-white font-mono text-[8px] uppercase tracking-widest rounded-full shadow-lg flex items-center gap-2">
                    <Zap size={10} fill="white" /> Trending
                  </div>
                )}
              </div>

              <input 
                type="file" 
                ref={el => { fileInputRefs.current[post.id] = el; }} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleFileChange(post.id, e)}
              />

              <button 
                onClick={() => router.push(`/admin/blogs/${post.id}`)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-widest hover:opacity-80 transition-all"
              >
                <Edit3 size={14} /> Full Editor
              </button>
            </div>
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <input 
                    className="text-2xl font-black bg-transparent border-none focus:ring-0 w-full p-0 dark:text-white"
                    defaultValue={post.title}
                    onBlur={(e) => onUpdate(post.id, { title: e.target.value })}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => onToggleFeature?.(post.id, 'isHeadline')}
                    className={`p-2 rounded-xl border transition-all ${post.isHeadline ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent hover:border-indigo-500'}`}
                  >
                    <Star size={20} fill={post.isHeadline ? "white" : "none"} />
                  </button>
                  <button 
                    onClick={() => onToggleFeature?.(post.id, 'isTrending')}
                    className={`p-2 rounded-xl border transition-all ${post.isTrending ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-transparent hover:border-amber-500'}`}
                  >
                    <Zap size={20} fill={post.isTrending ? "white" : "none"} />
                  </button>
                  <button onClick={() => onDelete(post.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between">
                  Excerpt
                  <button 
                    disabled={isAiLoading}
                    onClick={() => onAiRefine(post.id, post.title)}
                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-all disabled:opacity-50"
                  >
                    <Sparkles size={12} /> Draft with Gemini
                  </button>
                </label>
                <textarea 
                  className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-none text-sm dark:text-slate-300"
                  defaultValue={post.excerpt}
                  onBlur={(e) => onUpdate(post.id, { excerpt: e.target.value })}
                />
              </div>

              <div className="p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl flex items-center justify-between border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white"><FileText size={16}/></div>
                  <p className="text-[10px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-tighter">Status: {post.contentHtml ? 'Formatted' : 'Raw Content'}</p>
                </div>
                <button 
                  onClick={() => router.push(`/admin/blogs/${post.id}`)}
                  className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"
                >
                  Edit Body <ExternalLink size={12} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}