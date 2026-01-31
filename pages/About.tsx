
import React from 'react';
import { Profile } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AboutProps {
  profile: Profile;
}

const About: React.FC<AboutProps> = ({ profile }) => {
  const chartData = profile.skills.map(s => ({ name: s.name, level: s.level }));
  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f97316', '#10b981', '#3b82f6'];

  return (
    <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-24">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <h1 className="text-5xl font-bold">Behind the Screen</h1>
          <div className="prose prose-lg dark:prose-invert text-slate-600 dark:text-slate-400">
            <p className="leading-relaxed">{profile.about}</p>
          </div>
          <div className="flex gap-4">
            <a href={profile.socials.github} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border hover:bg-indigo-50 hover:border-indigo-200 transition-all">
              <span className="sr-only">GitHub</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
            </a>
            <a href={profile.socials.linkedin} className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-900 border hover:bg-indigo-50 hover:border-indigo-200 transition-all">
              <span className="sr-only">LinkedIn</span>
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="aspect-square rounded-[2rem] overflow-hidden rotate-3 bg-indigo-100">
            <img src="https://picsum.photos/seed/about1/500/500" className="w-full h-full object-cover" />
          </div>
          <div className="aspect-square rounded-[2rem] overflow-hidden -rotate-6 bg-violet-100 mt-12">
            <img src="https://picsum.photos/seed/about2/500/500" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      <section className="space-y-12">
        <h2 className="text-3xl font-bold">Skills Proficiency</h2>
        <div className="h-[400px] w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical">
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" width={120} axisLine={false} tickLine={false} style={{ fontWeight: 600 }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="level" radius={[0, 8, 8, 0]} barSize={32}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="space-y-12">
        <h2 className="text-3xl font-bold">Professional Experience</h2>
        <div className="space-y-8">
          {profile.experience.map((exp, idx) => (
            <div key={idx} className="relative pl-8 border-l-2 border-slate-200 dark:border-slate-800 pb-8 last:pb-0">
              <div className="absolute left-[-9px] top-0 w-4 h-4 bg-indigo-600 rounded-full border-4 border-white dark:border-slate-950 shadow-sm"></div>
              <div className="space-y-2">
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-3 py-1 rounded-full uppercase">{exp.period}</span>
                <h3 className="text-2xl font-bold">{exp.role}</h3>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">{exp.company}</p>
                <p className="text-slate-500 max-w-2xl">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
