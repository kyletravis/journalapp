import { useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  folderId?: string; // Optional folder ID
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export function useLocalStorage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load entries and folders from localStorage on mount
  useEffect(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    const storedFolders = localStorage.getItem('journalFolders');

    if (storedEntries) {
      try {
        setEntries(JSON.parse(storedEntries));
      } catch (error) {
        console.error('Error parsing stored entries:', error);
        setEntries([]);
      }
    }

    if (storedFolders) {
      try {
        setFolders(JSON.parse(storedFolders));
      } catch (error) {
        console.error('Error parsing stored folders:', error);
        setFolders([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save entries to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('journalEntries', JSON.stringify(entries));
    }
  }, [entries, isLoaded]);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('journalFolders', JSON.stringify(folders));
    }
  }, [folders, isLoaded]);

  const saveEntry = (entry: JournalEntry) => {
    setEntries((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === entry.id);
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = entry;
        return updated;
      } else {
        // Add new entry
        return [entry, ...prev];
      }
    });
  };

  const deleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const getEntry = (id: string): JournalEntry | undefined => {
    return entries.find((e) => e.id === id);
  };

  const createFolder = (name: string): Folder => {
    const newFolder: Folder = {
      id: Date.now().toString(),
      name,
      createdAt: new Date().toISOString(),
    };
    setFolders((prev) => [newFolder, ...prev]);
    return newFolder;
  };

  const deleteFolder = (id: string) => {
    // Remove folder and move entries back to root (remove folderId)
    setFolders((prev) => prev.filter((f) => f.id !== id));
    setEntries((prev) =>
      prev.map((entry) =>
        entry.folderId === id ? { ...entry, folderId: undefined } : entry
      )
    );
  };

  const renameFolder = (id: string, newName: string) => {
    setFolders((prev) =>
      prev.map((folder) =>
        folder.id === id ? { ...folder, name: newName } : folder
      )
    );
  };

  const moveEntry = (entryId: string, folderId: string | undefined) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, folderId } : entry
      )
    );
  };

  const getEntriesByFolder = (folderId: string | undefined): JournalEntry[] => {
    return entries.filter((entry) => entry.folderId === folderId);
  };

  return {
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
  };
}

