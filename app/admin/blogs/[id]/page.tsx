'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { processContent } from '../../../../services/contentProcessor';
import RichEditor from '../../../../components/admin/RichEditor';
import { BlogPost } from '../../../../types';
import { Layout, Image as ImageIcon, Upload, X, AlertCircle, FileText, Settings } from 'lucide-react';

export default function BlogEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!supabase || !id) return;
      try {
        const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          setBlog({
            ...data,
            imageUrl: data.image_url || '',
            content: data.content || '',
            excerpt: data.excerpt || '',
            author: data.author || 'Anonymous',
            tags: Array.isArray(data.tags) ? data.tags : []
          });
        }
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, router]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (file) {
      // 2MB size limit
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("Image size exceeds 2MB limit. Optimization required.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (blog) {
          setBlog({ ...blog, imageUrl: reader.result as string });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!supabase || !blog || !id) return;
    setIsSaving(true);
    
    try {
      const contentHtml = await processContent(blog.content);
      const { error } = await supabase.from('blogs').update({ 
        content: blog.content,
        content_html: contentHtml,
        title: blog.title,
        excerpt: blog.excerpt,
        image_url: blog.imageUrl,
        tags: blog.tags,
        author: blog.author
      }).eq('id', id);

      if (error) throw error;
      router.push('/admin');
    } catch (err) {
      alert("Error saving: " + (err as any).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="-mt-20 min-h-[calc(100svh+5rem)] flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Journal Vault...</p>
    </div>
  );
  
  if (!blog) return <div className="p-20 text-center font-black uppercase text-red-500">Record not found.</div>;

  return (
    <div className="-mt-20 min-h-[calc(100svh+5rem)] flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col gap-6 p-6 lg:p-10 h-full">
        
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 w-full">
             <input 
              className="text-3xl md:text-5xl font-black bg-transparent border-none outline-none w-full text-slate-900 dark:text-white placeholder:text-slate-300 tracking-tighter"
              value={blog.title}
              onChange={(e) => setBlog({...blog, title: e.target.value})}
              placeholder="Article Headline..."
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
              <FileText size={16} className="text-indigo-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Draft_Mode</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          {/* Main Editor Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <RichEditor 
              content={blog.content}
              onChange={(val) => setBlog({...blog, content: val})}
              onSave={handleSave}
              isSaving={isSaving}
              title="Content Composer"
              onBack={() => router.push('/admin')}
            />
          </div>

          {/* Metadata Sidebar */}
          <aside className="w-full lg:w-96 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {/* Image Upload Section */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-tech text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] flex items-center gap-2">
                  <ImageIcon size={14} className="text-indigo-600" /> Headline_Visual
                </h3>
                {blog.imageUrl && (
                  <button 
                    onClick={() => setBlog({...blog, imageUrl: ''})}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="relative group">
                {blog.imageUrl ? (
                  <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm relative">
                    <img src={blog.imageUrl} className="w-full h-full object-cover" alt="Cover Preview" />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                    >
                      <Upload size={24} />
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[16/10] rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all text-slate-400 hover:text-indigo-600"
                  >
                    <Upload size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Select Cover Image</span>
                  </button>
                )}
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  className="hidden" 
                  accept="image/*"
                />
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-bold uppercase">
                  <AlertCircle size={14} /> {uploadError}
                </div>
              )}
              
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest text-center">
                Max file size: 2MB. Recommended 16:10 Ratio.
              </p>
            </section>

            {/* Scientific Settings Section */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
               <h3 className="font-mono-tech text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] flex items-center gap-2">
                  <Settings size={14} className="text-indigo-600" /> Research_Parameters
               </h3>
               
               <div className="space-y-4">
                 <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Journal Excerpt</label>
                   <textarea 
                     className="w-full h-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-xs font-medium border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all resize-none"
                     value={blog.excerpt}
                     onChange={(e) => setBlog({...blog, excerpt: e.target.value})}
                     placeholder="Summary of research findings..."
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Keywords / Tags (Comma Sep)</label>
                   <input 
                     className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                     value={blog.tags.join(', ')}
                     onChange={(e) => setBlog({...blog, tags: e.target.value.split(',').map(t => t.trim())})}
                   />
                 </div>

                 <div className="space-y-2">
                   <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Lead Researcher</label>
                   <input 
                     className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                     value={blog.author}
                     onChange={(e) => setBlog({...blog, author: e.target.value})}
                   />
                 </div>
               </div>
            </section>

            <div className="px-8 py-6 bg-slate-900 rounded-[2.5rem] text-white">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
                 <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">System Information</span>
               </div>
               <p className="text-[10px] font-bold leading-relaxed text-slate-400">
                 All data is cryptographically prepared before being synchronized to the Supabase cloud network.
               </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
