
import React, { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { supabase } from '../lib/supabase';
import { INITIAL_PROFILE } from '../constants';
import { Project, BlogPost, Profile, Certification } from '../types';
import { ArrowUpRight, Award, ShieldCheck, Activity } from 'lucide-react';
import Skeleton from '../components/Skeleton';

const HomeRadarChart = dynamic(() => import('../components/HomeRadarChart'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-full animate-pulse"></div>
});

export const revalidate = 60;

async function getHomeData() {
  if (!supabase) return { projects: [], blogs: [], certs: [], profile: INITIAL_PROFILE };
  
  // Parallel fetching untuk efisiensi maksimal
  const [projectsRes, blogsRes, certsRes, profileRes] = await Promise.all([
    supabase.from('projects').select('id, title, description, image_url').limit(2).order('created_at', { ascending: false }),
    supabase.from('blogs').select('id, title, excerpt, date, image_url').limit(3).order('date', { ascending: false }),
    supabase.from('certifications').select('id, title, issuer, image_url, issue_date').limit(3).order('issue_date', { ascending: false }),
    supabase.from('profiles').select('name, title, about, skills').maybeSingle()
  ]);

  return {
    projects: (projectsRes.data || []).map((p: any) => ({ ...p, imageUrl: p.image_url })),
    blogs: (blogsRes.data || []).map((b: any) => ({ ...b, imageUrl: b.image_url })),
    certs: (certsRes.data || []).map((c: any) => ({ ...c, imageUrl: c.image_url })),
    profile: profileRes.data || INITIAL_PROFILE
  };
}

export default async function HomePage() {
  const { projects, blogs, certs, profile } = await getHomeData();

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="space-y-24 py-8 px-6 md:px-12 max-w-7xl mx-auto pb-24">
        {/* HERO */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-2 md:pt-6">
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 shadow-sm">
              <span className="flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-indigo-400 opacity-75"></span>
              </span>
              <span className="font-mono text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
                System_Node: Online / Latency: Optimal
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

        {/* PROJECTS */}
        <section className="space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Selected Models.</h2>
            <Link href="/projects" className="text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project, idx) => (
              <Link key={project.id} href={`/projects/${project.id}`} className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
                <div className="h-[300px] overflow-hidden relative bg-slate-100 dark:bg-slate-900">
                  {project.imageUrl && (
                    <Image src={project.imageUrl} alt={project.title} fill sizes="(max-width: 768px) 100vw, 600px" priority={idx === 0} className="object-cover grayscale group-hover:grayscale-0 opacity-90 group-hover:opacity-100 transition-all duration-700" quality={75} />
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

        {/* CERTS */}
        <section className="space-y-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-600 font-mono text-[9px] uppercase tracking-widest font-black">
              <Activity size={12} className="animate-pulse" /> Verified_Credentials
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">Verified Authority.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {certs.map((cert) => (
              <div key={cert.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] hover:shadow-xl transition-all group flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center p-2 group-hover:rotate-6 transition-transform">
                    {cert.imageUrl ? <img src={cert.imageUrl} alt={cert.issuer} className="w-full h-full object-contain" /> : <Award className="text-indigo-600" size={24} />}
                  </div>
                  <ShieldCheck className="text-emerald-500" size={18} />
                </div>
                <div>
                  <h3 className="font-black text-base line-clamp-1">{cert.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* BLOG */}
        <section className="space-y-10">
          <div className="border-b border-slate-200 dark:border-slate-800 pb-8">
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">The Data Journal.</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogs.map(post => (
              <article key={post.id} className="group">
                <Link href={`/blog/${post.id}`} className="block space-y-4">
                  <div className="aspect-[16/11] rounded-[1.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800">
                    {post.imageUrl && <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, 400px" className="object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all" quality={60} />}
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
