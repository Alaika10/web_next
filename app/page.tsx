import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '../lib/supabase';
import { INITIAL_PROFILE } from '../constants';
import { Project, BlogPost, Profile } from '../types';

export const revalidate = 3600; // Cache for 1 hour to improve Time to First Byte (TTFB)

export default async function HomePage() {
  let profile: Profile = INITIAL_PROFILE;
  let projects: Project[] = [];
  let blogs: BlogPost[] = [];

  if (supabase) {
    // Parallel fetching for performance
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

  const firstName = profile.name ? profile.name.split(' ')[0] : 'Alex';

  return (
    <div className="space-y-24 py-12 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Hero Section - Optimized for LCP */}
      <section className="flex flex-col md:flex-row items-center gap-12 pt-12 animate-in">
        <div className="flex-1 space-y-6">
          <span className="inline-block px-4 py-1.5 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold tracking-wide uppercase">Deploying Intelligence at Scale</span>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tighter">
            DataLab <span className="text-slate-400">by {firstName}.</span> <br/>
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">{profile.title}</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
            {profile.about}
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
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-[3rem] overflow-hidden shadow-2xl z-10 relative rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white dark:border-slate-800 bg-slate-100">
            {profile.avatar && (
              <Image 
                src={profile.avatar} 
                alt={profile.name} 
                width={400} 
                height={400} 
                className="w-full h-full object-cover"
                priority
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 768px) 256px, 320px"
              />
            )}
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
              <div className="h-72 overflow-hidden relative bg-slate-100 dark:bg-slate-800">
                {project.imageUrl && (
                  <Image 
                    src={project.imageUrl} 
                    alt={project.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700" 
                    quality={75}
                  />
                )}
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
              <div className="aspect-[16/10] rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 relative bg-slate-100 dark:bg-slate-800">
                {post.imageUrl && (
                  <Image 
                    src={post.imageUrl} 
                    alt={post.title} 
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                    quality={75}
                  />
                )}
              </div>
              <div className="space-y-2">
                <span className="text-indigo-600 font-black text-[10px] uppercase tracking-tighter">{post.date}</span>
                <Link href={`/blog/${post.id}`}>
                  <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug">{post.title}</h3>
                </Link>
                <p className="text-slate-500 text-sm line-clamp-2">{post.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}