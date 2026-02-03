import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { supabase } from '../lib/supabase';
import { INITIAL_PROFILE } from '../constants';
import { Project, BlogPost, Profile } from '../types';
import { BarChart3, ArrowUpRight, MousePointer2 } from 'lucide-react';

// Placeholder SVG statis yang sangat ringan (Critical for FCP)
const RadarPlaceholder = () => (
  <div className="w-full h-full flex items-center justify-center relative bg-slate-50/50 dark:bg-slate-900/50 rounded-full border border-dashed border-slate-200 dark:border-slate-800">
    <div className="w-12 h-12 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
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
      <div className="space-y-24 py-8 px-6 md:px-12 max-w-7xl mx-auto">
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2 md:pt-6">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
              </span>
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                System_Status: Online
              </span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black leading-[1.1] tracking-tighter">
                Crafting <span className="text-slate-400">Intelligence.</span> <br/>
                <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {profile.title}
                </span>
              </h1>
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                {profile.about}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href="/projects" className="px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center gap-2">
                Explore Repository <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 relative flex items-center justify-center min-h-[350px]">
            <div className="relative w-full max-w-[350px] aspect-square">
              <HomeRadarChart skills={profile.skills} />
            </div>
          </div>
        </section>

        <section className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Selected Models.</h2>
            <Link href="/projects" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">
              View All Systems
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                <div className="h-[300px] overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                  {project.imageUrl && (
                    <Image 
                      src={project.imageUrl} 
                      alt={project.title} 
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      priority={idx === 0} // LCP CRITICAL OPTIMIZATION
                      className="object-cover transform group-hover:scale-105 transition-transform duration-700 grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100" 
                      quality={60} // Lower quality for faster load
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end text-white">
                    <h3 className="text-2xl font-black tracking-tighter">{project.title}</h3>
                    <ArrowUpRight size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-10">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">The Data Journal.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogs.map(post => (
              <article key={post.id} className="group space-y-4">
                <Link href={`/blog/${post.id}`} className="block space-y-4">
                  <div className="aspect-[16/11] rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800 transition-all group-hover:shadow-lg">
                    {post.imageUrl && (
                      <Image 
                        src={post.imageUrl} 
                        alt={post.title} 
                        fill
                        sizes="(max-width: 768px) 100vw, 400px"
                        className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                        quality={50}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="font-mono text-[8px] text-indigo-600 font-black uppercase tracking-widest">{post.date}</span>
                    <h3 className="text-lg font-black tracking-tight leading-snug group-hover:text-indigo-600 transition-colors">{post.title}</h3>
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