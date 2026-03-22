'use client';

import { useState, useMemo, useRef, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Step { name: string; type: string; content: string }
interface Doc { id: string; name: string; steps: Step[] }
interface Subject { category: string; docs: Doc[] }
interface PortalData { [subjectName: string]: Subject }
interface Props { title: string; subtitle: string; data: PortalData; accentColor?: string }

// ── ProseMirror Renderer (handles ALL node/mark types) ────────────────────

function PM({ content }: { content: string }) {
  try {
    const doc = JSON.parse(content);
    return <div className="pm-content text-gray-300 text-sm leading-relaxed">{renderNode(doc, 0)}</div>;
  } catch {
    // Fallback: render as plain text
    if (content && content.length > 0 && !content.startsWith('{')) {
      return <p className="text-gray-400 text-sm">{content}</p>;
    }
    return null;
  }
}

function renderNode(node: any, key: number): any {
  if (!node) return null;

  if (node.type === 'text') {
    let el: any = node.text || '';
    (node.marks || []).forEach((m: any, i: number) => {
      switch (m.type) {
        case 'bold': el = <strong key={`m${i}`}>{el}</strong>; break;
        case 'italic': el = <em key={`m${i}`}>{el}</em>; break;
        case 'underline': el = <u key={`m${i}`}>{el}</u>; break;
        case 'strike': el = <s key={`m${i}`}>{el}</s>; break;
        case 'code': el = <code key={`m${i}`} className="bg-white/10 px-1 py-0.5 rounded text-te-teal font-mono text-xs">{el}</code>; break;
        case 'link': el = <a key={`m${i}`} href={m.attrs?.href} target="_blank" rel="noopener noreferrer" className="text-te-teal hover:text-te-teal-light underline underline-offset-2 decoration-te-teal/40">{el}</a>; break;
        case 'deeplink': el = <a key={`m${i}`} href={m.attrs?.href || '#'} className="text-te-teal hover:text-te-teal-light underline underline-offset-2">{el}</a>; break;
        case 'text_highlight': el = <mark key={`m${i}`} className="bg-yellow-500/20 text-yellow-200 px-0.5 rounded">{el}</mark>; break;
        case 'font_color': break; // Skip — we control colors via CSS
      }
    });
    return el;
  }

  const ch = (node.content || []).map((c: any, i: number) => renderNode(c, i));
  const align = node.attrs?.align;
  const alignCls = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';

  switch (node.type) {
    case 'doc': return <>{ch}</>;

    case 'paragraph':
      return <p key={key} className={`mb-3 leading-relaxed min-h-[1em] ${alignCls}`}>{ch.length > 0 ? ch : null}</p>;

    case 'heading': {
      const lvl = node.attrs?.level || 2;
      const styles: Record<number, string> = {
        1: 'text-xl font-bold mt-8 mb-3 text-white border-b border-white/10 pb-2',
        2: 'text-lg font-bold mt-6 mb-3 text-white',
        3: 'text-base font-semibold mt-5 mb-2 text-white',
        4: 'text-sm font-semibold mt-4 mb-2 text-gray-200',
      };
      return <div key={key} className={`${styles[lvl] || styles[3]} ${alignCls}`} role="heading" aria-level={lvl}>{ch}</div>;
    }

    case 'bullet_list':
      return <ul key={key} className="mb-4 space-y-1 ml-4">{ch}</ul>;

    case 'ordered_list':
      return <ol key={key} className="mb-4 space-y-1 ml-4 list-decimal list-outside">{ch}</ol>;

    case 'list_item':
      return (
        <li key={key} className="text-gray-300 pl-1 relative">
          {node.content?.[0]?.type === 'paragraph' ? (
            <span className="before:content-['•'] before:text-te-teal before:mr-2 before:font-bold">
              {(node.content || []).map((c: any, i: number) => {
                if (c.type === 'paragraph') return (c.content || []).map((cc: any, j: number) => renderNode(cc, j));
                return renderNode(c, i);
              })}
            </span>
          ) : ch}
        </li>
      );

    case 'todo_list':
      return <div key={key} className="mb-4 space-y-1.5">{ch}</div>;

    case 'todo_item': {
      const checked = node.attrs?.checked || node.attrs?.done;
      return (
        <div key={key} className="flex items-start gap-2">
          <div className={`w-4 h-4 rounded border mt-0.5 shrink-0 flex items-center justify-center ${checked ? 'bg-te-teal border-te-teal' : 'border-gray-600'}`}>
            {checked && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" d="M5 13l4 4L19 7" /></svg>}
          </div>
          <span className={checked ? 'line-through text-gray-500' : 'text-gray-300'}>{ch}</span>
        </div>
      );
    }

    case 'blockquote':
      return <blockquote key={key} className="border-l-3 border-te-teal/40 pl-4 my-4 italic text-gray-400">{ch}</blockquote>;

    case 'aside':
      return (
        <div key={key} className="rounded-lg p-4 my-4 bg-te-teal/10 border border-te-teal/20">
          <div className="text-gray-200">{ch}</div>
        </div>
      );

    case 'horizontal_rule':
      return <hr key={key} className="border-white/10 my-6" />;

    case 'image':
      return (
        <figure key={key} className="my-4">
          <img src={node.attrs?.src || node.attrs?.asset} alt={node.attrs?.alt || ''} loading="lazy"
            className="rounded-lg max-w-full mx-auto shadow-lg"
            style={node.attrs?.width ? { width: node.attrs.width } : { maxHeight: '500px' }} />
          {node.attrs?.title && <figcaption className="text-center text-xs text-gray-500 mt-2">{node.attrs.title}</figcaption>}
        </figure>
      );

    case 'attachment':
      return (
        <a key={key} href={node.attrs?.url || node.attrs?.href || '#'} target="_blank" rel="noopener"
          className="flex items-center gap-3 rounded-lg p-3 my-2 bg-white/5 border border-white/10 hover:border-te-teal/30 hover:bg-white/8 transition-all group">
          <div className="w-9 h-9 rounded-lg bg-te-teal/15 flex items-center justify-center shrink-0">
            <span className="text-te-teal text-[10px] font-bold uppercase">{(node.attrs?.extension || node.attrs?.name?.split('.').pop() || 'FILE').substring(0, 4)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-200 truncate group-hover:text-white">{node.attrs?.name || node.attrs?.title || 'Attachment'}</p>
            {node.attrs?.filesize && <p className="text-[10px] text-gray-500">{(node.attrs.filesize / 1024).toFixed(0)} KB</p>}
          </div>
          <svg className="w-4 h-4 text-gray-500 group-hover:text-te-teal shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>
      );

    case 'file_viewer':
      return (
        <div key={key} className="rounded-lg p-4 my-3 bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
              <span className="text-red-400 text-xs font-bold">{(node.attrs?.extension || 'PDF').toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{node.attrs?.name || 'Document'}</p>
              <p className="text-[10px] text-gray-500">{(node.attrs?.extension || '').toUpperCase()} {node.attrs?.filesize ? `· ${(node.attrs.filesize / 1024).toFixed(0)} KB` : ''}</p>
            </div>
            {node.attrs?.src && (
              <a href={node.attrs.src} target="_blank" rel="noopener"
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-te-teal bg-te-teal/10 hover:bg-te-teal/20 transition-colors">
                Open
              </a>
            )}
          </div>
        </div>
      );

    case 'embed_frame': case 'embed': {
      const src = node.attrs?.src || node.attrs?.url || '';
      if (!src) return null;
      // YouTube
      const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]+)/);
      if (ytMatch) return (
        <div key={key} className="my-4 aspect-video rounded-lg overflow-hidden border border-white/10">
          <iframe src={`https://www.youtube.com/embed/${ytMatch[1]}`} className="w-full h-full" allowFullScreen />
        </div>
      );
      // Loom
      const loomMatch = src.match(/loom\.com\/(?:share|embed)\/([\w]+)/);
      if (loomMatch) return (
        <div key={key} className="my-4 aspect-video rounded-lg overflow-hidden border border-white/10">
          <iframe src={`https://www.loom.com/embed/${loomMatch[1]}`} className="w-full h-full" allowFullScreen />
        </div>
      );
      // Google Docs/Sheets/Forms
      if (src.includes('google.com') || src.includes('docs.google') || src.includes('forms.gle')) return (
        <div key={key} className="my-4 rounded-lg overflow-hidden border border-white/10" style={{ height: '500px' }}>
          <iframe src={src} className="w-full h-full" allowFullScreen />
        </div>
      );
      // Generic embed
      return (
        <div key={key} className="my-4 aspect-video rounded-lg overflow-hidden border border-white/10">
          <iframe src={src} className="w-full h-full" allowFullScreen />
        </div>
      );
    }

    case 'table':
      return (
        <div key={key} className="overflow-x-auto my-4 rounded-lg border border-white/10">
          <table className="w-full text-sm">{ch}</table>
        </div>
      );
    case 'table_row': return <tr key={key} className="border-b border-white/5 even:bg-white/[0.02]">{ch}</tr>;
    case 'table_cell': return <td key={key} className="px-3 py-2 text-gray-300 text-xs">{ch}</td>;
    case 'table_header': return <th key={key} className="px-3 py-2 text-left text-xs font-semibold text-white bg-white/5">{ch}</th>;

    case 'basic': return <div key={key}>{ch}</div>;

    default:
      return ch.length > 0 ? <div key={key}>{ch}</div> : null;
  }
}

// ── Portal Layout ──────────────────────────────────────────────────────────

export default function Portal({ title, subtitle, data, accentColor = '#16635C' }: Props) {
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

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
        name.toLowerCase().includes(q) ||
        sub.docs.some(d => d.name.toLowerCase().includes(q) || d.steps.some(s => {
          try { const c = JSON.parse(s.content); return JSON.stringify(c).toLowerCase().includes(q); } catch { return false; }
        }))
      ),
    }] as [string, { subjects: [string, Subject][] }]).filter(([, { subjects: s }]) => s.length > 0);
  }, [categories, search]);

  const currentDoc = useMemo(() => {
    if (!activeSubject || !activeDoc) return null;
    return data[activeSubject]?.docs.find(d => d.id === activeDoc) || null;
  }, [data, activeSubject, activeDoc]);

  const currentStep = currentDoc?.steps[activeStep] || null;

  useEffect(() => { contentRef.current?.scrollTo(0, 0); }, [activeDoc, activeStep]);

  // Auto-select first subject
  useEffect(() => { if (!activeSubject && subjects.length > 0) setActiveSubject(subjects[0][0]); }, []);

  const totalDocs = subjects.reduce((s, [, sub]) => s + sub.docs.length, 0);

  return (
    <div className="h-screen flex flex-col bg-te-dark text-white overflow-hidden">
      {/* Header */}
      <header className="glass-nav px-4 py-2.5 flex items-center gap-3 shrink-0 z-20">
        <a href="/" className="shrink-0"><img src="/images/logo.png" alt="TE" className="h-8 w-auto" /></a>
        <div className="hidden sm:block shrink-0">
          <h1 className="text-sm font-bold leading-tight">{title}</h1>
          <p className="text-[10px] text-gray-500">{subtitle}</p>
        </div>

        {/* Breadcrumb */}
        {(activeSubject || activeDoc) && (
          <div className="hidden md:flex items-center gap-1.5 text-[11px] text-gray-500 ml-4 min-w-0">
            <span className="text-gray-600">›</span>
            {activeSubject && <button onClick={() => { setActiveDoc(null); }} className="truncate max-w-[150px] hover:text-gray-300">{activeSubject}</button>}
            {currentDoc && <><span className="text-gray-600">›</span><span className="text-gray-300 truncate max-w-[200px]">{currentDoc.name}</span></>}
          </div>
        )}

        <div className="flex-1" />

        <div className="relative w-56">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="M21 21l-4.35-4.35" /></svg>
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
            className="w-full glass rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-te-teal" />
        </div>

        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 md:hidden">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <a href="/" className="text-[11px] text-gray-500 hover:text-te-teal hidden md:block shrink-0">← Site</a>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-64 shrink-0 overflow-y-auto border-r border-white/5 bg-black/30">
            <nav className="p-2 space-y-0.5">
              {filteredCategories.map(([cat, { subjects: subs }]) => (
                <div key={cat} className="mb-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-bold px-2 py-1">{cat}</p>
                  {subs.map(([name, sub]) => (
                    <div key={name}>
                      <button onClick={() => setActiveSubject(activeSubject === name ? null : name)}
                        className={`w-full text-left px-2 py-1.5 rounded-md text-xs transition-all flex items-center gap-1.5 ${activeSubject === name ? 'bg-white/8 text-white font-medium' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}>
                        <svg className={`w-3 h-3 shrink-0 transition-transform duration-200 ${activeSubject === name ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
                        <span className="truncate flex-1">{name}</span>
                        <span className="text-[9px] text-gray-600 tabular-nums">{sub.docs.length}</span>
                      </button>

                      {activeSubject === name && (
                        <div className="ml-4 mt-0.5 space-y-px border-l border-white/5 pl-2">
                          {sub.docs.map(doc => {
                            const isActive = activeDoc === doc.id;
                            return (
                              <button key={doc.id} onClick={() => { setActiveDoc(doc.id); setActiveStep(0); }}
                                className={`w-full text-left px-2 py-1 rounded text-[11px] transition-all truncate block ${isActive ? 'bg-white/10 text-white font-medium' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                                {doc.name}
                                {doc.steps.length > 1 && <span className="text-gray-600 ml-1">({doc.steps.length})</span>}
                              </button>
                            );
                          })}
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
        <main ref={contentRef} className="flex-1 overflow-y-auto bg-gradient-to-br from-te-dark to-gray-950">
          {currentDoc ? (
            <div className="max-w-3xl mx-auto px-6 py-8">
              {/* Doc header */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: accentColor }}>{activeSubject}</p>
                <h2 className="text-2xl font-bold text-white">{currentDoc.name}</h2>
                {currentDoc.steps.length > 1 && (
                  <p className="text-xs text-gray-500 mt-1">{currentDoc.steps.length} sections</p>
                )}
              </div>

              {/* Step tabs — scrollable */}
              {currentDoc.steps.length > 1 && (
                <div className="flex gap-1 mb-6 overflow-x-auto pb-2 -mx-2 px-2">
                  {currentDoc.steps.map((step, i) => (
                    <button key={i} onClick={() => setActiveStep(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all shrink-0 ${activeStep === i ? 'text-white font-medium shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                      style={activeStep === i ? { backgroundColor: `${accentColor}30`, boxShadow: `0 0 12px ${accentColor}20` } : {}}>
                      {step.name || `Section ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Step content */}
              {currentStep && (
                <div className="rounded-xl bg-white/[0.02] border border-white/5 p-6">
                  {currentStep.name && currentDoc.steps.length > 1 && (
                    <h3 className="text-lg font-semibold text-white mb-4 pb-3 border-b border-white/5">{currentStep.name}</h3>
                  )}
                  <PM content={currentStep.content} />
                </div>
              )}

              {/* Prev/Next */}
              {currentDoc.steps.length > 1 && (
                <div className="flex items-center justify-between mt-8 pt-4 border-t border-white/5">
                  <button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all flex items-center gap-1.5">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M15 19l-7-7 7-7" /></svg>
                    {activeStep > 0 ? currentDoc.steps[activeStep - 1].name || 'Previous' : 'Previous'}
                  </button>
                  <span className="text-[10px] text-gray-600 tabular-nums">{activeStep + 1} / {currentDoc.steps.length}</span>
                  <button disabled={activeStep >= currentDoc.steps.length - 1} onClick={() => setActiveStep(s => s + 1)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 disabled:opacity-20 transition-all flex items-center gap-1.5">
                    {activeStep < currentDoc.steps.length - 1 ? currentDoc.steps[activeStep + 1].name || 'Next' : 'Next'}
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              )}
            </div>
          ) : activeSubject ? (
            /* Subject overview — show all docs as cards */
            <div className="max-w-4xl mx-auto px-6 py-8">
              <h2 className="text-xl font-bold mb-6">{activeSubject}</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {data[activeSubject]?.docs.map(doc => (
                  <button key={doc.id} onClick={() => { setActiveDoc(doc.id); setActiveStep(0); }}
                    className="text-left glass-card rounded-xl p-4 group">
                    <h3 className="text-sm font-semibold text-white group-hover:text-te-teal transition-colors mb-1">{doc.name}</h3>
                    <p className="text-[11px] text-gray-500">{doc.steps.length} section{doc.steps.length !== 1 ? 's' : ''}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Landing */
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-lg px-6">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${accentColor}15` }}>
                  <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">{title}</h2>
                <p className="text-sm text-gray-500 mb-2">{subtitle}</p>
                <p className="text-xs text-gray-600 mb-8">Select a topic from the sidebar to get started</p>
                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  <div className="glass rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold" style={{ color: accentColor }}>{totalDocs}</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Documents</p>
                  </div>
                  <div className="glass rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold" style={{ color: accentColor }}>{categories.length}</p>
                    <p className="text-[9px] text-gray-500 uppercase tracking-wider">Categories</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
