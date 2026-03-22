'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import ImageExt from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';

interface Props {
  content: string;
  onChange: (json: string) => void;
  dark?: boolean;
}

const BTN = 'p-1.5 rounded transition-colors';

export default function RichEditor({ content, onChange, dark = true }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false }),
      ImageExt,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start typing...' }),
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: true }),
      TableRow, TableCell, TableHeader,
    ],
    content: (() => { try { return JSON.parse(content); } catch { return content || ''; } })(),
    onUpdate: ({ editor: e }) => {
      onChange(JSON.stringify(e.getJSON()));
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm max-w-none outline-none min-h-[200px] px-4 py-3 ${dark ? 'prose-invert' : ''} [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-2 [&_ul]:ml-4 [&_ol]:ml-4 [&_li]:mb-1 [&_blockquote]:border-l-4 [&_blockquote]:border-te-teal/40 [&_blockquote]:pl-4 [&_blockquote]:italic [&_hr]:my-4 [&_a]:text-te-teal [&_a]:underline [&_img]:rounded-lg [&_img]:max-w-full [&_table]:w-full [&_table]:border-collapse [&_td]:border [&_td]:px-2 [&_td]:py-1 [&_th]:border [&_th]:px-2 [&_th]:py-1 [&_th]:font-semibold ${dark ? '[&_td]:border-white/10 [&_th]:border-white/10 [&_th]:bg-white/5' : '[&_td]:border-gray-200 [&_th]:border-gray-200 [&_th]:bg-gray-50'}`,
      },
    },
  });

  if (!editor) return null;

  const active = (name: string, attrs?: any) => editor.isActive(name, attrs);
  const btnCls = (isActive: boolean) => `${BTN} ${isActive ? (dark ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-900') : (dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100')}`;

  return (
    <div className={`rounded-xl border overflow-hidden ${dark ? 'border-white/10 bg-white/[0.02]' : 'border-gray-200 bg-white'}`}>
      {/* Toolbar */}
      <div className={`flex flex-wrap items-center gap-0.5 px-2 py-1.5 border-b ${dark ? 'border-white/10 bg-white/[0.03]' : 'border-gray-200 bg-gray-50'}`}>
        {/* Text format */}
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={btnCls(active('bold'))} title="Bold">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btnCls(active('italic'))} title="Italic">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M19 4h-9 M14 20H5 M15 4L9 20" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnCls(active('underline'))} title="Underline">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3 M4 21h16" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btnCls(active('strike'))} title="Strike">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M16 4H9a3 3 0 100 6h6a3 3 0 010 6H8 M4 12h16" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={btnCls(active('highlight'))} title="Highlight">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.5 17a4.5 4.5 0 01-1.44-8.765 4.5 4.5 0 018.302-3.046 3.5 3.5 0 014.504 4.272A4 4 0 0115 17H5.5z" /></svg>
        </button>

        <div className={`w-px h-5 mx-0.5 ${dark ? 'bg-white/10' : 'bg-gray-200'}`} />

        {/* Headings */}
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnCls(active('heading', { level: 1 }))} title="Heading 1">
          <span className="text-xs font-bold w-4 text-center block">H1</span>
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnCls(active('heading', { level: 2 }))} title="Heading 2">
          <span className="text-xs font-bold w-4 text-center block">H2</span>
        </button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnCls(active('heading', { level: 3 }))} title="Heading 3">
          <span className="text-xs font-bold w-4 text-center block">H3</span>
        </button>

        <div className={`w-px h-5 mx-0.5 ${dark ? 'bg-white/10' : 'bg-gray-200'}`} />

        {/* Lists */}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnCls(active('bulletList'))} title="Bullet List">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnCls(active('orderedList'))} title="Numbered List">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10 6h11M10 12h11M10 18h11M4 6V2l-2 2M3 10h2l-2 2.5h2M3 16h2v2H3" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleTaskList().run()} className={btnCls(active('taskList'))} title="Checklist">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
        </button>

        <div className={`w-px h-5 mx-0.5 ${dark ? 'bg-white/10' : 'bg-gray-200'}`} />

        {/* Block types */}
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnCls(active('blockquote'))} title="Quote">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10 11H6a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011 1v3a4 4 0 01-4 4m10-4h-4a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 011 1v3a4 4 0 01-4 4" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btnCls(active('codeBlock'))} title="Code Block">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className={BTN + ` ${dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`} title="Divider">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M5 12h14" /></svg>
        </button>

        <div className={`w-px h-5 mx-0.5 ${dark ? 'bg-white/10' : 'bg-gray-200'}`} />

        {/* Media */}
        <button onClick={() => {
          const url = prompt('Enter image URL:');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} className={BTN + ` ${dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`} title="Insert Image">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </button>
        <button onClick={() => {
          const url = prompt('Enter link URL:');
          if (url) editor.chain().focus().setLink({ href: url, target: '_blank' }).run();
        }} className={btnCls(active('link'))} title="Insert Link">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} className={BTN + ` ${dark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'}`} title="Insert Table">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 10h18M3 14h18M10 3v18M14 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" /></svg>
        </button>

        <div className={`w-px h-5 mx-0.5 ${dark ? 'bg-white/10' : 'bg-gray-200'}`} />

        {/* Align */}
        <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnCls(editor.isActive({ textAlign: 'left' }))} title="Align Left">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M3 12h12M3 18h18" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnCls(editor.isActive({ textAlign: 'center' }))} title="Center">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 6h18M6 12h12M3 18h18" /></svg>
        </button>

        <div className="flex-1" />

        {/* Undo/Redo */}
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={BTN + ` ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} disabled:opacity-30`} title="Undo">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M3 10h10a5 5 0 015 5v2M3 10l4-4m-4 4l4 4" /></svg>
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={BTN + ` ${dark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} disabled:opacity-30`} title="Redo">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4m4 4l-4 4" /></svg>
        </button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} />
    </div>
  );
}
