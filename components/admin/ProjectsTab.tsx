'use client';
import React, { useRef } from 'react';
import { Trash2, Sparkles, Edit3, ExternalLink, Camera, Upload, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Project } from '../../types';

interface ProjectsTabProps {
  projects: Project[];
  isAiLoading: boolean;
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onAiRefine: (id: string, title: string, tech: string[]) => void;
}

export default function ProjectsTab({ projects, isAiLoading, onUpdate, onDelete, onAiRefine }: ProjectsTabProps) {
  const router = useRouter();
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { alert("Max 2MB"); return; }
      const reader = new FileReader();
      reader.onloadend = () => onUpdate(id, { imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {projects.map((proj) => (
        <div key={proj.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-4 relative h-64 lg:h-auto overflow-hidden bg-slate-100 dark:bg-slate-800">
              {proj.imageUrl ? (
                <img src={proj.imageUrl} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={proj.title} />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-300">No Image</div>
              )}
              
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                 <button 
                   onClick={() => router.push(`/admin/projects/${proj.id}`)}
                   className="bg-white text-slate-900 px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                 >
                   Open Case Study Editor
                 </button>
                 <button 
                   onClick={() => fileInputRefs.current[proj.id]?.click()}
                   className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                 >
                   <Camera size={14} /> Change Hero Image
                 </button>
              </div>

              <input 
                type="file" 
                ref={el => { fileInputRefs.current[proj.id] = el; }} 
                className="hidden" 
                accept="image/*"
                onChange={(e) => handleFileChange(proj.id, e)}
              />
            </div>
            
            <div className="lg:col-span-8 p-10 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <input 
                  className="text-2xl font-black bg-transparent border-none focus:ring-0 w-full p-0 dark:text-white"
                  defaultValue={proj.title}
                  onBlur={(e) => onUpdate(proj.id, { title: e.target.value })}
                />
                <button onClick={() => onDelete(proj.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between">
                  Hero Description
                  <button 
                    disabled={isAiLoading}
                    onClick={() => onAiRefine(proj.id, proj.title, proj.technologies)}
                    className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-all disabled:opacity-50"
                  >
                    <Sparkles size={12} /> Refine with Gemini
                  </button>
                </label>
                <textarea 
                  className="w-full h-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border-none text-sm leading-relaxed dark:text-slate-300"
                  defaultValue={proj.description}
                  onBlur={(e) => onUpdate(proj.id, { description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Technologies (Comma Sep)</label>
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2 text-xs font-bold dark:text-slate-200"
                    defaultValue={proj.technologies.join(', ')}
                    onBlur={(e) => onUpdate(proj.id, { technologies: e.target.value.split(',').map(s => s.trim()) })}
                  />
                </div>
                <div className="flex flex-col justify-end">
                   <button 
                     onClick={() => router.push(`/admin/projects/${proj.id}`)}
                     className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:gap-4 transition-all"
                   >
                     Write Detailed Case Study <ExternalLink size={12} />
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}