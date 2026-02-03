import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { supabase } from '../lib/supabase';
import { INITIAL_PROFILE } from '../constants';
import { Project, BlogPost, Profile } from '../types';
import { BarChart3, ArrowUpRight, MousePointer2 } from 'lucide-react';

// Placeholder SVG ringan untuk Radar Chart agar LCP/FCP cepat
const RadarPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center relative opacity-20">
    <svg viewBox="0 0 100 100" className="w-full h-full animate-pulse text-indigo-500">
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
      <path d="M50 10 L50 90 M10 50 L90 50 M20 20 L80 80 M80 20 L20 80" stroke="currentColor" strokeWidth="0.2" />
    </svg>
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  </div>
);

const HomeRadarChart = dynamic(() => import('../components/HomeRadarChart'), { 
  ssr: false,
  loading: () => <RadarPlaceholder />
});

export const revalidate = 3600;

export default async function HomePage() {
  let profile: Profile = INITIAL_PROFILE;
  let projects: Project[] = [];
  let blogs: BlogPost[] = [];

  if (supabase) {
    const [profileRes, projectsRes, blogsRes] = await Promise.all([
      supabase.from('profiles').select('*').maybeSingle(),
      supabase.from('projects').select('*').limit(2).order('created_at', { ascending: false }),
      supabase.from('blogs').select('*').limit(3).order('date', { ascending: false })
    ]);

    if (profileRes.data) profile = profileRes.data;
    if (projectsRes.data) {
      projects = projectsRes.data.map((p: any) => ({
        ...p,
        imageUrl: p.image_url
      }));
    }
    if (blogsRes.data) {
      blogs = blogsRes.data.map((item: any) => ({
        ...item,
        imageUrl: item.image_url
      }));
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10"></div>
      
      <div className="space-y-24 py-8 px-6 md:px-12 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2 md:pt-6">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                System_Status: Optimal
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tighter">
                Crafting <span className="text-slate-400">Intelligence.</span> <br/>
                <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-clip-text text-transparent">
                  {profile.title}
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
                {profile.about}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/projects" className="group px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-500/20 flex items-center gap-2">
                Explore Neural Repo <ArrowUpRight size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </Link>
              <Link href="/about" className="px-6 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-indigo-600 transition-all">
                Technical Dossier
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 relative w-full flex items-center justify-center min-h-[380px]">
            <div className="relative w-full max-w-[380px] aspect-square">
              <div className="absolute inset-0 bg-indigo-600/5 rounded-full blur-[60px]"></div>
              <div className="relative z-10 w-full h-full flex items-center justify-center animate-neural-float">
                <HomeRadarChart skills={profile.skills} />
              </div>

              {/* Float Tags */}
              <div className="absolute top-2 -right-4 md:-right-6 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hidden sm:block">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <BarChart3 size={12} className="text-indigo-600" />
                    <span className="font-mono text-[8px] font-black uppercase tracking-[0.15em] text-slate-900 dark:text-white">Expertise_Mapping</span>
                  </div>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className={`h-0.5 w-3 rounded-full ${i < 5 ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-700'}`}></div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-4 -left-6 p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-[1.5rem] border border-slate-200 dark:border-slate-800 shadow-xl hidden sm:block">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-900 dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-slate-900">
                    <MousePointer2 size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[7px] font-black uppercase tracking-widest text-slate-400">Status</span>
                    <span className="font-mono text-[10px] font-black uppercase">Stable_V25</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="space-y-1">
              <p className="font-mono text-[9px] uppercase text-indigo-600 font-black tracking-[0.3em]">Sector_01</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Selected Models.</h2>
            </div>
            <Link href="/projects" className="group flex items-center gap-2.5 px-5 py-2.5 bg-slate-50 dark:bg-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all">
              Full Repository <ArrowUpRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-700">
                <div className="h-[350px] overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                  {project.imageUrl && (
                    <Image 
                      src={project.imageUrl} 
                      alt={project.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                      priority={idx === 0}
                      className="object-cover transform group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0 opacity-80 group-hover:opacity-100" 
                      quality={75}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent opacity-60"></div>
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                    <div className="space-y-1">
                      <div className="flex gap-1.5">
                        {project.technologies.slice(0, 2).map(tech => (
                          <span key={tech} className="px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-lg text-[7px] font-black uppercase tracking-widest border border-white/10">{tech}</span>
                        ))}
                      </div>
                      <h3 className="text-2xl font-black tracking-tighter">{project.title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <ArrowUpRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-8">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">The Data Journal.</h2>
            <p className="text-slate-500 text-xs max-w-[240px] font-medium text-center md:text-right">
              Deep dives into neural architectures and large-scale data systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogs.map(post => (
              <article key={post.id} className="group space-y-4">
                <Link href={`/blog/${post.id}`} className="block space-y-4">
                  <div className="aspect-[16/11] rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800 shadow-sm transition-all duration-500 group-hover:shadow-lg">
                    {post.imageUrl && (
                      <Image 
                        src={post.imageUrl} 
                        alt={post.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                        quality={70}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-[1px] bg-indigo-600"></span>
                      <span className="font-mono text-[8px] text-indigo-600 font-black uppercase tracking-widest">{post.date}</span>
                    </div>
                    <h3 className="text-lg font-black tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed line-clamp-2">{post.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}