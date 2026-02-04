
'use client';
import React, { useState, useEffect } from 'react';
import { Github, Star, GitFork, Book, Code, Terminal, ExternalLink, Activity, Package, Layers } from 'lucide-react';
import { GithubRepo } from '../../types';

export default function GithubPage() {
  const [repos, setRepos] = useState<GithubRepo[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const username = 'Alaika10';

  useEffect(() => {
    const fetchGithubData = async () => {
      try {
        // Fetch User Info
        const userRes = await fetch(`https://api.github.com/users/${username}`);
        const userJson = await userRes.json();
        setUserData(userJson);

        // Fetch Repositories (Sorted by last updated)
        const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
        const reposJson = await reposRes.json();
        setRepos(reposJson);
      } catch (error) {
        console.error("Error fetching GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGithubData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-400">Syncing with GitHub Cloud...</p>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 px-6 md:px-12 max-w-7xl mx-auto space-y-16 md:space-y-24 animate-in">
      
      {/* Header & Stats Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em]">
            <Github size={14} /> Open Source / Activity / Real-time
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            Code <br/><span className="text-slate-400">Chronicle.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium max-w-2xl">
            Monitoring repository states, commit frequencies, and open-source contributions for <strong>@{username}</strong>.
          </p>
        </div>

        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-sm space-y-6">
            <div className="flex items-center gap-4">
              <img src={userData?.avatar_url} className="w-16 h-16 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-xl" alt="GitHub Avatar" />
              <div>
                <h3 className="font-black text-xl">{userData?.name || username}</h3>
                <p className="text-xs font-mono text-slate-400">@{username}</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div className="text-center">
                <p className="text-lg font-black">{userData?.public_repos}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Repos</p>
              </div>
              <div className="text-center border-x border-slate-100 dark:border-slate-800">
                <p className="text-lg font-black">{userData?.followers}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Followers</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-black">{userData?.following}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">Following</p>
              </div>
            </div>
            <a 
              href={userData?.html_url} 
              target="_blank" 
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/10"
            >
              Follow on GitHub <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>

      {/* Contribution Heatmap Section */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600">
                <Activity size={20} />
             </div>
             <h2 className="text-3xl font-black tracking-tighter">Contribution Heap.</h2>
          </div>
          <div className="hidden md:flex items-center gap-6 font-mono text-[10px] uppercase tracking-widest text-slate-400">
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-slate-200 dark:bg-slate-800"></div> Less</div>
             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded bg-emerald-700"></div> More</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 md:p-12 overflow-hidden shadow-sm relative group">
          {/* Scanning Line Animation */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent h-20 w-full animate-pulse-slow pointer-events-none z-20"></div>
          
          <div className="w-full overflow-x-auto custom-scrollbar">
            {/* Using a standard GitHub Contribution chart proxy for real-time visualization */}
            <img 
              src={`https://ghchart.rshah.org/4f46e5/${username}`} 
              alt="GitHub Contributions" 
              className="w-full min-w-[700px] h-auto dark:invert dark:hue-rotate-180 dark:brightness-125"
            />
          </div>
          
          <div className="mt-8 flex flex-col md:flex-row justify-between items-center gap-4">
             <p className="text-xs font-mono text-slate-400 italic">"Code commit frequency analysis for the last 365 days cycle."</p>
             <div className="px-4 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-[9px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></div> Live Data Synchronized
             </div>
          </div>
        </div>
      </section>

      {/* Repositories Section */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter">Repository Index.</h2>
            <p className="text-slate-500 text-sm font-medium">Recently deployed or updated systems.</p>
          </div>
          <div className="flex gap-2">
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Package size={14} className="text-indigo-600" /> {repos.length} Active
            </div>
            <div className="px-4 py-2 bg-white dark:bg-slate-900 border rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Layers size={14} className="text-indigo-600" /> Public Domain
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {repos.map((repo, idx) => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank"
              className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6 hover:shadow-2xl transition-all duration-500 hover:border-indigo-500/30 flex flex-col h-full"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                  <Book size={24} />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                    <Star size={12} fill="currentColor" /> {repo.stargazers_count}
                  </div>
                </div>
              </div>

              <div className="space-y-3 flex-grow">
                <h3 className="text-xl font-black tracking-tight group-hover:text-indigo-600 transition-colors line-clamp-1">{repo.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
                  {repo.description || "No project documentation available for this repository instance."}
                </p>
              </div>

              <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex flex-wrap gap-2">
                  {repo.language && (
                    <span className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 rounded-lg">
                      {repo.language}
                    </span>
                  )}
                  {repo.topics?.slice(0, 2).map(topic => (
                    <span key={topic} className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-[9px] font-black uppercase tracking-widest text-indigo-600 rounded-lg">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 uppercase tracking-widest">
                  <span>ID: #{String(idx + 1).padStart(2, '0')}</span>
                  <span>Updated: {new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
        
        <div className="text-center pt-8">
           <a 
            href={`https://github.com/${username}?tab=repositories`} 
            target="_blank"
            className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:opacity-80 transition-all shadow-xl"
           >
             View Complete Repository Archive <Terminal size={16} />
           </a>
        </div>
      </section>
    </div>
  );
}
