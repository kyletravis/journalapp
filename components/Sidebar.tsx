'use client';

import { useState } from 'react';
import { JournalEntry, Folder } from '@/hooks/useLocalStorage';
import { format } from 'date-fns';
import SearchFilter from './SearchFilter';

interface SidebarProps {
  entries: JournalEntry[];
  filteredEntries: JournalEntry[];
  folders: Folder[];
  selectedEntryId: string | null;
  selectedFolderId: string | undefined;
  onSelectEntry: (id: string) => void;
  onSelectFolder: (id: string | undefined) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
  onCreateFolder: (name: string) => Folder;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, newName: string) => void;
  onMoveEntry: (entryId: string, folderId: string | undefined) => void;
  getEntriesByFolder: (folderId: string | undefined) => JournalEntry[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onResetFilters: () => void;
}

export default function Sidebar({
  entries,
  filteredEntries,
  folders,
  selectedEntryId,
  selectedFolderId,
  onSelectEntry,
  onSelectFolder,
  onNewEntry,
  onDeleteEntry,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onMoveEntry,
  getEntriesByFolder,
  searchQuery,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onResetFilters,
}: SidebarProps) {
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [renamingFolderName, setRenamingFolderName] = useState('');
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName);
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleRenameFolder = (id: string) => {
    if (renamingFolderName.trim()) {
      onRenameFolder(id, renamingFolderName);
      setRenamingFolderId(null);
      setRenamingFolderName('');
    }
  };

  const toggleFolderExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const entriesInSelectedFolder = selectedFolderId
    ? getEntriesByFolder(selectedFolderId)
    : getEntriesByFolder(undefined);

  const rootEntries = getEntriesByFolder(undefined);

  return (
    <div className="w-80 bg-gradient-to-b from-slate-50 to-slate-100 border-r border-slate-200 flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-4">My Journal</h1>
        <button
          onClick={onNewEntry}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          + New Entry
        </button>
      </div>

      {/* Search and Filter */}
      <SearchFilter
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={onStartDateChange}
        onEndDateChange={onEndDateChange}
        onReset={onResetFilters}
      />

      {/* Folders and Entries List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Folder Management Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Folders</h2>
            <button
              onClick={() => setIsCreatingFolder(true)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title="Create new folder"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.5 1.5H4a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V7.5L10.5 1.5z" />
                <path d="M10 8v5m2.5-2.5h-5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </button>
          </div>

          {isCreatingFolder && (
            <div className="mb-3 p-3 bg-white rounded-lg border border-blue-300">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder();
                  if (e.key === 'Escape') {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }
                }}
                placeholder="Folder name..."
                autoFocus
                className="w-full px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleCreateFolder}
                  className="flex-1 px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Create
                </button>
                <button
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  className="flex-1 px-2 py-1 text-sm bg-slate-300 text-slate-700 rounded hover:bg-slate-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* All Entries Folder */}
          <div
            className={`p-3 rounded-lg cursor-pointer transition-all duration-200 mb-2 ${
              selectedFolderId === undefined
                ? 'bg-blue-100 text-blue-700 font-semibold'
                : 'hover:bg-slate-200 text-slate-700'
            }`}
            onClick={() => onSelectFolder(undefined)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                  <path
                    fillRule="evenodd"
                    d="M3 7h14v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm8-5a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">All Entries</span>
              </div>
              <span className="text-xs bg-slate-300 px-2 py-0.5 rounded-full">
                {entries.length}
              </span>
            </div>
          </div>

          {/* Folders List */}
          <div className="space-y-2">
            {folders.map((folder) => {
              const folderEntries = getEntriesByFolder(folder.id);
              const isExpanded = expandedFolders.has(folder.id);
              const isSelected = selectedFolderId === folder.id;
              const isRenaming = renamingFolderId === folder.id;

              return (
                <div key={folder.id}>
                  <div
                    className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      isSelected
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFolderExpanded(folder.id);
                        }}
                        className="flex-shrink-0"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-90' : ''
                          }`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>

                      {isRenaming ? (
                        <input
                          type="text"
                          value={renamingFolderName}
                          onChange={(e) => setRenamingFolderName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleRenameFolder(folder.id);
                            if (e.key === 'Escape') {
                              setRenamingFolderId(null);
                              setRenamingFolderName('');
                            }
                            e.stopPropagation();
                          }}
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          className="flex-1 min-w-0 px-2 py-1 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 flex-shrink-0"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M4 4a2 2 0 012-2h6a1 1 0 00-.757.363l-6 6A1 1 0 004 12.414V16a2 2 0 002 2h12a2 2 0 002-2v-7a1 1 0 00-1-1h-3.757a1 1 0 00-.757.363l-6-6zM12 12.414l6-6V4a1 1 0 00-1-1H10a1 1 0 00-1 1v8.414z" />
                          </svg>
                          <span
                            className="text-sm truncate flex-1 min-w-0"
                            onClick={() => onSelectFolder(folder.id)}
                          >
                            {folder.name}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <span className="text-xs bg-slate-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                        {folderEntries.length}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRenamingFolderId(folder.id);
                          setRenamingFolderName(folder.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-slate-700 transition-opacity p-1"
                        title="Rename folder"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Delete folder "${folder.name}"? Entries will move to root.`)) {
                            onDeleteFolder(folder.id);
                            if (selectedFolderId === folder.id) {
                              onSelectFolder(undefined);
                            }
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity p-1"
                        title="Delete folder"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded Folder Entries */}
                  {isExpanded && (
                    <div className="ml-4 mt-2 space-y-1 border-l-2 border-slate-300 pl-2">
                      {folderEntries.length === 0 ? (
                        <div className="text-xs text-slate-400 py-2">No entries</div>
                      ) : (
                        folderEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className={`group relative p-2 rounded text-sm cursor-pointer transition-all duration-200 ${
                              selectedEntryId === entry.id
                                ? 'bg-blue-50 text-blue-700 font-semibold'
                                : 'hover:bg-slate-200 text-slate-700'
                            }`}
                            onClick={() => onSelectEntry(entry.id)}
                          >
                            <div className="flex justify-between items-start gap-2">
                              <span className="truncate flex-1">{entry.title || 'Untitled'}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (confirm('Are you sure you want to delete this entry?')) {
                                    onDeleteEntry(entry.id);
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity flex-shrink-0"
                                title="Delete entry"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Entries Section */}
        <div>
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
            {selectedFolderId ? 'Folder Entries' : 'All Entries'} ({filteredEntries.length})
          </h2>

          {filteredEntries.length === 0 ? (
            <div className="text-center text-slate-400 mt-8 px-4">
              <p className="text-sm">
                {searchQuery || startDate || endDate
                  ? 'No entries match your search/filter.'
                  : selectedFolderId
                  ? 'No entries in this folder.'
                  : 'No entries yet.'}
              </p>
              <p className="text-xs mt-2">
                {searchQuery || startDate || endDate
                  ? 'Try adjusting your filters.'
                  : 'Create your first journal entry!'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredEntries.map((entry) => (
                <div
                  key={entry.id}
                  className={`group relative p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                    selectedEntryId === entry.id
                      ? 'bg-white shadow-md ring-2 ring-blue-500'
                      : 'bg-white/50 hover:bg-white hover:shadow-md'
                  }`}
                  onClick={() => onSelectEntry(entry.id)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-800 truncate flex-1 pr-2">
                      {entry.title || 'Untitled'}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <select
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => onMoveEntry(entry.id, e.target.value || undefined)}
                        value={entry.folderId || ''}
                        className="text-xs px-2 py-1 border border-slate-300 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Move to folder"
                      >
                        <option value="">Move to root</option>
                        {folders.map((folder) => (
                          <option key={folder.id} value={folder.id}>
                            {folder.name}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('Are you sure you want to delete this entry?')) {
                            onDeleteEntry(entry.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity"
                        title="Delete entry"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">
                    {format(new Date(entry.updatedAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {entry.content.substring(0, 100) || 'No content'}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

