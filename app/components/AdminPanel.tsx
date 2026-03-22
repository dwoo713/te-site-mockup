'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

const RichEditor = dynamic(() => import('./RichEditor'), { ssr: false });

interface Step { name: string; type: string; content: string }
interface Doc { id: string; name: string; steps: Step[] }
interface Subject { category: string; docs: Doc[] }
interface PortalData { [subjectName: string]: Subject }

interface Props {
  data: PortalData;
  onSave: (data: PortalData) => void;
  dark: boolean;
  activeSubject: string | null;
  activeDoc: string | null;
  activeStep: number;
  onNavigate: (subject: string | null, doc: string | null, step: number) => void;
}

export default function AdminPanel({ data, onSave, dark, activeSubject, activeDoc, activeStep, onNavigate }: Props) {
  const [editingStep, setEditingStep] = useState(false);
  const [showCreateSubject, setShowCreateSubject] = useState(false);
  const [showCreateDoc, setShowCreateDoc] = useState(false);
  const [showCreateStep, setShowCreateStep] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const bg = dark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200';
  const inputCls = `w-full px-3 py-2 rounded-lg text-sm outline-none ${dark ? 'bg-white/5 border border-white/10 text-white focus:border-te-teal' : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-te-teal'}`;
  const btnPrimary = 'px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-te-teal hover:bg-te-teal-light transition-colors';
  const btnDanger = 'px-3 py-1.5 rounded-lg text-xs font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors';
  const btnGhost = `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${dark ? 'text-gray-400 hover:bg-white/5' : 'text-gray-500 hover:bg-gray-100'}`;

  const currentDoc = activeSubject && activeDoc ? data[activeSubject]?.docs.find(d => d.id === activeDoc) : null;
  const currentStep = currentDoc?.steps[activeStep];

  // ── CRUD Operations ────────────────────────────────────────────────

  const addSubject = useCallback(() => {
    if (!newName.trim()) return;
    const updated = { ...data };
    updated[newName.trim()] = { category: newCategory || 'General', docs: [] };
    onSave(updated);
    setShowCreateSubject(false);
    setNewName('');
    setNewCategory('');
    onNavigate(newName.trim(), null, 0);
  }, [data, newName, newCategory, onSave, onNavigate]);

  const deleteSubject = useCallback((name: string) => {
    if (!confirm(`Delete "${name}" and all its documents?`)) return;
    const updated = { ...data };
    delete updated[name];
    onSave(updated);
    if (activeSubject === name) onNavigate(null, null, 0);
  }, [data, onSave, activeSubject, onNavigate]);

  const renameSubject = useCallback((oldName: string, newName: string) => {
    if (!newName.trim() || newName === oldName) { setRenaming(null); return; }
    const updated: PortalData = {};
    Object.entries(data).forEach(([k, v]) => {
      updated[k === oldName ? newName.trim() : k] = v;
    });
    onSave(updated);
    if (activeSubject === oldName) onNavigate(newName.trim(), activeDoc, activeStep);
    setRenaming(null);
  }, [data, onSave, activeSubject, activeDoc, activeStep, onNavigate]);

  const addDocument = useCallback(() => {
    if (!newName.trim() || !activeSubject) return;
    const updated = { ...data };
    const sub = { ...updated[activeSubject] };
    sub.docs = [...sub.docs, { id: `doc_${Date.now()}`, name: newName.trim(), steps: [{ name: 'Introduction', type: 'jsonpm', content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Start writing here..."}]}]}' }] }];
    updated[activeSubject] = sub;
    onSave(updated);
    setShowCreateDoc(false);
    setNewName('');
    onNavigate(activeSubject, sub.docs[sub.docs.length - 1].id, 0);
  }, [data, newName, activeSubject, onSave, onNavigate]);

  const deleteDocument = useCallback((docId: string) => {
    if (!activeSubject || !confirm('Delete this document?')) return;
    const updated = { ...data };
    const sub = { ...updated[activeSubject] };
    sub.docs = sub.docs.filter(d => d.id !== docId);
    updated[activeSubject] = sub;
    onSave(updated);
    if (activeDoc === docId) onNavigate(activeSubject, null, 0);
  }, [data, activeSubject, activeDoc, onSave, onNavigate]);

  const renameDocument = useCallback((docId: string, newDocName: string) => {
    if (!activeSubject || !newDocName.trim()) { setRenaming(null); return; }
    const updated = { ...data };
    const sub = { ...updated[activeSubject] };
    sub.docs = sub.docs.map(d => d.id === docId ? { ...d, name: newDocName.trim() } : d);
    updated[activeSubject] = sub;
    onSave(updated);
    setRenaming(null);
  }, [data, activeSubject, onSave]);

  const addStep = useCallback(() => {
    if (!newName.trim() || !activeSubject || !activeDoc) return;
    const updated = { ...data };
    const sub = { ...updated[activeSubject] };
    sub.docs = sub.docs.map(d => {
      if (d.id !== activeDoc) return d;
      return { ...d, steps: [...d.steps, { name: newName.trim(), type: 'jsonpm', content: '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":""}]}]}' }] };
    });
    updated[activeSubject] = sub;
    onSave(updated);
    setShowCreateStep(false);
    setNewName('');
    const doc = sub.docs.find(d => d.id === activeDoc);
    if (doc) onNavigate(activeSubject, activeDoc, doc.steps.length - 1);
  }, [data, newName, activeSubject, activeDoc, onSave, onNavigate]);

  const deleteStep = useCallback((stepIdx: number) => {
    if (!activeSubject || !activeDoc || !confirm('Delete this step?')) return;
    const updated = { ...data };
    const sub = { ...updated[activeSubject] };
    sub.docs = sub.docs.map(d => {
      if (d.id !== activeDoc) return d;
      const steps = d.steps.filter((_, i) => i !== stepIdx);
      return { ...d, steps: steps.length > 0 ? steps : [{ name: 'Introduction', type: 'jsonpm', content: '{"type":"doc","content":[{"type":"paragraph"}]}' }] };
    });
    updated[activeSubject] = sub;
    onSave(updated);
    if (activeStep >= stepIdx) onNavigate(activeSubject, activeDoc, Math.max(0, activeStep - 1));
  }, [data, activeSubject, activeDoc, activeStep, onSave, onNavigate]);

  const updateStepContent = useCallback((content: string) => {
    if (!activeSubject || !activeDoc) return;
    const updated = { ...data };
    const sub = { ...updated[activeSubject] };
    sub.docs = sub.docs.map(d => {
      if (d.id !== activeDoc) return d;
      const steps = d.steps.map((s, i) => i === activeStep ? { ...s, content } : s);
      return { ...d, steps };
    });
    updated[activeSubject] = sub;
    onSave(updated);
  }, [data, activeSubject, activeDoc, activeStep, onSave]);

  const renameStep = useCallback((stepIdx: number, newStepName: string) => {
    if (!activeSubject || !activeDoc || !newStepName.trim()) { setRenaming(null); return; }
    const updated = { ...data };
    const sub = { ...updated[activeSubject] };
    sub.docs = sub.docs.map(d => {
      if (d.id !== activeDoc) return d;
      const steps = d.steps.map((s, i) => i === stepIdx ? { ...s, name: newStepName.trim() } : s);
      return { ...d, steps };
    });
    updated[activeSubject] = sub;
    onSave(updated);
    setRenaming(null);
  }, [data, activeSubject, activeDoc, onSave]);

  const moveStep = useCallback((from: number, to: number) => {
    if (!activeSubject || !activeDoc) return;
    const updated = { ...data };
    const sub = { ...updated[activeSubject] };
    sub.docs = sub.docs.map(d => {
      if (d.id !== activeDoc) return d;
      const steps = [...d.steps];
      const [item] = steps.splice(from, 1);
      steps.splice(to, 0, item);
      return { ...d, steps };
    });
    updated[activeSubject] = sub;
    onSave(updated);
    onNavigate(activeSubject, activeDoc, to);
  }, [data, activeSubject, activeDoc, onSave, onNavigate]);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <div className={`border-t ${dark ? 'border-white/10 bg-black/30' : 'border-gray-200 bg-gray-50'}`}>
      {/* Admin toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 flex-wrap">
        <span className={`text-[10px] uppercase tracking-wider font-bold ${dark ? 'text-yellow-500' : 'text-yellow-600'}`}>Admin</span>

        <button onClick={() => { setShowCreateSubject(true); setNewName(''); }} className={btnPrimary}>+ Subject</button>

        {activeSubject && (
          <>
            <button onClick={() => { setShowCreateDoc(true); setNewName(''); }} className={btnPrimary}>+ Document</button>
            <button onClick={() => deleteSubject(activeSubject)} className={btnDanger}>Delete Subject</button>
            <button onClick={() => { setRenaming(`subject:${activeSubject}`); setRenameValue(activeSubject); }} className={btnGhost}>Rename Subject</button>
          </>
        )}

        {currentDoc && (
          <>
            <div className={`w-px h-4 ${dark ? 'bg-white/10' : 'bg-gray-300'}`} />
            <button onClick={() => { setShowCreateStep(true); setNewName(''); }} className={btnPrimary}>+ Step</button>
            <button onClick={() => setEditingStep(!editingStep)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${editingStep ? 'bg-yellow-500/20 text-yellow-400' : btnGhost}`}>
              {editingStep ? 'Done Editing' : 'Edit Content'}
            </button>
            <button onClick={() => deleteDocument(currentDoc.id)} className={btnDanger}>Delete Doc</button>
            <button onClick={() => { setRenaming(`doc:${currentDoc.id}`); setRenameValue(currentDoc.name); }} className={btnGhost}>Rename Doc</button>
          </>
        )}

        {currentStep && currentDoc && currentDoc.steps.length > 1 && (
          <>
            <div className={`w-px h-4 ${dark ? 'bg-white/10' : 'bg-gray-300'}`} />
            <button disabled={activeStep === 0} onClick={() => moveStep(activeStep, activeStep - 1)} className={btnGhost + ' disabled:opacity-30'}>↑ Move Up</button>
            <button disabled={activeStep >= currentDoc.steps.length - 1} onClick={() => moveStep(activeStep, activeStep + 1)} className={btnGhost + ' disabled:opacity-30'}>↓ Move Down</button>
            <button onClick={() => deleteStep(activeStep)} className={btnDanger}>Delete Step</button>
            <button onClick={() => { setRenaming(`step:${activeStep}`); setRenameValue(currentStep.name); }} className={btnGhost}>Rename Step</button>
          </>
        )}
      </div>

      {/* Inline forms */}
      {showCreateSubject && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="Subject name..." className={inputCls + ' max-w-xs'}
            onKeyDown={e => e.key === 'Enter' && addSubject()} />
          <input value={newCategory} onChange={e => setNewCategory(e.target.value)} placeholder="Category..." className={inputCls + ' max-w-xs'} />
          <button onClick={addSubject} className={btnPrimary}>Create</button>
          <button onClick={() => setShowCreateSubject(false)} className={btnGhost}>Cancel</button>
        </div>
      )}

      {showCreateDoc && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="Document name..." className={inputCls + ' max-w-xs'}
            onKeyDown={e => e.key === 'Enter' && addDocument()} />
          <button onClick={addDocument} className={btnPrimary}>Create</button>
          <button onClick={() => setShowCreateDoc(false)} className={btnGhost}>Cancel</button>
        </div>
      )}

      {showCreateStep && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <input autoFocus value={newName} onChange={e => setNewName(e.target.value)} placeholder="Step name..." className={inputCls + ' max-w-xs'}
            onKeyDown={e => e.key === 'Enter' && addStep()} />
          <button onClick={addStep} className={btnPrimary}>Create</button>
          <button onClick={() => setShowCreateStep(false)} className={btnGhost}>Cancel</button>
        </div>
      )}

      {renaming && (
        <div className="px-4 pb-3 flex items-center gap-2">
          <input autoFocus value={renameValue} onChange={e => setRenameValue(e.target.value)} className={inputCls + ' max-w-xs'}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                if (renaming.startsWith('subject:')) renameSubject(renaming.replace('subject:', ''), renameValue);
                else if (renaming.startsWith('doc:')) renameDocument(renaming.replace('doc:', ''), renameValue);
                else if (renaming.startsWith('step:')) renameStep(parseInt(renaming.replace('step:', '')), renameValue);
              }
              if (e.key === 'Escape') setRenaming(null);
            }} />
          <button onClick={() => {
            if (renaming.startsWith('subject:')) renameSubject(renaming.replace('subject:', ''), renameValue);
            else if (renaming.startsWith('doc:')) renameDocument(renaming.replace('doc:', ''), renameValue);
            else if (renaming.startsWith('step:')) renameStep(parseInt(renaming.replace('step:', '')), renameValue);
          }} className={btnPrimary}>Save</button>
          <button onClick={() => setRenaming(null)} className={btnGhost}>Cancel</button>
        </div>
      )}

      {/* Rich text editor */}
      {editingStep && currentStep && (
        <div className="px-4 pb-4">
          <RichEditor content={currentStep.content} onChange={updateStepContent} dark={dark} />
        </div>
      )}
    </div>
  );
}
