
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, Project, BlogPost, Certification, DashboardTab } from '../../types';
import { supabase } from '../../lib/supabase';
import { INITIAL_PROFILE } from '../../constants';
import { isAuthenticated } from '../../lib/auth';
import { Menu, Terminal } from 'lucide-react';

// Import Modular Components
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminHeader from '../../components/admin/AdminHeader';
import OverviewTab from '../../components/admin/OverviewTab';
import ProjectsTab from '../../components/admin/ProjectsTab';
import JournalTab from '../../components/admin/JournalTab';
import ProfileTab from '../../components/admin/ProfileTab';
import CertificationsTab from '../../components/admin/CertificationsTab';

export default function AdminPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.OVERVIEW);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        const { data: p } = await supabase.from('profiles').select('*').maybeSingle();
        if (p) setProfile(p);
        
        const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projs) setProjects(projs.map(p => ({ ...p, imageUrl: p.image_url })));
        
        const { data: b } = await supabase.from('blogs').select('*').order('date', { ascending: false });
        if (b) setBlogs(b.map(item => ({ 
          ...item, 
          imageUrl: item.image_url,
          isHeadline: item.is_headline,
          isTrending: item.is_trending
        })));

        const { data: certs } = await supabase.from('certifications').select('*').order('issue_date', { ascending: false });
        if (certs) setCertifications(certs.map(c => ({
          ...c,
          issueDate: c.issue_date,
          imageUrl: c.image_url,
          credentialUrl: c.credential_url
        })));
      } catch (err) {
        console.error("Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    refreshData();
  }, [router]);

  const addProject = async () => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('projects').insert([{
        title: "New Project Implementation",
        description: "Initial model description...",
        technologies: ["Python"],
        image_url: ""
      }]).select('*').single();
      if (error) throw error;
      if (data) setProjects([{ ...data, imageUrl: data.image_url }, ...projects]);
    } catch (err) { alert("Failed to create project."); } 
    finally { setIsSaving(false); }
  };

  const addBlog = async () => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('blogs').insert([{
        title: "New Research Entry",
        excerpt: "Brief summary...",
        content: "# New Article",
        author: profile.name,
        date: new Date().toISOString().split('T')[0],
        tags: ["Research"],
        is_headline: false,
        is_trending: false
      }]).select('*').single();
      if (error) throw error;
      if (data) setBlogs([{ ...data, imageUrl: data.image_url }, ...blogs]);
    } catch (err) { alert("Failed to create blog."); }
    finally { setIsSaving(false); }
  };

  const addCertification = async () => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('certifications').insert([{
        title: "New Certification",
        issuer: "Organization Name",
        issue_date: new Date().toISOString().split('T')[0],
        image_url: "",
        credential_url: "",
        description: ""
      }]).select('*').single();
      if (error) throw error;
      if (data) {
        setCertifications([{
          ...data,
          issueDate: data.issue_date,
          imageUrl: data.image_url,
          credentialUrl: data.credential_url
        }, ...certifications]);
      }
    } catch (err) { alert("Error creating credential."); }
    finally { setIsSaving(false); }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!supabase || !confirm("Permanent delete?")) return;
    setIsSaving(true);
    try {
      await supabase.from(table).delete().eq('id', id);
      if (table === 'projects') setProjects(projects.filter(p => p.id !== id));
      else if (table === 'blogs') setBlogs(blogs.filter(b => b.id !== id));
      else if (table === 'certifications') setCertifications(certifications.filter(c => c.id !== id));
    } finally { setIsSaving(false); }
  };

  const updateItem = async (table: string, id: string, updates: any) => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const dbUpdates = { ...updates };
      if (updates.imageUrl !== undefined) { dbUpdates.image_url = updates.imageUrl; delete dbUpdates.imageUrl; }
      if (updates.issueDate !== undefined) { dbUpdates.issue_date = updates.issueDate; delete dbUpdates.issueDate; }
      if (updates.credentialUrl !== undefined) { dbUpdates.credential_url = updates.credentialUrl; delete dbUpdates.credentialUrl; }
      const { error } = await supabase.from(table).update(dbUpdates).eq('id', id);
      if (error) throw error;
      if (table === 'certifications') setCertifications(certifications.map(c => c.id === id ? { ...c, ...updates } : c));
      else if (table === 'projects') setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
      else if (table === 'blogs') setBlogs(blogs.map(b => b.id === id ? { ...b, ...updates } : b));
    } finally { setIsSaving(false); }
  };

  const toggleBlogFeature = async (id: string, type: 'isHeadline' | 'isTrending') => {
    if (!supabase) return;
    const post = blogs.find(b => b.id === id);
    if (!post) return;
    const newValue = !post[type];
    const dbField = type === 'isHeadline' ? 'is_headline' : 'is_trending';
    try {
      const { error } = await supabase.from('blogs').update({ [dbField]: newValue }).eq('id', id);
      if (error) throw error;
      setBlogs(blogs.map(b => b.id === id ? { ...b, [type]: newValue } : b));
    } catch (err) { console.error("Feature toggle failed"); }
  };

  const saveProfile = async () => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        ...profile, updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) throw error;
      alert("Profile updated successfully");
    } catch (err) { alert("Failed to update profile"); }
    finally { setIsSaving(false); }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Sidebar - Positioned correctly to not overlap */}
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      {/* Main Content Wrapper */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        
        {/* Mobile Header (Only visible on Mobile) */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <Terminal size={16} />
            </div>
            <span className="font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white">Admin Console</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Scrollable Area */}
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-14">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            
            <AdminHeader 
              activeTab={activeTab}
              isSupabase={!!supabase}
              isSaving={isSaving}
              onAddProject={addProject} 
              onAddBlog={addBlog} 
              onSaveProfile={saveProfile}
              onAddCertification={addCertification}
            />

            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              {activeTab === DashboardTab.OVERVIEW && (
                <OverviewTab 
                  projects={projects} 
                  blogs={blogs} 
                  onExploreJournal={() => setActiveTab(DashboardTab.BLOGS)} 
                />
              )}
              {activeTab === DashboardTab.PROJECTS && (
                <ProjectsTab 
                  projects={projects} 
                  isAiLoading={isAiLoading} 
                  onUpdate={(id, up) => updateItem('projects', id, up)} 
                  onDelete={(id) => deleteItem('projects', id)} 
                  onAiRefine={() => {}} 
                />
              )}
              {activeTab === DashboardTab.BLOGS && (
                <JournalTab 
                  blogs={blogs} 
                  isAiLoading={isAiLoading} 
                  onUpdate={(id, up) => updateItem('blogs', id, up)} 
                  onDelete={(id) => deleteItem('blogs', id)} 
                  onAiRefine={() => {}} 
                  onToggleFeature={toggleBlogFeature} 
                />
              )}
              {activeTab === DashboardTab.CERTIFICATIONS && (
                <CertificationsTab 
                  certs={certifications} 
                  onUpdate={(id, up) => updateItem('certifications', id, up)} 
                  onDelete={(id) => deleteItem('certifications', id)} 
                  onAdd={addCertification} 
                />
              )}
              {activeTab === DashboardTab.PROFILE && (
                <ProfileTab 
                  profile={profile} 
                  onProfileChange={(up) => setProfile({ ...profile, ...up })} 
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
