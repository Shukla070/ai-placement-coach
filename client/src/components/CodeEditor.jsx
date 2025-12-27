/**
 * CodeEditor Component - Monaco-based code editor
 */

import Editor from '@monaco-editor/react';
import { useState } from 'react';

// Loading component
function EditorSkeleton() {
  return (
    <div className="flex items-center justify-center h-full bg-bg-primary">
      <div className="text-center flex-none max-w-[200px] max-h-[200px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-border-default border-t-accent-blue mx-auto mb-4 flex-shrink-0" style={{ width: '48px', height: '48px', minWidth: '48px', maxWidth: '48px', minHeight: '48px', maxHeight: '48px', flexShrink: 0 }}></div>
        <p className="text-text-secondary text-sm">Loading editor...</p>
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
    <div className="h-full flex flex-col bg-bg-primary">
      {/* Language Selector */}
      <div className="flex-shrink-0 bg-bg-secondary border-b border-border-default px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-text-tertiary">Language:</span>
        <select
          value={language}
          onChange={handleLanguageChange}
          disabled={disabled}
          className="input-field py-1 text-sm max-w-[150px]"
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
