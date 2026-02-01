
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile, Project, BlogPost } from '../../types';
import { supabase } from '../../lib/supabase';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_BLOGS } from '../../constants';
import { Sparkles, ArrowRight, Database, BrainCircuit, Activity } from 'lucide-react';

// Reusable Skeleton Component
const Skeleton = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl ${className}`}></div>
);

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data: p } = await supabase.from('profiles').select('*').single();
        if (p) setProfile(p);
        
        const { data: projs } = await supabase.from('projects').select('*').limit(2).order('created_at', { ascending: false });
        if (projs) setProjects(projs);
        
        const { data: b } = await supabase.from('blogs').select('*').limit(3).order('date', { ascending: false });
        if (b) setBlogs(b);
      } catch (e) {
        console.error("Home load error:", e);
      } finally {
        // Slight delay for smooth transition from skeleton
        setTimeout(() => setLoading(false), 500);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 md:py-20 space-y-24 md:space-y-32">
        
        {/* HERO SECTION */}
        <section className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          <div className="space-y-8 order-2 lg:order-1">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-20 w-3/4" />
                <Skeleton className="h-24 w-full" />
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-40" />
                  <Skeleton className="h-12 w-40" />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-left-8 duration-1000">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-[0.2em] mb-6">
                  <Activity size={14} /> Data-Driven Intelligence
                </div>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
                  DataLab <span className="text-slate-300 dark:text-slate-700">by Alex.</span><br/>
                  <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">ML Architect.</span>
                </h1>
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed mb-10">
                  Transforming complex datasets into high-performance neural solutions. Specialized in end-to-end Machine Learning lifecycles and predictive systems.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/projects" className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 dark:shadow-none flex items-center gap-3">
                    View Model Zoo <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/about" className="px-8 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white dark:hover:bg-slate-900 transition-all">
                    Research Bio
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end">
            {loading ? (
              <Skeleton className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] rotate-3" />
            ) : (
              <div className="relative group animate-in fade-in zoom-in duration-1000">
                <div className="absolute inset-0 bg-indigo-600 rounded-[3.5rem] rotate-6 scale-95 opacity-20 blur-2xl group-hover:rotate-12 transition-transform duration-700"></div>
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl relative z-10 rotate-3 group-hover:rotate-0 transition-transform duration-700 border-4 border-white dark:border-slate-900">
                  <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-4 -right-4 p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-xl z-20 border border-slate-100 dark:border-slate-800 flex items-center gap-3 animate-bounce">
                  <BrainCircuit className="text-indigo-600" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Research</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Technical Deployments</h2>
              <p className="text-slate-500 font-medium max-w-md">Neural architectures and data systems built for production scale.</p>
            </div>
            <Link href="/projects" className="group text-indigo-600 font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
              Explore All <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="space-y-6">
                  <Skeleton className="aspect-video w-full rounded-[2.5rem]" />
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))
            ) : (
              projects.map((project) => (
                <div key={project.id} className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500">
                  <div className="aspect-video overflow-hidden relative">
                    <img src={project.imageUrl || (project as any).image_url} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-indigo-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <Link href={`/projects/${project.id}`} className="bg-white text-indigo-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform">
                        System Architecture
                      </Link>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.slice(0, 3).map(tech => (
                        <span key={tech} className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-lg uppercase tracking-widest">{tech}</span>
                      ))}
                    </div>
                    <h3 className="text-3xl font-black tracking-tight">{project.title}</h3>
                    <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">{project.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* STATS SECTION */}
        <section className="bg-slate-900 rounded-[3rem] md:rounded-[4rem] p-8 md:p-20 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-600/10 blur-[120px] rounded-full"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tighter">Data is the <br/><span className="text-indigo-500">New Architecture.</span></h2>
              <p className="text-slate-400 text-lg md:text-xl leading-relaxed font-medium">
                I focus on building stochastic systems that learn and adapt. My stack is optimized for high-throughput data processing and inference.
              </p>
              <div className="flex flex-wrap gap-8">
                <div>
                  <p className="text-4xl font-black text-indigo-500 mb-1">98%</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Model Accuracy Avg</p>
                </div>
                <div className="w-px h-12 bg-slate-800 hidden sm:block"></div>
                <div>
                  <p className="text-4xl font-black text-indigo-500 mb-1">20TB+</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Data Processed</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               {loading ? (
                 [1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 w-full bg-white/5" />)
               ) : (
                 profile.skills.slice(0, 4).map(skill => (
                   <div key={skill.name} className="p-6 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 group hover:border-indigo-500/50 transition-colors">
                     <p className="font-black text-sm mb-4 uppercase tracking-widest">{skill.name}</p>
                     <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                     </div>
                   </div>
                 ))
               )}
            </div>
          </div>
        </section>

        {/* BLOG SECTION */}
        <section className="space-y-12">
          <div className="flex justify-between items-end">
            <div className="space-y-3">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter">Research Journal</h2>
              <p className="text-slate-500 font-medium">Notes on stochastic systems, neural logic, and automation.</p>
            </div>
            <Link href="/blog" className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Full Archive →</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[16/10] w-full rounded-3xl" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            ) : (
              blogs.map(post => (
                <div key={post.id} className="group space-y-5">
                  <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800">
                    <img src={post.imageUrl || (post as any).image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Database size={12} className="text-indigo-600" />
                      <span className="text-indigo-600 font-black text-[10px] uppercase tracking-widest">{post.date}</span>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 font-medium leading-relaxed">{post.excerpt}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
