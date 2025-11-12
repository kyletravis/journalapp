import { useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  folderId?: string; // Optional folder ID
  sentiment?: number; // -1 (negative) to 1 (positive)
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

// Sentiment analysis function for automatic color coding
function analyzeSentiment(text: string): number {
  const positiveWords = [
    'happy', 'good', 'great', 'wonderful', 'excellent', 'amazing', 'awesome',
    'love', 'loved', 'fantastic', 'brilliant', 'perfect', 'beautiful', 'grateful',
    'thankful', 'blessed', 'joy', 'joyful', 'excited', 'proud', 'success',
    'accomplished', 'brilliant', 'delighted', 'pleased', 'wonderful', 'great',
    'awesome', 'superb', 'outstanding', 'epic', 'incredible', 'wonderful'
  ];

  const negativeWords = [
    'sad', 'bad', 'terrible', 'awful', 'horrible', 'hate', 'hated', 'angry',
    'frustrated', 'disappointed', 'depressed', 'miserable', 'anxious', 'worried',
    'stressed', 'scared', 'fear', 'afraid', 'failed', 'failure', 'waste', 'lost',
    'struggle', 'pain', 'hurt', 'annoyed', 'upset', 'useless', 'stupid', 'awful',
    'disgusting', 'pathetic', 'difficult', 'crisis'
  ];

  const lowerText = text.toLowerCase();
  const words = lowerText.match(/\b\w+\b/g) || [];

  let positiveCount = 0;
  let negativeCount = 0;

  words.forEach((word) => {
    if (positiveWords.includes(word)) positiveCount++;
    if (negativeWords.includes(word)) negativeCount++;
  });

  const totalSentimentWords = positiveCount + negativeCount;
  if (totalSentimentWords === 0) return 0; // Neutral if no sentiment words found

  // Calculate sentiment score between -1 and 1
  const sentiment = (positiveCount - negativeCount) / totalSentimentWords;
  return Math.max(-1, Math.min(1, sentiment));
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
    // Compute sentiment based on title and content
    const sentiment = analyzeSentiment(entry.title + ' ' + entry.content);
    const entryWithSentiment = { ...entry, sentiment };

    setEntries((prev) => {
      const existingIndex = prev.findIndex((e) => e.id === entry.id);
      if (existingIndex >= 0) {
        // Update existing entry
        const updated = [...prev];
        updated[existingIndex] = entryWithSentiment;
        return updated;
      } else {
        // Add new entry
        return [entryWithSentiment, ...prev];
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

