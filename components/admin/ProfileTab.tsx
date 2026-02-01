
'use client';
import React, { useRef } from 'react';
import { Trash2, Plus, Briefcase, Share2, Award, User as UserIcon, Camera, Upload, X } from 'lucide-react';
import { Profile, Experience } from '../../types';

interface ProfileTabProps {
  profile: Profile;
  onProfileChange: (updates: Partial<Profile>) => void;
}

export default function ProfileTab({ profile, onProfileChange }: ProfileTabProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Avatar Upload Handler (Base64)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File is too large. Please select an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onProfileChange({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  // Skills Handlers
  const updateSkill = (index: number, updates: any) => {
    const newSkills = [...(profile.skills || [])];
    newSkills[index] = { ...newSkills[index], ...updates };
    onProfileChange({ skills: newSkills });
  };

  const removeSkill = (index: number) => {
    onProfileChange({ skills: (profile.skills || []).filter((_, i) => i !== index) });
  };

  const addSkill = () => {
    onProfileChange({ 
      skills: [...(profile.skills || []), { name: 'New Skill', level: 50, category: 'Other' }] 
    });
  };

  // Experience Handlers
  const updateExperience = (index: number, updates: Partial<Experience>) => {
    const newExp = [...(profile.experience || [])];
    newExp[index] = { ...newExp[index], ...updates };
    onProfileChange({ experience: newExp });
  };

  const addExperience = () => {
    onProfileChange({
      experience: [
        { company: 'New Company', role: 'Role Name', period: '2023 - Present', description: 'Brief description...' },
        ...(profile.experience || [])
      ]
    });
  };

  const removeExperience = (index: number) => {
    onProfileChange({ experience: (profile.experience || []).filter((_, i) => i !== index) });
  };

  // Socials Handlers
  const updateSocial = (platform: string, value: string) => {
    onProfileChange({
      socials: { ...profile.socials, [platform]: value } as Profile['socials']
    });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      {/* Basic Info Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm space-y-10">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <UserIcon className="text-indigo-600" size={24} />
          <h3 className="text-xl font-black">Identity & Research Bio</h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Enhanced Avatar Upload */}
          <div className="w-full lg:w-56 flex flex-col items-center gap-6">
            <div className="relative group">
              <div className="w-48 h-48 rounded-[2.5rem] overflow-hidden border-4 border-slate-100 dark:border-slate-800 shadow-2xl bg-slate-50 relative">
                {profile.avatar ? (
                  <img src={profile.avatar} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Avatar Preview" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-300">
                    <UserIcon size={64} />
                  </div>
                )}
                
                {/* Overlay on Hover */}
                <div 
                  onClick={triggerUpload}
                  className="absolute inset-0 bg-indigo-900/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-center p-4 backdrop-blur-sm"
                >
                  <Camera size={32} className="mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Change Image</span>
                </div>
              </div>

              {profile.avatar && (
                <button 
                  onClick={() => onProfileChange({ avatar: '' })}
                  className="absolute -top-3 -right-3 w-8 h-8 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-lg flex items-center justify-center text-red-500 hover:scale-110 transition-transform"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="w-full space-y-3">
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
              />
              <button 
                onClick={triggerUpload}
                className="w-full py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              >
                <Upload size={14} /> Upload New Photo
              </button>
              <p className="text-center text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Recommended: Square PNG/JPG, Max 2MB</p>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Display Name</label>
              <input 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-2 border-transparent focus:border-indigo-600 outline-none transition-all" 
                value={profile.name} 
                onChange={(e) => onProfileChange({ name: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Professional Title</label>
              <input 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-bold border-2 border-transparent focus:border-indigo-600 outline-none transition-all" 
                value={profile.title} 
                onChange={(e) => onProfileChange({ title: e.target.value })} 
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Scientific Bio / Research Interests</label>
              <textarea 
                className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-800 rounded-[2rem] border-2 border-transparent focus:border-indigo-600 outline-none transition-all leading-relaxed" 
                value={profile.about} 
                onChange={(e) => onProfileChange({ about: e.target.value })} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Award className="text-indigo-600" size={24} />
            <h3 className="text-xl font-black">Technical Expertise</h3>
          </div>
          <button onClick={addSkill} className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
            <Plus size={16} /> Add Expertise
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profile.skills?.map((skill, i) => (
            <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-between gap-6 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex-1 space-y-3">
                <input 
                  className="bg-transparent font-bold text-sm w-full outline-none border-b border-slate-200 dark:border-slate-700 focus:border-indigo-600 pb-1" 
                  value={skill.name} 
                  onChange={(e) => updateSkill(i, { name: e.target.value })} 
                />
                <div className="flex items-center gap-4">
                  <input 
                    type="range" 
                    className="flex-1 accent-indigo-600 h-1.5" 
                    value={skill.level} 
                    onChange={(e) => updateSkill(i, { level: parseInt(e.target.value) })} 
                  />
                  <span className="text-[10px] font-black text-slate-400 w-8">{skill.level}%</span>
                </div>
              </div>
              <button onClick={() => removeSkill(i)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Experience Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-6">
          <div className="flex items-center gap-3">
            <Briefcase className="text-indigo-600" size={24} />
            <h3 className="text-xl font-black">Engineering Timeline</h3>
          </div>
          <button onClick={addExperience} className="flex items-center gap-2 text-xs font-black text-indigo-600 uppercase tracking-widest hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">
            <Plus size={16} /> Add Milestone
          </button>
        </div>

        <div className="space-y-6">
          {profile.experience?.map((exp, i) => (
            <div key={i} className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all space-y-6 relative group">
              <button 
                onClick={() => removeExperience(i)}
                className="absolute top-8 right-8 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                <Trash2 size={20} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Institution / Company</label>
                  <input 
                    className="w-full bg-white dark:bg-slate-900 px-4 py-3 rounded-xl font-bold border border-transparent focus:border-indigo-600 outline-none text-sm"
                    value={exp.company}
                    onChange={(e) => updateExperience(i, { company: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Role</label>
                  <input 
                    className="w-full bg-white dark:bg-slate-900 px-4 py-3 rounded-xl font-bold border border-transparent focus:border-indigo-600 outline-none text-sm"
                    value={exp.role}
                    onChange={(e) => updateExperience(i, { role: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Period</label>
                  <input 
                    className="w-full bg-white dark:bg-slate-900 px-4 py-3 rounded-xl font-bold border border-transparent focus:border-indigo-600 outline-none text-sm"
                    value={exp.period}
                    onChange={(e) => updateExperience(i, { period: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Key Responsibilities / Impact</label>
                <textarea 
                  className="w-full bg-white dark:bg-slate-900 p-5 rounded-xl border border-transparent focus:border-indigo-600 outline-none text-sm leading-relaxed h-24"
                  value={exp.description}
                  onChange={(e) => updateExperience(i, { description: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Social Links Section */}
      <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-6">
          <Share2 className="text-indigo-600" size={24} />
          <h3 className="text-xl font-black">Digital Presence</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {['github', 'linkedin', 'twitter'].map((platform) => (
            <div key={platform} className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                <span className="capitalize">{platform}</span> Handle URL
              </label>
              <input 
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl font-medium border-2 border-transparent focus:border-indigo-600 outline-none transition-all text-sm"
                value={(profile.socials as any)?.[platform] || ''}
                onChange={(e) => updateSocial(platform, e.target.value)}
                placeholder={`https://${platform}.com/username`}
              />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
