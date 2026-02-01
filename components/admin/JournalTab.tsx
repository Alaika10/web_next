
'use client';
import React from 'react';
import { Trash2, Sparkles, FileText } from 'lucide-react';
import { BlogPost } from '../../types';

interface JournalTabProps {
  blogs: BlogPost[];
  isAiLoading: boolean;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onAiRefine: (id: string, topic: string) => void;
}

export default function JournalTab({ blogs, isAiLoading, onUpdate, onDelete, onAiRefine }: JournalTabProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {blogs.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border p-20 text-center space-y-4">
          <FileText className="mx-auto text-slate-200" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No articles found</p>
        </div>
      )}
      {blogs.map((post) => (
        <div key={post.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-8 space-y-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-64 space-y-4">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border">
                <img src={post.imageUrl || (post as any).image_url} className="w-full h-full object-cover" />
              </div>
              <input 
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] outline-none"
                defaultValue={post.imageUrl || (post as any).image_url}
                onBlur={(e) => onUpdate(post.id, { imageUrl: e.target.value })}
                placeholder="Image URL"
              />
            </div>
            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <input 
                  className="text-2xl font-black bg-transparent border-none focus:ring-0 w-full p-0"
                  defaultValue={post.title}
                  onBlur={(e) => onUpdate(post.id, { title: e.target.value })}
                />
                <button onClick={() => onDelete(post.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
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
                  className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-none text-sm"
                  defaultValue={post.excerpt}
                  onBlur={(e) => onUpdate(post.id, { excerpt: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Content (Markdown)</label>
                <textarea 
                  className="w-full h-48 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-none text-sm font-mono"
                  defaultValue={post.content}
                  onBlur={(e) => onUpdate(post.id, { content: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
