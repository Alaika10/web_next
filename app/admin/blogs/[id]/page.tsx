
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { processContent } from '../../../../services/contentProcessor';
import RichEditor from '../../../../components/admin/RichEditor';
import { BlogPost } from '../../../../types';
import { isAuthenticated } from '../../../../lib/auth';

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
      const { data } = await supabase.from('blogs').select('*').eq('id', id).single();
      if (data) setBlog(data);
      setLoading(false);
    };
    fetchBlog();
  }, [id, router]);

  const handleSave = async () => {
    if (!supabase || !blog || !id) return;
    setIsSaving(true);
    
    try {
      const contentHtml = await processContent(blog.content);
      const { error } = await supabase.from('blogs').update({ 
        content: blog.content,
        content_html: contentHtml,
        title: blog.title
      }).eq('id', id);

      if (!error) {
        router.push('/admin');
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!blog) return <div className="p-20 text-center">Article not found.</div>;

  return (
    <div className="h-screen flex flex-col p-6 lg:p-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-6">
        <input 
          className="text-4xl font-black bg-transparent border-none outline-none mb-4 w-full"
          value={blog.title}
          onChange={(e) => setBlog({...blog, title: e.target.value})}
          placeholder="Enter article title..."
        />
        <RichEditor 
          content={blog.content}
          onChange={(val) => setBlog({...blog, content: val})}
          onSave={handleSave}
          isSaving={isSaving}
          title="Journal Editor"
          onBack={() => router.push('/admin')}
        />
      </div>
    </div>
  );
}
