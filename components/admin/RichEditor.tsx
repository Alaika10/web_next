
'use client';
import React, { useRef } from 'react';
import { 
  Bold, Italic, Heading1, Quote, Link as LinkIcon, 
  List, Image as ImageIcon, Save, ArrowLeft 
} from 'lucide-react';

interface RichEditorProps {
  content: string;
  onChange: (val: string) => void;
  onSave: () => void;
  isSaving: boolean;
  title: string;
  onBack: () => void;
}

export default function RichEditor({ content, onChange, onSave, isSaving, title, onBack }: RichEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl">
      <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-xl font-black">{title}</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Editor Mode</p>
          </div>
        </div>
        <button 
          onClick={onSave} 
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Save size={18} />}
          Save Changes
        </button>
      </div>

      <div className="flex items-center gap-1 p-2 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
        <button onClick={() => insertFormat('# ', '')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Heading1 size={18} /></button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <button onClick={() => insertFormat('**', '**')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Bold size={18} /></button>
        <button onClick={() => insertFormat('*', '*')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Italic size={18} /></button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <button onClick={() => insertFormat('> ', '')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><Quote size={18} /></button>
        <button onClick={() => insertFormat('- ', '')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><List size={18} /></button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <button onClick={() => insertFormat('[Link Title](', ')')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><LinkIcon size={18} /></button>
        <button onClick={() => insertFormat('![Alt Text](', ')')} className="p-2 text-slate-500 hover:text-indigo-600 rounded-lg"><ImageIcon size={18} /></button>
      </div>

      <div className="flex-1 overflow-hidden">
        <textarea
          ref={textareaRef}
          className="w-full h-full p-8 bg-transparent border-none outline-none resize-none font-mono text-sm leading-relaxed"
          placeholder="Start writing your masterpiece with Markdown..."
          value={content}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    </div>
  );
}
