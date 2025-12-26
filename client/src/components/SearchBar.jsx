/**
 * SearchBar Component - Compact LeetCode Style
 */

import { useState } from 'react';

const DIFFICULTY_OPTIONS = ['All', 'Easy', 'Medium', 'Hard'];
const COMPANY_OPTIONS = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Uber'];

export default function SearchBar({ onSearch, isLoading = false }) {
  const [query, setQuery] = useState('');
  const [difficulty, setDifficulty] = useState('All');
  const [company, setCompany] = useState('All');

  function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;

    const filters = {};
    if (difficulty !== 'All') filters.difficulty = difficulty;
    if (company !== 'All') filters.companies = [company];
    onSearch(query, filters);
  }

  function handleQuickSearch(searchQuery) {
    setQuery(searchQuery);
    const filters = {};
    if (difficulty !== 'All') filters.difficulty = difficulty;
    if (company !== 'All') filters.companies = [company];
    onSearch(searchQuery, filters);
  }

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit} className="space-y-2">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            disabled={isLoading}
            className="w-full bg-[#2d2d2d] border border-[#404040] rounded-lg px-10 py-2 text-sm text-white placeholder-gray-500 
                       focus:outline-none focus:border-[#0ea5e9] focus:ring-1 focus:ring-[#0ea5e9] 
                       disabled:opacity-50 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isLoading}
            className="bg-[#2d2d2d] border border-[#404040] rounded-lg px-3 py-1.5 text-xs text-gray-200 
                       focus:outline-none focus:border-[#0ea5e9] disabled:opacity-50"
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isLoading}
            className="bg-[#2d2d2d] border border-[#404040] rounded-lg px-3 py-1.5 text-xs text-gray-200 
                       focus:outline-none focus:border-[#0ea5e9] disabled:opacity-50"
          >
            {COMPANY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={isLoading || !query.trim()}
          className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold py-2 px-4 rounded-lg text-sm
                     transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Searching...
            </>
          ) : (
            'Search'
          )}
        </button>
      </form>

      <div>
        <p className="text-xs text-gray-500 mb-1.5">Quick:</p>
        <div className="flex flex-wrap gap-1.5">
          {['array', 'graph', 'tree', 'dp'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleQuickSearch(suggestion)}
              disabled={isLoading}
              className="px-2 py-1 bg-[#2d2d2d] hover:bg-[#353535] border border-[#404040] rounded text-xs text-gray-300 
                         transition-all disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
