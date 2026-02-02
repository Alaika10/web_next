import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { Terminal, ChevronRight } from 'lucide-react';
import { Project } from '../../types';

export const revalidate = 60; // Revalidate every minute

export default async function ProjectsPage() {
  let projects: Project[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (data) {
      projects = data.map((p: any) => ({
        ...p,
        imageUrl: p.image_url
      }));
    }
  }

  return (
    <div className="py-16 md:py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-16 md:space-y-24 animate-in">
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em]">
          <Terminal size={14} /> Repository / Implementations
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
          Technical <br/><span className="text-slate-400">Analysis.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
          A collection of research implementations, architecture breakdowns, and data-driven solutions optimized for scalability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20 md:gap-y-24">
        {projects.length === 0 ? (
          <div className="col-span-full py-32 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">No models deployed in this sector</p>
          </div>
        ) : (
          projects.map((project, idx) => (
            <Link 
              key={project.id} 
              href={`/projects/${project.id}`}
              className="group flex flex-col space-y-6 md:space-y-8"
            >
              <div className="aspect-[16/10] relative rounded-[2rem] md:rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:border-indigo-500/30">
                {project.imageUrl && (
                  <Image 
                    src={project.imageUrl} 
                    alt={project.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 opacity-80 group-hover:opacity-100" 
                    priority={idx < 2} // Priority for first two projects
                  />
                )}
                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2">
                   <div className="px-3 md:px-4 py-1.5 bg-black/80 backdrop-blur-md text-white font-mono text-[8px] md:text-[9px] uppercase tracking-widest rounded-full border border-white/10 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span> Production Ready
                   </div>
                </div>
              </div>

              <div className="space-y-4 px-2 md:px-4">
                <div className="flex items-center gap-4 md:gap-6">
                  <span className="font-mono text-[10px] text-slate-400">#{String(idx + 1).padStart(2, '0')}</span>
                  <div className="h-px flex-1 bg-slate-100 dark:bg-slate-800/50"></div>
                  <div className="flex gap-2">
                    {project.technologies.slice(0, 3).map(tech => (
                      <span key={tech} className="font-mono text-[9px] uppercase text-indigo-500 font-bold">{tech}</span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-start gap-4 md:gap-8">
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight group-hover:text-indigo-600 transition-colors">{project.title}</h3>
                  <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all duration-500">
                    <ChevronRight size={18} />
                  </div>
                </div>
                
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 text-base md:text-lg">
                  {project.description}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}