'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { JournalEntry, Category } from '@/hooks/useLocalStorage';

interface MarkdownEditorProps {
  entry: JournalEntry | null;
  categories: Category[];
  onSave: (entry: JournalEntry) => void;
  onAddTag: (entryId: string, tag: string) => void;
  onRemoveTag: (entryId: string, tag: string) => void;
  onSetCategory: (entryId: string, categoryId: string | undefined) => void;
  onCreateCategory: (name: string, color?: string) => void;
}

export default function MarkdownEditor({
  entry,
  categories,
  onSave,
  onAddTag,
  onRemoveTag,
  onSetCategory,
  onCreateCategory,
}: MarkdownEditorProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  const handleAddTag = () => {
    if (!entry || !newTag.trim()) return;
    onAddTag(entry.id, newTag);
    setNewTag('');
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    onCreateCategory(newCategoryName);
    setNewCategoryName('');
    setShowNewCategoryInput(false);
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
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showPreview
                ? 'bg-blue-500 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>

      {/* Tags and Category Metadata */}
      <div className="border-b border-slate-200 bg-slate-50 px-8 py-4">
        {/* Category Selection */}
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-slate-600 min-w-fit">Category:</label>
          <div className="relative">
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                entry?.category
                  ? `text-white`
                  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
              }`}
              style={
                entry?.category
                  ? {
                      backgroundColor:
                        categories.find((c) => c.id === entry.category)?.color || '#94A3B8',
                    }
                  : undefined
              }
            >
              {entry?.category
                ? categories.find((c) => c.id === entry.category)?.name || 'Unknown'
                : 'No category'}
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full mt-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-48">
                <button
                  onClick={() => {
                    onSetCategory(entry!.id, undefined);
                    setShowCategoryDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-700 text-sm"
                >
                  Clear category
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      onSetCategory(entry!.id, category.id);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-2"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
                <div className="border-t border-slate-200 pt-2">
                  <button
                    onClick={() => {
                      setShowNewCategoryInput(true);
                      setShowCategoryDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 text-slate-600 text-sm flex items-center gap-2"
                  >
                    <span>+ New category</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* New Category Input */}
        {showNewCategoryInput && (
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
              placeholder="Category name..."
              className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              autoFocus
            />
            <button
              onClick={handleCreateCategory}
              className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
            >
              Create
            </button>
            <button
              onClick={() => {
                setShowNewCategoryInput(false);
                setNewCategoryName('');
              }}
              className="px-3 py-2 bg-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-300"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Tags */}
        <div className="flex items-start gap-3">
          <label className="text-sm font-medium text-slate-600 min-w-fit mt-2">Tags:</label>
          <div className="flex-1">
            {/* Existing Tags */}
            {entry?.tags && entry.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {entry.tags.map((tag) => (
                  <div
                    key={tag}
                    className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                    <button
                      onClick={() => onRemoveTag(entry.id, tag)}
                      className="hover:text-blue-600 font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Add Tag Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag... (e.g., work, important)"
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
              />
              <button
                onClick={handleAddTag}
                className="px-3 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-hidden">
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
            className="w-full h-full px-8 py-6 text-slate-700 resize-none outline-none font-mono text-base leading-relaxed"
          />
        )}
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

