'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import { useState, useEffect } from 'react';
import { JournalEntry } from '@/hooks/useLocalStorage';

interface RichTextEditorProps {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
}

// Toolbar Button Component
function ToolbarButton({
  onClick,
  isActive,
  icon,
  title,
}: {
  onClick: () => void;
  isActive: boolean;
  icon: string;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-md transition-colors ${
        isActive
          ? 'bg-blue-500 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      }`}
    >
      {icon}
    </button>
  );
}

export default function RichTextEditor({ entry, onSave }: RichTextEditorProps) {
  const [title, setTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          languageClassPrefix: 'language-',
        },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
    ],
    content: '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none focus:outline-none h-full overflow-y-auto px-8 py-6',
      },
    },
  });

  // Initialize editor with entry content
  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      if (editor) {
        editor.commands.setContent(entry.content || '');
      }
    } else {
      setTitle('');
      if (editor) {
        editor.commands.setContent('');
      }
    }
  }, [entry, editor]);

  // Auto-save on content change
  useEffect(() => {
    if (!entry || !editor) return;

    const timeoutId = setTimeout(() => {
      const content = editor.getHTML();
      setIsSaving(true);

      const updatedEntry: JournalEntry = {
        ...entry,
        title: title || 'Untitled',
        content,
        updatedAt: new Date().toISOString(),
      };
      onSave(updatedEntry);

      setTimeout(() => setIsSaving(false), 500);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title, editor?.getHTML()]);

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-slate-300 mx-auto mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-slate-600 mb-2">
            Select an entry or create a new one
          </h2>
          <p className="text-slate-400">Start journaling to capture your thoughts</p>
        </div>
      </div>
    );
  }

  if (!editor) {
    return <div className="flex-1 flex items-center justify-center">Loading editor...</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-8 py-4 flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title..."
          className="text-2xl font-bold text-slate-800 bg-transparent border-none outline-none flex-1"
        />
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-sm text-slate-400 animate-pulse">Saving...</span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="border-b border-slate-200 bg-slate-50 px-8 py-3 flex flex-wrap gap-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          icon="B"
          title="Bold (Ctrl+B)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          icon="I"
          title="Italic (Ctrl+I)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          icon="U"
          title="Underline (Ctrl+U)"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          icon="S"
          title="Strikethrough"
        />

        <div className="border-l border-slate-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          icon="H1"
          title="Heading 1"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          icon="H2"
          title="Heading 2"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          icon="H3"
          title="Heading 3"
        />

        <div className="border-l border-slate-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          icon="•"
          title="Bullet List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          icon="1."
          title="Ordered List"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          icon='" "'
          title="Blockquote"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          icon="</>"
          title="Code Block"
        />

        <div className="border-l border-slate-300 mx-1"></div>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
          icon="—"
          title="Horizontal Line"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
          icon="↶"
          title="Undo"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
          icon="↷"
          title="Redo"
        />
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden bg-white">
        <EditorContent editor={editor} className="h-full" />
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-200 bg-slate-50 px-8 py-3 text-sm text-slate-500 flex justify-between">
        <span>
          Created: {new Date(entry.createdAt).toLocaleDateString()} at{' '}
          {new Date(entry.createdAt).toLocaleTimeString()}
        </span>
        <span>
          Last updated: {new Date(entry.updatedAt).toLocaleDateString()} at{' '}
          {new Date(entry.updatedAt).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
