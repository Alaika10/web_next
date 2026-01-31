
'use client';
import React, { useState, useEffect } from 'react';
import { Project } from '../../types';
import { supabase } from '../../lib/supabase';
import { INITIAL_PROJECTS } from '../../constants';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (data) setProjects(data);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="max-w-3xl space-y-4">
        <h1 className="text-5xl font-black tracking-tight">Portfolio</h1>
        <p className="text-xl text-slate-500 leading-relaxed">A curation of digital experiences, architectural solutions, and creative experiments.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => (
          <div key={project.id} className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
            <div className="aspect-[4/3] relative overflow-hidden">
              <img 
                src={project.imageUrl || (project as any).image_url} 
                alt={project.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-[10px] text-white font-black uppercase tracking-widest">{tech}</span>
                ))}
              </div>
            </div>
            <div className="p-8 flex-grow flex flex-col space-y-4">
              <h3 className="text-2xl font-bold group-hover:text-indigo-600 transition-colors">{project.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed flex-grow">{project.description}</p>
              <div className="pt-4">
                <a href={project.link} className="inline-flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest hover:gap-4 transition-all">
                  Case Study <span>→</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
