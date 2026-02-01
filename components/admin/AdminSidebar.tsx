
'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Briefcase, FileText, User, Globe, LogOut } from 'lucide-react';
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
      <div className="p-8 pb-4">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200 dark:shadow-none">D</div>
          <div>
            <p className="font-black text-sm uppercase leading-none">DataLab Console</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">v2.1.0 Stable</p>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem tab={DashboardTab.OVERVIEW} icon={<LayoutDashboard size={18}/>} label="Analytics" />
          <NavItem tab={DashboardTab.PROJECTS} icon={<Briefcase size={18}/>} label="Model Zoo" />
          <NavItem tab={DashboardTab.BLOGS} icon={<FileText size={18}/>} label="Research Notes" />
          <NavItem tab={DashboardTab.PROFILE} icon={<User size={18}/>} label="Lab Profile" />
        </nav>
      </div>

      <div className="mt-auto p-8 space-y-4">
        <Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors">
          <Globe size={18} /> View Public Site
        </Link>
        <button onClick={() => { logoutAdmin(); router.push('/'); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
