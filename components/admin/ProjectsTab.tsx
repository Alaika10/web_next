
'use client';
import React from 'react';
import { Trash2, Edit3, Layers, ImageIcon, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Project } from '../../types';

interface ProjectsTabProps {
  projects: Project[];
  onDelete: (id: string) => void;
}

export default function ProjectsTab({ projects, onDelete }: ProjectsTabProps) {
  const router = useRouter();

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      {projects.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border p-20 text-center space-y-4">
          <Layers className="mx-auto text-slate-200" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No models deployed</p>
        </div>
      )}
      
      {projects.map((proj) => (
        <div key={proj.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group hover:border-indigo-500/30 transition-all duration-300">
          <div className="flex flex-col lg:flex-row h-full">
            <div className="lg:w-72 relative h-48 lg:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800">
              {proj.imageUrl ? (
                <img src={proj.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80" alt={proj.title} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-2">
                  <ImageIcon size={32} />
                  <span className="text-[8px] font-black uppercase tracking-widest">No Visual</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 p-8 flex flex-col justify-between gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-black dark:text-white group-hover:text-indigo-600 transition-colors">{proj.title}</h3>
                    <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-1">ID: {proj.id.slice(0, 8)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => router.push(`/admin/projects/${proj.id}`)}
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-indigo-600 rounded-xl transition-all"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button 
                      onClick={() => onDelete(proj.id)} 
                      className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 hover:text-red-500 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {proj.description || "No description provided for this project instance."}
                </p>

                <div className="flex flex-wrap gap-2">
                  {proj.technologies && proj.technologies.length > 0 ? proj.technologies.map(tech => (
                    <span key={tech} className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-lg border border-slate-100 dark:border-slate-700">
                      {tech}
                    </span>
                  )) : (
                    <span className="text-[9px] font-bold text-slate-300 uppercase italic">No tech specified</span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                   <span className="text-[10px] font-bold text-slate-400 uppercase">Live Preview Active</span>
                </div>
                <button 
                  onClick={() => router.push(`/admin/projects/${proj.id}`)}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-1.5 group/btn"
                >
                  Enter Project Studio <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
