'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';

const AdminPanel = dynamic(() => import('./AdminPanel'), { ssr: false });
const TrainingModule = dynamic(() => import('./TrainingModule'), { ssr: false });

// ── Types ──────────────────────────────────────────────────────────────────

interface Step { name: string; type: string; content: string }
interface Doc { id: string; name: string; steps: Step[] }
interface Subject { category: string; docs: Doc[] }
interface PortalData { [subjectName: string]: Subject }
interface Props { title: string; subtitle: string; data: PortalData; accentColor?: string; showPTO?: boolean; storageKey?: string }

// ── Theme ──────────────────────────────────────────────────────────────────

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const saved = localStorage.getItem('portal-theme');
    if (saved === 'light') setDark(false);
  }, []);
  const toggle = useCallback(() => {
    setDark(d => { const next = !d; localStorage.setItem('portal-theme', next ? 'dark' : 'light'); return next; });
  }, []);
  return { dark, toggle };
}

// ── ProseMirror Renderer ───────────────────────────────────────────────────

function PM({ content, dark }: { content: string; dark: boolean }) {
  try {
    const doc = JSON.parse(content);
    return <div className={`pm-content text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{renderNode(doc, 0, dark)}</div>;
  } catch {
    if (content && content.length > 0 && !content.startsWith('{'))
      return <p className={dark ? 'text-gray-400' : 'text-gray-600'}>{content}</p>;
    return null;
  }
}

function renderNode(node: any, key: number, dark: boolean): any {
  if (!node) return null;

  if (node.type === 'text') {
    let el: any = node.text || '';
    (node.marks || []).forEach((m: any, i: number) => {
      switch (m.type) {
        case 'bold': el = <strong key={`m${i}`} className={dark ? 'text-white' : 'text-gray-900'}>{el}</strong>; break;
        case 'italic': el = <em key={`m${i}`}>{el}</em>; break;
        case 'underline': el = <u key={`m${i}`}>{el}</u>; break;
        case 'strike': el = <s key={`m${i}`} className="opacity-50">{el}</s>; break;
        case 'code': el = <code key={`m${i}`} className={`px-1.5 py-0.5 rounded font-mono text-xs ${dark ? 'bg-white/10 text-emerald-400' : 'bg-gray-100 text-emerald-700'}`}>{el}</code>; break;
        case 'link': case 'deeplink':
          el = <a key={`m${i}`} href={m.attrs?.href} target="_blank" rel="noopener noreferrer" className="text-te-teal hover:text-te-teal-light underline underline-offset-2 decoration-te-teal/40">{el}</a>; break;
        case 'text_highlight': el = <mark key={`m${i}`} className={`px-0.5 rounded ${dark ? 'bg-yellow-500/20 text-yellow-200' : 'bg-yellow-200 text-yellow-900'}`}>{el}</mark>; break;
        case 'font_color': break;
      }
    });
    return el;
  }

  const ch = (node.content || []).map((c: any, i: number) => renderNode(c, i, dark));
  const align = node.attrs?.align;
  const alignCls = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';

  switch (node.type) {
    case 'doc': return <>{ch}</>;
    case 'paragraph':
      return <p key={key} className={`mb-3 leading-relaxed min-h-[0.5em] ${alignCls}`}>{ch.length > 0 ? ch : null}</p>;
    case 'heading': {
      const lvl = node.attrs?.level || 2;
      const headingColor = dark ? 'text-white' : 'text-gray-900';
      const styles: Record<number, string> = {
        1: `text-xl font-bold mt-8 mb-3 ${headingColor} pb-2 border-b ${dark ? 'border-white/10' : 'border-gray-200'}`,
        2: `text-lg font-bold mt-6 mb-3 ${headingColor}`,
        3: `text-base font-semibold mt-5 mb-2 ${headingColor}`,
        4: `text-sm font-semibold mt-4 mb-2 ${dark ? 'text-gray-200' : 'text-gray-800'}`,
      };
      return <div key={key} className={`${styles[lvl] || styles[3]} ${alignCls}`} role="heading" aria-level={lvl}>{ch}</div>;
    }
    case 'bullet_list': return <ul key={key} className="mb-4 space-y-1.5 ml-1">{ch}</ul>;
    case 'ordered_list': return <ol key={key} className="mb-4 space-y-1.5 ml-5 list-decimal">{ch}</ol>;
    case 'list_item': {
      const inner = (node.content || []).map((c: any, i: number) => {
        if (c.type === 'paragraph') return <span key={i}>{(c.content || []).map((cc: any, j: number) => renderNode(cc, j, dark))}</span>;
        return renderNode(c, i, dark);
      });
      return <li key={key} className="flex items-start gap-2"><span className="text-te-teal mt-1.5 text-[8px]">●</span><span className="flex-1">{inner}</span></li>;
    }
    case 'todo_list': return <div key={key} className="mb-4 space-y-2">{ch}</div>;
    case 'todo_item': {
      const checked = node.attrs?.checked || node.attrs?.done;
      return (
        <label key={key} className="flex items-start gap-2.5 cursor-pointer group">
          <div className={`w-[18px] h-[18px] rounded-md border-2 mt-0.5 shrink-0 flex items-center justify-center transition-colors ${checked ? 'bg-te-teal border-te-teal' : dark ? 'border-gray-600 group-hover:border-gray-400' : 'border-gray-300 group-hover:border-gray-500'}`}>
            {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <span className={`flex-1 ${checked ? 'line-through opacity-50' : ''}`}>{ch}</span>
        </label>
      );
    }
    case 'blockquote':
      return <blockquote key={key} className={`border-l-4 border-te-teal/40 pl-4 my-4 italic ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{ch}</blockquote>;
    case 'aside':
      return (
        <div key={key} className={`rounded-xl p-4 my-4 ${dark ? 'bg-te-teal/10 border border-te-teal/20' : 'bg-te-teal/5 border border-te-teal/15'}`}>
          {ch}
        </div>
      );
    case 'horizontal_rule':
      return <hr key={key} className={`my-6 ${dark ? 'border-white/10' : 'border-gray-200'}`} />;
    case 'image':
      return (
        <figure key={key} className="my-5">
          <img src={node.attrs?.src || node.attrs?.asset} alt={node.attrs?.alt || ''} loading="lazy"
            className="rounded-xl max-w-full mx-auto shadow-lg" style={node.attrs?.width ? { width: node.attrs.width } : { maxHeight: '500px' }} />
        </figure>
      );
    case 'attachment':
      return (
        <a key={key} href={node.attrs?.url || node.attrs?.href || '#'} target="_blank" rel="noopener"
          className={`flex items-center gap-3 rounded-xl p-3 my-2 transition-all group ${dark ? 'bg-white/5 border border-white/10 hover:border-te-teal/30' : 'bg-gray-50 border border-gray-200 hover:border-te-teal/40'}`}>
          <div className="w-10 h-10 rounded-lg bg-te-teal/15 flex items-center justify-center shrink-0">
            <span className="text-te-teal text-[10px] font-bold uppercase">{(node.attrs?.extension || node.attrs?.name?.split('.').pop() || 'FILE').substring(0, 4)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{node.attrs?.name || 'Attachment'}</p>
            {node.attrs?.filesize && <p className="text-[10px] text-gray-500">{(node.attrs.filesize / 1024).toFixed(0)} KB</p>}
          </div>
          <svg className="w-4 h-4 text-gray-400 group-hover:text-te-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      );
    case 'file_viewer':
      return (
        <div key={key} className={`rounded-xl p-4 my-3 ${dark ? 'bg-white/5 border border-white/10' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
              <span className="text-red-400 text-xs font-bold">{(node.attrs?.extension || 'PDF').toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{node.attrs?.name || 'Document'}</p>
              <p className="text-[10px] text-gray-500">{(node.attrs?.extension || '').toUpperCase()} {node.attrs?.filesize ? `· ${(node.attrs.filesize / 1024).toFixed(0)} KB` : ''}</p>
            </div>
            {node.attrs?.src && <a href={node.attrs.src} target="_blank" rel="noopener" className="px-3 py-1.5 rounded-lg text-xs font-medium text-te-teal bg-te-teal/10 hover:bg-te-teal/20 transition-colors">Open</a>}
          </div>
        </div>
      );
    case 'embed_frame': case 'embed': {
      const src = node.attrs?.src || node.attrs?.url || '';
      if (!src) return null;
      const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
      if (ytMatch) return <div key={key} className="my-5 aspect-video rounded-xl overflow-hidden shadow-lg"><iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} className="w-full h-full" allowFullScreen /></div>;
      const loomMatch = src.match(/loom\.com\/(?:share|embed)\/([\w]+)/);
      if (loomMatch) return <div key={key} className="my-5 aspect-video rounded-xl overflow-hidden shadow-lg"><iframe src={`https://www.loom.com/embed/${loomMatch[1]}`} className="w-full h-full" allowFullScreen /></div>;
      return <div key={key} className="my-5 aspect-video rounded-xl overflow-hidden shadow-lg"><iframe src={src} className="w-full h-full" allowFullScreen /></div>;
    }
    case 'table':
      return <div key={key} className={`overflow-x-auto my-4 rounded-xl ${dark ? 'border border-white/10' : 'border border-gray-200'}`}><table className="w-full text-sm">{ch}</table></div>;
    case 'table_row': return <tr key={key} className={`${dark ? 'border-b border-white/5 even:bg-white/[0.02]' : 'border-b border-gray-100 even:bg-gray-50/50'}`}>{ch}</tr>;
    case 'table_cell': return <td key={key} className="px-3 py-2 text-xs">{ch}</td>;
    case 'table_header': return <th key={key} className={`px-3 py-2 text-left text-xs font-semibold ${dark ? 'text-white bg-white/5' : 'text-gray-900 bg-gray-50'}`}>{ch}</th>;
    case 'basic': return <div key={key}>{ch}</div>;
    default: return ch.length > 0 ? <div key={key}>{ch}</div> : null;
  }
}

// ── PTO Form ───────────────────────────────────────────────────────────────

function PTOForm({ dark }: { dark: boolean }) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [type, setType] = useState('vacation');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const bg = dark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200';
  const inputCls = `w-full px-3 py-2 rounded-lg text-sm outline-none transition-colors ${dark ? 'bg-white/5 border border-white/10 text-white focus:border-te-teal' : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-te-teal'}`;

  if (submitted) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-te-teal/15 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-te-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>PTO Request Submitted</h3>
      <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Your request has been sent to HR for approval.</p>
      <button onClick={() => setSubmitted(false)} className="mt-4 px-4 py-2 rounded-lg text-xs font-medium text-te-teal bg-te-teal/10 hover:bg-te-teal/20">Submit Another</button>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto">
      <h3 className={`text-lg font-bold mb-6 ${dark ? 'text-white' : 'text-gray-900'}`}>PTO Request Form</h3>
      <div className="space-y-4">
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Employee Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className={inputCls} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Start Date</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">End Date</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className={inputCls}>
            <option value="vacation">Vacation</option>
            <option value="sick">Sick Leave</option>
            <option value="personal">Personal Day</option>
            <option value="bereavement">Bereavement</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider block mb-1">Notes</label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Optional notes..." className={inputCls} />
        </div>
        <button onClick={() => setSubmitted(true)} disabled={!name || !startDate || !endDate}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white bg-te-teal hover:bg-te-teal-light disabled:opacity-40 transition-colors">
          Submit Request
        </button>
      </div>
    </div>
  );
}

// ── Files Section ──────────────────────────────────────────────────────────

function FilesSection({ data, dark }: { data: PortalData; dark: boolean }) {
  const files: { name: string; url: string; ext: string; doc: string; subject: string }[] = [];

  Object.entries(data).forEach(([subName, sub]) => {
    sub.docs.forEach(doc => {
      doc.steps.forEach(step => {
        try {
          const parsed = JSON.parse(step.content);
          function walk(node: any) {
            if (node.type === 'attachment' || node.type === 'file_viewer') {
              const url = node.attrs?.url || node.attrs?.href || node.attrs?.src || '';
              const name = node.attrs?.name || node.attrs?.title || 'File';
              const ext = (node.attrs?.extension || name.split('.').pop() || '').toUpperCase();
              if (url) files.push({ name, url, ext: ext.substring(0, 4), doc: doc.name, subject: subName });
            }
            (node.content || []).forEach(walk);
          }
          walk(parsed);
        } catch {}
      });
    });
  });

  const grouped: Record<string, typeof files> = {};
  files.forEach(f => {
    const key = f.ext || 'OTHER';
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(f);
  });

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>Files & Downloads</h3>
      <p className={`text-sm mb-6 ${dark ? 'text-gray-500' : 'text-gray-600'}`}>{files.length} files across all documents</p>

      {files.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-8">No downloadable files found</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).sort((a, b) => b[1].length - a[1].length).map(([ext, items]) => (
            <div key={ext}>
              <h4 className={`text-xs font-bold uppercase tracking-wider mb-2 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{ext} Files ({items.length})</h4>
              <div className="space-y-1">
                {items.map((f, i) => (
                  <a key={i} href={f.url} target="_blank" rel="noopener"
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all group ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                    <div className="w-8 h-8 rounded-lg bg-te-teal/15 flex items-center justify-center shrink-0">
                      <span className="text-te-teal text-[9px] font-bold">{f.ext}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-medium truncate ${dark ? 'text-gray-200 group-hover:text-white' : 'text-gray-800'}`}>{f.name}</p>
                      <p className="text-[10px] text-gray-500 truncate">{f.subject} › {f.doc}</p>
                    </div>
                    <svg className="w-3.5 h-3.5 text-gray-500 group-hover:text-te-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Portal ────────────────────────────────────────────────────────────

export default function Portal({ title, subtitle, data: initialData, accentColor = '#16635C', showPTO = false, storageKey = 'portal' }: Props) {
  const { dark, toggle } = useTheme();
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState<'docs' | 'pto' | 'files' | 'training'>('docs');
  const [adminMode, setAdminMode] = useState(false);
  const [liveData, setLiveData] = useState<PortalData>(initialData);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load edits from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`${storageKey}-data`);
      if (saved) setLiveData(JSON.parse(saved));
    } catch {}
  }, [storageKey]);

  // Save to localStorage on changes
  const handleSave = useCallback((updated: PortalData) => {
    setLiveData(updated);
    try { localStorage.setItem(`${storageKey}-data`, JSON.stringify(updated)); } catch {}
  }, [storageKey]);

  const handleNavigate = useCallback((subject: string | null, doc: string | null, step: number) => {
    setActiveSubject(subject);
    setActiveDoc(doc);
    setActiveStep(step);
    setView('docs');
  }, []);

  const resetToDefault = useCallback(() => {
    if (!confirm('Reset all content to the original Waybook data? Your edits will be lost.')) return;
    setLiveData(initialData);
    localStorage.removeItem(`${storageKey}-data`);
  }, [initialData, storageKey]);

  const data = liveData;
  const subjects = Object.entries(data);

  const categories = useMemo(() => {
    const cats: Record<string, { subjects: [string, Subject][] }> = {};
    subjects.forEach(([name, sub]) => {
      const cat = sub.category || 'General';
      if (!cats[cat]) cats[cat] = { subjects: [] };
      cats[cat].subjects.push([name, sub]);
    });
    return Object.entries(cats);
  }, []);

  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.map(([cat, { subjects: subs }]) => [cat, {
      subjects: subs.filter(([name, sub]) =>
        name.toLowerCase().includes(q) || sub.docs.some(d => d.name.toLowerCase().includes(q))
      ),
    }] as [string, { subjects: [string, Subject][] }]).filter(([, { subjects: s }]) => s.length > 0);
  }, [categories, search]);

  const currentDoc = useMemo(() => {
    if (!activeSubject || !activeDoc) return null;
    return data[activeSubject]?.docs.find(d => d.id === activeDoc) || null;
  }, [data, activeSubject, activeDoc]);

  const currentStep = currentDoc?.steps[activeStep] || null;

  useEffect(() => { contentRef.current?.scrollTo(0, 0); }, [activeDoc, activeStep, view]);
  useEffect(() => { if (!activeSubject && subjects.length > 0) setActiveSubject(subjects[0][0]); }, []);

  const totalDocs = subjects.reduce((s, [, sub]) => s + sub.docs.length, 0);

  // Theme classes
  const bgMain = dark ? 'bg-te-dark' : 'bg-gray-50';
  const bgSidebar = dark ? 'bg-black/30' : 'bg-white';
  const bgContent = dark ? 'bg-gradient-to-br from-te-dark to-gray-950' : 'bg-gray-50';
  const bgCard = dark ? 'bg-white/[0.03] border-white/5' : 'bg-white border-gray-200 shadow-sm';
  const textPrimary = dark ? 'text-white' : 'text-gray-900';
  const textSecondary = dark ? 'text-gray-400' : 'text-gray-600';
  const textMuted = dark ? 'text-gray-500' : 'text-gray-400';
  const borderColor = dark ? 'border-white/5' : 'border-gray-200';

  return (
    <div className={`h-screen flex flex-col ${bgMain} ${textPrimary} overflow-hidden`}>
      {/* Header */}
      <header className={`px-4 py-2.5 flex items-center gap-3 shrink-0 z-20 border-b ${borderColor} ${dark ? 'bg-black/60 backdrop-blur-xl' : 'bg-white/90 backdrop-blur-xl shadow-sm'}`}>
        <a href="/" className="shrink-0"><img src="/images/logo.png" alt="TE" className="h-8 w-auto" /></a>
        <div className="hidden sm:block shrink-0">
          <h1 className="text-sm font-bold leading-tight">{title}</h1>
          <p className={`text-[10px] ${textMuted}`}>{subtitle}</p>
        </div>

        {/* View tabs */}
        <div className={`hidden md:flex items-center gap-0.5 ml-4 p-0.5 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-100'}`}>
          {[
            { key: 'docs' as const, label: 'Documents', icon: 'M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25' },
            ...(showPTO ? [{ key: 'pto' as const, label: 'PTO Request', icon: 'M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5' }] : []),
            { key: 'training' as const, label: 'Training', icon: 'M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5' },
            { key: 'files' as const, label: 'Files', icon: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setView(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all ${view === tab.key ? `${dark ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm'}` : `${textMuted} hover:${dark ? 'text-gray-300' : 'text-gray-700'}`}`}>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d={tab.icon} /></svg>
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {view === 'docs' && (
          <div className="relative w-52">
            <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
              className={`w-full rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none transition-colors ${dark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-te-teal' : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-te-teal'}`} />
          </div>
        )}

        {/* Admin toggle */}
        <button onClick={() => setAdminMode(!adminMode)}
          className={`p-1.5 rounded-lg transition-colors ${adminMode ? 'bg-yellow-500/20 text-yellow-400' : dark ? 'text-gray-500 hover:bg-white/10' : 'text-gray-400 hover:bg-gray-100'}`}
          title={adminMode ? 'Exit admin mode' : 'Enter admin mode'}>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        {adminMode && (
          <button onClick={resetToDefault} className={`text-[10px] ${dark ? 'text-red-400 hover:text-red-300' : 'text-red-500'}`} title="Reset to original Waybook data">Reset</button>
        )}

        {/* Theme toggle */}
        <button onClick={toggle} className={`p-1.5 rounded-lg transition-colors ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`} title={dark ? 'Switch to light mode' : 'Switch to dark mode'}>
          {dark ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>
          )}
        </button>

        <a href="/" className={`text-[11px] ${textMuted} hover:text-te-teal hidden md:block shrink-0`}>← Site</a>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — only show for docs view */}
        {sidebarOpen && view === 'docs' && (
          <aside className={`w-64 shrink-0 overflow-y-auto border-r ${borderColor} ${bgSidebar}`}>
            <nav className="p-2 space-y-0.5">
              {filteredCategories.map(([cat, { subjects: subs }]) => (
                <div key={cat} className="mb-3">
                  <p className={`text-[9px] uppercase tracking-[0.2em] font-bold px-2 py-1 ${textMuted}`}>{cat}</p>
                  {subs.map(([name, sub]) => (
                    <div key={name}>
                      <button onClick={() => { setActiveSubject(activeSubject === name ? null : name); setView('docs'); }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5 ${activeSubject === name ? `${dark ? 'bg-white/8 text-white' : 'bg-te-teal/5 text-gray-900'} font-medium` : `${textSecondary} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}`}>
                        <svg className={`w-3 h-3 shrink-0 transition-transform duration-200 ${activeSubject === name ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
                        <span className="truncate flex-1">{name}</span>
                        <span className={`text-[9px] tabular-nums ${textMuted}`}>{sub.docs.length}</span>
                      </button>
                      {activeSubject === name && (
                        <div className={`ml-4 mt-0.5 space-y-px border-l pl-2 ${borderColor}`}>
                          {sub.docs.map(doc => (
                            <button key={doc.id} onClick={() => { setActiveDoc(doc.id); setActiveStep(0); setView('docs'); }}
                              className={`w-full text-left px-2 py-1 rounded-md text-[11px] transition-all truncate block ${activeDoc === doc.id ? `font-medium ${dark ? 'bg-white/10 text-white' : 'bg-te-teal/10 text-gray-900'}` : `${textMuted} ${dark ? 'hover:text-gray-300 hover:bg-white/5' : 'hover:text-gray-700 hover:bg-gray-50'}`}`}>
                              {doc.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </nav>
          </aside>
        )}

        {/* Content */}
        <main ref={contentRef} className={`flex-1 overflow-y-auto ${bgContent}`}>
          {view === 'pto' ? (
            <div className="max-w-3xl mx-auto px-6 py-8">
              <PTOForm dark={dark} />
            </div>
          ) : view === 'training' ? (
            <TrainingModule dark={dark} storageKey={storageKey} portalType={showPTO ? 'employee' : 'operations'} />
          ) : view === 'files' ? (
            <div className="px-6 py-8">
              <FilesSection data={data} dark={dark} />
            </div>
          ) : currentDoc ? (
            <div className="max-w-3xl mx-auto px-6 py-8">
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: accentColor }}>{activeSubject}</p>
                <h2 className={`text-2xl font-bold ${textPrimary}`}>{currentDoc.name}</h2>
              </div>

              {currentDoc.steps.length > 1 && (
                <div className="flex gap-1 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
                  {currentDoc.steps.map((step, i) => (
                    <button key={i} onClick={() => setActiveStep(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all shrink-0 ${activeStep === i ? `${textPrimary} font-medium` : `${textMuted} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}`}
                      style={activeStep === i ? { backgroundColor: `${accentColor}20` } : {}}>
                      {step.name || `Section ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {currentStep && (
                <div className={`rounded-xl p-6 border ${bgCard}`}>
                  {currentStep.name && currentDoc.steps.length > 1 && (
                    <h3 className={`text-lg font-semibold mb-4 pb-3 border-b ${borderColor} ${textPrimary}`}>{currentStep.name}</h3>
                  )}
                  <PM content={currentStep.content} dark={dark} />
                </div>
              )}

              {currentDoc.steps.length > 1 && (
                <div className={`flex items-center justify-between mt-8 pt-4 border-t ${borderColor}`}>
                  <button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-20 transition-all ${textSecondary} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                    ← {activeStep > 0 ? (currentDoc.steps[activeStep - 1].name || 'Previous').substring(0, 25) : 'Previous'}
                  </button>
                  <span className={`text-[10px] tabular-nums ${textMuted}`}>{activeStep + 1} / {currentDoc.steps.length}</span>
                  <button disabled={activeStep >= currentDoc.steps.length - 1} onClick={() => setActiveStep(s => s + 1)}
                    className={`px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-20 transition-all ${textSecondary} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}>
                    {activeStep < currentDoc.steps.length - 1 ? (currentDoc.steps[activeStep + 1].name || 'Next').substring(0, 25) : 'Next'} →
                  </button>
                </div>
              )}
            </div>
          ) : activeSubject ? (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <h2 className={`text-xl font-bold mb-6 ${textPrimary}`}>{activeSubject}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data[activeSubject]?.docs.map(doc => (
                  <button key={doc.id} onClick={() => { setActiveDoc(doc.id); setActiveStep(0); }}
                    className={`text-left rounded-xl p-4 border transition-all group ${bgCard} hover:border-te-teal/30`}>
                    <h3 className={`text-sm font-semibold group-hover:text-te-teal transition-colors mb-1 ${textPrimary}`}>{doc.name}</h3>
                    <p className={`text-[11px] ${textMuted}`}>{doc.steps.length} section{doc.steps.length !== 1 ? 's' : ''}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-lg px-6">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
                  <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h2 className={`text-2xl font-bold mb-2 ${textPrimary}`}>{title}</h2>
                <p className={`text-sm ${textSecondary} mb-8`}>Select a topic from the sidebar to get started</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin Panel */}
      {adminMode && (
        <AdminPanel
          data={data}
          onSave={handleSave}
          dark={dark}
          activeSubject={activeSubject}
          activeDoc={activeDoc}
          activeStep={activeStep}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  );
}
