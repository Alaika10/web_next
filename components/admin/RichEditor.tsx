
'use client';
import React, { useRef, useState, useEffect } from 'react';
import { 
  Bold, Italic, Heading1, Heading2, Quote, Link as LinkIcon, 
  List, Image as ImageIcon, Save, ArrowLeft, Eye, Edit3, Sparkles
} from 'lucide-react';

interface RichEditorProps {
  content: string;
  onChange: (val: string) => void;
  onSave: () => void;
  isSaving: boolean;
  title: string;
  onBack: () => void;
  previewHtml?: string;
}

export default function RichEditor({ content, onChange, onSave, isSaving, title, onBack }: RichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [viewMode, setViewMode] = useState<'split' | 'edit' | 'preview'>('split');
  const [localPreview, setLocalPreview] = useState('');

  // Sederhana: Client-side markdown preview untuk feedback instan
  useEffect(() => {
    const preview = content
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-black mb-6">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mb-4">$1</h2>')
      .replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-600 pl-4 py-2 italic my-6 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg">$1</blockquote>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1" class="rounded-3xl shadow-xl my-8 w-full object-cover" />')
      .replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc mb-2">$1</li>');
    setLocalPreview(preview);
  }, [content]);

  const insertFormat = (prefix: string, suffix: string = '') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const text = el.value;
    const selected = text.substring(start, end);
    const before = text.substring(0, start);
    const after = text.substring(end);

    const newContent = `${before}${prefix}${selected}${suffix}${after}`;
    onChange(newContent);
    
    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 10);
  };

  return (
    <div className="flex flex-col h-[85vh] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-500">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-lg font-black leading-tight">{title}</h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setViewMode('edit')} 
                className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${viewMode === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >Edit</button>
              <button 
                onClick={() => setViewMode('split')} 
                className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >Split</button>
              <button 
                onClick={() => setViewMode('preview')} 
                className={`text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded ${viewMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}
              >Preview</button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1.5 rounded-2xl border shadow-sm">
          <button title="Heading 1" onClick={() => insertFormat('# ', '')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Heading1 size={16} /></button>
          <button title="Heading 2" onClick={() => insertFormat('## ', '')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Heading2 size={16} /></button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
          <button title="Bold" onClick={() => insertFormat('**', '**')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Bold size={16} /></button>
          <button title="Italic" onClick={() => insertFormat('*', '*')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Italic size={16} /></button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
          <button title="Quote" onClick={() => insertFormat('> ', '')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Quote size={16} /></button>
          <button title="List" onClick={() => insertFormat('- ', '')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><List size={16} /></button>
          <div className="w-px h-4 bg-slate-200 dark:bg-slate-700 mx-1" />
          <button title="Image" onClick={() => insertFormat('![Description](', ')')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><ImageIcon size={16} /></button>
        </div>

        <button 
          onClick={onSave} 
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
          <span className="hidden sm:inline">Save Content</span>
        </button>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Input Area */}
        {(viewMode === 'edit' || viewMode === 'split') && (
          <div className={`flex-1 border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 ${viewMode === 'edit' ? 'w-full' : 'w-1/2'}`}>
            <textarea
              ref={textareaRef}
              className="w-full h-full p-8 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed text-slate-700 dark:text-slate-300"
              placeholder="Write your content here... markdown formatting will be visualized on the right."
              value={content}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
        )}

        {/* Preview Area (The "Real Formatting" view) */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div className={`flex-1 bg-slate-50/30 dark:bg-slate-950/30 overflow-y-auto p-10 md:p-16 ${viewMode === 'preview' ? 'w-full' : 'w-1/2'}`}>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 mb-8">
                <Sparkles size={12} /> Real-time Visual Rendering
              </div>
              <div 
                className="prose prose-lg dark:prose-invert max-w-none 
                prose-headings:font-black prose-headings:tracking-tighter
                prose-p:text-slate-600 dark:prose-p:text-slate-400 prose-p:leading-relaxed
                prose-img:rounded-[2rem] prose-img:shadow-xl"
                dangerouslySetInnerHTML={{ __html: localPreview || '<p class="text-slate-300 italic">Start typing to see the formatting...</p>' }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="px-6 py-3 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {content.split(/\s+/).filter(Boolean).length} Words
        </p>
        <div className="flex gap-4">
           <div className="flex items-center gap-1 text-[9px] font-bold text-emerald-500 uppercase tracking-widest">
             <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div> Sync Active
           </div>
        </div>
      </div>
    </div>
  );
}
