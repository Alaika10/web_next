import React, { Suspense } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { Certification } from '../../types';
import { Award, ExternalLink, ShieldCheck, Database, Calendar, Building, ChevronRight, Terminal, Sparkles } from 'lucide-react';
import Skeleton from '../../components/Skeleton';

export const revalidate = 60;

async function CertificationList() {
  let certs: Certification[] = [];

  if (supabase) {
    const { data } = await supabase
      .from('certifications')
      .select('id, title, issuer, issue_date, image_url, credential_url, description')
      .order('issue_date', { ascending: false })
      .limit(30);

    if (data) {
      certs = data.map((c) => ({
        ...c,
        issueDate: c.issue_date,
        imageUrl: c.image_url,
        credentialUrl: c.credential_url,
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

  const [featured, ...rest] = certs;

  return (
    <div className="space-y-8">
      <article className="relative overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-7 md:p-10 shadow-sm">
        <div className="absolute -top-20 -right-12 w-56 h-56 bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="relative grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-3">
            <div className="aspect-square rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 overflow-hidden p-4 flex items-center justify-center">
              {featured.imageUrl ? (
                <img src={featured.imageUrl} alt={featured.issuer} className="w-full h-full object-contain" />
              ) : (
                <Award size={56} className="text-indigo-600" />
              )}
            </div>
          </div>

          <div className="md:col-span-9 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300">
                <Sparkles size={11} /> Highlight Credential
              </span>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/40 dark:text-emerald-300">
                <ShieldCheck size={11} /> Verified
              </span>
            </div>

            <h3 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">{featured.title}</h3>

            <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <span className="inline-flex items-center gap-1.5"><Building size={13} className="text-indigo-600" /> {featured.issuer}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar size={13} /> {featured.issueDate}</span>
            </div>

            {featured.description && (
              <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">{featured.description}</p>
            )}

            {featured.credentialUrl && (
              <a
                href={featured.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700"
              >
                Verify Credential <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </article>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {rest.map((cert, idx) => (
          <article
            key={cert.id}
            className="group relative bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-200 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full hover:border-indigo-500/30"
          >
            <div className="absolute top-0 right-0 w-28 h-28 bg-indigo-500/5 rounded-full blur-3xl -translate-y-12 translate-x-12 group-hover:bg-indigo-500/10 transition-colors"></div>

            <div className="relative space-y-5 flex-grow">
              <div className="flex justify-between items-start">
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center justify-center p-2 border border-slate-100 dark:border-slate-700 shadow-sm">
                  {cert.imageUrl ? (
                    <img src={cert.imageUrl} alt={cert.issuer} className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all" />
                  ) : (
                    <Award className="text-indigo-600" size={28} />
                  )}
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                  <ShieldCheck size={11} className="animate-pulse" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Verified</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-black tracking-tight leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">{cert.title}</h3>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <Building size={12} className="text-indigo-600" /> {cert.issuer}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                    <Calendar size={12} /> {cert.issueDate}
                  </div>
                </div>

                {cert.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{cert.description}</p>
                )}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              {cert.credentialUrl ? (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:text-indigo-700 transition-all"
                >
                  Verify <ExternalLink size={13} />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300">
                  <Database size={12} /> Internal
                </div>
              )}

              <span className="font-mono text-[10px] text-slate-400">#{String(idx + 2).padStart(2, '0')}</span>
            </div>
          </article>
        ))}
      </div>
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
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none">
          Trusted <span className="text-slate-400">Credentials.</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-medium">
          A validation of technical proficiency and academic rigor across deep learning, mathematics, and systems architecture. All credentials are cryptographically verifiable.
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-[420px] rounded-[2.5rem]" />
            ))}
          </div>
        }
      >
        <CertificationList />
      </Suspense>

      <div className="text-center pt-8 border-t border-slate-100 dark:border-slate-800">
        <div className="inline-flex items-center gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-[0.2em]">
          <Terminal size={12} /> End of Verification Chain
          <ChevronRight size={12} className="animate-pulse" />
        </div>
      </div>
    </div>
  );
}
