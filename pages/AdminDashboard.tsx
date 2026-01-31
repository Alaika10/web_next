
import React, { useState } from 'react';
import { Profile, Project, BlogPost, DashboardTab } from '../types';
import { generateBlogDraft, generateProjectDescription } from '../services/geminiService';
import { supabase } from '../lib/supabase';

interface AdminProps {
  profile: Profile;
  setProfile: React.Dispatch<React.SetStateAction<Profile>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  blogs: BlogPost[];
  setBlogs: React.Dispatch<React.SetStateAction<BlogPost[]>>;
  refreshData: () => Promise<void>;
}

const AdminDashboard: React.FC<AdminProps> = ({ profile, setProfile, projects, setProjects, blogs, setBlogs, refreshData }) => {
  const [activeTab, setActiveTab] = useState<DashboardTab>(DashboardTab.PROJECTS);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const isSupabaseConfigured = !!supabase;

  // Handlers for Projects
  const addProject = async () => {
    if (!supabase) {
      const newLocalProj: Project = {
        id: Date.now().toString(),
        title: "New Local Project",
        description: "A short description.",
        imageUrl: "https://picsum.photos/seed/new/800/450",
        technologies: ["React"],
        link: "#",
        createdAt: new Date().toISOString()
      };
      setProjects([newLocalProj, ...projects]);
      return;
    }
    
    setIsSaving(true);
    const newProj = {
      title: "New Project",
      description: "A short description of your new project.",
      image_url: "https://picsum.photos/seed/new/800/450",
      technologies: ["React"],
      link: "#",
      created_at: new Date().toISOString()
    };
    const { error } = await supabase.from('projects').insert([newProj]);
    if (!error) await refreshData();
    setIsSaving(false);
  };

  const deleteProject = async (id: string) => {
    if (!supabase) {
      setProjects(projects.filter(p => p.id !== id));
      return;
    }
    if (!confirm("Are you sure you want to delete this project?")) return;
    setIsSaving(true);
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) await refreshData();
    setIsSaving(false);
  };

  const updateProjectInDb = async (id: string, updates: Partial<Project>) => {
    if (!supabase) {
      setProjects(projects.map(p => p.id === id ? { ...p, ...updates } : p));
      return;
    }
    setIsSaving(true);
    const dbUpdates: any = { ...updates };
    if (updates.imageUrl) {
      dbUpdates.image_url = updates.imageUrl;
      delete dbUpdates.imageUrl;
    }
    if (updates.createdAt) {
      dbUpdates.created_at = updates.createdAt;
      delete dbUpdates.createdAt;
    }
    
    const { error } = await supabase.from('projects').update(dbUpdates).eq('id', id);
    if (!error) await refreshData();
    setIsSaving(false);
  };

  // Handlers for Blogs
  const addBlog = async () => {
    if (!supabase) {
      const newLocalBlog: BlogPost = {
        id: Date.now().toString(),
        title: "New Local Blog",
        excerpt: "Draft excerpt.",
        content: "Draft content.",
        imageUrl: "https://picsum.photos/seed/blog/800/450",
        author: profile.name,
        date: new Date().toISOString().split('T')[0],
        tags: ["Draft"]
      };
      setBlogs([newLocalBlog, ...blogs]);
      return;
    }
    
    setIsSaving(true);
    const newBlog = {
      title: "New Blog Post",
      excerpt: "Click to edit this excerpt.",
      content: "Start writing your post content here.",
      image_url: "https://picsum.photos/seed/blog/800/450",
      author: profile.name,
      date: new Date().toISOString().split('T')[0],
      tags: ["Draft"]
    };
    const { error } = await supabase.from('blogs').insert([newBlog]);
    if (!error) await refreshData();
    setIsSaving(false);
  };

  const deleteBlog = async (id: string) => {
    if (!supabase) {
      setBlogs(blogs.filter(b => b.id !== id));
      return;
    }
    if (!confirm("Delete this article?")) return;
    setIsSaving(true);
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) await refreshData();
    setIsSaving(false);
  };

  const updateBlogInDb = async (id: string, updates: Partial<BlogPost>) => {
    if (!supabase) {
      setBlogs(blogs.map(b => b.id === id ? { ...b, ...updates } : b));
      return;
    }
    setIsSaving(true);
    const dbUpdates: any = { ...updates };
    if (updates.imageUrl) {
      dbUpdates.image_url = updates.imageUrl;
      delete dbUpdates.imageUrl;
    }
    const { error } = await supabase.from('blogs').update(dbUpdates).eq('id', id);
    if (!error) await refreshData();
    setIsSaving(false);
  };

  // Profile Update
  const saveProfile = async () => {
    if (!supabase) return alert("Supabase not configured. Changes are only local for this session.");
    setIsSaving(true);
    const { error } = await supabase.from('profiles').upsert({
      id: profile.id || 1, 
      ...profile
    });
    if (!error) alert("Profile saved successfully!");
    else alert("Error saving profile: " + error.message);
    setIsSaving(false);
  };

  const handleAiProjectDescription = async (id: string, title: string, tech: string[]) => {
    setIsAiLoading(true);
    const desc = await generateProjectDescription(title, tech);
    await updateProjectInDb(id, { description: desc });
    setIsAiLoading(false);
  };

  const handleAiBlogDraft = async (id: string, topic: string) => {
    setIsAiLoading(true);
    const data = await generateBlogDraft(topic);
    if (data) {
      await updateBlogInDb(id, { title: data.title, excerpt: data.excerpt, content: data.content });
    }
    setIsAiLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 flex flex-col hidden md:flex">
        <div className="p-6 space-y-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Management</p>
          <nav className="space-y-2">
            {Object.values(DashboardTab).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all ${
                  activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-6 border-t">
          <div className="flex items-center gap-3">
            <img src={profile.avatar} className="w-10 h-10 rounded-full border object-cover" />
            <div>
              <p className="text-sm font-bold line-clamp-1">{profile.name}</p>
              <p className="text-xs text-slate-500">Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto relative">
        {/* Connection Warning */}
        {!isSupabaseConfigured && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-4 text-amber-800">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="font-bold">Database Not Connected</p>
              <p className="text-sm">Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` in environment variables to persist your changes. Currently using session-only data.</p>
            </div>
          </div>
        )}

        {/* Saving Overlay */}
        {isSaving && (
          <div className="absolute top-4 right-12 z-50 bg-white/80 dark:bg-slate-800/80 px-4 py-2 rounded-full border shadow-sm backdrop-blur flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-widest">Updating...</span>
          </div>
        )}

        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-3xl font-bold">{activeTab}</h1>
            <p className="text-slate-500">Manage your site content dynamically.</p>
          </div>
          <div className="flex gap-2">
            {activeTab === DashboardTab.PROJECTS && (
              <button onClick={addProject} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-sm transition-all">
                + New Project
              </button>
            )}
            {activeTab === DashboardTab.BLOGS && (
              <button onClick={addBlog} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 shadow-sm transition-all">
                + New Blog Post
              </button>
            )}
            {activeTab === DashboardTab.PROFILE && (
              <button onClick={saveProfile} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-emerald-700 shadow-sm transition-all">
                Save All Profile Changes
              </button>
            )}
          </div>
        </header>

        <div className="bg-white dark:bg-slate-900 border rounded-[2rem] p-4 md:p-8 shadow-sm">
          {isAiLoading && (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center">
              <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-bold text-indigo-600 animate-pulse">Gemini is writing content...</p>
              </div>
            </div>
          )}

          {activeTab === DashboardTab.PROJECTS && (
            <div className="space-y-12">
              {projects.length === 0 && <p className="text-center py-12 text-slate-400 italic">No projects found. Add your first masterpiece!</p>}
              {projects.map(proj => (
                <div key={proj.id} className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12 border-b last:border-0 items-start">
                  <div className="space-y-2">
                    <img src={proj.imageUrl || (proj as any).image_url} className="w-full aspect-video rounded-xl object-cover border" />
                    <input 
                      type="text" 
                      defaultValue={proj.imageUrl || (proj as any).image_url} 
                      onBlur={(e) => updateProjectInDb(proj.id, { imageUrl: e.target.value })}
                      className="w-full text-[10px] p-2 bg-slate-50 dark:bg-slate-800 rounded border"
                      placeholder="Image URL"
                    />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <input 
                      className="text-2xl font-bold w-full bg-transparent focus:ring-0 focus:outline-none border-b border-transparent focus:border-indigo-600"
                      defaultValue={proj.title}
                      onBlur={(e) => updateProjectInDb(proj.id, { title: e.target.value })}
                    />
                    <textarea 
                      className="w-full min-h-[100px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 p-4 rounded-xl focus:ring-1 focus:ring-indigo-600"
                      defaultValue={proj.description}
                      onBlur={(e) => updateProjectInDb(proj.id, { description: e.target.value })}
                    />
                    <div className="flex gap-4">
                      <button 
                        onClick={() => handleAiProjectDescription(proj.id, proj.title, proj.technologies)}
                        className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-2"
                      >
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z"/></svg>
                        Refine with AI
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <button 
                      onClick={() => deleteProject(proj.id)}
                      className="w-full bg-red-50 dark:bg-red-950/30 text-red-600 p-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      Delete Project
                    </button>
                    <p className="text-xs text-slate-400 text-center">ID: {proj.id.substring(0,8)}...</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === DashboardTab.BLOGS && (
            <div className="space-y-8">
              {blogs.length === 0 && <p className="text-center py-12 text-slate-400 italic">The journal is empty. Write your first story!</p>}
              {blogs.map(post => (
                <div key={post.id} className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-8 border-b last:border-0 items-start">
                  <div className="space-y-2">
                    <img src={post.imageUrl || (post as any).image_url} className="w-full aspect-video rounded-xl object-cover border" />
                    <input 
                      type="text" 
                      defaultValue={post.imageUrl || (post as any).image_url} 
                      onBlur={(e) => updateBlogInDb(post.id, { imageUrl: e.target.value })}
                      className="w-full text-[10px] p-2 bg-slate-50 dark:bg-slate-800 rounded border"
                      placeholder="Image URL"
                    />
                  </div>
                  <div className="lg:col-span-2 space-y-4">
                    <input 
                      className="text-xl font-bold w-full bg-transparent border-b"
                      defaultValue={post.title}
                      onBlur={(e) => updateBlogInDb(post.id, { title: e.target.value })}
                    />
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Excerpt</p>
                    <textarea 
                      className="w-full min-h-[60px] text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg"
                      defaultValue={post.excerpt}
                      onBlur={(e) => updateBlogInDb(post.id, { excerpt: e.target.value })}
                    />
                    <p className="text-xs text-slate-400 uppercase font-bold tracking-tighter">Content (Markdown)</p>
                    <textarea 
                      className="w-full min-h-[150px] text-sm bg-slate-50 dark:bg-slate-800 p-3 rounded-lg font-mono"
                      defaultValue={post.content}
                      onBlur={(e) => updateBlogInDb(post.id, { content: e.target.value })}
                    />
                    <button 
                      onClick={() => handleAiBlogDraft(post.id, post.title)}
                      className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 flex items-center gap-2"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L14.85 9.15L22 12L14.85 14.85L12 22L9.15 14.85L2 12L9.15 9.15L12 2Z"/></svg>
                      Auto-generate with Gemini
                    </button>
                  </div>
                  <div className="space-y-4">
                    <button 
                      onClick={() => deleteBlog(post.id)}
                      className="w-full bg-red-50 dark:bg-red-950/30 text-red-600 p-2.5 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                    >
                      Delete Post
                    </button>
                    <p className="text-xs text-slate-400 text-center">Date: {post.date}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === DashboardTab.PROFILE && (
            <div className="space-y-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                  <input 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-indigo-600"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Job Title</label>
                  <input 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-indigo-600"
                    value={profile.title}
                    onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avatar URL</label>
                  <input 
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-indigo-600"
                    value={profile.avatar}
                    onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-500 uppercase tracking-wider">About Me</label>
                <textarea 
                  className="w-full min-h-[150px] p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-indigo-600 leading-relaxed"
                  value={profile.about}
                  onChange={(e) => setProfile({ ...profile, about: e.target.value })}
                />
              </div>

              <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold text-xl">Skills List</h3>
                   <button 
                    onClick={() => setProfile({ ...profile, skills: [...profile.skills, { name: 'New Skill', level: 50, category: 'Other' }] })}
                    className="text-sm font-bold text-indigo-600 hover:underline"
                   >
                     + Add Skill
                   </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.skills.map((skill, i) => (
                    <div key={i} className="p-4 border dark:border-slate-800 rounded-2xl flex items-center justify-between gap-4">
                      <input 
                        className="bg-transparent border-b font-semibold focus:outline-none focus:border-indigo-600"
                        value={skill.name}
                        onChange={(e) => {
                          const newSkills = [...profile.skills];
                          newSkills[i].name = e.target.value;
                          setProfile({ ...profile, skills: newSkills });
                        }}
                      />
                      <div className="flex-1 flex items-center gap-2">
                        <input 
                          type="range" 
                          min="0" max="100" 
                          value={skill.level} 
                          onChange={(e) => {
                            const newSkills = [...profile.skills];
                            newSkills[i].level = parseInt(e.target.value);
                            setProfile({ ...profile, skills: newSkills });
                          }}
                          className="flex-1 accent-indigo-600"
                        />
                        <span className="text-xs font-bold w-8">{skill.level}%</span>
                      </div>
                      <button 
                        onClick={() => {
                          const newSkills = profile.skills.filter((_, idx) => idx !== i);
                          setProfile({ ...profile, skills: newSkills });
                        }}
                        className="text-red-400 hover:text-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                 <h3 className="font-bold text-xl">Social Links</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   {Object.keys(profile.socials).map((platform) => (
                      <div key={platform} className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">{platform}</label>
                        <input 
                          className="w-full p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border-none ring-1 ring-slate-200 dark:ring-slate-700 focus:ring-indigo-600"
                          value={(profile.socials as any)[platform]}
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

          {activeTab === DashboardTab.OVERVIEW && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 bg-indigo-50 dark:bg-indigo-950/30 rounded-3xl border border-indigo-100 dark:border-indigo-900 flex flex-col items-center text-center">
                <p className="text-4xl font-black text-indigo-600">{projects.length}</p>
                <p className="font-bold text-slate-600 dark:text-slate-400 mt-2">Projects</p>
              </div>
              <div className="p-8 bg-violet-50 dark:bg-violet-950/30 rounded-3xl border border-violet-100 dark:border-violet-900 flex flex-col items-center text-center">
                <p className="text-4xl font-black text-violet-600">{blogs.length}</p>
                <p className="font-bold text-slate-600 dark:text-slate-400 mt-2">Articles</p>
              </div>
              <div className="p-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl border border-emerald-100 dark:border-emerald-900 flex flex-col items-center text-center">
                <p className="text-4xl font-black text-emerald-600">{profile.skills.length}</p>
                <p className="font-bold text-slate-600 dark:text-slate-400 mt-2">Expertise</p>
              </div>
              <div className="md:col-span-3 p-8 border dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-800/50">
                <h3 className="font-bold text-xl mb-4">Portfolio Management System</h3>
                <div className="flex items-center gap-2 text-emerald-500 font-bold mb-4">
                  <div className={`w-2 h-2 rounded-full animate-ping ${isSupabaseConfigured ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                  {isSupabaseConfigured ? 'Live Cloud Sync Active' : 'Offline Mode (Session only)'}
                </div>
                <ul className="list-disc list-inside space-y-2 text-slate-500 text-sm">
                  <li>Data is automatically synced between devices when Supabase is connected.</li>
                  <li>Gemini AI handles technical writing to save you time.</li>
                  <li>Responsive layout allows you to update your site from your mobile phone.</li>
                  <li>Dark mode is automatically applied based on system preferences.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
