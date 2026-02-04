'use client';
import React from 'react';
import { Trash2, ExternalLink, Award, Calendar, Link as LinkIcon, Building } from 'lucide-react';
import { Certification } from '../../types';

interface CertsTabProps {
  certs: Certification[];
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function CertificationsTab({ certs, onUpdate, onDelete, onAdd }: CertsTabProps) {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {certs.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border p-20 text-center space-y-4">
          <Award className="mx-auto text-slate-200" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No credentials found</p>
          <button onClick={onAdd} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Initial Entry</button>
        </div>
      )}

      {certs.map((cert) => (
        <div key={cert.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-8 group">
          <div className="flex flex-col lg:flex-row gap-10">
            <div className="w-full lg:w-48 space-y-4">
              <div className="aspect-square rounded-2xl overflow-hidden border border-slate-100 relative bg-slate-50 flex items-center justify-center">
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} className="w-full h-full object-contain p-4" alt={cert.title} />
                ) : (
                  <Award size={40} className="text-slate-300" />
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Icon URL</label>
                <input 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-[10px] outline-none"
                  defaultValue={cert.imageUrl}
                  onBlur={(e) => onUpdate(cert.id, { imageUrl: e.target.value })}
                />
              </div>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <input 
                    className="text-2xl font-black bg-transparent border-none focus:ring-0 w-full p-0 placeholder:text-slate-300"
                    defaultValue={cert.title}
                    onBlur={(e) => onUpdate(cert.id, { title: e.target.value })}
                    placeholder="Credential Title"
                  />
                </div>
                <button onClick={() => onDelete(cert.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Building size={12}/> Issuing Organization
                  </label>
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                    defaultValue={cert.issuer}
                    onBlur={(e) => onUpdate(cert.id, { issuer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Calendar size={12}/> Issue Date
                  </label>
                  <input 
                    type="date"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                    defaultValue={cert.issueDate}
                    onBlur={(e) => onUpdate(cert.id, { issueDate: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <LinkIcon size={12}/> Credential URL / Verification Link
                  </label>
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                    defaultValue={cert.credentialUrl}
                    onBlur={(e) => onUpdate(cert.id, { credentialUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}