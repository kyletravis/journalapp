'use client';

import { JournalEntry } from '@/hooks/useLocalStorage';
import { format } from 'date-fns';

interface SidebarProps {
  entries: JournalEntry[];
  selectedEntryId: string | null;
  onSelectEntry: (id: string) => void;
  onNewEntry: () => void;
  onDeleteEntry: (id: string) => void;
}

// Convert sentiment (-1 to 1) to a color gradient from black to blue
function getSentimentColor(sentiment: number): string {
  // Normalize sentiment from [-1, 1] to [0, 1]
  const normalized = (sentiment + 1) / 2;

  // Create a gradient from black (#000000) to blue (#3B82F6)
  // At 0: black, at 1: blue
  const r = Math.round(59 * (1 - normalized)); // 59 = 0x3B
  const g = Math.round(130 * (1 - normalized)); // 130 = 0x82
  const b = Math.round(246 * normalized); // 246 = 0xF6

  return `rgb(${r}, ${g}, ${b})`;
}

export default function Sidebar({
  entries,
  selectedEntryId,
  onSelectEntry,
  onNewEntry,
  onDeleteEntry,
}: SidebarProps) {
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

      {/* Entries List */}
      <div className="flex-1 overflow-y-auto p-4">
        {entries.length === 0 ? (
          <div className="text-center text-slate-400 mt-8 px-4">
            <p className="text-sm">No entries yet.</p>
            <p className="text-xs mt-2">Create your first journal entry!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className={`group relative rounded-lg cursor-pointer transition-all duration-200 overflow-hidden ${
                  selectedEntryId === entry.id
                    ? 'bg-white shadow-md ring-2 ring-blue-500'
                    : 'bg-white/50 hover:bg-white hover:shadow-md'
                }`}
                onClick={() => onSelectEntry(entry.id)}
              >
                {/* Sentiment gradient bar */}
                <div
                  className="h-1 w-full"
                  style={{ backgroundColor: getSentimentColor(entry.sentiment || 0) }}
                />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-800 truncate flex-1 pr-2">
                      {entry.title || 'Untitled'}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Are you sure you want to delete this entry?')) {
                          onDeleteEntry(entry.id);
                        }
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition-opacity duration-200 ml-2"
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
                  <p className="text-xs text-slate-500">
                    {format(new Date(entry.updatedAt), 'MMM d, yyyy')}
                  </p>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {entry.content.substring(0, 100) || 'No content'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

