'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { JournalEntry } from '@/hooks/useLocalStorage';

interface MarkdownEditorProps {
  entry: JournalEntry | null;
  onSave: (entry: JournalEntry) => void;
}

export default function MarkdownEditor({ entry, onSave }: MarkdownEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (entry) {
      setTitle(entry.title);
      setContent(entry.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [entry]);

  const handleSave = () => {
    if (!entry) return;

    setIsSaving(true);
    const updatedEntry: JournalEntry = {
      ...entry,
      title: title || 'Untitled',
      content,
      updatedAt: new Date().toISOString(),
    };
    onSave(updatedEntry);

    setTimeout(() => setIsSaving(false), 500);
  };

  // Auto-save on content change
  useEffect(() => {
    if (!entry) return;

    const timeoutId = setTimeout(() => {
      handleSave();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [title, content]);

  if (!entry) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-24 w-24 text-slate-300 dark:text-slate-600 mx-auto mb-4"
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
          <h2 className="text-2xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
            Select an entry or create a new one
          </h2>
          <p className="text-slate-400 dark:text-slate-500">Start journaling to capture your thoughts</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-4 flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title..."
          className="text-2xl font-bold text-slate-800 dark:text-slate-100 bg-transparent border-none outline-none flex-1 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <div className="flex items-center gap-3">
          {isSaving && (
            <span className="text-sm text-slate-400 dark:text-slate-500 animate-pulse">Saving...</span>
          )}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showPreview
                ? 'bg-blue-500 dark:bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900">
        {showPreview ? (
          <div className="h-full overflow-y-auto px-8 py-6">
            <div className="max-w-4xl mx-auto markdown-preview">
              <ReactMarkdown>{content || '*No content yet*'}</ReactMarkdown>
            </div>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your thoughts in markdown...

# Heading 1
## Heading 2

- Bullet point
- Another point

**Bold text** and *italic text*"
            className="w-full h-full px-8 py-6 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 resize-none outline-none font-mono text-base leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-600"
          />
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-8 py-3 text-sm text-slate-500 dark:text-slate-400 flex justify-between">
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

