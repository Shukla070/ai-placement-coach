/**
 * SearchBar Component - Enhanced with new UI components
 */

import { useState } from 'react';
import { Button } from './ui/Button';
import { LoadingSkeleton } from './ui/LoadingSkeleton';

const DIFFICULTY_OPTIONS = ['All', 'Easy', 'Medium', 'Hard'];
const COMPANY_OPTIONS = ['All', 'Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Uber'];

export default function SearchBar({ onSearch, isLoading = false, showQuickSearches = true }) {
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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
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
            className="input-field pl-10"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isLoading}
            className="input-field text-xs"
          >
            {DIFFICULTY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>

          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            disabled={isLoading}
            className="input-field text-xs"
          >
            {COMPANY_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          disabled={!query.trim()}
          className="w-full"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search
        </Button>
      </form>

      {/* Quick Searches - Only show when no question is selected */}
      {showQuickSearches && (
        <div>
          <p className="text-xs text-text-secondary mb-3 font-medium">Quick Search:</p>
          <div className="flex flex-wrap gap-2">
            {['array', 'graph', 'tree', 'dp', 'sorting', 'string'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleQuickSearch(suggestion)}
                disabled={isLoading}
                className="px-3 py-1.5 bg-bg-tertiary hover:bg-bg-hover border border-border-default hover:border-accent-blue/50 
                           rounded-lg text-xs text-text-primary font-medium transition-all duration-200 
                           disabled:opacity-50 hover:scale-105 active:scale-95"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
