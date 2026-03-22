'use client';

import { useState, useMemo, useRef, useEffect } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────

interface Step {
  name: string;
  text: string;
  media: { type: string; url: string; name?: string; alt?: string }[];
  rawContent: string;
}

interface Doc {
  id: string;
  name: string;
  steps: Step[];
}

interface Subject {
  category: string;
  docs: Doc[];
}

interface PortalData {
  [subjectName: string]: Subject;
}

interface Props {
  title: string;
  subtitle: string;
  data: PortalData;
  accentColor?: string;
}

// ── ProseMirror JSON → HTML renderer ───────────────────────────────────────

function renderPMNode(node: any, key: number = 0): any {
  if (!node) return null;

  // Text node
  if (node.type === 'text') {
    let el: any = node.text || '';
    const marks = node.marks || [];
    for (const mark of marks) {
      if (mark.type === 'bold') el = <strong key={key}>{el}</strong>;
      if (mark.type === 'italic') el = <em key={key}>{el}</em>;
      if (mark.type === 'underline') el = <u key={key}>{el}</u>;
      if (mark.type === 'strike') el = <s key={key}>{el}</s>;
      if (mark.type === 'code') el = <code key={key} className="bg-white/10 px-1.5 py-0.5 rounded text-te-teal font-mono text-sm">{el}</code>;
      if (mark.type === 'link') el = <a key={key} href={mark.attrs?.href} target="_blank" rel="noopener noreferrer" className="text-te-teal hover:text-te-teal-light underline underline-offset-2">{el}</a>;
      if (mark.type === 'highlight') el = <mark key={key} className="bg-yellow-500/20 text-yellow-200 px-0.5 rounded">{el}</mark>;
    }
    return el;
  }

  const children = (node.content || []).map((child: any, i: number) => renderPMNode(child, i));

  switch (node.type) {
    case 'doc': return <>{children}</>;
    case 'paragraph': {
      const align = node.attrs?.align;
      return <p key={key} className={`mb-3 leading-relaxed ${align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : ''}`}>{children.length > 0 ? children : '\u00A0'}</p>;
    }
    case 'heading': {
      const level = node.attrs?.level || 2;
      const cls = level === 1 ? 'text-2xl font-bold mt-8 mb-4 text-white' : level === 2 ? 'text-xl font-bold mt-6 mb-3 text-white' : 'text-lg font-semibold mt-5 mb-2 text-white';
      const Tag = `h${level}` as any;
      return <Tag key={key} className={cls}>{children}</Tag>;
    }
    case 'bullet_list': return <ul key={key} className="list-disc list-inside mb-4 space-y-1.5 ml-2">{children}</ul>;
    case 'ordered_list': return <ol key={key} className="list-decimal list-inside mb-4 space-y-1.5 ml-2">{children}</ol>;
    case 'list_item': return <li key={key} className="text-gray-300">{children}</li>;
    case 'blockquote': return <blockquote key={key} className="border-l-4 border-te-teal/40 pl-4 my-4 italic text-gray-400">{children}</blockquote>;
    case 'code_block': return <pre key={key} className="glass rounded-lg p-4 my-4 overflow-x-auto"><code className="text-sm text-green-400 font-mono">{children}</code></pre>;
    case 'horizontal_rule': return <hr key={key} className="border-white/10 my-6" />;
    case 'image': return (
      <figure key={key} className="my-4">
        <img src={node.attrs?.src} alt={node.attrs?.alt || ''} className="rounded-lg max-w-full mx-auto" style={node.attrs?.width ? { width: node.attrs.width } : {}} />
        {node.attrs?.alt && <figcaption className="text-center text-xs text-gray-500 mt-2">{node.attrs.alt}</figcaption>}
      </figure>
    );
    case 'file_viewer': return (
      <div key={key} className="glass rounded-lg p-4 my-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-te-teal/20 flex items-center justify-center shrink-0">
          <span className="text-te-teal text-xs font-bold uppercase">{(node.attrs?.extension || 'PDF').toUpperCase()}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-white truncate">{node.attrs?.name || 'Document'}</p>
          <p className="text-xs text-gray-500">{node.attrs?.extension?.toUpperCase()} {node.attrs?.filesize ? `· ${(node.attrs.filesize / 1024).toFixed(0)}KB` : ''}</p>
        </div>
        {node.attrs?.src && (
          <a href={node.attrs.src} target="_blank" rel="noopener" className="glass-teal px-3 py-1.5 rounded-lg text-xs font-medium text-white hover:scale-105 transition-transform">View</a>
        )}
      </div>
    );
    case 'video': case 'embed': {
      const src = node.attrs?.src || '';
      if (src.includes('youtube') || src.includes('youtu.be')) {
        const vid = src.match(/(?:v=|youtu\.be\/)([\w-]+)/)?.[1];
        return vid ? (
          <div key={key} className="my-4 aspect-video rounded-lg overflow-hidden glass">
            <iframe src={`https://www.youtube.com/embed/${vid}`} className="w-full h-full" allowFullScreen />
          </div>
        ) : null;
      }
      if (src.includes('loom.com')) {
        const loomId = src.match(/share\/([\w]+)/)?.[1];
        return loomId ? (
          <div key={key} className="my-4 aspect-video rounded-lg overflow-hidden glass">
            <iframe src={`https://www.loom.com/embed/${loomId}`} className="w-full h-full" allowFullScreen />
          </div>
        ) : null;
      }
      return src ? (
        <div key={key} className="my-4 aspect-video rounded-lg overflow-hidden glass">
          <iframe src={src} className="w-full h-full" allowFullScreen />
        </div>
      ) : null;
    }
    case 'aside': return (
      <div key={key} className="glass-teal rounded-lg p-4 my-4 border-l-4 border-te-teal">
        {children}
      </div>
    );
    case 'table': return <div key={key} className="overflow-x-auto my-4"><table className="w-full text-sm">{children}</table></div>;
    case 'table_row': return <tr key={key} className="border-b border-white/5">{children}</tr>;
    case 'table_cell': return <td key={key} className="px-3 py-2 text-gray-300">{children}</td>;
    case 'table_header': return <th key={key} className="px-3 py-2 text-left font-semibold text-white bg-white/5">{children}</th>;
    default: return children.length > 0 ? <div key={key}>{children}</div> : null;
  }
}

