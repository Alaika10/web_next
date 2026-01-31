
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_BLOGS } from './constants';
import { Profile, Project, BlogPost } from './types';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [blogs, setBlogs] = useState<BlogPost[]>(INITIAL_BLOGS);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    // If supabase is not configured, we just use the initial state and stop loading
    if (!supabase) {
      console.log("Supabase not configured, using local constants.");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Fetch Profile (Assume single row for portfolio)
      const { data: profileData } = await supabase.from('profiles').select('*').single();
      if (profileData) setProfile(profileData);

      // Fetch Projects
      const { data: projectsData } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (projectsData) setProjects(projectsData);

      // Fetch Blogs
      const { data: blogsData } = await supabase.from('blogs').select('*').order('date', { ascending: false });
      if (blogsData) setBlogs(blogsData);
      
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Syncing with Zenith Cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home profile={profile} projects={projects} blogs={blogs} />} />
            <Route path="/projects" element={<Projects projects={projects} />} />
            <Route path="/blog" element={<Blog blogs={blogs} />} />
            <Route path="/about" element={<About profile={profile} />} />
            <Route 
              path="/admin" 
              element={
                <AdminDashboard 
                  profile={profile} 
                  setProfile={setProfile}
                  projects={projects}
                  setProjects={setProjects}
                  blogs={blogs}
                  setBlogs={setBlogs}
                  refreshData={fetchData}
                />
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="py-12 px-6 border-t mt-12 bg-slate-50 dark:bg-slate-900">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div>
              <p className="font-bold text-xl mb-2">Zenith</p>
              <p className="text-slate-500 text-sm max-w-xs">Building the web of tomorrow with passion and precision.</p>
            </div>
            <div className="flex space-x-6">
              <a href={profile?.socials?.github} className="text-slate-500 hover:text-indigo-600">GitHub</a>
              <a href={profile?.socials?.linkedin} className="text-slate-500 hover:text-indigo-600">LinkedIn</a>
              <a href={profile?.socials?.twitter} className="text-slate-500 hover:text-indigo-600">Twitter</a>
            </div>
            <p className="text-slate-400 text-xs">© 2024 {profile?.name}. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
};

export default App;
