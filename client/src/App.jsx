/**
 * Main App - AI Placement Coach Frontend (Redesigned)
 */

import { useState } from 'react';
import CodeEditor from './components/SimpleCodeEditor';
import QuestionDisplay from './components/QuestionDisplay';
import AudioRecorder from './components/AudioRecorder';
import SearchBar from './components/SearchBar';
import { searchQuestions, submitSolution } from './services/api';

const DEFAULT_CODE = `// Write your solution here
function solve() {
  // Your code
}`;

export default function App() {
  // State
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [code, setCode] = useState(DEFAULT_CODE);
  const [audioBlob, setAudioBlob] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  /**
   * Handle search
   */
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

  /**
   * Select a question from search results
   */
  function selectQuestion(question) {
    setCurrentQuestion(question);
    setCode(DEFAULT_CODE);
    setAudioBlob(null);
    setFeedback(null);
  }

  /**
   * Handle audio recording complete
   */
  function handleRecordingComplete(blob) {
    setAudioBlob(blob);
    setFeedback({
      type: 'success',
      message: `Recording saved (${(blob.size / 1024).toFixed(2)} KB). Ready to submit!`
    });
  }

  /**
   * Submit solution for evaluation
   */
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
    <div className="h-screen flex flex-col bg-darker text-gray-100">
      {/* Header */}
      <header className="bg-dark border-b border-gray-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🤖</div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Placement Coach</h1>
            <p className="text-sm text-gray-400">Practice with real interview questions</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-400">
            {searchResults.length > 0 && `${searchResults.length} questions loaded`}
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Search & Question (Scrollable) */}
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Search Section */}
              <section>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  🔍 Find Questions
                </h2>
                <SearchBar onSearch={handleSearch} isLoading={isSearching} />
              </section>

              {/* Search Results */}
              {searchResults.length > 0 && (
                <section>
                  <h2 className="text-lg font-semibold mb-4">
                    📊 Results ({searchResults.length})
                  </h2>
                  <div className="grid gap-2">
                    {searchResults.map((result) => (
                      <button
                        key={result.id}
                        onClick={() => selectQuestion(result)}
                        className={`text-left p-4 rounded-lg transition-all ${
                          currentQuestion?.id === result.id
                            ? 'bg-primary text-white shadow-lg scale-105'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-semibold">{result.title}</div>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                result.metadata.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
                                result.metadata.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                                'bg-red-900 text-red-200'
                              }`}>
                                {result.metadata.difficulty}
                              </span>
                              {result.metadata.topics.slice(0, 2).map(topic => (
                                <span key={topic} className="text-xs px-2 py-0.5 rounded bg-blue-900 text-blue-200">
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {(result._searchScore * 100).toFixed(0)}% match
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {/* Question Display */}
              {currentQuestion && (
                <section>
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    📝 Problem Statement
                  </h2>
                  <QuestionDisplay question={currentQuestion} />
                </section>
              )}

              {/* Empty State */}
              {!currentQuestion && searchResults.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-lg">Search for questions to get started</p>
                  <p className="text-sm mt-2">Try "array problems" or "graph algorithms"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Code Editor & Submission (Fixed) */}
        <div className="w-1/2 flex flex-col">
          {/* Code Editor (Takes most space) */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="bg-dark border-b border-gray-700 px-4 py-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-300 flex items-center gap-2">
                💻 Code Editor
              </h2>
              {currentQuestion && (
                <div className="text-xs text-gray-400">
                  Solving: {currentQuestion.title}
                </div>
              )}
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={code}
                onChange={setCode}
                disabled={isSubmitting || !currentQuestion}
              />
            </div>
          </div>

          {/* Audio Recorder & Submit Section (Fixed height) */}
          <div className="bg-dark border-t border-gray-700 p-6 space-y-4">
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={isSubmitting || !currentQuestion}
            />

            {/* Feedback Display */}
            {feedback && (
              <div className={`rounded-lg p-4 text-sm ${
                feedback.type === 'error' ? 'bg-red-900/20 border border-red-500 text-red-200' :
                feedback.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-500 text-yellow-200' :
                feedback.type === 'success' ? 'bg-green-900/20 border border-green-500 text-green-200' :
                'bg-blue-900/20 border border-blue-500 text-blue-200'
              }`}>
                <p className="font-semibold">{feedback.message}</p>
                {feedback.details && (
                  <div className="mt-3 space-y-2">
                    <div className="flex gap-4">
                      <div className="flex-1 bg-black/20 rounded p-2 text-center">
                        <div className="text-xs opacity-75">Correctness</div>
                        <div className="text-lg font-bold">{feedback.details.breakdown.correctness}/40</div>
                      </div>
                      <div className="flex-1 bg-black/20 rounded p-2 text-center">
                        <div className="text-xs opacity-75">Efficiency</div>
                        <div className="text-lg font-bold">{feedback.details.breakdown.efficiency}/30</div>
                      </div>
                      <div className="flex-1 bg-black/20 rounded p-2 text-center">
                        <div className="text-xs opacity-75">Communication</div>
                        <div className="text-lg font-bold">{feedback.details.breakdown.communication}/30</div>
                      </div>
                    </div>
                    {feedback.details.feedback && (
                      <div className="text-xs opacity-90 mt-2 p-3 bg-black/20 rounded">
                        <strong>Feedback:</strong> {feedback.details.feedback}
                      </div>
                    )}
                    {feedback.details.strengths && feedback.details.strengths.length > 0 && (
                      <div className="text-xs">
                        <strong>✅ Strengths:</strong>
                        <ul className="list-disc list-inside mt-1 opacity-90">
                          {feedback.details.strengths.map((s, i) => <li key={i}>{s}</li>)}
                        </ul>
                      </div>
                    )}
                    {feedback.details.improvements && feedback.details.improvements.length > 0 && (
                      <div className="text-xs">
                        <strong>💡 Improvements:</strong>
                        <ul className="list-disc list-inside mt-1 opacity-90">
                          {feedback.details.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
                        </ul>
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
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <span className="text-2xl">🚀</span>
                  Submit Solution
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}