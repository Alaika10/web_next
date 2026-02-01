
'use client';
import React, { useState, useEffect } from 'react';
import { Profile, Project, BlogPost, DashboardTab } from '../../types';
import { generateBlogDraft, generateProjectDescription } from '../../services/geminiService';
import { supabase } from '../../lib/supabase';
import { INITIAL_PROFILE } from '../../constants';
import { Sparkles, Menu } from 'lucide-react';

// Import Modular Components
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import OverviewTab from '../../components/admin/OverviewTab';
import ProjectsTab from '../../components/admin/ProjectsTab';
import JournalTab from '../../components/admin/JournalTab';
import ProfileTab from '../../components/admin/ProfileTab';

export default function AdminPage() {
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
    }
    try {
      const { data: p } = await supabase.from('profiles').select('*').single();
      if (p) setProfile(p);
      const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projs) setProjects(projs || []);
      const { data: b } = await supabase.from('blogs').select('*').order('date', { ascending: false });
      if (b) setBlogs(b || []);
    } catch (err) {
      console.error("Sync Error:", err);
    }
  };

  useEffect(() => {
    refreshData().finally(() => setLoading(false));
  }, []);

  // Action Handlers
  const addProject = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('projects').insert([{
      title: "New Project",
      description: "Short description.",
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
      technologies: ["React"],
      link: "#"
    }]);
    await refreshData();
    setIsSaving(false);
  };

  const addBlog = async () => {
    if (!supabase) return;
    setIsSaving(true);
    await supabase.from('blogs').insert([{
      title: "Untitled Article",
      excerpt: "Summary...",
      content: "Writing...",
      image_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800",
      author: profile.name,
      date: new Date().toISOString().split('T')[0],
      tags: ["General"]
    }]);
    await refreshData();
    setIsSaving(false);
  };

  const deleteItem = async (table: string, id: string) => {
    if (!supabase || !confirm("Permanent delete?")) return;
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

  // AI Logic
  const aiRefineProject = async (id: string, title: string, tech: string[]) => {
    setIsAiLoading(true);
    try {
      const desc = await generateProjectDescription(title, tech);
      if (desc) await updateItem('projects', id, { description: desc });
    } finally {
      setIsAiLoading(false);
    }
  };

  const aiRefineBlog = async (id: string, topic: string) => {
    setIsAiLoading(true);
    try {
      const data = await generateBlogDraft(topic);
      if (data) await updateItem('blogs', id, { title: data.title, excerpt: data.excerpt, content: data.content });
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
      
      {/* Mobile Trigger */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">Z</div>
          <span className="font-black text-xs uppercase tracking-tighter">Zenith Admin</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2"><Menu /></button>
      </div>

      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen} 
      />

      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-12">
        <AdminHeader 
          activeTab={activeTab}
          isSupabase={isSupabase}
          isSaving={isSaving}
          onAddProject={addProject}
          onAddBlog={addBlog}
          onSaveProfile={saveProfile}
        />

        {/* Tab Router */}
        {activeTab === DashboardTab.OVERVIEW && (
          <OverviewTab projects={projects} blogs={blogs} onExploreJournal={() => setActiveTab(DashboardTab.BLOGS)} />
        )}
        {activeTab === DashboardTab.PROJECTS && (
          <ProjectsTab 
            projects={projects} 
            isAiLoading={isAiLoading} 
            onUpdate={(id, up) => updateItem('projects', id, up)} 
            onDelete={(id) => deleteItem('projects', id)} 
            onAiRefine={aiRefineProject}
          />
        )}
        {activeTab === DashboardTab.BLOGS && (
          <JournalTab 
            blogs={blogs} 
            isAiLoading={isAiLoading} 
            onUpdate={(id, up) => updateItem('blogs', id, up)} 
            onDelete={(id) => deleteItem('blogs', id)} 
            onAiRefine={aiRefineBlog}
          />
        )}
        {activeTab === DashboardTab.PROFILE && (
          <ProfileTab 
            profile={profile} 
            onProfileChange={(up) => setProfile({ ...profile, ...up })} 
          />
        )}

        {/* AI Thinking Overlay */}
        {isAiLoading && (
          <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-md z-[100] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-2 border-indigo-500/20 max-w-sm text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={32} />
              </div>
              <div>
                <h4 className="text-xl font-black mb-2">Gemini Thinking</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Processing your request with neural intelligence...</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
