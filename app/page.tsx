'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import { useLocalStorage, JournalEntry } from '@/hooks/useLocalStorage';

export default function Home() {
  const {
    entries,
    folders,
    saveEntry,
    deleteEntry,
    getEntry,
    createFolder,
    deleteFolder,
    renameFolder,
    moveEntry,
    getEntriesByFolder,
    isLoaded,
  } = useLocalStorage();
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (selectedEntryId) {
      const entry = getEntry(selectedEntryId);
      setSelectedEntry(entry || null);
    }
  }, [selectedEntryId, entries, getEntry]);

  const handleNewEntry = () => {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: 'Untitled',
      content: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      folderId: selectedFolderId,
    };
    saveEntry(newEntry);
    setSelectedEntryId(newEntry.id);
  };

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
  };

  const handleDeleteEntry = (id: string) => {
    deleteEntry(id);
    if (selectedEntryId === id) {
      setSelectedEntryId(null);
      setSelectedEntry(null);
    }
  };

  const handleSaveEntry = (entry: JournalEntry) => {
    saveEntry(entry);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        entries={entries}
        folders={folders}
        selectedEntryId={selectedEntryId}
        selectedFolderId={selectedFolderId}
        onSelectEntry={handleSelectEntry}
        onSelectFolder={setSelectedFolderId}
        onNewEntry={handleNewEntry}
        onDeleteEntry={handleDeleteEntry}
        onCreateFolder={createFolder}
        onDeleteFolder={deleteFolder}
        onRenameFolder={renameFolder}
        onMoveEntry={moveEntry}
        getEntriesByFolder={getEntriesByFolder}
      />
      <MarkdownEditor entry={selectedEntry} onSave={handleSaveEntry} />
    </div>
  );
}

