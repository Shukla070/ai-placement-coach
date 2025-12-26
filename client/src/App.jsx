/**
 * Main App - LeetCode Style Coding Platform
 */

import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import QuestionDisplay from './components/QuestionDisplay';
import AudioRecorder from './components/AudioRecorder';
import SearchBar from './components/SearchBar';
import { searchQuestions, submitSolution } from './services/api';

const DEFAULT_CODE = `// Write your solution here
function solve() {
  // Your code
}`;

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [audioBlob, setAudioBlob] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleSearch(query, filters) {
    setIsSearching(true);
    setFeedback(null);

    try {
      const response = await searchQuestions(query, filters, 10);
      setSearchResults(response.results);

      if (response.results.length === 0) {
        setFeedback({
          type: 'warning',
          message: `No questions found matching "${query}". Try different filters.`
        });
      }
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsSearching(false);
    }
  }

  function selectQuestion(question) {
    setCurrentQuestion(question);
    setCode(DEFAULT_CODE);
    setAudioBlob(null);
    setFeedback(null);
  }

  function handleRecordingComplete(blob) {
    setAudioBlob(blob);
    setFeedback({
      type: 'success',
      message: `Recording saved (${(blob.size / 1024).toFixed(2)} KB). Ready to submit!`
    });
  }

  async function handleSubmit() {
    if (!currentQuestion) {
      setFeedback({
        type: 'error',
        message: 'Please select a question first'
      });
      return;
    }

    if (!code.trim() || code.trim() === DEFAULT_CODE.trim()) {
      setFeedback({
        type: 'error',
        message: 'Please write some code before submitting'
      });
      return;
    }

    if (!audioBlob) {
      setFeedback({
        type: 'error',
        message: 'Please record your explanation before submitting'
      });
      return;
    }

    setIsSubmitting(true);
    setFeedback({
      type: 'info',
      message: '🔄 Processing your submission... This may take 5-10 seconds.'
    });

    try {
      const result = await submitSolution(currentQuestion.id, code, audioBlob);
      setFeedback({
        type: 'success',
        message: `🎉 Score: ${result.score}/100`,
        details: result
      });
    } catch (error) {
      setFeedback({
        type: 'error',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#1a1a1a] text-[#e5e5e5] overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex-shrink-0 h-14 bg-[#262626] border-b border-[#404040] flex items-center px-6">
        <div className="flex items-center gap-4 w-full">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#0ea5e9] to-[#0284c7] rounded-lg flex items-center justify-center text-lg font-bold">
              AI
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">AI Placement Coach</h1>
            </div>
          </div>
          <div className="flex-1"></div>
          <div className="flex items-center gap-3">
            {searchResults.length > 0 && (
              <span className="text-sm text-gray-400">{searchResults.length} questions</span>
            )}
            {currentQuestion && (
              <span className="text-sm text-green-400 font-medium">● Active</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Split Screen Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT PANEL - Questions (35% width) */}
        <div className="w-[35%] flex flex-col border-r border-[#404040] bg-[#1f1f1f]">
          {/* Search Section - Fixed */}
          <div className="flex-shrink-0 p-4 border-b border-[#404040] bg-[#262626]">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-300 mb-3">Search Results</h3>
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => selectQuestion(result)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          currentQuestion?.id === result.id
                            ? 'bg-[#0ea5e9] text-white shadow-lg'
                            : 'bg-[#2d2d2d] hover:bg-[#353535] text-gray-200 border border-[#404040]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm mb-1.5 truncate">{result.title}</h4>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                result.metadata.difficulty === 'Easy' 
                                  ? 'bg-green-500/20 text-green-400' 
                                  : result.metadata.difficulty === 'Medium'
                                  ? 'bg-yellow-500/20 text-yellow-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}>
                                {result.metadata.difficulty}
                              </span>
                              {result.metadata.topics.slice(0, 2).map(topic => (
                                <span key={topic} className="text-xs px-2 py-0.5 rounded bg-[#0ea5e9]/20 text-[#0ea5e9]">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">
                            {(result._searchScore * 100).toFixed(0)}%
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Question Display */}
              {currentQuestion && (
                <div className="mt-4">
                  <div className="bg-[#2d2d2d] rounded-lg p-4 border border-[#404040]">
                    <QuestionDisplay question={currentQuestion} />
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!currentQuestion && searchResults.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-5xl mb-4">🎯</div>
                  <p className="text-sm text-gray-400">Search for questions to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Code Editor (65% width) */}
        <div className="flex-1 flex flex-col bg-[#1a1a1a]">
          {/* Code Editor Header */}
          <div className="flex-shrink-0 h-12 bg-[#262626] border-b border-[#404040] flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-300">Code Editor</span>
              {currentQuestion && (
                <span className="text-xs text-gray-500">• {currentQuestion.title}</span>
              )}
            </div>
          </div>

          {/* Code Editor - Takes most space */}
          <div className="flex-1 min-h-0">
            <CodeEditor
              value={code}
              onChange={setCode}
              disabled={isSubmitting || !currentQuestion}
            />
          </div>

          {/* Bottom Panel - Audio & Submit (Fixed height) */}
          <div className="flex-shrink-0 bg-[#262626] border-t border-[#404040] p-4 space-y-4">
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={isSubmitting || !currentQuestion}
            />

            {/* Feedback */}
            {feedback && (
              <div className={`rounded-lg p-3 text-sm border ${
                feedback.type === 'error' 
                  ? 'bg-red-500/10 border-red-500/30 text-red-300' 
                  : feedback.type === 'warning' 
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                  : feedback.type === 'success' 
                  ? 'bg-green-500/10 border-green-500/30 text-green-300'
                  : 'bg-[#0ea5e9]/10 border-[#0ea5e9]/30 text-[#0ea5e9]'
              }`}>
                <p className="font-semibold mb-2">{feedback.message}</p>
                {feedback.details && (
                  <div className="mt-3 space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-[#1a1a1a] rounded p-2 text-center border border-[#404040]">
                        <div className="text-xs text-gray-400 mb-1">Correctness</div>
                        <div className="text-lg font-bold text-[#0ea5e9]">{feedback.details.breakdown.correctness}/40</div>
                      </div>
                      <div className="bg-[#1a1a1a] rounded p-2 text-center border border-[#404040]">
                        <div className="text-xs text-gray-400 mb-1">Efficiency</div>
                        <div className="text-lg font-bold text-purple-400">{feedback.details.breakdown.efficiency}/30</div>
                      </div>
                      <div className="bg-[#1a1a1a] rounded p-2 text-center border border-[#404040]">
                        <div className="text-xs text-gray-400 mb-1">Communication</div>
                        <div className="text-lg font-bold text-green-400">{feedback.details.breakdown.communication}/30</div>
                      </div>
                    </div>
                    {feedback.details.feedback && (
                      <div className="text-xs mt-2 p-2 bg-[#1a1a1a] rounded border border-[#404040]">
                        <strong className="text-white">Feedback:</strong>
                        <p className="mt-1 text-gray-300">{feedback.details.feedback}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !currentQuestion || !audioBlob}
              className="w-full bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold py-3 px-4 rounded-lg 
                         transition-all duration-200 shadow-md hover:shadow-lg
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>🚀</span>
                  <span>Submit Solution</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
