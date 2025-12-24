/**
 * SearchBar Component - Enhanced design
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
    
    if (!query.trim()) {
      return;
    }

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
    <div className="space-y-4">
      {/* Main Search */}
      <div className="card p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'array problems', 'graph algorithms', 'dynamic programming'"
              disabled={isLoading}
              className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 pl-11 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50 disabled:opacity-50 transition-all"
            />
            <svg 
              className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 gap-3">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary disabled:opacity-50 transition-all"
              >
                {DIFFICULTY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Company Filter */}
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 font-semibold">Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                disabled={isLoading}
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary disabled:opacity-50 transition-all"
              >
                {COMPANY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="w-full btn-primary flex items-center justify-center gap-2 py-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Questions
              </>
            )}
          </button>
        </form>
      </div>

      {/* Quick Search Suggestions */}
      <div className="card p-4">
        <p className="text-xs text-gray-400 mb-3 font-semibold">💡 Quick Searches</p>
        <div className="flex flex-wrap gap-2">
          {[
            'array problems',
            'graph algorithms', 
            'dynamic programming',
            'linked list',
            'binary tree',
            'sorting'
          ].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleQuickSearch(suggestion)}
              disabled={isLoading}
              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded-full text-xs text-gray-300 transition-all disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}