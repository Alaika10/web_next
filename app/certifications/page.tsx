
import React, { Suspense } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { Certification } from '../../types';
import { Award, ExternalLink, ShieldCheck, Database, Calendar, Building, ChevronRight, Terminal } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

export const revalidate = 60; 

async function CertificationList() {
  let certs: Certification[] = [];
  
  if (supabase) {
    const { data } = await supabase.from('certifications').select('*').order('issue_date', { ascending: false });
    if (data) {
      certs = data.map(c => ({
        ...c,
        issueDate: c.issue_date,
        imageUrl: c.image_url,
        credentialUrl: c.credential_url
      }));
    }
  }

  if (certs.length === 0) {
    return (
      <div className="col-span-full py-32 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem] bg-slate-50/50 dark:bg-slate-900/50">
        <Award className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">No active credentials detected in the vault</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {certs.map((cert, idx) => (
        <div 
          key={cert.id} 
          className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:border-indigo-500/30"
        >
          {/* Subtle Decorative Background Element */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-indigo-500/10 transition-colors"></div>
          
          <div className="relative space-y-6 flex-grow">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center p-2.5 border border-slate-100 dark:border-slate-700 shadow-sm transition-all duration-500 group-hover:rotate-6 group-hover:scale-110">
                {cert.imageUrl ? (
                  <img 
                    src={cert.imageUrl} 
                    alt={cert.issuer} 
                    className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" 
                  />
                ) : (
                  <Award className="text-indigo-600" size={32} />
                )}
              </div>
              
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                  <ShieldCheck size={12} className="animate-pulse" />
                  <span className="text-[9px] font-black uppercase tracking-widest">Verified_ID</span>
                </div>
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">v.{String(idx + 1).padStart(2, '0')}</span>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl font-black tracking-tighter leading-tight group-hover:text-indigo-600 transition-colors">
                {cert.title}
              </h3>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <Building size={14} className="text-indigo-600" /> {cert.issuer}
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                  <Calendar size={14} /> {cert.issueDate}
                </div>
              </div>
            </div>

            {cert.description && (
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 font-medium">
                {cert.description}
              </p>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            {cert.credentialUrl ? (
              <a 
                href={cert.credentialUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group/link inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 transition-all"
              >
                Inspect Credentials 
                <span className="p-1 bg-indigo-50 dark:bg-indigo-950/50 rounded-lg group-hover/link:translate-x-1 transition-transform">
                   <ExternalLink size={14} />
                </span>
              </a>
            ) : (
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                <Database size={12} /> Institutional Accreditation
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CertificationsPage() {
  return (
    <div className="py-16 md:py-24 px-6 md:px-12 max-w-7xl mx-auto space-y-16 md:space-y-24 animate-in">
      <div className="max-w-3xl space-y-8">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em]">
          <Award size={14} /> Accreditation / Research_Identity / Verified
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
            Verified <br/><span className="text-slate-400">Authority.</span>
          </h1>
          <div className="h-1.5 w-24 bg-indigo-600 rounded-full"></div>
        </div>

        <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          A validation of technical proficiency and academic rigor across deep learning, mathematics, and systems architecture. All credentials are cryptographically verifiable.
        </p>
      </div>

      <Suspense 
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Skeleton className="h-[320px] rounded-[2.5rem]" />
            <Skeleton className="h-[320px] rounded-[2.5rem]" />
            <Skeleton className="h-[320px] rounded-[2.5rem]" />
          </div>
        }
      >
        <CertificationList />
      </Suspense>

      {/* Lab Note Footer */}
      <div className="pt-20 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-10 bg-slate-900 rounded-[3rem] text-white overflow-hidden relative group">
           <div className="absolute inset-0 bg-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                 <Terminal size={24} />
              </div>
              <div>
                <h4 className="font-black text-xl">Continuous Learning.</h4>
                <p className="text-slate-400 text-sm">Always updating the neural network with new certifications.</p>
              </div>
           </div>
           <div className="relative z-10 font-mono text-[9px] uppercase tracking-[0.4em] text-indigo-400 flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div> Status: Synchronizing_Knowledge
           </div>
        </div>
      </div>
    </div>
  );
}
