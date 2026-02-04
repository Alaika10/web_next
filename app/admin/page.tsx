
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, Project, BlogPost, Certification, DashboardTab } from '../../types';
import { supabase } from '../../lib/supabase';
import { INITIAL_PROFILE } from '../../constants';
import { isAuthenticated } from '../../lib/auth';
import { Menu, Terminal } from 'lucide-react';
import { deleteRecord, toggleBlogFeature } from './actions';

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
        const [p, projs, b, certs] = await Promise.all([
          supabase.from('profiles').select('*').maybeSingle(),
          supabase.from('projects').select('id, title, description, image_url, created_at, technologies').order('created_at', { ascending: false }),
          supabase.from('blogs').select('id, title, excerpt, date, author, image_url, is_headline, is_trending').order('date', { ascending: false }),
          supabase.from('certifications').select('*').order('issue_date', { ascending: false })
        ]);

        if (p.data) setProfile(p.data);
        if (projs.data) setProjects(projs.data.map((p:any) => ({ ...p, imageUrl: p.image_url })));
        if (b.data) setBlogs(b.data.map((item:any) => ({ 
          ...item, 
          imageUrl: item.image_url,
          isHeadline: item.is_headline,
          isTrending: item.is_trending
        })));
        if (certs.data) setCertifications(certs.data.map((c:any) => ({
          ...c,
          issueDate: c.issue_date,
          imageUrl: c.image_url,
          credentialUrl: c.credential_url
        })));
      } finally {
        setLoading(false);
      }
    };

    refreshData();
  }, [router]);

  const addProject = async () => {
    if (!supabase) return;
    setIsSaving(true);
    const { data } = await supabase.from('projects').insert([{ title: "Untitled Project", description: "Draft...", technologies: [] }]).select('id').single();
    if (data) router.push(`/admin/projects/${data.id}`);
    setIsSaving(false);
  };

  const addBlog = async () => {
    if (!supabase) return;
    setIsSaving(true);
    const { data } = await supabase.from('blogs').insert([{ title: "New Entry", excerpt: "Draft...", content: "# Start writing", author: profile.name, date: new Date().toISOString().split('T')[0] }]).select('id').single();
    if (data) router.push(`/admin/blogs/${data.id}`);
    setIsSaving(false);
  };

  const handleDelete = async (table: string, id: string) => {
    if (!confirm("Delete permanently?")) return;
    setIsSaving(true);
    const result = await deleteRecord(table, id);
    if (result.success) {
      if (table === 'projects') setProjects(prev => prev.filter(p => p.id !== id));
      else if (table === 'blogs') setBlogs(prev => prev.filter(b => b.id !== id));
      else if (table === 'certifications') setCertifications(prev => prev.filter(c => c.id !== id));
    } else {
      alert(result.error);
    }
    setIsSaving(false);
  };

  const handleToggleBlog = async (id: string, type: 'isHeadline' | 'isTrending') => {
    const field = type === 'isHeadline' ? 'is_headline' : 'is_trending';
    const post = blogs.find(b => b.id === id);
    if (!post) return;
    
    const result = await toggleBlogFeature(id, field, !post[type]);
    if (result.success) {
      setBlogs(prev => prev.map(b => b.id === id ? { ...b, [type]: !b[type] } : b));
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <AdminSidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        <div className="lg:hidden flex items-center justify-between px-6 py-4 bg-white dark:bg-slate-900 border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white"><Terminal size={16} /></div>
            <span className="font-black text-[10px] uppercase tracking-widest">Admin Console</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl"><Menu size={20} /></button>
        </div>
        <main className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-14">
          <div className="max-w-6xl mx-auto space-y-12 pb-20">
            <AdminHeader activeTab={activeTab} isSupabase={!!supabase} isSaving={isSaving} onAddProject={addProject} onAddBlog={addBlog} onSaveProfile={() => {}} onAddCertification={() => {}} />
            <div className="animate-in fade-in duration-500">
              {activeTab === DashboardTab.OVERVIEW && <OverviewTab projects={projects} blogs={blogs} onExploreJournal={() => setActiveTab(DashboardTab.BLOGS)} />}
              {activeTab === DashboardTab.PROJECTS && <ProjectsTab projects={projects} onDelete={(id) => handleDelete('projects', id)} />}
              {activeTab === DashboardTab.BLOGS && <JournalTab blogs={blogs} onDelete={(id) => handleDelete('blogs', id)} onToggleFeature={handleToggleBlog} />}
              {activeTab === DashboardTab.CERTIFICATIONS && <CertificationsTab certs={certifications} onUpdate={() => {}} onDelete={(id) => handleDelete('certifications', id)} onAdd={() => {}} />}
              {activeTab === DashboardTab.PROFILE && <ProfileTab profile={profile} onProfileChange={(up) => setProfile(prev => ({ ...prev, ...up }))} />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
