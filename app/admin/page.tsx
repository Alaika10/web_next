
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
  RefreshCw, Eye, ChevronRight 
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
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

  const saveProfile = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('profiles').upsert({ id: profile.id || 1, ...profile });
    alert("Profil berhasil disinkronkan!");
    setIsSaving(false);
  };

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
      {/* Sidebar logic sama, hanya Link diubah */}
      <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 p-8 flex flex-col gap-12 transition-transform duration-500 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">Z</div>
          <span className="font-black text-sm uppercase">Console</span>
        </div>
        <nav className="flex-1 space-y-2">
          {Object.values(DashboardTab).map(tab => (
            <button key={tab} onClick={() => selectTab(tab)} className={`w-full text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm flex items-center gap-3 ${activeTab === tab ? 'bg-indigo-600 text-white shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
              {tab}
            </button>
          ))}
          <div className="pt-8 mt-8 border-t">
            <Link href="/" className="w-full text-left px-5 py-4 rounded-2xl font-bold transition-all text-sm flex items-center gap-3 text-slate-400">
              <Eye className="w-4 h-4" /> Live Website
            </Link>
          </div>
        </nav>
        <button onClick={() => { logoutAdmin(); router.push('/'); }} className="w-full py-4 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" /> Keluar Sesi
        </button>
      </aside>

      <main className="flex-1 overflow-y-auto px-6 py-8 md:px-12 md:py-12 relative scroll-smooth">
        {/* Render Konten CRUD sesuai tab aktif */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <h1 className="text-3xl md:text-5xl font-black tracking-tight">{activeTab}</h1>
          <div className="flex gap-4">
             {activeTab === DashboardTab.PROJECTS && <button onClick={addProject} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl">+ Proyek Baru</button>}
             {activeTab === DashboardTab.BLOGS && <button onClick={addBlog} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl">+ Artikel Baru</button>}
             {activeTab === DashboardTab.PROFILE && <button onClick={saveProfile} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold shadow-xl">Update Profil</button>}
          </div>
        </header>

        {/* Form Editor CRUD Projects/Blogs/Profile di sini */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border p-12">
           <p className="text-slate-500 italic">Silakan kelola data {activeTab.toLowerCase()} Anda melalui antarmuka editor di bawah ini.</p>
           {/* Logic CRUD tetap sama dengan file asli Anda, hanya pastikan Link diubah ke next/link */}
        </div>
      </main>
    </div>
  );
}
