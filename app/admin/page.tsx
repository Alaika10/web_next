'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Profile, Project, BlogPost, Certification, DashboardTab } from '../../types';
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
        const { data: p } = await supabase.from('profiles').select('*').maybeSingle();
        if (p) setProfile(p);
        
        const { data: projs } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
        if (projs) setProjects(projs.map(p => ({ ...p, imageUrl: p.image_url })));
        
        const { data: b } = await supabase.from('blogs').select('*').order('date', { ascending: false });
        if (b) setBlogs(b.map(item => ({ ...item, imageUrl: item.image_url })));

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

  const addCertification = async () => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('certifications').insert([{
        title: "New Certification",
        issuer: "Organization Name",
        issue_date: new Date().toISOString().split('T')[0],
        image_url: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=800",
        credential_url: "",
        description: ""
      }]).select('*').single();

      if (error) throw error;
      if (data) {
        const newCert: Certification = {
          ...data,
          issueDate: data.issue_date,
          imageUrl: data.image_url,
          credentialUrl: data.credential_url
        };
        setCertifications([newCert, ...certifications]);
      }
    } catch (err) {
      alert("Error creating credential node.");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!supabase || !confirm("Permanent delete?")) return;
    setIsSaving(true);
    try {
      await supabase.from(table).delete().eq('id', id);
      if (table === 'projects') setProjects(projects.filter(p => p.id !== id));
      else if (table === 'blogs') setBlogs(blogs.filter(b => b.id !== id));
      else if (table === 'certifications') setCertifications(certifications.filter(c => c.id !== id));
    } finally {
      setIsSaving(false);
    }
  };

  const updateItem = async (table: string, id: string, updates: any) => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const dbUpdates = { ...updates };
      // Normalisasi snake_case untuk DB
      if (updates.imageUrl) { dbUpdates.image_url = updates.imageUrl; }
      if (updates.issueDate) { dbUpdates.issue_date = updates.issueDate; }
      if (updates.credentialUrl) { dbUpdates.credential_url = updates.credentialUrl; }
      
      // Hapus camelCase sebelum dikirim ke DB agar tidak error
      delete dbUpdates.imageUrl;
      delete dbUpdates.issueDate;
      delete dbUpdates.credentialUrl;

      const { error } = await supabase.from(table).update(dbUpdates).eq('id', id);
      if (error) throw error;

      // Update state lokal agar UI langsung sinkron
      if (table === 'certifications') {
        setCertifications(certifications.map(c => c.id === id ? { ...c, ...updates } : c));
      } else if (table === 'projects') {
        setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
      } else if (table === 'blogs') {
        setBlogs(blogs.map(b => b.id === id ? { ...b, ...updates } : b));
      }
    } catch (err) {
      console.error("Update failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    if (!supabase) return;
    setIsSaving(true);
    try {
      const { error } = await supabase.from('profiles').upsert({
        ...profile,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });
      if (error) throw error;
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100">
      <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b">
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2"><Menu /></button>
      </div>

      <AdminSidebar activeTab={activeTab} onTabChange={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} isOpen={isSidebarOpen} />

      <main className="flex-1 overflow-y-auto h-screen p-6 md:p-12 relative">
        <AdminHeader 
          activeTab={activeTab}
          isSupabase={isSupabase}
          isSaving={isSaving}
          onAddProject={() => {}} 
          onAddBlog={() => {}} 
          onSaveProfile={saveProfile}
          onAddCertification={addCertification}
        />

        {activeTab === DashboardTab.OVERVIEW && <OverviewTab projects={projects} blogs={blogs} onExploreJournal={() => setActiveTab(DashboardTab.BLOGS)} />}
        {activeTab === DashboardTab.PROJECTS && (
          <ProjectsTab projects={projects} isAiLoading={isAiLoading} onUpdate={(id, up) => updateItem('projects', id, up)} onDelete={(id) => deleteItem('projects', id)} onAiRefine={() => {}} />
        )}
        {activeTab === DashboardTab.BLOGS && (
          <JournalTab blogs={blogs} isAiLoading={isAiLoading} onUpdate={(id, up) => updateItem('blogs', id, up)} onDelete={(id) => deleteItem('blogs', id)} onAiRefine={() => {}} />
        )}
        {activeTab === DashboardTab.CERTIFICATIONS && (
          <CertificationsTab certs={certifications} onUpdate={(id, up) => updateItem('certifications', id, up)} onDelete={(id) => deleteItem('certifications', id)} onAdd={addCertification} />
        )}
        {activeTab === DashboardTab.PROFILE && <ProfileTab profile={profile} onProfileChange={(up) => setProfile({ ...profile, ...up })} />}
      </main>
    </div>
  );
}