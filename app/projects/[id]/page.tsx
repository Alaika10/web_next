import React from 'react';
import { supabase } from '../../../lib/supabase';
import { Project } from '../../../types';
import { 
  ArrowLeft, ExternalLink, Cpu, Github, 
  Binary, Layers, ShieldCheck 
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import SocialShare from '../../../components/SocialShare';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params;
  if (!supabase) return {};

  try {
    const { data: project } = await supabase
      .from('projects')
      .select('title, description')
      .eq('id', id)
      .single();

    if (!project) return { title: 'Project Not Found' };

    const ogImageUrl = `/api/og/project/${id}`;

    return {
      alternates: { canonical: `/projects/${id}` },
      title: project.title,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        type: 'article',
        url: `/projects/${id}`,
        images: [{ url: ogImageUrl, width: 1200, height: 630 }],
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description,
        images: [ogImageUrl],
      },
    };
  } catch (e) {
    return { title: 'Project Detail', alternates: { canonical: `/projects/${id}` } };
  }
}

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  if (!supabase) return notFound();

  const { data: project, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !project) return notFound();

  const currentProject: Project = {
    ...project,
    imageUrl: project.image_url
  };

  return (
    <div className="min-h-screen pb-32 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-12">
        <Link href="/projects" className="inline-flex items-center gap-3 text-slate-400 hover:text-indigo-600 transition-colors font-mono-tech text-[10px] uppercase tracking-[0.2em] mb-12">
          <ArrowLeft size={14} /> Back to Repository
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-lg font-mono-tech text-[9px] uppercase font-black tracking-widest">Model_V1.0</span>
                <span className="text-slate-300 font-mono-tech text-[9px]">/</span>
                <span className="font-mono-tech text-[9px] text-slate-400 uppercase tracking-widest">Created: {new Date(currentProject.createdAt || (project as any).created_at).toLocaleDateString()}</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none break-words">
                {currentProject.title}
              </h1>
            </div>

            <p className="text-2xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-2xl">
              {currentProject.description}
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-end gap-6">
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] space-y-6 shadow-sm">
               <div className="flex items-center justify-between">
                 <span className="font-mono-tech text-[10px] uppercase text-slate-400">System Accuracy</span>
                 <span className="font-mono-tech text-xs font-black text-emerald-500">98.4%</span>
               </div>
               <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div className="w-[98%] h-full bg-emerald-500"></div>
               </div>
               <div className="flex gap-4">
                 <a href={currentProject.link} className="flex-1 flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all">
                   Deploy <ExternalLink size={12} />
                 </a>
                 <a href="#" className="w-14 h-14 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all">
                   <Github size={20} />
                 </a>
               </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20">
        <div className="aspect-[21/9] rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl relative group">
          <Image src={currentProject.imageUrl} fill className="object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000" alt={currentProject.title} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-20 grid grid-cols-1 lg:grid-cols-12 gap-20">
        <aside className="lg:col-span-4 space-y-12">
          <div className="p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] shadow-sm">
            <SocialShare title={currentProject.title} />
          </div>
        </aside>

        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-[3rem] p-10 md:p-16 border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
          <div 
            className="rich-text-content prose prose-lg md:prose-xl dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ 
              __html: (project as any).content_html || `<p>${currentProject.description}</p>` 
            }}
          />
        </div>
      </div>
    </div>
  );
}