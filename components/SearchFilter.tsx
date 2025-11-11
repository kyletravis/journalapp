'use client';

import { useState } from 'react';

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onReset: () => void;
}

export default function SearchFilter({
  searchQuery,
  onSearchChange,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  onReset,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchQuery || startDate || endDate;

  return (
    <div className="p-4 border-b border-slate-200 bg-white/50">
      {/* Search Input */}
      <div className="flex gap-2 items-center mb-3">
        <div className="flex-1 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search entries..."
            className="w-full pl-10 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            showFilters || hasActiveFilters
              ? 'bg-blue-100 text-blue-700'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
          title="Toggle filters"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V17a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {/* Filter Options */}
      {showFilters && (
        <div className="space-y-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => onEndDateChange(e.target.value)}
                className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="w-full px-3 py-1.5 text-sm bg-slate-300 hover:bg-slate-400 text-slate-700 font-medium rounded transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Filters active</span>
        </div>
      )}
    </div>
  );
}
