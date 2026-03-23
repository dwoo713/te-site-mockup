'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import rawData from './data.json';

const TrainingModule = dynamic(() => import('../components/TrainingModule'), { ssr: false });

// ── Theme ────────────────────────────────────────────────────────────────
function useTheme() {
  const [dark, setDark] = useState(true);
  useEffect(() => { if (localStorage.getItem('portal-theme') === 'light') setDark(false); }, []);
  const toggle = useCallback(() => setDark(d => { const n = !d; localStorage.setItem('portal-theme', n ? 'dark' : 'light'); return n; }), []);
  return { dark, toggle };
}

// ── Types ────────────────────────────────────────────────────────────────
interface Step { name: string; type: string; content: string }
interface Doc { id: string; name: string; steps: Step[] }
const data = rawData as Record<string, { category: string; docs: Doc[] }>;
function getDocs(subject: string): Doc[] { return data[subject]?.docs || []; }
function getAllDocs(subjects: string[]): Doc[] { return subjects.flatMap(s => getDocs(s)); }

type View = 'home' | 'training' | 'section' | 'doc' | 'search';

// ── PM Renderer ──────────────────────────────────────────────────────────
function PM({ content, dark }: { content: string; dark: boolean }) {
  try { const doc = JSON.parse(content); return <div className={`text-sm leading-relaxed ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{rn(doc, 0, dark)}</div>; }
  catch { return content ? <p className={dark ? 'text-gray-400' : 'text-gray-600'}>{content}</p> : null; }
}
function rn(node: any, key: number, dark: boolean): any {
  if (!node) return null;
  if (node.type === 'text') {
    let el: any = node.text || '';
    (node.marks || []).forEach((m: any) => {
      if (m.type === 'bold') el = <strong className={dark ? 'text-white' : 'text-gray-900'}>{el}</strong>;
      if (m.type === 'italic') el = <em>{el}</em>;
      if (m.type === 'underline') el = <u>{el}</u>;
      if (m.type === 'link' || m.type === 'deeplink') el = <a href={m.attrs?.href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">{el}</a>;
      if (m.type === 'text_highlight') el = <mark className={dark ? 'bg-yellow-500/20 text-yellow-200 px-0.5 rounded' : 'bg-yellow-200 text-yellow-900 px-0.5 rounded'}>{el}</mark>;
    });
    return el;
  }
  const ch = (node.content || []).map((c: any, i: number) => rn(c, i, dark));
  const tp = dark ? 'text-white' : 'text-gray-900';
  switch (node.type) {
    case 'doc': return <>{ch}</>;
    case 'paragraph': return <p key={key} className={`mb-3 leading-relaxed ${node.attrs?.align === 'center' ? 'text-center' : ''}`}>{ch.length > 0 ? ch : null}</p>;
    case 'heading': { const l = node.attrs?.level || 2; return <div key={key} className={`${l === 1 ? 'text-xl font-bold mt-6 mb-3' : l === 2 ? 'text-lg font-bold mt-5 mb-2' : 'text-base font-semibold mt-4 mb-2'} ${tp}`}>{ch}</div>; }
    case 'bullet_list': return <ul key={key} className="mb-4 space-y-1.5 ml-1">{ch}</ul>;
    case 'ordered_list': return <ol key={key} className="mb-4 space-y-1.5 ml-5 list-decimal">{ch}</ol>;
    case 'list_item': return <li key={key} className="flex items-start gap-2"><span className="text-blue-400 mt-1.5 text-[8px]">●</span><span className="flex-1">{(node.content || []).map((c: any, i: number) => c.type === 'paragraph' ? <span key={i}>{(c.content || []).map((cc: any, j: number) => rn(cc, j, dark))}</span> : rn(c, i, dark))}</span></li>;
    case 'horizontal_rule': return <hr key={key} className={dark ? 'border-white/10 my-6' : 'border-gray-200 my-6'} />;
    case 'image': return <figure key={key} className="my-4"><img src={node.attrs?.src || node.attrs?.asset} alt="" loading="lazy" className="rounded-xl max-w-full mx-auto" style={node.attrs?.width ? { width: node.attrs.width } : { maxHeight: '400px' }} /></figure>;
    case 'aside': return <div key={key} className={`rounded-xl p-4 my-4 ${dark ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>{ch}</div>;
    case 'attachment': case 'file_viewer': return (
      <a key={key} href={node.attrs?.url || node.attrs?.href || node.attrs?.src || '#'} target="_blank" rel="noopener" className={`flex items-center gap-3 rounded-xl p-3 my-2 transition-all group ${dark ? 'bg-white/5 border border-white/10 hover:border-blue-500/30' : 'bg-gray-50 border border-gray-200 hover:border-blue-400'}`}>
        <div className="w-9 h-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0"><span className="text-blue-400 text-[10px] font-bold">{(node.attrs?.extension || node.attrs?.name?.split('.').pop() || 'FILE').substring(0, 4).toUpperCase()}</span></div>
        <div className="flex-1 min-w-0"><p className={`text-xs font-medium truncate ${dark ? 'text-gray-200' : 'text-gray-800'}`}>{node.attrs?.name || 'Document'}</p></div>
        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
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
    case 'todo_item': { const done = node.attrs?.checked || node.attrs?.done; return <label key={key} className="flex items-start gap-2.5"><div className={`w-[18px] h-[18px] rounded-md border-2 mt-0.5 shrink-0 flex items-center justify-center ${done ? 'bg-blue-500 border-blue-500' : dark ? 'border-gray-600' : 'border-gray-300'}`}>{done && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>}</div><span className={done ? 'line-through opacity-50' : ''}>{ch}</span></label>; }
    case 'blockquote': return <blockquote key={key} className={`border-l-4 border-blue-500/40 pl-4 my-4 italic ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{ch}</blockquote>;
    case 'table': return <div key={key} className={`overflow-x-auto my-4 rounded-xl border ${dark ? 'border-white/10' : 'border-gray-200'}`}><table className="w-full text-sm">{ch}</table></div>;
    case 'table_row': return <tr key={key} className={dark ? 'border-b border-white/5' : 'border-b border-gray-100'}>{ch}</tr>;
    case 'table_cell': return <td key={key} className="px-3 py-2 text-xs">{ch}</td>;
    case 'table_header': return <th key={key} className={`px-3 py-2 text-left text-xs font-semibold ${dark ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'}`}>{ch}</th>;
    default: return ch.length > 0 ? <div key={key}>{ch}</div> : null;
  }
}

// ── Section Definitions (organized by workflow) ──────────────────────────

interface Section {
  key: string;
  title: string;
  icon: string;
  desc: string;
  color: string;
  border: string;
  subjects: string[];
}

const SECTIONS: Section[] = [
  { key: 'preconstruction', title: 'Pre-Construction', icon: '📐', desc: 'Project setup, handoff, startup activities, turnover meetings', color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20', subjects: ['Project Set Up'] },
  { key: 'planning', title: 'Planning & Procurement', icon: '📦', desc: 'Contracts, purchasing, submittals, budgets, billing, subcontracts, RFIs', color: 'from-blue-500/20 to-blue-600/10', border: 'border-blue-500/20', subjects: ['Planning & Procurement'] },
  { key: 'execution', title: 'Construction Execution', icon: '🏗️', desc: 'Change orders, AP processing, monthly billing, field coordination', color: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/20', subjects: ['Construction Execution'] },
  { key: 'monitoring', title: 'Monitoring & Reporting', icon: '📊', desc: 'Schedules, CE reports, CAC process, job walks, constraints', color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', subjects: ['Monitoring'] },
  { key: 'closeout', title: 'Closeout', icon: '✅', desc: 'Warranty letters, work to complete, final documentation', color: 'from-green-500/20 to-green-600/10', border: 'border-green-500/20', subjects: ['Close Out'] },
  { key: 'field', title: 'Field Operations', icon: '🔧', desc: 'Pre-job, daily reporting, manpower, QA/QC, security, drug testing', color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/20', subjects: ['Build for Field', 'Pre-Job', 'Planning', 'Documentation/Applications', 'Manpower', 'QA/QC', 'HR', 'Security', 'Project Drug Testing Procedures - Field'] },
  { key: 'software', title: 'Software & Tools', icon: '💻', desc: 'Autodesk Build, Bluebeam, Teams, eSub, CE, DUO MFA, and more', color: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/20', subjects: ['Software we use', 'IT Best Practices', 'Build for PMs', 'QMS Software', 'Accubid CO'] },
  { key: 'templates', title: 'Templates & Forms', icon: '📄', desc: 'PM templates, field templates, purchasing templates, BOMs', color: 'from-pink-500/20 to-pink-600/10', border: 'border-pink-500/20', subjects: ['PM Templates', 'Field Templates', 'Purchasing Templates', 'BOMs'] },
  { key: 'purchasing', title: 'Purchasing & Procurement', icon: '🛒', desc: 'AMEX policy, vendor packets, customer packets, commodity pricing', color: 'from-indigo-500/20 to-indigo-600/10', border: 'border-indigo-500/20', subjects: ['AMEX Policy', 'Purchasing Templates'] },
  { key: 'network', title: 'Network / Low Voltage', icon: '🔌', desc: 'Codes & standards, manufacturer resources, BICSI, Panduit', color: 'from-teal-500/20 to-teal-600/10', border: 'border-teal-500/20', subjects: ['Codes & Standards', 'Manufacturer Resources', 'Partner Contacts'] },
  { key: 'contacts', title: 'Contacts & Resources', icon: '📇', desc: 'Partner contacts, vendor contacts, reference materials', color: 'from-gray-500/20 to-gray-600/10', border: 'border-gray-500/20', subjects: ['Partner Contacts', 'HR Documents', 'Live Trainings'] },
];

// ── Main Component ───────────────────────────────────────────────────────

export default function OperationsPortalPage() {
  const { dark, toggle } = useTheme();
  const [view, setView] = useState<View>('home');
  const [activeSection, setActiveSection] = useState<Section | null>(null);
  const [activeDoc, setActiveDoc] = useState<Doc | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [search, setSearch] = useState('');

  const bg = dark ? 'bg-te-dark' : 'bg-gray-50';
  const tp = dark ? 'text-white' : 'text-gray-900';
  const ts = dark ? 'text-gray-400' : 'text-gray-600';
  const tm = dark ? 'text-gray-500' : 'text-gray-400';
  const card = dark ? 'bg-white/[0.03] border border-white/5 hover:border-blue-500/20' : 'bg-white border border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md';
  const cardStatic = dark ? 'bg-white/[0.03] border border-white/5' : 'bg-white border border-gray-200 shadow-sm';
  const headerBg = dark ? 'bg-black/60 backdrop-blur-xl border-b border-white/5' : 'bg-white/90 backdrop-blur-xl border-b border-gray-200 shadow-sm';

  function openDoc(doc: Doc) { setActiveDoc(doc); setActiveStep(0); setView('doc'); }
  function openSection(section: Section) { setActiveSection(section); setView('section'); }

  // Search
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    const results: Doc[] = [];
    Object.values(data).forEach(sub => {
      sub.docs.forEach(doc => {
        if (doc.name.toLowerCase().includes(q)) { results.push(doc); return; }
        for (const step of doc.steps) {
          try {
            if (JSON.stringify(JSON.parse(step.content)).toLowerCase().includes(q)) { results.push(doc); return; }
          } catch {}
        }
      });
    });
    return results;
  }, [search]);

  // Theme toggle button
  const ThemeBtn = () => (
    <button onClick={toggle} className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
      {dark ? <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg> :
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" /></svg>}
    </button>
  );

  const BackBtn = ({ to = 'home' as View, label = 'Back' }) => (
    <button onClick={() => { setView(to); if (to === 'home') { setActiveDoc(null); setActiveSection(null); } }}
      className={`p-1.5 rounded-lg ${dark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'}`}>
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
    </button>
  );

  // ── Document View ─────────────────────────────────────────────────
  if (view === 'doc' && activeDoc) {
    const step = activeDoc.steps[activeStep];
    return (
      <div className={`min-h-screen ${bg}`}>
        <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${headerBg}`}>
          <BackBtn to={activeSection ? 'section' : 'home'} />
          <div className="flex-1 min-w-0">
            {activeSection && <p className={`text-[10px] ${tm}`}>{activeSection.icon} {activeSection.title}</p>}
            <h1 className={`text-sm font-bold truncate ${tp}`}>{activeDoc.name}</h1>
          </div>
          <ThemeBtn />
        </header>
        <div className="max-w-3xl mx-auto px-4 py-8">
          {activeDoc.steps.length > 1 && (
            <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
              {activeDoc.steps.map((s, i) => (
                <button key={i} onClick={() => setActiveStep(i)}
                  className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap shrink-0 transition-all ${activeStep === i ? `${tp} font-medium ${dark ? 'bg-blue-500/20' : 'bg-blue-50'}` : `${tm} ${dark ? 'hover:bg-white/5' : 'hover:bg-gray-100'}`}`}>
                  {s.name || `Section ${i + 1}`}
                </button>
              ))}
            </div>
          )}
          <div className={`rounded-xl p-6 border ${cardStatic}`}>
            {step?.name && activeDoc.steps.length > 1 && <h3 className={`text-lg font-semibold mb-4 pb-3 border-b ${dark ? 'border-white/5' : 'border-gray-200'} ${tp}`}>{step.name}</h3>}
            {step && <PM content={step.content} dark={dark} />}
          </div>
          {activeDoc.steps.length > 1 && (
            <div className={`flex justify-between mt-6 pt-4 border-t ${dark ? 'border-white/5' : 'border-gray-200'}`}>
              <button disabled={activeStep === 0} onClick={() => setActiveStep(i => i - 1)} className={`px-4 py-2 rounded-lg text-xs disabled:opacity-20 ${ts}`}>← {activeStep > 0 ? (activeDoc.steps[activeStep - 1].name || 'Previous').substring(0, 30) : 'Previous'}</button>
              <span className={`text-[10px] ${tm}`}>{activeStep + 1} / {activeDoc.steps.length}</span>
              <button disabled={activeStep >= activeDoc.steps.length - 1} onClick={() => setActiveStep(i => i + 1)} className={`px-4 py-2 rounded-lg text-xs disabled:opacity-20 ${ts}`}>{activeStep < activeDoc.steps.length - 1 ? (activeDoc.steps[activeStep + 1].name || 'Next').substring(0, 30) : 'Next'} →</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Training View ─────────────────────────────────────────────────
  if (view === 'training') {
    return (
      <div className={`min-h-screen ${bg}`}>
        <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${headerBg}`}>
          <BackBtn /><h1 className={`text-sm font-bold ${tp}`}>🎓 Training Center</h1><div className="flex-1" /><ThemeBtn />
        </header>
        <TrainingModule dark={dark} storageKey="operations-portal" portalType="operations" />
      </div>
    );
  }

  // ── Section View ──────────────────────────────────────────────────
  if (view === 'section' && activeSection) {
    const docs = getAllDocs(activeSection.subjects);
    // Group by subject
    const grouped: Record<string, Doc[]> = {};
    activeSection.subjects.forEach(s => {
      const d = getDocs(s);
      if (d.length > 0) grouped[s] = d;
    });

    return (
      <div className={`min-h-screen ${bg}`}>
        <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${headerBg}`}>
          <BackBtn />
          <div className="flex-1 min-w-0">
            <h1 className={`text-sm font-bold ${tp}`}>{activeSection.icon} {activeSection.title}</h1>
            <p className={`text-[10px] ${tm}`}>{docs.length} documents</p>
          </div>
          <ThemeBtn />
        </header>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <p className={`text-sm mb-8 ${ts}`}>{activeSection.desc}</p>

          {Object.entries(grouped).length > 1 ? (
            // Multiple sub-sections
            Object.entries(grouped).map(([subName, subDocs]) => (
              <div key={subName} className="mb-8">
                <h3 className={`text-xs uppercase tracking-[0.2em] font-bold mb-3 ${tm}`}>{subName}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {subDocs.map(doc => (
                    <button key={doc.id} onClick={() => openDoc(doc)} className={`text-left rounded-xl p-4 transition-all ${card}`}>
                      <h4 className={`text-sm font-semibold mb-1 ${tp}`}>{doc.name}</h4>
                      <p className={`text-[11px] ${tm}`}>{doc.steps.length} section{doc.steps.length !== 1 ? 's' : ''}</p>
                    </button>
                  ))}
                </div>
              </div>
            ))
          ) : (
            // Single section — flat grid
            <div className="grid sm:grid-cols-2 gap-3">
              {docs.map(doc => (
                <button key={doc.id} onClick={() => openDoc(doc)} className={`text-left rounded-xl p-4 transition-all ${card}`}>
                  <h4 className={`text-sm font-semibold mb-1 ${tp}`}>{doc.name}</h4>
                  <p className={`text-[11px] ${tm}`}>{doc.steps.length} section{doc.steps.length !== 1 ? 's' : ''}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Home Dashboard ────────────────────────────────────────────────
  const totalDocs = Object.values(data).reduce((s, sub) => s + sub.docs.length, 0);

  return (
    <div className={`min-h-screen ${bg}`}>
      <header className={`sticky top-0 z-20 px-4 py-3 flex items-center gap-3 ${headerBg}`}>
        <a href="/" className="shrink-0"><img src="/images/logo.png" alt="TE" className="h-8 w-auto" /></a>
        <div className="hidden sm:block">
          <h1 className={`text-sm font-bold ${tp}`}>Operations Portal</h1>
          <p className={`text-[10px] ${tm}`}>Tumlinson Electric</p>
        </div>
        <div className="flex-1" />

        {/* Search */}
        <div className="relative w-56">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all docs..."
            className={`w-full rounded-lg pl-8 pr-3 py-1.5 text-xs outline-none ${dark ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-blue-500' : 'bg-gray-100 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-blue-500'}`} />
        </div>
        <ThemeBtn />
        <a href="/" className={`text-xs ${tm} hover:text-blue-400 hidden md:block`}>← Site</a>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Search Results */}
        {search.trim() && (
          <div className="mb-8">
            <h2 className={`text-sm font-bold mb-4 ${tp}`}>Search Results ({searchResults.length})</h2>
            {searchResults.length === 0 ? (
              <p className={`text-sm ${ts}`}>No documents found for &ldquo;{search}&rdquo;</p>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.slice(0, 12).map(doc => (
                  <button key={doc.id} onClick={() => openDoc(doc)} className={`text-left rounded-xl p-4 transition-all ${card}`}>
                    <h4 className={`text-sm font-semibold mb-1 ${tp}`}>{doc.name}</h4>
                    <p className={`text-[11px] ${tm}`}>{doc.steps.length} sections</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!search.trim() && (
          <>
            {/* Welcome */}
            <div className={`rounded-2xl p-8 mb-8 bg-gradient-to-r ${dark ? 'from-blue-500/15 via-blue-500/5 to-transparent border border-blue-500/10' : 'from-blue-50 via-blue-50/50 to-transparent border border-blue-200/50'}`}>
              <h1 className={`text-2xl md:text-3xl font-bold mb-2 ${tp}`}>Operations Portal</h1>
              <p className={`text-sm ${ts} max-w-xl`}>Project management manuals, field procedures, software guides, templates, and training — organized by project phase.</p>
              <div className="flex items-center gap-4 mt-4">
                <span className={`text-xs ${tm}`}>{totalDocs} documents</span>
                <span className={`text-xs ${tm}`}>•</span>
                <button onClick={() => setView('training')} className="text-xs text-blue-400 hover:text-blue-300 font-medium">🎓 Open Training Center →</button>
              </div>
            </div>

            {/* Project Lifecycle - Phase cards */}
            <h2 className={`text-xs uppercase tracking-[0.2em] font-bold mb-4 ${tm}`}>Project Lifecycle</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {SECTIONS.filter(s => ['preconstruction', 'planning', 'execution', 'monitoring', 'closeout'].includes(s.key)).map(section => {
                const count = getAllDocs(section.subjects).length;
                return (
                  <button key={section.key} onClick={() => openSection(section)} className={`text-left rounded-xl p-5 transition-all ${card}`}>
                    <div className={`w-11 h-11 rounded-xl mb-3 flex items-center justify-center bg-gradient-to-br ${section.color} border ${section.border}`}>
                      <span className="text-xl">{section.icon}</span>
                    </div>
                    <h3 className={`text-sm font-bold mb-1 ${tp}`}>{section.title}</h3>
                    <p className={`text-[11px] ${tm} line-clamp-2`}>{section.desc}</p>
                    <p className={`text-[10px] mt-2 ${tm}`}>{count} document{count !== 1 ? 's' : ''}</p>
                  </button>
                );
              })}
            </div>

            {/* Operations & Tools */}
            <h2 className={`text-xs uppercase tracking-[0.2em] font-bold mb-4 ${tm}`}>Operations & Tools</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-10">
              {SECTIONS.filter(s => ['field', 'software', 'templates', 'purchasing', 'network', 'contacts'].includes(s.key)).map(section => {
                const count = getAllDocs(section.subjects).length;
                return (
                  <button key={section.key} onClick={() => openSection(section)} className={`text-left rounded-xl p-5 transition-all ${card}`}>
                    <div className={`w-11 h-11 rounded-xl mb-3 flex items-center justify-center bg-gradient-to-br ${section.color} border ${section.border}`}>
                      <span className="text-xl">{section.icon}</span>
                    </div>
                    <h3 className={`text-sm font-bold mb-1 ${tp}`}>{section.title}</h3>
                    <p className={`text-[11px] ${tm} line-clamp-2`}>{section.desc}</p>
                    <p className={`text-[10px] mt-2 ${tm}`}>{count} document{count !== 1 ? 's' : ''}</p>
                  </button>
                );
              })}
            </div>

            {/* Quick Access */}
            <h2 className={`text-xs uppercase tracking-[0.2em] font-bold mb-4 ${tm}`}>Quick Access</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { label: 'Training Center', icon: '🎓', action: () => setView('training') },
                { label: 'PM Templates', icon: '📄', action: () => openSection(SECTIONS.find(s => s.key === 'templates')!) },
                { label: 'Autodesk Build Guide', icon: '🏗️', action: () => { const d = getDocs('Build for PMs'); if (d.length) openDoc(d[0]); }},
                { label: 'Accubid CO', icon: '💰', action: () => { const d = getDocs('Accubid CO'); if (d.length) openDoc(d[0]); }},
              ].map(q => (
                <button key={q.label} onClick={q.action} className={`rounded-xl p-4 text-center transition-all ${card}`}>
                  <span className="text-2xl block mb-2">{q.icon}</span>
                  <p className={`text-xs font-semibold ${tp}`}>{q.label}</p>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
