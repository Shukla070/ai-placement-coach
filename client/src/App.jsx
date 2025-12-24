/**
 * Main App - AI Placement Coach Frontend
 */

import { useState } from 'react';
// import CodeEditor from './components/CodeEditor';
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
      const response = await searchQuestions(query, filters, 5);
      setSearchResults(response.results);

      if (response.results.length === 0) {
        setFeedback({
          type: 'warning',
          message: `No questions found matching "${query}" with the selected filters. Try adjusting your filters or search terms.`
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

    if (!code.trim()) {
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
      message: 'Processing your submission...'
    });

    try {
      const result = await submitSolution(currentQuestion.id, code, audioBlob);
      setFeedback({
        type: 'success',
        message: `Score: ${result.score}/100`,
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
    <div className="min-h-screen bg-darker">
      {/* Header */}
      <header className="bg-dark border-b border-gray-700 px-6 py-4">
        <h1 className="text-2xl font-bold text-white">
          🤖 AI Placement Coach
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Practice coding interviews with real-time AI feedback
        </p>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Search & Results */}
          <div className="space-y-4">
            <SearchBar onSearch={handleSearch} isLoading={isSearching} />

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="card p-4">
                <h3 className="text-sm font-semibold text-gray-300 mb-3">
                  Search Results ({searchResults.length})
                </h3>
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => selectQuestion(result)}
                      className={`w-full text-left p-3 rounded-lg transition-colors ${
                        currentQuestion?.id === result.id
                          ? 'bg-primary text-white'
                          : 'bg-gray-800 hover:bg-gray-700 text-gray-200'
                      }`}
                    >
                      <div className="font-semibold text-sm">{result.title}</div>
                      <div className="text-xs opacity-75 mt-1">
                        Score: {(result._searchScore * 100).toFixed(0)}%
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Middle - Code Editor */}
          <div className="lg:col-span-2 space-y-4">
            {/* Question Display */}
            <QuestionDisplay question={currentQuestion} />

            {/* Code Editor */}
            <div className="card h-[500px]">
              <CodeEditor
                value={code}
                onChange={setCode}
                disabled={isSubmitting}
              />
            </div>

            {/* Audio Recorder */}
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={isSubmitting || !currentQuestion}
            />

            {/* Feedback Display */}
            {feedback && (
              <div className={`rounded-lg p-4 ${
                feedback.type === 'error' ? 'bg-red-900/20 border border-red-500 text-red-200' :
                feedback.type === 'warning' ? 'bg-yellow-900/20 border border-yellow-500 text-yellow-200' :
                feedback.type === 'success' ? 'bg-green-900/20 border border-green-500 text-green-200' :
                'bg-blue-900/20 border border-blue-500 text-blue-200'
              }`}>
                <p className="font-semibold">{feedback.message}</p>
                {feedback.details && (
                  <div className="mt-2 text-sm opacity-90">
                    <p>Breakdown:</p>
                    <ul className="list-disc list-inside">
                      <li>Correctness: {feedback.details.breakdown.correctness}</li>
                      <li>Efficiency: {feedback.details.breakdown.efficiency}</li>
                      <li>Communication: {feedback.details.breakdown.communication}</li>
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !currentQuestion || !audioBlob}
              className="w-full btn-primary py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                '🚀 Submit Solution'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}