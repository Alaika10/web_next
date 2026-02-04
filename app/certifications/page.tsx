import React, { Suspense } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { Certification } from '../../types';
import { Award, ExternalLink, ShieldCheck, Database } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

export const revalidate = 3600;

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
      <div className="col-span-full py-32 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-[3rem]">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">No active credentials detected</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {certs.map((cert) => (
        <div key={cert.id} className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
          
          <div className="relative space-y-6">
            <div className="flex justify-between items-start">
              <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center p-2 border border-slate-100 dark:border-slate-700 shadow-sm transition-transform group-hover:rotate-6">
                {cert.imageUrl ? (
                  <img src={cert.imageUrl} alt={cert.issuer} className="w-full h-full object-contain" />
                ) : (
                  <Award className="text-indigo-600" size={32} />
                )}
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="font-mono text-[9px] text-slate-400 uppercase tracking-widest">{cert.issueDate}</span>
                <div className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-md flex items-center gap-1">
                  <ShieldCheck size={10} />
                  <span className="text-[8px] font-black uppercase">Verified</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">{cert.title}</h3>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Database size={12} className="text-indigo-600" /> {cert.issuer}
              </p>
            </div>

            {cert.credentialUrl && (
              <a 
                href={cert.credentialUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:gap-4 transition-all"
              >
                Inspect Credentials <ExternalLink size={14} />
              </a>
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
      <div className="max-w-3xl space-y-6">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em]">
          <Award size={14} /> Knowledge / Credentials / Verified
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
          Verified <br/><span className="text-slate-400">Authority.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
          A validation of technical proficiency and academic rigor across deep learning, mathematics, and systems architecture.
        </p>
      </div>

      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"><Skeleton className="h-[250px]" /><Skeleton className="h-[250px]" /><Skeleton className="h-[250px]" /></div>}>
        <CertificationList />
      </Suspense>
    </div>
  );
}