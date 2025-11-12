'use client';

import { useState, useEffect, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import MarkdownEditor from '@/components/MarkdownEditor';
import ThemeToggle from '@/components/ThemeToggle';
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

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (selectedEntryId) {
      const entry = getEntry(selectedEntryId);
      setSelectedEntry(entry || null);
    }
  }, [selectedEntryId, entries, getEntry]);

  // Filter entries based on search query and date range
  const filteredEntries = useMemo(() => {
    let result = entries;

    // Filter by folder
    result = result.filter(
      (entry) =>
        (selectedFolderId === undefined && !entry.folderId) ||
        entry.folderId === selectedFolderId
    );

    // Filter by search query (title and content)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          entry.content.toLowerCase().includes(query)
      );
    }

    // Filter by start date
    if (startDate) {
      const start = new Date(startDate);
      result = result.filter((entry) => new Date(entry.createdAt) >= start);
    }

    // Filter by end date
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include entire end day
      result = result.filter((entry) => new Date(entry.createdAt) <= end);
    }

    return result;
  }, [entries, selectedFolderId, searchQuery, startDate, endDate]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
  };

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
      <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-slate-600 dark:text-slate-300">Loading your journal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar
        entries={entries}
        filteredEntries={filteredEntries}
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
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onResetFilters={handleResetFilters}
      />
      <MarkdownEditor entry={selectedEntry} onSave={handleSaveEntry} />
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>
    </div>
  );
}

