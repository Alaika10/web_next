
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { Project } from '../../../../types';
import { ArrowLeft, Code, ExternalLink, Monitor } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!supabase || !id) return;
      const { data } = await supabase.from('projects').select('*').eq('id', id).single();
      if (data) setProject(data);
      setLoading(false);
    };
    fetchProject();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div></div>;
  if (!project) return <div className="p-20 text-center">Project not found.</div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
      {/* Hero Header */}
      <div className="h-[70vh] relative overflow-hidden">
        <img 
          src={project.imageUrl || (project as any).image_url} 
          className="w-full h-full object-cover" 
          alt={project.title} 
        />
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"></div>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-8 animate-in zoom-in duration-700">
           <div className="flex flex-wrap justify-center gap-3">
             {project.technologies.map(tech => (
               <span key={tech} className="px-4 py-1.5 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                 {tech}
               </span>
             ))}
           </div>
           <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter max-w-5xl leading-none">
             {project.title}
           </h1>
           <div className="flex gap-4">
             <a href={project.link} target="_blank" className="flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-black text-sm hover:scale-105 transition-all shadow-xl">
               Live Demo <ExternalLink size={18} />
             </a>
             <Link href="/projects" className="flex items-center gap-2 px-8 py-3.5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black text-sm border border-white/20 hover:bg-white/20 transition-all">
               <ArrowLeft size={18} /> All Projects
             </Link>
           </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 px-6 -mt-20 relative z-20">
        {/* Left: Content */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 dark:border-slate-800">
           <div 
             className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-img:rounded-[2rem]"
             dangerouslySetInnerHTML={{ __html: (project as any).content_html || project.description }}
           />
        </div>

        {/* Right: Sidebar Info */}
        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-xl space-y-8">
             <div className="space-y-4">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                 <Monitor size={14} className="text-indigo-600" /> Platform Scope
               </p>
               <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                 {project.description}
               </p>
             </div>

             <div className="space-y-4">
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] flex items-center gap-2">
                 <Code size={14} className="text-indigo-600" /> Technology Stack
               </p>
               <div className="flex flex-wrap gap-2">
                 {project.technologies.map(tech => (
                   <span key={tech} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs font-bold border">
                     {tech}
                   </span>
                 ))}
               </div>
             </div>

             <div className="pt-6 border-t">
               <a href={project.link} target="_blank" className="w-full flex items-center justify-center gap-2 py-4 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all shadow-lg">
                 Visit Repository <ExternalLink size={16} />
               </a>
             </div>
           </div>

           <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-indigo-200 dark:shadow-none space-y-4">
             <h4 className="text-xl font-black">Want to build something similar?</h4>
             <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
               If this project inspires you, let's collaborate to bring your vision to life.
             </p>
             <Link href="/about" className="inline-block pt-2 font-black text-xs uppercase tracking-widest hover:underline">
               Contact Me →
             </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
