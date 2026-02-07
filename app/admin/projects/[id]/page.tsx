
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { processContent } from '../../../../services/contentProcessor';
import RichEditor from '../../../../components/admin/RichEditor';
import { Project } from '../../../../types';
import { Briefcase } from 'lucide-react';

export default function ProjectEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      if (!supabase || !id) return;
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) setProject({ ...data, content: data.content || "" });
      } catch (err) {
        console.error("Fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id, router]);

  const handleSave = async () => {
    if (!supabase || !project || !id) return;
    setIsSaving(true);

    try {
      // Server-side processing to HTML for public safety
      const contentHtml = await processContent(project.content || "");
      const { error } = await supabase.from('projects').update({ 
        content: project.content,
        content_html: contentHtml,
        title: project.title
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
       <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Project Studio...</p>
    </div>
  );

  if (!project) return <div className="p-20 text-center font-black uppercase text-red-500">Project record not found.</div>;

  return (
    <div className="h-screen flex flex-col p-6 lg:p-10 bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col gap-6">
        <header className="flex items-center justify-between gap-6">
          <div className="flex-1">
             <input 
              className="text-3xl md:text-5xl font-black bg-transparent border-none outline-none w-full text-slate-900 dark:text-white placeholder:text-slate-200"
              value={project.title}
              onChange={(e) => setProject({...project, title: e.target.value})}
              placeholder="Project Name..."
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
            <Briefcase size={16} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Case Study Mode</span>
          </div>
        </header>

        <RichEditor 
          content={project.content || ""}
          onChange={(val) => setProject({...project, content: val})}
          onSave={handleSave}
          isSaving={isSaving}
          title="Case Study Editor"
          onBack={() => router.push('/admin')}
        />
      </div>
    </div>
  );
}
