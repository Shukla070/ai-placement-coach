/**
 * SimpleCodeEditor - Fallback textarea-based editor
 * Use this if Monaco Editor fails to load
 */

import { useState } from 'react';

const LANGUAGE_OPTIONS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
];

const DEFAULT_CODE = {
  javascript: `// Write your solution here
function solve() {
  // Your code
}`,
  python: `# Write your solution here
def solve():
    # Your code
    pass`,
  java: `// Write your solution here
class Solution {
    public void solve() {
        // Your code
    }
}`,
  cpp: `// Write your solution here
#include <iostream>
using namespace std;

void solve() {
    // Your code
}`,
};

export default function SimpleCodeEditor({ value, onChange, disabled = false }) {
  const [language, setLanguage] = useState('javascript');

  function handleLanguageChange(e) {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    onChange(DEFAULT_CODE[newLanguage]);
  }

  return (
    <div className="h-full flex flex-col bg-dark-900">
      {/* Language Selector */}
      <div className="bg-dark-700/50 border-b border-dark-700 px-6 py-4 flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-200 flex items-center gap-2">
          <span className="text-lg">💻</span>
          Code Editor
        </h3>
        <select
          value={language}
          onChange={handleLanguageChange}
          disabled={disabled}
          className="input-field py-2 text-sm"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Textarea Editor */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="flex-1 w-full p-6 bg-dark-900 text-gray-100 font-mono text-sm resize-none 
                   focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:opacity-50 
                   border-none transition-all duration-200"
        style={{ 
          tabSize: 2,
          fontFamily: "'Fira Code', 'Courier New', monospace",
          lineHeight: '1.6',
        }}
        placeholder="Write your code here..."
        spellCheck={false}
      />
    </div>
  );
}