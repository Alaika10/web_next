import React from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { INITIAL_PROFILE } from '../../constants';
import { supabase } from '../../lib/supabase';

const AboutChart = dynamic(() => import('../../components/AboutChart'), { 
  ssr: false,
  loading: () => <div className="h-[500px] bg-slate-100 dark:bg-slate-800 rounded-[3rem] animate-pulse" />
});

export default async function AboutPage() {
  let profile = INITIAL_PROFILE;

  if (supabase) {
    const { data } = await supabase.from('profiles').select('*').single();
    if (data) profile = data;
  }

  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-32 animate-in fade-in duration-700">
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <div className="space-y-10 order-2 lg:order-1">
          <h1 className="text-6xl font-black tracking-tighter">Behind the <br/><span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Digital Craft</span></h1>
          <div className="space-y-6 text-slate-600 dark:text-slate-400 text-xl leading-relaxed">
            <p>{profile.about}</p>
          </div>
          <div className="flex gap-6">
            {profile.socials && Object.entries(profile.socials).map(([platform, url]) => (
              <a 
                key={platform} 
                href={url} 
                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">{platform}</span>
              </a>
            ))}
          </div>
        </div>
        <div className="relative order-1 lg:order-2">
          <div className="aspect-square rounded-[4rem] overflow-hidden shadow-2xl rotate-3 border-8 border-white dark:border-slate-900 relative z-10">
            <Image src={profile.avatar} fill className="object-cover" alt={profile.name} priority />
          </div>
          <div className="absolute inset-0 bg-indigo-600 rounded-[4rem] -rotate-6 scale-95 opacity-20 blur-2xl"></div>
        </div>
      </section>

      <section className="space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold">Technological Proficiency</h2>
          <p className="text-slate-500">A visual breakdown of my core technical arsenal.</p>
        </div>
        <AboutChart skills={profile.skills} />
      </section>

      <section className="space-y-16">
        <h2 className="text-4xl font-bold text-center">Career Milestone</h2>
        <div className="max-w-4xl mx-auto space-y-12">
          {profile.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-12 border-l-4 border-slate-100 dark:border-slate-800 pb-12 last:pb-0 group">
              <div className="absolute left-[-14px] top-0 w-6 h-6 bg-white dark:bg-slate-950 rounded-full border-4 border-indigo-600 group-hover:scale-125 transition-transform duration-300"></div>
              <div className="space-y-4">
                <span className="inline-block text-[10px] font-black text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-4 py-1.5 rounded-full uppercase tracking-widest">{exp.period}</span>
                <h3 className="text-3xl font-black">{exp.role}</h3>
                <p className="text-xl font-bold text-slate-700 dark:text-slate-300">{exp.company}</p>
                <p className="text-slate-500 text-lg max-w-2xl leading-relaxed">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}