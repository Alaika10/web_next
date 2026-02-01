
'use client';
import React from 'react';
import { Trash2 } from 'lucide-react';
import { Profile } from '../../types';

interface ProfileTabProps {
  profile: Profile;
  onProfileChange: (updates: Partial<Profile>) => void;
}

export default function ProfileTab({ profile, onProfileChange }: ProfileTabProps) {
  const updateSkill = (index: number, updates: any) => {
    const newSkills = [...profile.skills];
    newSkills[index] = { ...newSkills[index], ...updates };
    onProfileChange({ skills: newSkills });
  };

  const removeSkill = (index: number) => {
    onProfileChange({ skills: profile.skills.filter((_, i) => i !== index) });
  };

  const addSkill = () => {
    onProfileChange({ 
      skills: [...profile.skills, { name: 'New Skill', level: 50, category: 'Frontend' }] 
    });
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-10 space-y-12 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="relative group">
          <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-xl">
            <img src={profile.avatar} className="w-full h-full object-cover" />
          </div>
          <div className="mt-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Avatar URL</label>
            <input 
              className="w-full mt-1 bg-slate-50 dark:bg-slate-800/50 rounded-lg px-3 py-2 text-[10px]"
              value={profile.avatar}
              onChange={(e) => onProfileChange({ avatar: e.target.value })}
            />
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
            <input 
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" 
              value={profile.name} 
              onChange={(e) => onProfileChange({ name: e.target.value })} 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Job Title</label>
            <input 
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold" 
              value={profile.title} 
              onChange={(e) => onProfileChange({ title: e.target.value })} 
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">About Me</label>
            <textarea 
              className="w-full h-32 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl leading-relaxed" 
              value={profile.about} 
              onChange={(e) => onProfileChange({ about: e.target.value })} 
            />
          </div>
        </div>
      </div>

      <div className="pt-10 border-t space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-black">Skills Repository</h3>
          <button onClick={addSkill} className="text-xs font-black text-indigo-600 uppercase tracking-widest">+ Add Skill</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profile.skills.map((skill, i) => (
            <div key={i} className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between gap-4">
              <div className="flex-1">
                <input 
                  className="bg-transparent font-bold text-sm w-full outline-none" 
                  value={skill.name} 
                  onChange={(e) => updateSkill(i, { name: e.target.value })} 
                />
                <input 
                  type="range" 
                  className="w-full accent-indigo-600 h-1 mt-2" 
                  value={skill.level} 
                  onChange={(e) => updateSkill(i, { level: parseInt(e.target.value) })} 
                />
              </div>
              <button onClick={() => removeSkill(i)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
