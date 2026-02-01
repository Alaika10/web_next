
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Profile, Project, BlogPost } from '../types';
import { supabase } from '../lib/supabase';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_BLOGS } from '../constants';

export default function HomePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
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
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
    <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
  </div>;

  return (
    <div className="space-y-24 py-12 px-6 md:px-12 max-w-7xl mx-auto animate-in fade-in duration-700">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 pt-12">
        <div className="flex-1 space-y-6">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold tracking-wide uppercase">Deploying Intelligence at Scale</span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            DataLab <span className="text-slate-400">by Alex.</span> <br/>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Machine Learning Architect</span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            Specialized in turning high-dimensional data into predictive power. I build end-to-end ML pipelines that solve real-world complexities.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/projects" className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none">
              View Neural Gallery
            </Link>
            <Link href="/about" className="px-8 py-3.5 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-semibold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all">
              The Researcher
            </Link>
          </div>
        </div>
        <div className="flex-shrink-0 relative">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl z-10 relative rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-slate-800">
            <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
          </div>
          <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 rounded-[3rem] -z-0"></div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="space-y-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Technical Implementations</h2>
            <p className="text-slate-500">From Computer Vision to NLP—selected neural architectures.</p>
          </div>
          <Link href="/projects" className="text-indigo-600 font-bold hover:underline flex items-center gap-2">Explore All Models <span>→</span></Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-500">
              <div className="h-72 overflow-hidden relative">
                <img src={project.imageUrl || (project as any).image_url} alt={project.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                  <Link href={`/projects/${project.id}`} className="bg-white text-indigo-900 px-6 py-2.5 rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">Architecture Details</Link>
                </div>
              </div>
              <div className="p-8 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <span key={tech} className="text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1 rounded-lg uppercase tracking-widest">{tech}</span>
                  ))}
                </div>
                <h3 className="text-2xl font-bold">{project.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">{project.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-slate-900 rounded-[3rem] p-12 md:p-20 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 dark:shadow-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-transparent opacity-50"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">Engineering intelligence through data.</h2>
            <p className="text-slate-300 text-lg opacity-90 leading-relaxed">
              I specialize in end-to-end ML lifecycle management—from data cleaning and feature engineering to model deployment and monitoring.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
             {profile.skills.slice(0, 4).map(skill => (
               <div key={skill.name} className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                 <p className="font-bold text-lg mb-2">{skill.name}</p>
                 <div className="h-1.5 bg-indigo-500/30 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 transition-all duration-1000" style={{ width: `${skill.level}%` }}></div>
                 </div>
               </div>
             ))}
          </div>
        </div>
      </section>

      {/* Latest Blogs */}
      <section className="space-y-12">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">The Data Journal</h2>
            <p className="text-slate-500">Deep dives into algorithms and stochastic systems.</p>
          </div>
          <Link href="/blog" className="text-indigo-600 font-bold hover:underline">Read Research →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map(post => (
            <div key={post.id} className="group space-y-4">
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
                <img src={post.imageUrl || (post as any).image_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="space-y-2">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-tighter">{post.date}</span>
                <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
