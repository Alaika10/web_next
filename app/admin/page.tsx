
'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Profile, Project, BlogPost, DashboardTab } from '../../types';
import { generateBlogDraft, generateProjectDescription } from '../../services/geminiService';
import { supabase } from '../../lib/supabase';
import { INITIAL_PROFILE } from '../../constants';
import { logoutAdmin } from '../../lib/auth';
import { 
  Menu, X, Plus, Sparkles, Trash2, Save, LogOut, 
  LayoutDashboard, Briefcase, FileText, User, 
  RefreshCw, Eye, ChevronRight, Database, 
  BarChart3, Settings, Globe, Image as ImageIcon,
  ExternalLink, CheckCircle2, AlertCircle
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isSupabase = !!supabase;

  const refreshData = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    };
    try {
      const { data: p } = await supabase.from('profiles').select('*').single();
      if (p) setProfile(p);
      const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projs) setProjects(projs || []);
      const { data: b } = await supabase.from('blogs').select('*').order('date', { ascending: false });
      if (b) setBlogs(b || []);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
    }
  };

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, []);

  const selectTab = (tab: DashboardTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  // Handlers
  const addProject = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('projects').insert([{
      title: "New Project Title",
      description: "Short description about the project.",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
      technologies: ["React", "Next.js"],
      link: "#"
    }]);
    await refreshData();
    setIsSaving(false);
  };

  const addBlog = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('blogs').insert([{
      title: "Untitled Journal Entry",
      excerpt: "A brief overview of your new article.",
      content: "Start writing your content here...",
      image_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800",
      author: profile.name,
      date: new Date().toISOString().split('T')[0],
      tags: ["General"]
    }]);
    await refreshData();
    setIsSaving(false);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!supabase || !confirm("Are you sure? This action is permanent.")) return;
    setIsSaving(true);
    await supabase.from(table).delete().eq('id', id);
    await refreshData();
    setIsSaving(false);
  };

  const updateItem = async (table: string, id: string, updates: any) => {
    if (!supabase) return;
    setIsSaving(true);
    const dbUpdates = { ...updates };
    if (updates.imageUrl) { dbUpdates.image_url = updates.imageUrl; delete dbUpdates.imageUrl; }
    await supabase.from(table).update(dbUpdates).eq('id', id);
    await refreshData();
    setIsSaving(false);
  };

  const saveProfile = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('profiles').upsert({ id: profile.id || 1, ...profile });
    setIsSaving(false);
  };

  // AI Helpers
  // Fix: Added aiRefineProject to resolve "Cannot find name 'aiRefineProject'"
  const aiRefineProject = async (id: string, title: string, tech: string[]) => {
    setIsAiLoading(true);
    try {
      const desc = await generateProjectDescription(title, tech);
      if (desc) {
        await updateItem('projects', id, { description: desc });
      }
    } catch (error) {
      console.error("AI Project Refinement Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  // Fix: Added aiRefineBlog to support AI drafting in the Journal tab
  const aiRefineBlog = async (id: string, topic: string) => {
    setIsAiLoading(true);
    try {
      const data = await generateBlogDraft(topic);
      if (data) {
        await updateItem('blogs', id, { 
          title: data.title, 
          excerpt: data.excerpt, 
          content: data.content 
        });
      }
    } catch (error) {
      console.error("AI Blog Generation Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Initializing Console...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100">
      
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">Z</div>
          <span className="font-black text-xs uppercase tracking-tighter">Zenith Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 pb-4">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 dark:shadow-none">Z</div>
            <div>
              <p className="font-black text-sm uppercase leading-none">Console</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.0.4 Stable</p>
            </div>
          </div>

          <nav className="space-y-1">
            <NavItem active={activeTab === DashboardTab.OVERVIEW} onClick={() => selectTab(DashboardTab.OVERVIEW)} icon={<LayoutDashboard size={18}/>} label="Overview" />
            <NavItem active={activeTab === DashboardTab.PROJECTS} onClick={() => selectTab(DashboardTab.PROJECTS)} icon={<Briefcase size={18}/>} label="Projects" />
            <NavItem active={activeTab === DashboardTab.BLOGS} onClick={() => selectTab(DashboardTab.BLOGS)} icon={<FileText size={18}/>} label="Journal" />
            <NavItem active={activeTab === DashboardTab.PROFILE} onClick={() => selectTab(DashboardTab.PROFILE)} icon={<User size={18}/>} label="Profile" />
          </nav>
        </div>

        <div className="mt-auto p-8 space-y-4">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
            <Globe size={18} /> View Site
          </Link>
          <button onClick={() => { logoutAdmin(); router.push('/'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Control Center Area */}
      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight mb-2">{activeTab}</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest">
                <div className={`w-2 h-2 rounded-full ${isSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
                {isSupabase ? 'Cloud Connected' : 'Local Only'}
              </div>
              {isSaving && <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-600 animate-pulse uppercase tracking-widest">
                <RefreshCw size={10} className="animate-spin" /> Auto-Syncing...
              </div>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeTab === DashboardTab.PROJECTS && (
              <button onClick={addProject} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
                <Plus size={18} /> New Project
              </button>
            )}
            {activeTab === DashboardTab.BLOGS && (
              <button onClick={addBlog} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-indigo-200 dark:shadow-none hover:bg-indigo-700 transition-all">
                <Plus size={18} /> New Article
              </button>
            )}
            {activeTab === DashboardTab.PROFILE && (
              <button onClick={saveProfile} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl shadow-emerald-200 dark:shadow-none hover:bg-emerald-700 transition-all">
                <Save size={18} /> Save Profile
              </button>
            )}
          </div>
        </header>

        {/* Overview Tab Content */}
        {activeTab === DashboardTab.OVERVIEW && (
          <div className="space-y-10 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Projects" value={projects.length} icon={<Briefcase className="text-indigo-600" />} trend="+2 this month" />
              <StatCard title="Articles Published" value={blogs.length} icon={<FileText className="text-violet-600" />} trend="Consistent" />
              <StatCard title="Database Size" value="12.4 MB" icon={<Database className="text-emerald-600" />} trend="Optimal" />
              <StatCard title="Global Traffic" value="1.2k" icon={<BarChart3 className="text-amber-600" />} trend="+14% vs last week" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8">
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <RefreshCw size={20} /> Recent Activity
                </h3>
                <div className="space-y-6">
                  {projects.slice(0, 3).map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
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
                <button onClick={() => selectTab(DashboardTab.BLOGS)} className="w-full mt-8 py-3 bg-white text-indigo-600 rounded-xl font-bold text-sm">Open Assistant</button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Tab Content */}
        {activeTab === DashboardTab.PROJECTS && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm group">
                <div className="grid grid-cols-1 lg:grid-cols-12">
                  <div className="lg:col-span-4 relative h-64 lg:h-auto overflow-hidden">
                    <img src={proj.imageUrl || (proj as any).image_url} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <input 
                        className="w-full px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl text-[10px] text-white placeholder-white/70 outline-none"
                        defaultValue={proj.imageUrl || (proj as any).image_url}
                        onBlur={(e) => updateItem('projects', proj.id, { imageUrl: e.target.value })}
                        placeholder="Paste Image URL..."
                      />
                    </div>
                  </div>
                  <div className="lg:col-span-8 p-10 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <input 
                        className="text-2xl font-black bg-transparent border-none focus:ring-0 w-full p-0"
                        defaultValue={proj.title}
                        onBlur={(e) => updateItem('projects', proj.id, { title: e.target.value })}
                      />
                      <button onClick={() => deleteItem('projects', proj.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between">
                        Description
                        <button 
                          disabled={isAiLoading}
                          onClick={() => aiRefineProject(proj.id, proj.title, proj.technologies)}
                          className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-all disabled:opacity-50"
                        >
                          <Sparkles size={12} /> Refine with Gemini
                        </button>
                      </label>
                      <textarea 
                        className="w-full h-24 bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border-none text-sm leading-relaxed"
                        defaultValue={proj.description}
                        onBlur={(e) => updateItem('projects', proj.id, { description: e.target.value })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Technologies (Comma separated)</label>
                        <input 
                          className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2 text-xs font-bold"
                          defaultValue={proj.technologies.join(', ')}
                          onBlur={(e) => updateItem('projects', proj.id, { technologies: e.target.value.split(',').map(s => s.trim()) })}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Link</label>
                        <input 
                          className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-2 text-xs font-bold"
                          defaultValue={proj.link}
                          onBlur={(e) => updateItem('projects', proj.id, { link: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Fix: Added missing Journal Tab Content */}
        {activeTab === DashboardTab.BLOGS && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {blogs.length === 0 && (
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border p-20 text-center space-y-4">
                <FileText className="mx-auto text-slate-200" size={48} />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No articles found</p>
              </div>
            )}
            {blogs.map((post) => (
              <div key={post.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-8 space-y-6">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="w-full md:w-64 space-y-4">
                    <div className="aspect-[16/10] rounded-2xl overflow-hidden border">
                      <img src={post.imageUrl || (post as any).image_url} className="w-full h-full object-cover" />
                    </div>
                    <input 
                      className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-[10px] outline-none"
                      defaultValue={post.imageUrl || (post as any).image_url}
                      onBlur={(e) => updateItem('blogs', post.id, { imageUrl: e.target.value })}
                      placeholder="Image URL"
                    />
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="flex justify-between items-start gap-4">
                      <input 
                        className="text-2xl font-black bg-transparent border-none focus:ring-0 w-full p-0"
                        defaultValue={post.title}
                        onBlur={(e) => updateItem('blogs', post.id, { title: e.target.value })}
                      />
                      <button onClick={() => deleteItem('blogs', post.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center justify-between">
                        Excerpt
                        <button 
                          disabled={isAiLoading}
                          onClick={() => aiRefineBlog(post.id, post.title)}
                          className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-700 transition-all disabled:opacity-50"
                        >
                          <Sparkles size={12} /> Draft with Gemini
                        </button>
                      </label>
                      <textarea 
                        className="w-full h-16 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-none text-sm"
                        defaultValue={post.excerpt}
                        onBlur={(e) => updateItem('blogs', post.id, { excerpt: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Content (Markdown)</label>
                      <textarea 
                        className="w-full h-48 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 border-none text-sm font-mono"
                        defaultValue={post.content}
                        onBlur={(e) => updateItem('blogs', post.id, { content: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === DashboardTab.PROFILE && (
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 space-y-12 animate-in fade-in duration-500">
             <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-xl">
                    <img src={profile.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-4">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Avatar URL</label>
                    <input 
                      className="w-full mt-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 text-[10px]"
                      value={profile.avatar}
                      onChange={(e) => setProfile({...profile, avatar: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
                      <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Title</label>
                      <input className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} />
                   </div>
                   <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">About Me</label>
                      <textarea className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl leading-relaxed" value={profile.about} onChange={(e) => setProfile({...profile, about: e.target.value})} />
                   </div>
                </div>
             </div>

             <div className="pt-10 border-t space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-xl font-black">Skills Repository</h3>
                   <button onClick={() => setProfile({...profile, skills: [...profile.skills, { name: 'New Skill', level: 50, category: 'Frontend' }]})} className="text-xs font-black text-indigo-600 uppercase tracking-widest">+ Add Skill</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                   {profile.skills.map((skill, i) => (
                      <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between gap-4">
                         <div className="flex-1">
                            <input className="bg-transparent font-bold text-sm w-full outline-none" value={skill.name} onChange={(e) => {
                               const newSkills = [...profile.skills];
                               newSkills[i].name = e.target.value;
                               setProfile({...profile, skills: newSkills});
                            }} />
                            <input type="range" className="w-full accent-indigo-600 h-1 mt-2" value={skill.level} onChange={(e) => {
                               const newSkills = [...profile.skills];
                               newSkills[i].level = parseInt(e.target.value);
                               setProfile({...profile, skills: newSkills});
                            }} />
                         </div>
                         <button onClick={() => setProfile({...profile, skills: profile.skills.filter((_, idx) => idx !== i)})} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                      </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {/* Global UI Components */}
        {isAiLoading && (
          <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-md z-[100] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-2 border-indigo-500/20 max-w-sm text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black mb-2">Gemini Thinking</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Crafting high-quality content using the latest language models...</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Helper Components
function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick} 
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm group ${
        active 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none translate-x-1' 
        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>{icon}</span>
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string | number, icon: React.ReactNode, trend: string }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center">{icon}</div>
      <div>
        <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-1">{title}</p>
        <p className="text-3xl font-black tracking-tight">{value}</p>
      </div>
      <p className="text-[10px] font-bold text-emerald-500 flex items-center gap-1 uppercase tracking-widest">
        <CheckCircle2 size={10} /> {trend}
      </p>
    </div>
  );
}
