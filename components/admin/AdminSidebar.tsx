'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, User, Globe, LogOut, Zap, Atom, Award } from 'lucide-react';
import { DashboardTab } from '../../types';
import { logoutAdmin } from '../../lib/auth';

interface SidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  isOpen: boolean;
}

export default function AdminSidebar({ activeTab, onTabChange, isOpen }: SidebarProps) {
  const router = useRouter();

  const NavItem = ({ tab, icon, label }: { tab: DashboardTab, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => onTabChange(tab)} 
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all text-sm group ${
        activeTab === tab 
        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200 dark:shadow-none translate-x-1' 
        : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
    >
      <span className={`${activeTab === tab ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>{icon}</span>
      {label}
    </button>
  );

  return (
    <aside className={`fixed inset-y-0 left-0 z-[70] w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div className="p-8 pb-4 flex-1">
        <div className="relative mb-12 p-6 bg-slate-900 rounded-[2.5rem] overflow-hidden group shadow-2xl shadow-indigo-100 dark:shadow-none">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600 rounded-full blur-[60px] opacity-40 -translate-y-10 translate-x-10 group-hover:scale-150 transition-transform duration-1000"></div>
          <div className="relative z-10 flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:rotate-[360deg] transition-transform duration-[1.5s] ease-in-out">
              <Atom className="text-indigo-600" size={32} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-white font-black text-lg tracking-tighter uppercase mb-0.5">DataLabs <span className="text-indigo-400">Console</span></p>
            </div>
          </div>
        </div>

        <div className="space-y-2 overflow-y-auto">
          <p className="px-5 mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Menu Navigation</p>
          <nav className="space-y-1">
            <NavItem tab={DashboardTab.OVERVIEW} icon={<LayoutDashboard size={18}/>} label="Analytics" />
            <NavItem tab={DashboardTab.PROJECTS} icon={<Briefcase size={18}/>} label="Model Zoo" />
            <NavItem tab={DashboardTab.BLOGS} icon={<FileText size={18}/>} label="Research Notes" />
            <NavItem tab={DashboardTab.CERTIFICATIONS} icon={<Award size={18}/>} label="Credentials" />
            <NavItem tab={DashboardTab.PROFILE} icon={<User size={18}/>} label="Lab Profile" />
          </nav>
        </div>
      </div>

      <div className="p-8 border-t border-slate-100 dark:border-slate-800 space-y-4 bg-slate-50/50 dark:bg-slate-900/50">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors group">
          <Globe size={18} className="group-hover:rotate-12 transition-transform" /> View Public Site
        </Link>
        <button onClick={() => { logoutAdmin(); router.push('/'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all group">
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" /> Logout Session
        </button>
      </div>
    </aside>
  );
}