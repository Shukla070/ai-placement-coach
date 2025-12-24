/**
 * CodeEditor Component - Monaco-based code editor
 * 
 * Features:
 * - VS Code editing experience
 * - Syntax highlighting
 * - Auto-completion
 * - Multiple language support
 */

import Editor from '@monaco-editor/react';
import { useState } from 'react';

// Loading component
function EditorSkeleton() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-400">Loading editor...</p>
      </div>
    </div>
  );
}

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

export default function CodeEditor({ value, onChange, disabled = false }) {
  const [language, setLanguage] = useState('javascript');
  const [isEditorReady, setIsEditorReady] = useState(false);

  function handleEditorDidMount() {
    setIsEditorReady(true);
    console.log('✅ Monaco Editor loaded successfully');
  }

  function handleEditorChange(newValue) {
    onChange(newValue || '');
  }

  function handleLanguageChange(e) {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    
    // Reset code when language changes
    onChange(DEFAULT_CODE[newLanguage]);
  }

  return (
    <div className="h-full flex flex-col">
      {/* Language Selector */}
      <div className="bg-dark border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-300">Code Editor</h3>
        <select
          value={language}
          onChange={handleLanguageChange}
          disabled={disabled}
          className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-sm text-gray-200 focus:outline-none focus:border-primary disabled:opacity-50"
        >
          {LANGUAGE_OPTIONS.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          loading={<EditorSkeleton />}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            readOnly: disabled,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}