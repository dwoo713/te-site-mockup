'use client';

import { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import rawData from './data.json';

const TrainingModule = dynamic(() => import('../components/TrainingModule'), { ssr: false });

// ── Theme ──────────────────────────────────────────────────────────────────

function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => { if (localStorage.getItem('portal-theme') === 'light') setDark(false); }, []);
  const toggle = useCallback(() => setDark(d => { const n = !d; localStorage.setItem('portal-theme', n ? 'dark' : 'light'); return n; }), []);
  return { dark, toggle };
}

// ── ProseMirror Renderer ───────────────────────────────────────────────────

function PM({ content, dark }: { content: string; dark: boolean }) {
  try {
    const doc = JSON.parse(content);
    return <div className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{rn(doc, 0, dark)}</div>;
  } catch { return content ? <p className={dark ? 'text-gray-400' : 'text-gray-600'}>{content}</p> : null; }
}

function rn(node: any, key: number, dark: boolean): any {
  if (!node) return null;
  if (node.type === 'text') {
    let el: any = node.text || '';
    (node.marks || []).forEach((m: any) => {
      if (m.type === 'bold') el = <strong className={dark ? 'text-white' : 'text-gray-900'}>{el}</strong>;
      if (m.type === 'italic') el = <em>{el}</em>;
      if (m.type === 'underline') el = <u>{el}</u>;
      if (m.type === 'link' || m.type === 'deeplink') el = <a href={m.attrs?.href} target="_blank" rel="noopener noreferrer" className="text-te-teal hover:text-te-teal-light underline underline-offset-2">{el}</a>;
      if (m.type === 'text_highlight') el = <mark className={dark ? 'bg-yellow-500/20 text-yellow-200 px-0.5 rounded' : 'bg-yellow-200 text-yellow-900 px-0.5 rounded'}>{el}</mark>;
    });
    return el;
  }
  const ch = (node.content || []).map((c: any, i: number) => rn(c, i, dark));
  const tp = dark ? 'text-white' : 'text-gray-900';
  switch (node.type) {
    case 'doc': return <>{ch}</>;
    case 'paragraph': return <p key={key} className={`mb-3 leading-relaxed ${node.attrs?.align === 'center' ? 'text-center' : ''}`}>{ch.length > 0 ? ch : null}</p>;
    case 'heading': {
      const l = node.attrs?.level || 2;
      return <div key={key} className={`${l === 1 ? 'text-xl font-bold mt-6 mb-3' : l === 2 ? 'text-lg font-bold mt-5 mb-2' : 'text-base font-semibold mt-4 mb-2'} ${tp}`}>{ch}</div>;
    }
    case 'bullet_list': return <ul key={key} className="mb-4 space-y-1.5 ml-1">{ch}</ul>;
    case 'ordered_list': return <ol key={key} className="mb-4 space-y-1.5 ml-5 list-decimal">{ch}</ol>;
    case 'list_item': return <li key={key} className="flex items-start gap-2"><span className="text-te-teal mt-1.5 text-[8px]">●</span><span className="flex-1">{(node.content || []).map((c: any, i: number) => c.type === 'paragraph' ? <span key={i}>{(c.content || []).map((cc: any, j: number) => rn(cc, j, dark))}</span> : rn(c, i, dark))}</span></li>;
    case 'horizontal_rule': return <hr key={key} className={dark ? 'border-white/10 my-6' : 'border-gray-200 my-6'} />;
    case 'image': return <figure key={key} className="my-4"><img src={node.attrs?.src || node.attrs?.asset} alt="" loading="lazy" className="rounded-xl max-w-full mx-auto" style={node.attrs?.width ? { width: node.attrs.width } : { maxHeight: '400px' }} /></figure>;
    case 'aside': return <div key={key} className={`rounded-xl p-4 my-4 ${dark ? 'bg-te-teal/10 border border-te-teal/20' : 'bg-te-teal/5 border border-te-teal/15'}`}>{ch}</div>;
    case 'attachment': case 'file_viewer': return (
      <a key={key} href={node.attrs?.url || node.attrs?.href || node.attrs?.src || '#'} target="_blank" rel="noopener"
        className={`flex items-center gap-3 rounded-xl p-3 my-2 transition-all group ${dark ? 'bg-white/5 border border-white/10 hover:border-te-teal/30' : 'bg-gray-50 border border-gray-200 hover:border-te-teal/40'}`}>
        <div className="w-9 h-9 rounded-lg bg-te-teal/15 flex items-center justify-center shrink-0">
          <span className="text-te-teal text-[10px] font-bold">{(node.attrs?.extension || node.attrs?.name?.split('.').pop() || 'FILE').substring(0, 4).toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0"><p className={`text-xs font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{node.attrs?.name || 'Document'}</p></div>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-te-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
      </a>
    );
    case 'embed_frame': case 'embed': {
      const src = node.attrs?.src || node.attrs?.url || '';
      const yt = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
      if (yt) return <div key={key} className="my-4 aspect-video rounded-xl overflow-hidden"><iframe src={`https://www.youtube.com/embed/${yt[1]}`} className="w-full h-full" allowFullScreen /></div>;
      const loom = src.match(/loom\.com\/(?:share|embed)\/([\w]+)/);
      if (loom) return <div key={key} className="my-4 aspect-video rounded-xl overflow-hidden"><iframe src={`https://www.loom.com/embed/${loom[1]}`} className="w-full h-full" allowFullScreen /></div>;
      return src ? <div key={key} className="my-4 aspect-video rounded-xl overflow-hidden"><iframe src={src} className="w-full h-full" allowFullScreen /></div> : null;
    }
    case 'todo_list': return <div key={key} className="mb-4 space-y-2">{ch}</div>;
    case 'todo_item': {
      const done = node.attrs?.checked || node.attrs?.done;
      return <label key={key} className="flex items-start gap-2.5"><div className={`w-[18px] h-[18px] rounded-md border-2 mt-0.5 shrink-0 flex items-center justify-center ${done ? 'bg-te-teal border-te-teal' : dark ? 'border-gray-600' : 'border-gray-300'}`}>{done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>}</div><span className={done ? 'line-through opacity-50' : ''}>{ch}</span></label>;
    }
    case 'blockquote': return <blockquote key={key} className={`border-l-4 border-te-teal/40 pl-4 my-4 italic ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{ch}</blockquote>;
    case 'table': return <div key={key} className={`overflow-x-auto my-4 rounded-xl border ${dark ? 'border-white/10' : 'border-gray-200'}`}><table className="w-full text-sm">{ch}</table></div>;
    case 'table_row': return <tr key={key} className={dark ? 'border-b border-white/5' : 'border-b border-gray-100'}>{ch}</tr>;
    case 'table_cell': return <td key={key} className="px-3 py-2 text-xs">{ch}</td>;
    case 'table_header': return <th key={key} className={`px-3 py-2 text-left text-xs font-semibold ${dark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'}`}>{ch}</th>;
    default: return ch.length > 0 ? <div key={key}>{ch}</div> : null;
  }
}

// ── PTO Form ───────────────────────────────────────────────────────────────

function PTOForm({ dark }: { dark: boolean }) {
  const [name, setName] = useState(''); const [start, setStart] = useState(''); const [end, setEnd] = useState('');
  const [type, setType] = useState('vacation'); const [notes, setNotes] = useState(''); const [done, setDone] = useState(false);
  const ic = `w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-colors ${dark ? 'bg-white/5 border border-white/10 text-white focus:border-te-teal' : 'bg-white border border-gray-200 text-gray-900 focus:border-te-teal'}`;
  if (done) return (
    <div className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-te-teal/15 flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-te-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>
      </div>
      <h3 className={`text-lg font-bold mb-2 ${dark ? 'text-white' : 'text-gray-900'}`}>PTO Request Submitted</h3>
      <p className={dark ? 'text-gray-400' : 'text-gray-600'}>Your request has been sent to HR.</p>
      <button onClick={() => setDone(false)} className="mt-4 px-4 py-2 rounded-lg text-sm text-te-teal bg-te-teal/10 hover:bg-te-teal/20">Submit Another</button>
    </div>
  );
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Employee Name</label><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className={ic} /></div>
        <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Leave Type</label>
          <select value={type} onChange={e => setType(e.target.value)} className={ic}><option value="vacation">Vacation</option><option value="sick">Sick Leave</option><option value="personal">Personal Day</option><option value="bereavement">Bereavement</option><option value="other">Other</option></select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Start Date</label><input type="date" value={start} onChange={e => setStart(e.target.value)} className={ic} /></div>
        <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">End Date</label><input type="date" value={end} onChange={e => setEnd(e.target.value)} className={ic} /></div>
      </div>
      <div><label className="text-xs text-gray-500 uppercase tracking-wider block mb-1.5">Notes (Optional)</label><textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className={ic} /></div>
      <button onClick={() => setDone(true)} disabled={!name || !start || !end} className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-te-teal hover:bg-te-teal-light disabled:opacity-40 transition-colors">Submit PTO Request</button>
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────

interface Step { name: string; type: string; content: string }
interface Doc { id: string; name: string; steps: Step[] }
type View = 'home' | 'pto' | 'training' | 'directory' | 'benefits' | 'onboarding' | 'policies' | 'doc';

const data = rawData as Record<string, { category: string; docs: Doc[] }>;

// ── HR Portal Sections ────────────────────────────────────────────────────

const QUICK_LINKS = [
  { label: 'PTO Request', icon: '📅', view: 'pto' as const, color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20' },
  { label: 'Benefits', icon: '💊', view: 'benefits' as const, color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20' },
  { label: 'Training', icon: '🎓', view: 'training' as const, color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20' },
  { label: 'New Hire Guide', icon: '🚀', view: 'onboarding' as const, color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20' },
  { label: 'Company Directory', icon: '👥', view: 'directory' as const, color: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/20' },
  { label: 'Policies & Forms', icon: '📋', view: 'policies' as const, color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/20' },
];

// Map Waybook content to sections
function getDocsBySubject(subject: string): Doc[] { return data[subject]?.docs || []; }

// ── Main Component ────────────────────────────────────────────────────────

export default function EmployeePortalPage() {
  const { dark, toggle } = useTheme();
  const [view, setView] = useState<View>('home');
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  const bg = dark ? 'bg-te-dark' : 'bg-gray-50';
  const tp = dark ? 'text-white' : 'text-gray-900';
  const ts = dark ? 'text-gray-400' : 'text-gray-600';
  const tm = dark ? 'text-gray-500' : 'text-gray-400';
  const card = dark ? 'bg-white/[0.03] border border-white/5 hover:border-te-teal/20' : 'bg-white border border-gray-200 shadow-sm hover:border-te-teal/30 hover:shadow-md';
  const cardStatic = dark ? 'bg-white/[0.03] border border-white/5' : 'bg-white border border-gray-200 shadow-sm';
  const headerBg = dark ? 'bg-black/60 backdrop-blur-xl border-b border-white/5' : 'bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm';

  function openDoc(doc: Doc) { setActiveDoc(doc); setActiveStep(0); setView('doc'); }

  function DocList({ docs, title, icon }: { docs: Doc[]; title: string; icon: string }) {
    return (
      <div>
        <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${tp}`}><span className="text-2xl">{icon}</span>{title}</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {docs.map(doc => (
            <button key={doc.id} onClick={() => openDoc(doc)} className={`text-left rounded-xl p-5 transition-all ${card}`}>
              <h3 className={`text-sm font-semibold mb-1 ${tp}`}>{doc.name}</h3>
              <p className={`text-xs ${tm}`}>{doc.steps.length} section{doc.steps.length !== 1 ? 's' : ''}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Document Viewer ──────────────────────────────────────────────

  if (view === 'doc' && activeDoc) {
    const step = activeDoc.steps[activeStep];
    return (
      <div className={`min-h-screen ${bg}`}>
        <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${headerBg}`}>
          <button onClick={() => { setView('home'); setActiveDoc(null); }} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </button>
          <div className="flex-1 min-w-0"><h1 className={`text-sm font-bold truncate ${tp}`}>{activeDoc.name}</h1></div>
          <button onClick={toggle} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            {dark ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> :
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}
          </button>
        </header>
        <div className="max-w-3xl mx-auto px-4 py-8">
          {activeDoc.steps.length > 1 && (
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
              {activeDoc.steps.map((s, i) => (
                <button key={i} onClick={() => setActiveStep(i)} className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 transition-all ${activeStep === i ? `${tp} font-medium ${dark ? 'bg-te-teal/20' : 'bg-te-teal/10'}` : `${tm} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}`}>{s.name || `Section ${i + 1}`}</button>
              ))}
            </div>
          )}
          <div className={`rounded-xl p-6 border ${cardStatic}`}>
            {step?.name && activeDoc.steps.length > 1 && <h3 className={`text-lg font-semibold mb-4 pb-3 border-b ${dark ? 'border-white/5' : 'border-gray-200'} ${tp}`}>{step.name}</h3>}
            {step && <PM content={step.content} dark={dark} />}
          </div>
          {activeDoc.steps.length > 1 && (
            <div className={`flex justify-between mt-6 pt-4 border-t ${dark ? 'border-white/5' : 'border-gray-200'}`}>
              <button disabled={activeStep === 0} onClick={() => setActiveStep(i => i - 1)} className={`px-4 py-2 rounded-lg text-xs disabled:opacity-20 ${ts}`}>← Previous</button>
              <span className={`text-[10px] ${tm}`}>{activeStep + 1} / {activeDoc.steps.length}</span>
              <button disabled={activeStep >= activeDoc.steps.length - 1} onClick={() => setActiveStep(i => i + 1)} className={`px-4 py-2 rounded-lg text-xs disabled:opacity-20 ${ts}`}>Next →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Training View ────────────────────────────────────────────────

  if (view === 'training') {
    return (
      <div className={`min-h-screen ${bg}`}>
        <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${headerBg}`}>
          <button onClick={() => setView('home')} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </button>
          <h1 className={`text-sm font-bold ${tp}`}>Training Center</h1>
          <div className="flex-1" />
          <button onClick={toggle} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            {dark ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> :
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}
          </button>
        </header>
        <TrainingModule dark={dark} storageKey="employee-portal" portalType="employee" />
      </div>
    );
  }

  // ── Section Views ────────────────────────────────────────────────

  if (view !== 'home') {
    const sections: Record<string, { title: string; icon: string; docs: Doc[] }> = {
      pto: { title: 'PTO Request', icon: '📅', docs: [] },
      benefits: { title: 'Benefits & Wellness', icon: '💊', docs: [...getDocsBySubject('HR'), ...getDocsBySubject('HR Templates').filter(d => d.name.includes('TE Bucks') || d.name.includes('WellWorks') || d.name.includes('Direct Deposit'))] },
      onboarding: { title: 'New Hire Guide', icon: '🚀', docs: [...getDocsBySubject('Welcome to Tumlinson Electric'), ...getDocsBySubject('All Employees'), ...getDocsBySubject('PM Onboarding')] },
      directory: { title: 'Company Directory', icon: '👥', docs: [...getDocsBySubject('Roles and Responsibilities'), ...getDocsBySubject('TE Company Contacts')] },
      policies: { title: 'Policies & Forms', icon: '📋', docs: [...getDocsBySubject('HR Templates'), ...getDocsBySubject('Outlook')] },
    };

    const section = sections[view];
    if (!section) { setView('home'); return null; }

    return (
      <div className={`min-h-screen ${bg}`}>
        <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${headerBg}`}>
          <button onClick={() => setView('home')} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
          </button>
          <h1 className={`text-sm font-bold ${tp}`}>{section.icon} {section.title}</h1>
          <div className="flex-1" />
          <button onClick={toggle} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
            {dark ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> :
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}
          </button>
        </header>
        <div className="max-w-4xl mx-auto px-4 py-8">
          {view === 'pto' ? <PTOForm dark={dark} /> : <DocList docs={section.docs} title={section.title} icon={section.icon} />}
        </div>
      </div>
    );
  }

  // ── Home Dashboard ───────────────────────────────────────────────

  return (
    <div className={`min-h-screen ${bg}`}>
      {/* Header */}
      <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${headerBg}`}>
        <a href="/" className="shrink-0"><img src="/images/logo.png" alt="TE" className="h-8 w-auto" /></a>
        <div className="hidden sm:block">
          <h1 className={`text-sm font-bold ${tp}`}>Employee Portal</h1>
          <p className={`text-[10px] ${tm}`}>Tumlinson Electric</p>
        </div>
        <div className="flex-1" />
        <button onClick={toggle} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
          {dark ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> :
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}
        </button>
        <a href="/" className={`text-xs ${tm} hover:text-te-teal hidden md:block`}>← Back to Site</a>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome banner */}
        <div className={`rounded-2xl p-8 mb-8 bg-gradient-to-r ${dark ? 'from-te-teal/20 via-te-teal/10 to-transparent border border-te-teal/10' : 'from-te-teal/10 via-te-teal/5 to-transparent border border-te-teal/10'}`}>
          <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${tp}`}>Welcome to the Employee Portal</h1>
          <p className={`text-sm ${ts} max-w-xl`}>Access your benefits, submit PTO requests, complete training, and find company resources — all in one place.</p>
        </div>

        {/* Quick Actions */}
        <h2 className={`text-xs uppercase tracking-[0.2em] font-bold mb-4 ${tm}`}>Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-10">
          {QUICK_LINKS.map(link => (
            <button key={link.view} onClick={() => setView(link.view)}
              className={`rounded-xl p-4 text-center transition-all group ${card}`}>
              <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center bg-gradient-to-br ${link.color} border ${link.border}`}>
                <span className="text-2xl">{link.icon}</span>
              </div>
              <p className={`text-xs font-semibold ${tp}`}>{link.label}</p>
            </button>
          ))}
        </div>

        {/* Announcements */}
        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className={`rounded-xl p-6 ${cardStatic}`}>
            <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${tp}`}>
              <span className="text-lg">📢</span> Announcements
            </h3>
            <div className={`space-y-3 ${ts}`}>
              <div className={`p-3 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className="text-xs font-medium mb-1">WellWorks Wellness Program</p>
                <p className="text-[11px] opacity-70">Earn rewards by completing wellness activities. Check your WellWorks dashboard for details.</p>
              </div>
              <div className={`p-3 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className="text-xs font-medium mb-1">TE Bucks Reward Program</p>
                <p className="text-[11px] opacity-70">Earn TE Bucks for safety, performance, and team contributions. Redeem in the company store.</p>
              </div>
              <div className={`p-3 rounded-lg ${dark ? 'bg-white/5' : 'bg-gray-50'}`}>
                <p className="text-xs font-medium mb-1">Open Enrollment</p>
                <p className="text-[11px] opacity-70">Benefits enrollment period opens annually. Contact HR for details.</p>
              </div>
            </div>
          </div>

          <div className={`rounded-xl p-6 ${cardStatic}`}>
            <h3 className={`text-sm font-bold mb-4 flex items-center gap-2 ${tp}`}>
              <span className="text-lg">📞</span> Key Contacts
            </h3>
            <div className="space-y-3">
              {[
                ['HR/Payroll', 'TE_HRPAYROLL@tumlinsonelectric.com', '📧'],
                ['IT Support', 'support@tumlinsonelectric.com', '💻'],
                ['Office Manager', 'Brandi Watson', '🏢'],
                ['Safety Manager', 'Brandon Garrett', '🦺'],
                ['Main Office', '512-693-4444', '📞'],
              ].map(([role, info, icon]) => (
                <div key={role} className={`flex items-center gap-3 p-2 rounded-lg ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-50'} transition-colors`}>
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className={`text-xs font-medium ${tp}`}>{role}</p>
                    <p className={`text-[11px] ${tm}`}>{info}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Company Resources */}
        <h2 className={`text-xs uppercase tracking-[0.2em] font-bold mb-4 ${tm}`}>Company Resources</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            ...getDocsBySubject('Welcome to Tumlinson Electric'),
            ...getDocsBySubject('Roles and Responsibilities').slice(0, 3),
          ].map(doc => (
            <button key={doc.id} onClick={() => openDoc(doc)} className={`text-left rounded-xl p-4 transition-all ${card}`}>
              <h3 className={`text-sm font-semibold mb-1 ${tp}`}>{doc.name}</h3>
              <p className={`text-[11px] ${tm}`}>{doc.steps.length} section{doc.steps.length !== 1 ? 's' : ''}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
