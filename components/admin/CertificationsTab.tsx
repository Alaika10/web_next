'use client';
import React, { useRef } from 'react';
import { Trash2, Award, Calendar, Link as LinkIcon, Building, FileText, Camera, Upload, X } from 'lucide-react';
import { Certification } from '../../types';

interface CertsTabProps {
  certs: Certification[];
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
}

export default function CertificationsTab({ certs, onUpdate, onDelete, onAdd }: CertsTabProps) {
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handleFileChange = (certId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("File terlalu besar. Maksimal 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdate(certId, { imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = (certId: string) => {
    fileInputRefs.current[certId]?.click();
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {certs.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border p-20 text-center space-y-4">
          <Award className="mx-auto text-slate-200" size={48} />
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Belum ada sertifikasi</p>
          <button onClick={onAdd} className="text-indigo-600 font-black text-xs uppercase tracking-widest hover:underline">Tambah Sertifikasi Pertama</button>
        </div>
      )}

      {certs.map((cert) => (
        <div key={cert.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm p-8 group">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Image Upload Column */}
            <div className="w-full lg:w-48 space-y-4">
              <div className="relative group/img">
                <div 
                  onClick={() => triggerUpload(cert.id)}
                  className="aspect-square rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 relative bg-slate-50 dark:bg-slate-800 flex items-center justify-center cursor-pointer hover:border-indigo-500 transition-all shadow-inner"
                >
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} className="w-full h-full object-contain p-4 transition-transform group-hover/img:scale-110" alt={cert.title} />
                  ) : (
                    <div className="text-center p-4">
                      <Award size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                      <span className="text-[8px] font-black uppercase text-slate-400 tracking-tighter">Klik untuk Upload</span>
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover/img:opacity-100 flex flex-col items-center justify-center text-white transition-opacity backdrop-blur-[2px]">
                    <Camera size={24} className="mb-1" />
                    <span className="text-[8px] font-black uppercase tracking-widest">Ganti Logo</span>
                  </div>
                </div>

                {cert.imageUrl && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); onUpdate(cert.id, { imageUrl: '' }); }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-red-500 hover:scale-110 transition-transform z-10"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <input 
                type="file" 
                ref={el => { fileInputRefs.current[cert.id] = el; }}
                onChange={(e) => handleFileChange(cert.id, e)}
                className="hidden" 
                accept="image/*"
              />

              <button 
                onClick={() => triggerUpload(cert.id)}
                className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 hover:text-white transition-all"
              >
                <Upload size={12} /> Upload Gambar
              </button>
            </div>

            <div className="flex-1 space-y-6">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <input 
                    className="text-2xl font-black bg-transparent border-none focus:ring-0 w-full p-0 placeholder:text-slate-300 dark:text-white"
                    defaultValue={cert.title}
                    onBlur={(e) => onUpdate(cert.id, { title: e.target.value })}
                    placeholder="Judul Sertifikasi"
                  />
                </div>
                <button onClick={() => onDelete(cert.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Building size={12}/> Organisasi Penerbit
                  </label>
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all dark:text-slate-200"
                    defaultValue={cert.issuer}
                    onBlur={(e) => onUpdate(cert.id, { issuer: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <Calendar size={12}/> Tanggal Terbit
                  </label>
                  <input 
                    type="date"
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all dark:text-slate-200"
                    defaultValue={cert.issueDate}
                    onBlur={(e) => onUpdate(cert.id, { issueDate: e.target.value })}
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <LinkIcon size={12}/> Link Kredensial / Verifikasi
                  </label>
                  <input 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all dark:text-slate-200"
                    defaultValue={cert.credentialUrl}
                    onBlur={(e) => onUpdate(cert.id, { credentialUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                    <FileText size={12}/> Deskripsi / Skills
                  </label>
                  <textarea 
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-medium border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all dark:text-slate-200 h-24"
                    defaultValue={cert.description}
                    onBlur={(e) => onUpdate(cert.id, { description: e.target.value })}
                    placeholder="Jelaskan kompetensi yang didapatkan..."
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