
'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, Briefcase, FileText, User, 
  Globe, LogOut, Award, X, Terminal
} from 'lucide-react';
import { DashboardTab } from '../../types';
import { logoutAdmin } from '../../lib/auth';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const router = useRouter();

  const NavItem = ({ tab, icon, label }: { tab: DashboardTab, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => onTabChange(tab)} 
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm group ${
        activeTab === tab 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
        : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600'
      }`}
    >
      <span className={`${activeTab === tab ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>
        {icon}
      </span>
      {label}
    </button>
  );

  return (
    <>
      {/* Mobile Backdrop - High Z-index */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] lg:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container 
          - On Desktop (lg): relative, translate-x-0, w-72
          - On Mobile: fixed, transform, z-100
      */}
      <aside className={`
        fixed inset-y-0 left-0 z-[110] w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col 
        transition-transform duration-300 ease-[cubic-bezier(0.33,1,0.68,1)]
        lg:relative lg:translate-x-0 lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Sidebar Header */}
        <div className="p-6 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-xl transform group-hover:rotate-12 transition-transform">
                <Terminal size={20} strokeWidth={3} />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-xs uppercase tracking-widest text-slate-900 dark:text-white">DataLabs</span>
                <span className="font-bold text-[8px] uppercase tracking-[0.3em] text-indigo-500">Console_v2.5</span>
              </div>
            </Link>
            <button onClick={onClose} className="lg:hidden p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
              <X size={20} />
            </button>
          </div>
          <div className="h-px bg-slate-100 dark:bg-slate-800 w-full"></div>
        </div>

        {/* Navigation Section */}
        <div className="flex-1 px-4 py-2 space-y-8 overflow-y-auto custom-scrollbar">
          <div className="space-y-1">
            <p className="px-5 mb-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">System_Control</p>
            <nav className="space-y-1">
              <NavItem tab={DashboardTab.OVERVIEW} icon={<LayoutDashboard size={18}/>} label="Analytics" />
              <NavItem tab={DashboardTab.PROJECTS} icon={<Briefcase size={18}/>} label="Model Zoo" />
              <NavItem tab={DashboardTab.BLOGS} icon={<FileText size={18}/>} label="Research Notes" />
              <NavItem tab={DashboardTab.CERTIFICATIONS} icon={<Award size={18}/>} label="Credentials" />
              <NavItem tab={DashboardTab.PROFILE} icon={<User size={18}/>} label="Lab Profile" />
            </nav>
          </div>

          <div className="space-y-1">
            <p className="px-5 mb-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-400">External_Links</p>
            <Link href="/" className="flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-all group">
              <Globe size={18} className="text-slate-400 group-hover:rotate-12 transition-transform" />
              View Public Site
            </Link>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 mt-auto border-t border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => { logoutAdmin(); router.push('/'); }} 
            className="w-full flex items-center justify-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all group"
          >
            <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" /> 
            Exit Session
          </button>
        </div>
      </aside>
    </>
  );
}
