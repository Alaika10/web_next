
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Project } from '../../../types';
import { ArrowLeft, Code, ExternalLink, Monitor, Cpu, Layers, Github, Globe } from 'lucide-react';
import Link from 'next/link';

export default function ProjectDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      if (!supabase || !id) return;
      try {
        const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) setProject(data);
      } catch (err) {
        console.error("Error fetching project:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!project) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      <h2 className="text-2xl font-black text-slate-400">Project Not Found</h2>
      <Link href="/projects" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold">Return to Gallery</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
      {/* Hero Showcase Section */}
      <section className="relative h-[65vh] md:h-[80vh] flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
           <img 
            src={project.imageUrl || (project as any).image_url} 
            className="w-full h-full object-cover" 
            alt={project.title} 
          />
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[4px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center space-y-8 animate-in zoom-in duration-1000">
           <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4">
             {project.technologies.map(tech => (
               <span key={tech} className="px-4 py-1.5 bg-indigo-600/20 backdrop-blur-md text-indigo-400 border border-indigo-500/30 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em] shadow-2xl">
                 {tech}
               </span>
             ))}
           </div>
           
           <h1 className="text-5xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-[0.9] drop-shadow-2xl">
             {project.title}
           </h1>
           
           <p className="text-lg md:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-medium opacity-80">
             {project.description}
           </p>

           <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
             <a href={project.link} target="_blank" className="flex items-center justify-center gap-3 px-10 py-4 bg-white text-slate-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
               Launch Project <Globe size={18} />
             </a>
             <Link href="/projects" className="flex items-center justify-center gap-3 px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black text-sm uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">
               <ArrowLeft size={18} /> Gallery
             </Link>
           </div>
        </div>
      </section>

      {/* Narrative Section with Sidebar */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 px-6 -mt-16 md:-mt-24 relative z-20">
        
        {/* Left Column: Deep Dive */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-16 lg:p-20 shadow-2xl border border-slate-100 dark:border-slate-800">
           <div className="flex items-center gap-3 mb-12">
              <div className="w-2 h-12 bg-indigo-600 rounded-full"></div>
              <h2 className="text-3xl font-black tracking-tight">The Architecture</h2>
           </div>
           
           <div 
             className="rich-text-content prose prose-lg md:prose-xl dark:prose-invert max-w-none 
             prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-indigo-600 
             prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-[1.9]
             prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:my-16"
             dangerouslySetInnerHTML={{ __html: (project as any).content_html || `<p>${project.description}</p>` }}
           />
        </div>

        {/* Right Column: Sticky Metadata */}
        <aside className="lg:col-span-4 space-y-10">
           <div className="sticky top-32 space-y-10">
             
             {/* Specs Box */}
             <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] p-10 border border-slate-200/50 dark:border-slate-800 shadow-xl space-y-10">
               <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                   <Layers size={14} className="text-indigo-600" /> Core Challenge
                 </p>
                 <p className="text-slate-700 dark:text-slate-300 font-bold text-lg leading-relaxed">
                   Designing a scalable system that handles high-throughput data while maintaining 60fps UI performance.
                 </p>
               </div>

               <div className="space-y-4">
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                   <Code size={14} className="text-indigo-600" /> Technical Stack
                 </p>
                 <div className="flex flex-wrap gap-2 pt-2">
                   {project.technologies.map(tech => (
                     <span key={tech} className="px-4 py-2 bg-white dark:bg-slate-800 rounded-xl text-xs font-black border border-slate-200 dark:border-slate-700 shadow-sm">
                       {tech}
                     </span>
                   ))}
                 </div>
               </div>

               <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
                 <a href={project.link} target="_blank" className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all shadow-xl">
                   Source Code <Github size={18} />
                 </a>
                 <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest">Released in 2024</p>
               </div>
             </div>

             {/* Call to Action Box */}
             <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-1000"></div>
               <div className="relative z-10 space-y-6">
                 <h4 className="text-2xl font-black leading-tight">Interested in the process?</h4>
                 <p className="text-indigo-100 text-sm leading-relaxed font-medium">
                   I'm always open to discussing technical architecture or new collaborative ventures.
                 </p>
                 <Link href="/about" className="inline-flex items-center gap-2 pt-2 font-black text-xs uppercase tracking-widest bg-white text-indigo-600 px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors">
                   Get in touch
                 </Link>
               </div>
             </div>
             
           </div>
        </aside>
      </div>
    </div>
  );
}
