'use client';
import React from 'react';
import { Plus, Save, Cloud, CloudOff } from 'lucide-react';
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
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
      <div className="space-y-2">
        <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{activeTab}</h1>
        <div className="flex items-center gap-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
            isSupabase 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/50' 
            : 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/20 dark:border-red-900/50'
          }`}>
            {isSupabase ? <Cloud size={10} /> : <CloudOff size={10} />}
            {isSupabase ? 'Cloud Live' : 'Offline Mode'}
          </div>
          {isSaving && (
            <div className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase animate-pulse">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>
              Synchronizing...
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        {activeTab === DashboardTab.PROJECTS && (
          <button onClick={onAddProject} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/10 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus size={16} /> New Project
          </button>
        )}
        {activeTab === DashboardTab.BLOGS && (
          <button onClick={onAddBlog} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/10 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus size={16} /> New Article
          </button>
        )}
        {activeTab === DashboardTab.CERTIFICATIONS && onAddCertification && (
          <button onClick={onAddCertification} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/10 hover:bg-indigo-700 transition-all active:scale-95">
            <Plus size={16} /> New Credential
          </button>
        )}
        {activeTab === DashboardTab.PROFILE && (
          <button onClick={onSaveProfile} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:bg-emerald-700 transition-all active:scale-95">
            <Save size={16} /> Update Profile
          </button>
        )}
      </div>
    </header>
  );
}