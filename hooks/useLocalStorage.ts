import { useState, useEffect } from 'react';

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  folderId?: string; // Optional folder ID
  tags: string[]; // Tags for organization
  category?: string; // Optional category
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Color for UI display
  createdAt: string;
}

const DEFAULT_COLORS = [
  '#EF4444', // red
  '#F97316', // orange
  '#EAB308', // yellow
  '#22C55E', // green
  '#06B6D4', // cyan
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
];

export function useLocalStorage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load entries, folders, and categories from localStorage on mount
  useEffect(() => {
    const storedEntries = localStorage.getItem('journalEntries');
    const storedFolders = localStorage.getItem('journalFolders');
    const storedCategories = localStorage.getItem('journalCategories');

    if (storedEntries) {
      try {
        const parsed = JSON.parse(storedEntries);
        // Ensure all entries have tags and category fields
        const normalized = parsed.map((entry: JournalEntry) => ({
          ...entry,
          tags: entry.tags || [],
          category: entry.category || undefined,
        }));
        setEntries(normalized);
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

    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch (error) {
        console.error('Error parsing stored categories:', error);
        setCategories([]);
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

  // Save categories to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('journalCategories', JSON.stringify(categories));
    }
  }, [categories, isLoaded]);

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

  const addTagToEntry = (entryId: string, tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    if (!normalizedTag) return;

    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === entryId && !entry.tags.includes(normalizedTag)) {
          return { ...entry, tags: [...entry.tags, normalizedTag] };
        }
        return entry;
      })
    );
  };

  const removeTagFromEntry = (entryId: string, tag: string) => {
    const normalizedTag = tag.toLowerCase().trim();
    setEntries((prev) =>
      prev.map((entry) => {
        if (entry.id === entryId) {
          return { ...entry, tags: entry.tags.filter((t) => t !== normalizedTag) };
        }
        return entry;
      })
    );
  };

  const setEntryCategory = (entryId: string, categoryId: string | undefined) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === entryId ? { ...entry, category: categoryId } : entry
      )
    );
  };

  const createCategory = (name: string, color?: string): Category => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color: color || DEFAULT_COLORS[categories.length % DEFAULT_COLORS.length],
      createdAt: new Date().toISOString(),
    };
    setCategories((prev) => [newCategory, ...prev]);
    return newCategory;
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    // Remove category from all entries using it
    setEntries((prev) =>
      prev.map((entry) =>
        entry.category === id ? { ...entry, category: undefined } : entry
      )
    );
  };

  const renameCategory = (id: string, newName: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, name: newName } : category
      )
    );
  };

  const updateCategoryColor = (id: string, color: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, color } : category
      )
    );
  };

  const getEntriesByTag = (tag: string): JournalEntry[] => {
    const normalizedTag = tag.toLowerCase().trim();
    return entries.filter((entry) => entry.tags.includes(normalizedTag));
  };

  const getEntriesByCategory = (categoryId: string): JournalEntry[] => {
    return entries.filter((entry) => entry.category === categoryId);
  };

  const getAllTags = (): string[] => {
    const tagsSet = new Set<string>();
    entries.forEach((entry) => {
      entry.tags.forEach((tag) => tagsSet.add(tag));
    });
    return Array.from(tagsSet).sort();
  };

  return {
    entries,
    folders,
    categories,
    saveEntry,
    deleteEntry,
    getEntry,
    createFolder,
    deleteFolder,
    renameFolder,
    moveEntry,
    getEntriesByFolder,
    addTagToEntry,
    removeTagFromEntry,
    setEntryCategory,
    createCategory,
    deleteCategory,
    renameCategory,
    updateCategoryColor,
    getEntriesByTag,
    getEntriesByCategory,
    getAllTags,
    isLoaded,
  };
}

