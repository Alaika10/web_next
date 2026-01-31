
'use client';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Profile, Project, BlogPost, DashboardTab } from '../../types';
import { generateBlogDraft, generateProjectDescription } from '../../services/geminiService';
import { supabase } from '../../lib/supabase';
import { INITIAL_PROFILE } from '../../constants';
import { logoutAdmin } from '../../lib/auth';
import { 
  Menu, X, Plus, Sparkles, Trash2, Save, LogOut, 
  LayoutDashboard, Briefcase, FileText, User, 
  RefreshCw, Eye, ChevronRight 
} from 'lucide-react';

/**
 * AdminPage: Dashboard pusat untuk CRUD Portfolio dan Blog.
 * Menggunakan direktif 'use client' karena membutuhkan interaksi user dan fetch data.
 */
export default function AdminPage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.PROJECTS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isSupabase = !!supabase;

  const refreshData = async () => {
    if (!supabase) return;
    try {
      const { data: p } = await supabase.from('profiles').select('*').single();
      if (p) setProfile(p);
      
      const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projs) setProjects(projs);
      
      const { data: b } = await supabase.from('blogs').select('*').order('date', { ascending: false });
      if (b) setBlogs(b);
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

  // --- ACTIONS: PROJECTS ---
  const addProject = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('projects').insert([{
      title: "Proyek Baru",
      description: "Deskripsi singkat mengenai proyek Anda.",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
      technologies: ["React", "Next.js"],
      link: "#"
    }]);
    await refreshData();
    setIsSaving(false);
  };

  const deleteProject = async (id: string) => {
    if (!supabase || !confirm("Hapus proyek ini secara permanen?")) return;
    setIsSaving(true);
    await supabase.from('projects').delete().eq('id', id);
    await refreshData();
    setIsSaving(false);
  };

  const updateProject = async (id: string, updates: any) => {
    if (!supabase) return;
    setIsSaving(true);
    const dbUpdates = { ...updates };
    if (updates.imageUrl) { dbUpdates.image_url = updates.imageUrl; delete dbUpdates.imageUrl; }
    await supabase.from('projects').update(dbUpdates).eq('id', id);
    await refreshData();
    setIsSaving(false);
  };

  // --- ACTIONS: BLOGS ---
  const addBlog = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('blogs').insert([{
      title: "Draft Jurnal Baru",
      excerpt: "Ringkasan konten artikel...",
      content: "Tulis isi konten menggunakan format Markdown di sini.",
      image_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800",
      author: profile.name,
      date: new Date().toISOString().split('T')[0],
      tags: ["Teknologi"]
    }]);
    await refreshData();
    setIsSaving(false);
  };

  const deleteBlog = async (id: string) => {
    if (!supabase || !confirm("Hapus artikel ini?")) return;
    setIsSaving(true);
    await supabase.from('blogs').delete().eq('id', id);
    await refreshData();
    setIsSaving(false);
  };

  const updateBlog = async (id: string, updates: any) => {
    if (!supabase) return;
    setIsSaving(true);
    const dbUpdates = { ...updates };
    if (updates.imageUrl) { dbUpdates.image_url = updates.imageUrl; delete dbUpdates.imageUrl; }
    await supabase.from('blogs').update(dbUpdates).eq('id', id);
    await refreshData();
    setIsSaving(false);
  };

  // --- ACTIONS: PROFILE ---
  const saveProfile = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('profiles').upsert({ id: profile.id || 1, ...profile });
    alert("Profil berhasil disinkronkan!");
    setIsSaving(false);
  };

  // --- AI FEATURES ---
  const aiRefineProject = async (id: string, title: string, tech: string[]) => {
    setIsAiLoading(true);
    const desc = await generateProjectDescription(title, tech);
    await updateProject(id, { description: desc });
    setIsAiLoading(false);
  };

  const aiDraftBlog = async (id: string, topic: string) => {
    setIsAiLoading(true);
    const data = await generateBlogDraft(topic);
    if (data) {
      await updateBlog(id, { title: data.title, excerpt: data.excerpt, content: data.content });
    }
    setIsAiLoading(false);
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
      <RefreshCw className="w-10 h-10 text-indigo-600 animate-spin" />
      <p className="font-bold text-slate-500 animate-pulse uppercase tracking-[0.3em] text-[10px]">Zenith Dashboard OS</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row">
      
      {/* 📱 Mobile Top Bar */}
      <div className="lg:hidden sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">Z</div>
          <span className="font-black text-sm uppercase tracking-tighter">Admin Console</span>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* 🌑 Sidebar Overlay (Mobile) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-[60] bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* 🏛️ Admin Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-12 transition-transform duration-500 lg:static lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-indigo-100">Z</div>
            <div className="flex flex-col">
              <span className="font-black text-sm tracking-tight uppercase leading-none">Console</span>
              <span className="text-[10px] text-indigo-500 font-bold tracking-widest uppercase">Portfolio CMS</span>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-2 opacity-60">System Navigation</p>
          {Object.values(DashboardTab).map(tab => (
            <button
              key={tab}
              onClick={() => selectTab(tab)}
              className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm flex items-center gap-3 ${
                activeTab === tab 
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200/50 dark:shadow-none translate-x-1' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {activeTab === tab ? <ChevronRight className="w-4 h-4" /> : <div className="w-4 h-4" />}
              {tab}
            </button>
          ))}
          
          <div className="pt-8 mt-8 border-t border-slate-50 dark:border-slate-800">
            <Link to="/" className="w-full text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm flex items-center gap-3 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800">
              <Eye className="w-4 h-4" />
              Live Website
            </Link>
          </div>
        </nav>

        <div className="space-y-6 pt-6 border-t border-slate-50 dark:border-slate-800">
           <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl">
             <img src={profile.avatar} className="w-9 h-9 rounded-xl object-cover shadow-sm" />
             <div className="overflow-hidden">
               <p className="font-bold text-[11px] truncate">{profile.name}</p>
               <p className="text-[9px] text-slate-400 truncate uppercase font-black tracking-tighter opacity-70">Administrator</p>
             </div>
           </div>
           <button 
             onClick={logoutAdmin}
             className="w-full py-4 bg-red-50 text-red-600 dark:bg-red-950/30 rounded-xl text-xs font-black hover:bg-red-100 transition-all uppercase tracking-widest flex items-center justify-center gap-2 border border-red-100 dark:border-red-900/50"
           >
             <LogOut className="w-4 h-4" />
             Keluar Sesi
           </button>
        </div>
      </aside>

      {/* 🖥️ Main Viewport */}
      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 relative scroll-smooth">
        
        {/* Syncing Toast */}
        {isSaving && (
          <div className="fixed bottom-8 right-8 z-[100] md:top-8 md:bottom-auto bg-indigo-600 text-white px-6 py-3 rounded-full font-bold text-xs flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom-4 md:slide-in-from-top-4">
            <RefreshCw className="w-3 h-3 animate-spin" />
            MENYIMPAN DATA...
          </div>
        )}

        {/* AI Processing Modal */}
        {isAiLoading && (
          <div className="fixed inset-0 z-[1000] bg-slate-900/30 backdrop-blur-lg flex items-center justify-center p-6">
             <div className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-2xl text-center space-y-6 max-w-sm w-full animate-in zoom-in-95">
                <div className="relative w-24 h-24 mx-auto">
                   <div className="absolute inset-0 border-[6px] border-indigo-600/10 rounded-full"></div>
                   <div className="absolute inset-0 border-[6px] border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                   <div className="absolute inset-0 flex items-center justify-center text-3xl">✨</div>
                </div>
                <div className="space-y-2">
                  <p className="font-black text-2xl text-indigo-600">Gemini AI Aktif</p>
                  <p className="text-sm text-slate-500 leading-relaxed">Membangun konten berkualitas tinggi berdasarkan draf Anda.</p>
                </div>
             </div>
          </div>
        )}

        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">{activeTab}</h1>
            <p className="text-slate-500 text-sm md:text-lg">Kendalikan data portofolio Anda secara real-time.</p>
          </div>
          <div className="flex flex-wrap gap-4 w-full md:w-auto">
             {activeTab === DashboardTab.PROJECTS && <button onClick={addProject} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"><Plus className="w-5 h-5" /> Proyek Baru</button>}
             {activeTab === DashboardTab.BLOGS && <button onClick={addBlog} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"><Plus className="w-5 h-5" /> Artikel Baru</button>}
             {activeTab === DashboardTab.PROFILE && <button onClick={saveProfile} className="flex-1 md:flex-none flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"><Save className="w-5 h-5" /> Update Profil</button>}
          </div>
        </header>

        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] md:rounded-[3.5rem] border border-slate-100 dark:border-slate-800 p-6 md:p-12 shadow-sm">
          
          {/* TAB: PROJECTS */}
          {activeTab === DashboardTab.PROJECTS && (
            <div className="space-y-20">
              {projects.length === 0 && <div className="text-center py-24 text-slate-400 italic">Dashboard kosong. Tambahkan mahakarya pertama Anda.</div>}
              {projects.map(p => (
                <div key={p.id} className="grid grid-cols-1 xl:grid-cols-12 gap-12 pb-20 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                  <div className="xl:col-span-3 space-y-6">
                    <img src={p.imageUrl || (p as any).image_url} className="w-full aspect-[4/3] rounded-[2rem] object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md hover:scale-[1.02] transition-transform" />
                    <div className="space-y-2 px-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">URL Gambar</label>
                      <input 
                        defaultValue={p.imageUrl || (p as any).image_url}
                        onBlur={(e) => updateProject(p.id, { imageUrl: e.target.value })}
                        className="w-full text-[11px] bg-slate-50 dark:bg-slate-800 p-4 rounded-xl font-mono border border-transparent focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>
                  <div className="xl:col-span-6 space-y-8">
                    <input 
                      className="text-3xl md:text-4xl font-black w-full bg-transparent border-b-2 border-transparent focus:border-indigo-600 focus:outline-none transition-all pb-2"
                      defaultValue={p.title}
                      onBlur={(e) => updateProject(p.id, { title: e.target.value })}
                    />
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Deskripsi Proyek</label>
                      <textarea 
                        className="w-full min-h-[140px] bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl focus:ring-2 focus:ring-indigo-600 transition-all leading-relaxed text-slate-600 dark:text-slate-400 outline-none border border-transparent"
                        defaultValue={p.description}
                        onBlur={(e) => updateProject(p.id, { description: e.target.value })}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teknologi (pisahkan koma)</label>
                         <input 
                           className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold border border-transparent focus:border-indigo-600 outline-none"
                           defaultValue={p.technologies?.join(', ')}
                           onBlur={(e) => updateProject(p.id, { technologies: e.target.value.split(',').map(s => s.trim()) })}
                         />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Link Live/Demo</label>
                         <input 
                           className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold border border-transparent focus:border-indigo-600 outline-none"
                           defaultValue={p.link}
                           onBlur={(e) => updateProject(p.id, { link: e.target.value })}
                         />
                       </div>
                    </div>
                    <button 
                      onClick={() => aiRefineProject(p.id, p.title, p.technologies)}
                      className="flex items-center justify-center gap-3 w-full sm:w-auto text-indigo-600 font-black text-xs bg-indigo-50 dark:bg-indigo-950/50 px-8 py-4 rounded-2xl hover:bg-indigo-100 transition-all border border-indigo-100 dark:border-indigo-900/50 uppercase tracking-widest"
                    >
                      <Sparkles className="w-5 h-5" />
                      Poles Deskripsi dengan AI
                    </button>
                  </div>
                  <div className="xl:col-span-3 space-y-6 flex flex-col justify-start">
                    <button 
                      onClick={() => deleteProject(p.id)} 
                      className="w-full p-5 rounded-3xl bg-red-50 text-red-600 font-black text-xs hover:bg-red-100 transition-all uppercase tracking-widest flex items-center justify-center gap-3 border border-red-100/50"
                    >
                      <Trash2 className="w-5 h-5" />
                      Hapus Proyek
                    </button>
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800 opacity-60">
                       <p className="text-[10px] font-black text-slate-400 uppercase mb-3 tracking-widest px-1">Internal Metadata</p>
                       <div className="space-y-1.5 overflow-hidden">
                         <p className="text-[10px] font-mono break-all leading-tight">UID: {p.id}</p>
                         <p className="text-[10px] font-mono">Date: {new Date((p as any).created_at || Date.now()).toLocaleDateString()}</p>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: BLOGS */}
          {activeTab === DashboardTab.BLOGS && (
            <div className="space-y-16">
               {blogs.length === 0 && <div className="text-center py-24 text-slate-400 italic">Jurnal masih kosong. Bagikan pemikiran Anda hari ini.</div>}
               {blogs.map(b => (
                 <div key={b.id} className="grid grid-cols-1 xl:grid-cols-12 gap-12 pb-16 border-b border-slate-50 dark:border-slate-800 last:border-0 last:pb-0">
                    <div className="xl:col-span-3 space-y-6">
                       <img src={b.imageUrl || (b as any).image_url} className="w-full aspect-video rounded-[2rem] object-cover border-4 border-slate-50 dark:border-slate-800 shadow-md" />
                       <div className="space-y-4">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cover Image URL</label>
                             <input 
                               className="w-full text-[10px] p-4 bg-slate-50 dark:bg-slate-800 rounded-xl font-mono border border-transparent focus:border-indigo-600 outline-none"
                               defaultValue={b.imageUrl || (b as any).image_url}
                               onBlur={(e) => updateBlog(b.id, { imageUrl: e.target.value })}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kategori / Tags</label>
                             <input 
                               className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-[11px] font-bold border border-transparent focus:border-indigo-600 outline-none"
                               defaultValue={b.tags?.join(', ')}
                               onBlur={(e) => updateBlog(b.id, { tags: e.target.value.split(',').map(s => s.trim()) })}
                             />
                          </div>
                       </div>
                       <button 
                         onClick={() => deleteBlog(b.id)} 
                         className="w-full p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-100 flex items-center justify-center gap-3 border border-red-100"
                       >
                         <Trash2 className="w-4 h-4" />
                         Hapus Artikel
                       </button>
                    </div>
                    <div className="xl:col-span-9 space-y-8">
                       <div className="flex flex-col md:flex-row gap-6 items-start">
                         <input 
                           className="text-3xl font-black flex-1 bg-transparent border-b-2 border-transparent focus:border-indigo-600 focus:outline-none transition-all pb-2"
                           defaultValue={b.title}
                           onBlur={(e) => updateBlog(b.id, { title: e.target.value })}
                         />
                         <button 
                           onClick={() => aiDraftBlog(b.id, b.title)} 
                           className="w-full md:w-auto px-6 py-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-100 whitespace-nowrap flex items-center justify-center gap-3 border border-indigo-100"
                         >
                           <Sparkles className="w-4 h-4" />
                           ✨ AI Auto-Draft
                         </button>
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Summary (Cuplikan)</label>
                         <textarea 
                           className="w-full min-h-[90px] text-sm bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl border border-transparent focus:border-indigo-600 outline-none leading-relaxed"
                           defaultValue={b.excerpt}
                           onBlur={(e) => updateBlog(b.id, { excerpt: e.target.value })}
                         />
                       </div>
                       <div className="space-y-3">
                         <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Konten Artikel (Mendukung Markdown)</label>
                         <textarea 
                           className="w-full min-h-[400px] text-sm bg-slate-50 dark:bg-slate-800 p-8 rounded-[2.5rem] font-mono leading-relaxed border border-transparent focus:border-indigo-600 outline-none"
                           defaultValue={b.content}
                           onBlur={(e) => updateBlog(b.id, { content: e.target.value })}
                         />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
          )}

          {/* TAB: PROFILE */}
          {activeTab === DashboardTab.PROFILE && (
            <div className="max-w-4xl space-y-16">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Identitas Digital</label>
                    <input 
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl font-bold text-lg border-2 border-transparent focus:border-indigo-600 outline-none shadow-sm"
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Role Profesional</label>
                    <input 
                      className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-3xl font-bold text-lg border-2 border-transparent focus:border-indigo-600 outline-none shadow-sm"
                      value={profile.title}
                      onChange={(e) => setProfile({...profile, title: e.target.value})}
                    />
                  </div>
               </div>

               <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Biografi Utama</label>
                  <textarea 
                    className="w-full min-h-[220px] p-8 bg-slate-50 dark:bg-slate-800 rounded-[3rem] text-lg leading-relaxed focus:ring-2 focus:ring-indigo-600 outline-none border border-transparent shadow-sm"
                    value={profile.about}
                    onChange={(e) => setProfile({...profile, about: e.target.value})}
                  />
               </div>

               <div className="space-y-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <h3 className="font-black text-2xl tracking-tight">Technical Proficiency</h3>
                    <button 
                      onClick={() => setProfile({...profile, skills: [...profile.skills, { name: 'New Skill', level: 50, category: 'Other' }]})} 
                      className="w-full sm:w-auto text-indigo-600 font-black text-[11px] uppercase tracking-[0.2em] bg-indigo-50 px-8 py-4 rounded-2xl hover:bg-indigo-100 flex items-center justify-center gap-3 border border-indigo-100 shadow-sm transition-all"
                    >
                      <Plus className="w-5 h-5" /> Tambah Expertise
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {profile.skills.map((s, idx) => (
                       <div key={idx} className="p-6 bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-3xl flex items-center justify-between gap-8 hover:border-indigo-200 dark:hover:border-indigo-900 transition-colors group">
                          <input 
                            className="bg-transparent font-black text-sm border-b-2 border-transparent focus:border-indigo-600 outline-none flex-1 py-1"
                            value={s.name}
                            onChange={(e) => {
                              const news = [...profile.skills];
                              news[idx].name = e.target.value;
                              setProfile({...profile, skills: news});
                            }}
                          />
                          <div className="flex items-center gap-4 flex-1">
                            <input 
                              type="range"
                              min="0" max="100"
                              value={s.level}
                              onChange={(e) => {
                                const news = [...profile.skills];
                                news[idx].level = parseInt(e.target.value);
                                setProfile({...profile, skills: news});
                              }}
                              className="accent-indigo-600 flex-1 h-1.5"
                            />
                            <span className="text-[11px] font-black font-mono w-10 text-slate-400 group-hover:text-indigo-600 transition-colors">{s.level}%</span>
                          </div>
                          <button onClick={() => setProfile({...profile, skills: profile.skills.filter((_, i) => i !== idx)})} className="text-slate-300 hover:text-red-500 font-bold transition-colors">✕</button>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="space-y-8">
                  <h3 className="font-black text-2xl tracking-tight">Social Connection</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.entries(profile.socials || {}).map(([platform, url]) => (
                      <div key={platform} className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-2">{platform}</label>
                        <input 
                          className="w-full p-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-bold border-2 border-transparent focus:border-indigo-600 outline-none shadow-sm"
                          value={url as string}
                          onChange={(e) => setProfile({
                            ...profile, 
                            socials: { ...profile.socials, [platform]: e.target.value }
                          })}
                        />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === DashboardTab.OVERVIEW && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                <div className="p-10 md:p-14 bg-indigo-50 dark:bg-indigo-950/30 rounded-[3rem] md:rounded-[4rem] border border-indigo-100 dark:border-indigo-900/50 text-center space-y-4 hover:scale-[1.02] transition-transform shadow-sm">
                   <p className="text-6xl md:text-7xl font-black text-indigo-600 tracking-tighter">{projects.length}</p>
                   <p className="font-black text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-[0.2em] opacity-80">Proyek Terdaftar</p>
                </div>
                <div className="p-10 md:p-14 bg-violet-50 dark:bg-violet-950/30 rounded-[3rem] md:rounded-[4rem] border border-violet-100 dark:border-violet-900/50 text-center space-y-4 hover:scale-[1.02] transition-transform shadow-sm">
                   <p className="text-6xl md:text-7xl font-black text-violet-600 tracking-tighter">{blogs.length}</p>
                   <p className="font-black text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-[0.2em] opacity-80">Artikel Published</p>
                </div>
                <div className="p-10 md:p-14 bg-emerald-50 dark:bg-emerald-950/30 rounded-[3rem] md:rounded-[4rem] border border-emerald-100 dark:border-emerald-900/50 text-center space-y-4 hover:scale-[1.02] transition-transform shadow-sm">
                   <p className="text-6xl md:text-7xl font-black text-emerald-600 tracking-tighter">{profile.skills.length}</p>
                   <p className="font-black text-slate-500 dark:text-slate-400 uppercase text-[11px] tracking-[0.2em] opacity-80">Core Proficiencies</p>
                </div>
                
                <div className="md:col-span-3 p-10 md:p-16 border border-slate-100 dark:border-slate-800 rounded-[3rem] md:rounded-[5rem] bg-slate-50 dark:bg-slate-800/50 space-y-12">
                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                      <div className="space-y-2">
                        <h3 className="text-3xl font-black tracking-tight">System Infrastructure</h3>
                        <p className="text-slate-500">Status sinkronisasi dan kesehatan database.</p>
                      </div>
                      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 px-6 py-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-md">
                        <div className={`w-3 h-3 rounded-full ${isSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-ping'}`}></div>
                        <span className="text-[11px] font-black uppercase tracking-[0.15em]">{isSupabase ? 'Cloud Persistence Active' : 'Edge Mode (Local Session)'}</span>
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm">
                        <p className="font-black text-indigo-600 mb-2 text-xs uppercase tracking-widest">Cognitive Provider</p>
                        <p className="text-3xl font-black">Gemini 3 Pro</p>
                        <p className="text-xs text-slate-500 mt-4 leading-relaxed font-medium">Powering content refinement and automated journalistic drafts across the CMS.</p>
                      </div>
                      
                      <div className="p-10 md:p-14 bg-indigo-600 text-white rounded-[3rem] md:rounded-[4rem] flex flex-col justify-center space-y-8 shadow-2xl shadow-indigo-100 dark:shadow-none">
                         <div className="flex items-center gap-4">
                            <Sparkles className="w-8 h-8" />
                            <h4 className="text-2xl font-black tracking-tight">Operator Console Tips</h4>
                         </div>
                         <ul className="space-y-4 text-sm opacity-90 leading-relaxed font-medium list-disc list-inside">
                            <li>Klik <b>AI Auto-Draft</b> untuk membangun struktur artikel lengkap dari judul.</li>
                            <li>Gunakan <b>Refine Narrative</b> untuk mengonversi teknologi menjadi deskripsi profesional.</li>
                            <li>Semua teks disimpan otomatis (onBlur) untuk menjamin persistensi data.</li>
                         </ul>
                      </div>
                   </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
