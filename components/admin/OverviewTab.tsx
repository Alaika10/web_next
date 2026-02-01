
'use client';
import React from 'react';
import { Briefcase, FileText, Database, BarChart3, RefreshCw, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { Project, BlogPost, DashboardTab } from '../../types';

interface OverviewProps {
  projects: Project[];
  blogs: BlogPost[];
  onExploreJournal: () => void;
}

const StatCard = ({ title, value, icon, trend, colorClass }: any) => (
  <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
    <div className={`w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center ${colorClass}`}>{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{title}</p>
      <p className="text-3xl font-black tracking-tight">{value}</p>
    </div>
    <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-widest">
      <CheckCircle2 size={10} /> {trend}
    </p>
  </div>
);

export default function OverviewTab({ projects, blogs, onExploreJournal }: OverviewProps) {
  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Projects" value={projects.length} icon={<Briefcase size={20}/>} colorClass="text-indigo-600" trend="+2 this month" />
        <StatCard title="Articles Published" value={blogs.length} icon={<FileText size={20}/>} colorClass="text-violet-600" trend="Consistent" />
        <StatCard title="Database Size" value="12.4 MB" icon={<Database size={20}/>} colorClass="text-emerald-600" trend="Optimal" />
        <StatCard title="Global Traffic" value="1.2k" icon={<BarChart3 size={20}/>} colorClass="text-amber-600" trend="+14% vs last week" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
          <h3 className="text-xl font-black mb-6 flex items-center gap-2">
            <RefreshCw size={20} /> Recent Activity
          </h3>
          <div className="space-y-6">
            {projects.slice(0, 3).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600"><Briefcase size={20}/></div>
                  <div>
                    <p className="font-bold text-sm">{p.title}</p>
                    <p className="text-[10px] text-slate-400 uppercase font-black">Modified Project</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white flex flex-col justify-between shadow-2xl shadow-indigo-200 dark:shadow-none">
          <div className="space-y-4">
            <Sparkles size={32} />
            <h3 className="text-2xl font-black leading-tight">Gemini AI<br/>Ready to Assist</h3>
            <p className="text-indigo-100 text-sm opacity-80 leading-relaxed">Let artificial intelligence help you write high-quality blog posts and project descriptions in seconds.</p>
          </div>
          <button onClick={onExploreJournal} className="w-full mt-8 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm">Open Assistant</button>
        </div>
      </div>
    </div>
  );
}