function RichContent({ rawContent }: { rawContent: string }) {
  try {
    const doc = JSON.parse(rawContent);
    return <div className="text-gray-300 text-sm leading-relaxed">{renderPMNode(doc)}</div>;
  } catch {
    return null;
  }
}

// ── Portal Component ───────────────────────────────────────────────────────

export default function Portal({ title, subtitle, data, accentColor = '#16635C' }: Props) {
  const [search, setSearch] = useState('');
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const subjects = Object.entries(data);

  // Group subjects by category
  const categories = useMemo(() => {
    const cats: Record<string, { name: string; subjects: [string, Subject][] }> = {};
    subjects.forEach(([name, sub]) => {
      const cat = sub.category || 'General';
      if (!cats[cat]) cats[cat] = { name: cat, subjects: [] };
      cats[cat].subjects.push([name, sub]);
    });
    return Object.values(cats);
  }, [subjects]);

  // Search filter
  const filteredCategories = useMemo(() => {
    if (!search.trim()) return categories;
    const q = search.toLowerCase();
    return categories.map(cat => ({
      ...cat,
      subjects: cat.subjects.filter(([name, sub]) =>
        name.toLowerCase().includes(q) ||
        sub.docs.some(d => d.name.toLowerCase().includes(q) || d.steps.some(s => s.text.toLowerCase().includes(q)))
      ),
    })).filter(cat => cat.subjects.length > 0);
  }, [categories, search]);

  // Active document
  const currentDoc = useMemo(() => {
    if (!activeSubject || !activeDoc) return null;
    const sub = data[activeSubject];
    return sub?.docs.find(d => d.id === activeDoc) || null;
  }, [data, activeSubject, activeDoc]);

  const currentStep = currentDoc?.steps[activeStep] || null;

  // Auto-open first subject
  useEffect(() => {
    if (!activeSubject && subjects.length > 0) {
      setActiveSubject(subjects[0][0]);
    }
  }, [subjects, activeSubject]);

  // Scroll to top on doc/step change
  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [activeDoc, activeStep]);

  const totalDocs = subjects.reduce((s, [, sub]) => s + sub.docs.length, 0);
  const totalSteps = subjects.reduce((s, [, sub]) => s + sub.docs.reduce((ss, d) => ss + d.steps.length, 0), 0);

  return (
    <div className="h-screen flex flex-col bg-te-dark text-white">
      {/* Header */}
      <header className="glass-nav px-4 py-3 flex items-center gap-4 shrink-0 z-20">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <img src="/images/logo.png" alt="TE" className="h-8 w-auto" />
        </a>
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-bold truncate">{title}</h1>
          <p className="text-[10px] text-gray-500">{subtitle} · {totalDocs} docs · {totalSteps} sections</p>
        </div>
        <div className="relative w-64">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search documents..."
            className="w-full glass rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none focus:ring-1 focus:ring-te-teal" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white text-xs">✕</button>
          )}
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 text-gray-400 hover:text-white md:hidden">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
        <a href="/" className="text-xs text-gray-500 hover:text-te-teal transition-colors hidden md:block">← Back to Site</a>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} shrink-0 overflow-y-auto transition-all duration-200 border-r border-white/5 bg-black/20`}>
          <div className="p-3 space-y-1">
            {filteredCategories.map(cat => (
              <div key={cat.name} className="mb-4">
                <p className="text-[9px] uppercase tracking-[0.2em] text-gray-600 font-semibold px-2 mb-1.5">{cat.name}</p>
                {cat.subjects.map(([name, sub]) => (
                  <div key={name}>
                    <button onClick={() => setActiveSubject(activeSubject === name ? null : name)}
                      className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-2 ${activeSubject === name ? 'bg-white/5 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                      <svg className={`w-3 h-3 shrink-0 transition-transform ${activeSubject === name ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" d="M9 5l7 7-7 7" />
                      </svg>
                      <span className="truncate">{name}</span>
                      <span className="ml-auto text-[9px] text-gray-600">{sub.docs.length}</span>
                    </button>

                    {activeSubject === name && (
                      <div className="ml-5 mt-0.5 space-y-0.5">
                        {sub.docs.map(doc => (
                          <button key={doc.id} onClick={() => { setActiveDoc(doc.id); setActiveStep(0); }}
                            className={`w-full text-left px-2 py-1 rounded text-[11px] transition-colors truncate ${activeDoc === doc.id ? 'text-white font-medium' : 'text-gray-500 hover:text-gray-300'}`}
                            style={activeDoc === doc.id ? { backgroundColor: `${accentColor}20` } : {}}>
                            {doc.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main ref={contentRef} className="flex-1 overflow-y-auto">
          {currentDoc ? (
            <div className="max-w-4xl mx-auto px-6 py-8">
              {/* Doc title */}
              <div className="mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-1">{activeSubject}</p>
                <h2 className="text-2xl font-bold">{currentDoc.name}</h2>
              </div>

              {/* Step tabs */}
              {currentDoc.steps.length > 1 && (
                <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-2 border-b border-white/5">
                  {currentDoc.steps.map((step, i) => (
                    <button key={i} onClick={() => setActiveStep(i)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${activeStep === i ? 'text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
                      style={activeStep === i ? { backgroundColor: `${accentColor}30`, color: 'white' } : {}}>
                      {step.name || `Section ${i + 1}`}
                    </button>
                  ))}
                </div>
              )}

              {/* Step content */}
              {currentStep && (
                <div>
                  {currentStep.name && currentDoc.steps.length <= 1 && (
                    <h3 className="text-lg font-semibold mb-4">{currentStep.name}</h3>
                  )}
                  <RichContent rawContent={currentStep.rawContent} />
                </div>
              )}

              {/* Step navigation */}
              {currentDoc.steps.length > 1 && (
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-white/5">
                  <button disabled={activeStep === 0} onClick={() => setActiveStep(s => s - 1)}
                    className="glass px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-30 hover:bg-white/10 transition-colors">
                    ← Previous
                  </button>
                  <span className="text-xs text-gray-600">{activeStep + 1} / {currentDoc.steps.length}</span>
                  <button disabled={activeStep >= currentDoc.steps.length - 1} onClick={() => setActiveStep(s => s + 1)}
                    className="glass px-4 py-2 rounded-lg text-xs font-medium disabled:opacity-30 hover:bg-white/10 transition-colors">
                    Next →
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Landing / no doc selected */
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md px-6">
                <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
                  <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-2">{title}</h2>
                <p className="text-sm text-gray-500 mb-6">{subtitle}</p>
                <p className="text-xs text-gray-600">Select a document from the sidebar to get started</p>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    [String(totalDocs), 'Documents'],
                    [String(totalSteps), 'Sections'],
                    [String(categories.length), 'Categories'],
                  ].map(([n, l]) => (
                    <div key={l} className="glass rounded-lg p-3 text-center">
                      <p className="text-lg font-bold" style={{ color: accentColor }}>{n}</p>
                      <p className="text-[9px] text-gray-500 uppercase tracking-wider">{l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
