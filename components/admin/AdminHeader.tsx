'use client';
import React from 'react';
import { Plus, Save, RefreshCw } from 'lucide-react';
import { DashboardTab } from '../../types';

interface HeaderProps {
  activeTab: DashboardTab;
  isSupabase: boolean;
  isSaving: boolean;
  onAddProject: () => void;
  onAddBlog: () => void;
  onSaveProfile: () => void;
  onAddCertification?: () => void;
}

export default function AdminHeader({ activeTab, isSupabase, isSaving, onAddProject, onAddBlog, onSaveProfile, onAddCertification }: HeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
      <div>
        <h1 className="text-4xl font-black tracking-tight mb-2">{activeTab}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest">
            <div className={`w-2 h-2 rounded-full ${isSupabase ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
            {isSupabase ? 'Cloud Connected' : 'Local Only'}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {activeTab === DashboardTab.PROJECTS && (
          <button onClick={onAddProject} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all">
            <Plus size={18} /> New Project
          </button>
        )}
        {activeTab === DashboardTab.BLOGS && (
          <button onClick={onAddBlog} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all">
            <Plus size={18} /> New Article
          </button>
        )}
        {activeTab === DashboardTab.CERTIFICATIONS && onAddCertification && (
          <button onClick={onAddCertification} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-indigo-700 transition-all">
            <Plus size={18} /> New Credential
          </button>
        )}
        {activeTab === DashboardTab.PROFILE && (
          <button onClick={onSaveProfile} className="flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-xl hover:bg-emerald-700 transition-all">
            <Save size={18} /> Save Profile
          </button>
        )}
      </div>
    </header>
  );
}