'use client';
import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';
import { processContent } from '../../../../services/contentProcessor';
import RichEditor from '../../../../components/admin/RichEditor';
import { Project } from '../../../../types';
import { AlertCircle, Briefcase, Image as ImageIcon, Link2, Plus, Trash2, Upload, X } from 'lucide-react';

type ProjectMetric = {
  label: string;
  value: string;
};

type ProjectEditorData = Project & {
  demoUrl?: string;
  githubUrl?: string;
  metrics?: ProjectMetric[];
};

const normalizeMetrics = (value: unknown): ProjectMetric[] => {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (!item || typeof item !== 'object') return null;
        const metric = item as { label?: unknown; value?: unknown };
        return {
          label: String(metric.label || '').trim(),
          value: String(metric.value || '').trim(),
        };
      })
      .filter((metric): metric is ProjectMetric => Boolean(metric && metric.label && metric.value));
  }

  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>)
      .map(([label, metricValue]) => ({ label: String(label).trim(), value: String(metricValue ?? '').trim() }))
      .filter((metric) => metric.label && metric.value);
  }

  return [];
};

export default function ProjectEditorPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [project, setProject] = useState<ProjectEditorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      if (!id || !supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, description, content, image_url, technologies, created_at, link, metrics, matrix')
          .eq('id', id)
          .single();
        if (error) throw error;

        if (data) {
          setProject({
            ...data,
            content: data.content || '',
            createdAt: data.created_at || new Date().toISOString(),
            imageUrl: data.image_url || '',
            technologies: Array.isArray(data.technologies) ? data.technologies : [],
            demoUrl: data.link || '',
            githubUrl: '',
            metrics: normalizeMetrics(data.metrics || data.matrix),
          });
        }
      } catch (err) {
        console.error('Fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setUploadError('Image size exceeds 2MB limit. Optimization required.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProject((prev) => (prev ? { ...prev, imageUrl: reader.result as string } : prev));
    };
    reader.readAsDataURL(file);
  };

  const updateOptionalColumn = async (columnName: string, value: unknown) => {
    if (!supabase || !id) return;

    const { error } = await supabase.from('projects').update({ [columnName]: value }).eq('id', id);

    if (!error) return;

    const message = error.message.toLowerCase();
    const columnMissing = message.includes('column') && message.includes('does not exist');

    if (!columnMissing) {
      throw error;
    }
  };

  const handleSave = async () => {
    if (!supabase || !project || !id) return;
    setIsSaving(true);

    try {
      const cleanedMetrics = (project.metrics || []).filter((item) => item.label.trim() && item.value.trim());
      const contentHtml = await processContent(project.content || '');

      const basePayload = {
        content: project.content,
        content_html: contentHtml,
        title: project.title,
        description: project.description,
        image_url: project.imageUrl,
        technologies: project.technologies,
        link: project.demoUrl || project.link || '',
      };

      const { error } = await supabase.from('projects').update(basePayload).eq('id', id);
      if (error) throw error;

      await updateOptionalColumn('demo_url', project.demoUrl || '');
      await updateOptionalColumn('deploy_demo_url', project.demoUrl || '');
      await updateOptionalColumn('github_url', project.githubUrl || '');
      await updateOptionalColumn('git_url', project.githubUrl || '');
      await updateOptionalColumn('repository_url', project.githubUrl || '');
      await updateOptionalColumn('metrics', cleanedMetrics);
      await updateOptionalColumn('matrix', cleanedMetrics);

      router.push('/admin');
    } catch (err) {
      alert('Error saving: ' + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="-mt-20 min-h-[calc(100svh+5rem)] flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Opening Project Studio...</p>
      </div>
    );
  }

  if (!supabase) {
    return <div className="p-20 text-center font-black uppercase text-red-500">Supabase connection is not configured.</div>;
  }

  if (!project) {
    return <div className="p-20 text-center font-black uppercase text-red-500">Project record not found.</div>;
  }

  return (
    <div className="-mt-20 min-h-[calc(100svh+5rem)] flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <div className="max-w-[1600px] mx-auto w-full flex-1 flex flex-col gap-6 p-6 lg:p-10 h-full">
        <header className="flex items-center justify-between gap-6">
          <div className="flex-1">
            <input
              className="text-3xl md:text-5xl font-black bg-transparent border-none outline-none w-full text-slate-900 dark:text-white placeholder:text-slate-200"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
              placeholder="Project Name..."
            />
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border rounded-2xl shadow-sm">
            <Briefcase size={16} className="text-indigo-600" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Case Study Mode</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col lg:flex-row gap-8 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <RichEditor
              content={project.content || ''}
              onChange={(val) => setProject({ ...project, content: val })}
              onSave={handleSave}
              isSaving={isSaving}
              title="Case Study Editor"
              onBack={() => router.push('/admin')}
            />
          </div>

          <aside className="w-full lg:w-96 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-tech text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] flex items-center gap-2">
                  <ImageIcon size={14} className="text-indigo-600" /> Project_Image
                </h3>
                {project.imageUrl && (
                  <button
                    onClick={() => setProject({ ...project, imageUrl: '' })}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="relative group">
                {project.imageUrl ? (
                  <div className="aspect-[16/10] rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm relative">
                    <img src={project.imageUrl} className="w-full h-full object-cover" alt="Project Preview" />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
                    >
                      <Upload size={24} />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[16/10] rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-4 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all text-slate-400 hover:text-indigo-600"
                  >
                    <Upload size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Select Project Image</span>
                  </button>
                )}

                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
              </div>

              {uploadError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-xl text-[10px] font-bold uppercase">
                  <AlertCircle size={14} /> {uploadError}
                </div>
              )}
            </section>

            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
              <h3 className="font-mono-tech text-[10px] uppercase text-slate-400 font-black tracking-[0.3em] flex items-center gap-2">
                <Link2 size={14} className="text-indigo-600" /> Deployment_Links
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Description</label>
                  <textarea
                    className="w-full h-24 bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 text-xs font-medium border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all resize-none"
                    value={project.description || ''}
                    onChange={(e) => setProject({ ...project, description: e.target.value })}
                    placeholder="Brief project summary..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Tech Stack (Comma Sep)</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                    value={project.technologies.join(', ')}
                    onChange={(e) =>
                      setProject({
                        ...project,
                        technologies: e.target.value
                          .split(',')
                          .map((tech) => tech.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Next.js, Supabase, Tailwind"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Deploy Demo URL</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                    value={project.demoUrl || ''}
                    onChange={(e) => setProject({ ...project, demoUrl: e.target.value, link: e.target.value })}
                    placeholder="https://demo.your-app.com"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Git Repository URL</label>
                  <input
                    className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-xs font-bold border-none outline-none focus:ring-1 focus:ring-indigo-600 transition-all"
                    value={project.githubUrl || ''}
                    onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-8 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-mono-tech text-[10px] uppercase text-slate-400 font-black tracking-[0.3em]">
                  Project_Metrics
                </h3>
                <button
                  onClick={() => setProject({ ...project, metrics: [...(project.metrics || []), { label: '', value: '' }] })}
                  className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-300"
                  type="button"
                >
                  <Plus size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {(project.metrics || []).length === 0 && (
                  <p className="text-[10px] text-slate-400 font-semibold">No metrics yet. Add metrics to sync with Supabase.</p>
                )}

                {(project.metrics || []).map((metric, index) => (
                  <div key={`${metric.label}-${index}`} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 text-[11px] font-semibold border-none outline-none focus:ring-1 focus:ring-indigo-600"
                      value={metric.label}
                      placeholder="Label (e.g. Accuracy)"
                      onChange={(e) => {
                        const next = [...(project.metrics || [])];
                        next[index] = { ...next[index], label: e.target.value };
                        setProject({ ...project, metrics: next });
                      }}
                    />
                    <input
                      className="w-full bg-slate-50 dark:bg-slate-800/50 rounded-xl px-3 py-2 text-[11px] font-semibold border-none outline-none focus:ring-1 focus:ring-indigo-600"
                      value={metric.value}
                      placeholder="Value (e.g. 98.4%)"
                      onChange={(e) => {
                        const next = [...(project.metrics || [])];
                        next[index] = { ...next[index], value: e.target.value };
                        setProject({ ...project, metrics: next });
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const next = (project.metrics || []).filter((_, metricIndex) => metricIndex !== index);
                        setProject({ ...project, metrics: next });
                      }}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
