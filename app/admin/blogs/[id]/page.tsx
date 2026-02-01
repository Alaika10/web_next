
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { processContent } from '../../../../services/contentProcessor';
import RichEditor from '../../../../components/admin/RichEditor';
import { BlogPost } from '../../../../types';
import { isAuthenticated } from '../../../../lib/auth';
import { Layout } from 'lucide-react';

export default function BlogEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchBlog = async () => {
      if (!supabase || !id) return;
      try {
        const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) setBlog(data);
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id, router]);

  const handleSave = async () => {
    if (!supabase || !blog || !id) return;
    setIsSaving(true);
    
    try {
      // Server-side processing to HTML for public safety
      const contentHtml = await processContent(blog.content);
      const { error } = await supabase.from('blogs').update({ 
        content: blog.content,
        content_html: contentHtml,
        title: blog.title
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
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
       <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Journal Vault...</p>
    </div>
  );
  
  if (!blog) return <div className="p-20 text-center font-black uppercase text-red-500">Record not found.</div>;

  return (
    <div className="h-screen flex flex-col p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col gap-6">
        <header className="flex items-center justify-between gap-6">
          <div className="flex-1">
             <input 
              className="text-3xl md:text-5xl font-black bg-transparent border-none outline-none w-full text-slate-900 dark:text-white placeholder:text-slate-200"
              value={blog.title}
              onChange={(e) => setBlog({...blog, title: e.target.value})}
              placeholder="Article Headline..."
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
            <Layout size={16} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Journal Mode</span>
          </div>
        </header>

        <RichEditor 
          content={blog.content}
          onChange={(val) => setBlog({...blog, content: val})}
          onSave={handleSave}
          isSaving={isSaving}
          title="Content Composer"
          onBack={() => router.push('/admin')}
        />
      </div>
    </div>
  );
}
