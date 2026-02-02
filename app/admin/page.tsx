'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, Project, BlogPost, DashboardTab } from '../../types';
import { generateBlogDraft, generateProjectDescription } from '../../services/geminiService';
import { supabase } from '../../lib/supabase';
import { INITIAL_PROFILE } from '../../constants';
import { isAuthenticated } from '../../lib/auth';
import { Sparkles, Menu, CheckCircle2, AlertCircle } from 'lucide-react';

// Import Modular Components
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import OverviewTab from '../../components/admin/OverviewTab';
import ProjectsTab from '../../components/admin/ProjectsTab';
import JournalTab from '../../components/admin/JournalTab';
import ProfileTab from '../../components/admin/ProfileTab';

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
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const isSupabase = !!supabase;

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const refreshData = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const { data: p, error } = await supabase.from('profiles').select('*').maybeSingle();
        if (p) setProfile(p);
        
        const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projs) setProjects(projs || []);
        
        const { data: b } = await supabase.from('blogs').select('*').order('date', { ascending: false });
        if (b) setBlogs(b || []);
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    refreshData();
  }, [router]);

  const addProject = async () => {
    if (!supabase) {
      alert("Database connection is not configured.");
      return;
    }
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('projects').insert([{
        title: "Untitled Project",
        description: "Brief summary of the project.",
        image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
        technologies: ["React"],
        link: "#",
        content: ""
      }]).select('id').single();

      if (error) throw error;
      if (data) {
        router.push(`/admin/projects/${data.id}`);
      }
    } catch (err) {
      console.error("Add project error:", err);
      alert("Error: Cloud system failed to initialize project node.");
    } finally {
      setIsSaving(false);
    }
  };

  const addBlog = async () => {
    if (!supabase) {
      alert("Database connection is not configured.");
      return;
    }
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('blogs').insert([{
        title: "New Journal Entry",
        excerpt: "Short summary for the list view...",
        content: "",
        image_url: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800",
        author: profile.name || "Alex Sterling",
        date: new Date().toISOString().split('T')[0],
        tags: ["General"],
        is_headline: false, // Corrected to snake_case
        is_trending: false  // Corrected to snake_case
      }]).select('id').single();

      if (error) throw error;
      if (data) {
        router.push(`/admin/blogs/${data.id}`);
      }
    } catch (err) {
      console.error("Add blog error:", err);
      alert("Error: Could not commit new journal entry to the database.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!supabase || !confirm("Permanent delete? This cannot be undone.")) return;
    setIsSaving(true);
    try {
      await supabase.from(table).delete().eq('id', id);
      if (table === 'projects') setProjects(projects.filter(p => p.id !== id));
      else setBlogs(blogs.filter(b => b.id !== id));
    } finally {
      setIsSaving(false);
    }
  };

  const updateItem = async (table: string, id: string, updates: any) => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const dbUpdates = { ...updates };
      // Map cammelCase to snake_case
      if (updates.imageUrl) { dbUpdates.image_url = updates.imageUrl; delete dbUpdates.imageUrl; }
      if (updates.isHeadline !== undefined) { dbUpdates.is_headline = updates.isHeadline; delete dbUpdates.isHeadline; }
      if (updates.isTrending !== undefined) { dbUpdates.is_trending = updates.isTrending; delete dbUpdates.isTrending; }
      
      await supabase.from(table).update(dbUpdates).eq('id', id);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleBlogFeature = async (id: string, type: 'isHeadline' | 'isTrending') => {
    if (!supabase) return;
    setIsSaving(true);
    
    const blog = blogs.find(b => b.id === id);
    if (!blog) return;

    const newValue = !((blog as any)[type]);

    try {
      if (type === 'isHeadline' && newValue === true) {
        // Hanya boleh ada 1 headline. Reset yang lain di database.
        await supabase.from('blogs').update({ is_headline: false }).neq('id', id);
      }

      const field = type === 'isHeadline' ? 'is_headline' : 'is_trending';
      const { error } = await supabase.from('blogs').update({ [field]: newValue }).eq('id', id);
      
      if (error) throw error;

      // Update local state
      setBlogs(prev => prev.map(b => {
        if (type === 'isHeadline') {
           return b.id === id ? { ...b, [type]: newValue } : { ...b, [type]: false };
        }
        return b.id === id ? { ...b, [type]: newValue } : b;
      }));

    } catch (err) {
      console.error("Toggle error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!supabase) return;
    setIsSaving(true);
    setSaveStatus('idle');
    
    try {
      const payload = {
        id: profile.id || 1,
        name: profile.name,
        title: profile.title,
        about: profile.about,
        avatar: profile.avatar,
        skills: profile.skills,
        experience: profile.experience,
        socials: profile.socials,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      console.error("Profile save error:", err);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const aiRefineProject = async (id: string, title: string, tech: string[]) => {
    setIsAiLoading(true);
    try {
      const desc = await generateProjectDescription(title, tech);
      if (desc) {
        await updateItem('projects', id, { description: desc });
        setProjects(prev => prev.map(p => p.id === id ? {...p, description: desc} : p));
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  const aiRefineBlog = async (id: string, topic: string) => {
    setIsAiLoading(true);
    try {
      const data = await generateBlogDraft(topic);
      if (data) {
        await updateItem('blogs', id, { title: data.title, excerpt: data.excerpt, content: data.content });
        setBlogs(prev => prev.map(b => b.id === id ? {...b, title: data.title, excerpt: data.excerpt, content: data.content} : b));
      }
    } finally {
      setIsAiLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">Authenticating Studio...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100">
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

      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-12 relative">
        {saveStatus !== 'idle' && (
          <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl animate-in slide-in-from-top-4 duration-300 ${
            saveStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
            {saveStatus === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <p className="font-bold text-sm tracking-tight">
              {saveStatus === 'success' ? 'Profile synchronized successfully!' : 'Error syncing profile. Check console for details.'}
            </p>
          </div>
        )}

        <AdminHeader 
          activeTab={activeTab}
          isSupabase={isSupabase}
          isSaving={isSaving}
          onAddProject={addProject}
          onAddBlog={addBlog}
          onSaveProfile={saveProfile}
        />

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
            onToggleFeature={toggleBlogFeature}
          />
        )}
        {activeTab === DashboardTab.PROFILE && (
          <ProfileTab 
            profile={profile} 
            onProfileChange={(up) => setProfile({ ...profile, ...up })} 
          />
        )}

        {isAiLoading && (
          <div className="fixed inset-0 bg-indigo-900/40 backdrop-blur-md z-[100] flex items-center justify-center">
            <div className="bg-white dark:bg-slate-900 p-12 rounded-[3rem] shadow-2xl flex flex-col items-center gap-6 border-2 border-indigo-500/20 max-w-sm text-center">
              <div className="relative">
                <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <Sparkles className="absolute inset-0 m-auto text-indigo-600 animate-pulse" size={32} />
              </div>
              <h4 className="text-xl font-black mb-2 tracking-tight">AI is Processing</h4>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Generating Content...</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}