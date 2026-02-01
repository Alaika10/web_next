
'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../lib/supabase';
import { Project } from '../../../types';
import { ArrowLeft, Code, ExternalLink, Monitor, Cpu, Layers, Github, Globe, Sparkles } from 'lucide-react';
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
      <h2 className="text-2xl font-black text-slate-400 uppercase tracking-widest">Project Not Found</h2>
      <Link href="/projects" className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-200 dark:shadow-none transition-transform hover:scale-105">
        Return to Gallery
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Immersive Hero Header */}
      <section className="relative h-[60vh] md:h-[75vh] min-h-[500px] flex items-end overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={project.imageUrl || (project as any).image_url} 
            className="w-full h-full object-cover" 
            alt={project.title} 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-slate-950 via-slate-950/70 to-slate-950/30"></div>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 pb-16 md:pb-24 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="max-w-4xl space-y-6">
            <div className="flex flex-wrap gap-2">
              {project.technologies.map(tech => (
                <span key={tech} className="px-4 py-1.5 bg-indigo-600/20 backdrop-blur-xl text-indigo-300 border border-indigo-500/30 rounded-full text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
                  {tech}
                </span>
              ))}
            </div>
            
            <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9] break-words">
              {project.title}
            </h1>
            
            <p className="text-lg md:text-2xl text-slate-300 max-w-2xl leading-relaxed font-medium opacity-90 break-words">
              {project.description}
            </p>
          </div>
        </div>

        {/* Floating Navigation */}
        <div className="absolute top-8 left-6 md:left-12 z-20">
           <Link href="/projects" className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-xl text-white rounded-full font-bold text-xs uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">
             <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Projects
           </Link>
        </div>
      </section>

      {/* Main Content & Specs Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 mt-12 md:-mt-12 relative z-20">
        
        {/* Left Column: Content Deep Dive */}
        <div className="lg:col-span-8 space-y-12">
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="flex items-center gap-3 mb-10">
              <div className="w-1.5 h-10 bg-indigo-600 rounded-full"></div>
              <h2 className="text-3xl font-black tracking-tight flex items-center gap-3 text-slate-900 dark:text-white">
                Project Overview <Sparkles size={20} className="text-indigo-600" />
              </h2>
            </div>
            
            <div 
              className="rich-text-content prose prose-lg md:prose-xl dark:prose-invert max-w-none 
              prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-indigo-600 
              prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-[1.8]
              prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:my-12
              break-words overflow-hidden"
              dangerouslySetInnerHTML={{ 
                __html: (project as any).content_html || `<p class="text-xl">${project.description}</p>` 
              }}
            />
          </div>
        </div>

        {/* Right Column: Information Sidebar */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-8">
            
            {/* Project Specs Box */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                  <Monitor size={14} className="text-indigo-600" /> Deliverable
                </p>
                <p className="text-slate-900 dark:text-white font-black text-xl leading-snug">
                  High-performance web architecture & UI/UX Design
                </p>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.3em] flex items-center gap-2">
                  <Cpu size={14} className="text-indigo-600" /> Core Stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-bold border border-slate-100 dark:border-slate-700">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-3 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 dark:shadow-none"
                >
                  Live Preview <ExternalLink size={16} />
                </a>
                <a 
                  href="#" 
                  className="w-full flex items-center justify-center gap-3 py-5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                >
                  View Source <Github size={16} />
                </a>
              </div>
            </div>

            {/* Newsletter or Contact Card */}
            <div className="bg-slate-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[80px] -translate-y-10 translate-x-10"></div>
              <div className="relative z-10 space-y-6">
                <h4 className="text-2xl font-black leading-tight">Like this project?</h4>
                <p className="text-slate-400 text-sm leading-relaxed font-medium">
                  Let's discuss how we can build something similar for your next big idea.
                </p>
                <Link href="/about" className="inline-flex items-center gap-3 font-black text-[10px] uppercase tracking-widest bg-white text-slate-900 px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-colors">
                  Contact Me <Sparkles size={14} />
                </Link>
              </div>
            </div>
            
          </div>
        </aside>
      </div>
    </div>
  );
}
