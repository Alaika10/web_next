
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { processContent } from '../../../../services/contentProcessor';
import RichEditor from '../../../../components/admin/RichEditor';
import { Project } from '../../../../types';
import { isAuthenticated } from '../../../../lib/auth';

export default function ProjectEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const fetchProject = async () => {
      if (!supabase || !id) return;
      const { data } = await supabase.from('projects').select('*').eq('id', id).single();
      if (data) setProject({ ...data, content: data.content || "" });
      setLoading(false);
    };
    fetchProject();
  }, [id, router]);

  const handleSave = async () => {
    if (!supabase || !project || !id) return;
    setIsSaving(true);

    try {
      const contentHtml = await processContent(project.content || "");
      const { error } = await supabase.from('projects').update({ 
        content: project.content,
        content_html: contentHtml,
        title: project.title
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
  if (!project) return <div className="p-20 text-center">Project not found.</div>;

  return (
    <div className="h-screen flex flex-col p-6 lg:p-12 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col gap-6">
        <input 
          className="text-4xl font-black bg-transparent border-none outline-none mb-4 w-full"
          value={project.title}
          onChange={(e) => setProject({...project, title: e.target.value})}
          placeholder="Enter project title..."
        />
        <RichEditor 
          content={project.content || ""}
          onChange={(val) => setProject({...project, content: val})}
          onSave={handleSave}
          isSaving={isSaving}
          title="Project Editor"
          onBack={() => router.push('/admin')}
        />
      </div>
    </div>
  );
}
