/**
 * Main App - Enhanced with new UI components
 */

import { useState } from 'react';
import CodeEditor from './components/CodeEditor';
import QuestionDisplay from './components/QuestionDisplay';
import AudioRecorder from './components/AudioRecorder';
import SearchBar from './components/SearchBar';
import { Button } from './components/ui/Button';
import { Badge } from './components/ui/Badge';
import { Feedback } from './components/ui/Feedback';
import { SearchResultsSkeleton } from './components/ui/LoadingSkeleton';
import { searchQuestions, submitSolution } from './services/api';
import { MainLayout } from './components/layout/MainLayout';
import { Header } from './components/layout/Header';


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
  const [submissionScore, setSubmissionScore] = useState(null);

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
    setSubmissionScore(null);
  }

  function handleBackToSearch() {
    setCurrentQuestion(null);
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
      message: 'Processing your submission... This may take 5-10 seconds.'
    });

    try {
      const result = await submitSolution(currentQuestion.id, code, audioBlob);
      setSubmissionScore(result.score);
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
    <MainLayout>
      <Header searchResults={searchResults} currentQuestion={currentQuestion} submissionScore={submissionScore} />

      {/* Main Split Screen Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT PANEL - Questions */}
        <div className={`
          flex flex-col border-r border-border-default bg-bg-secondary/50
          w-full md:w-[35%] md:min-w-[320px] md:max-w-[480px] lg:w-[30%]
          ${currentQuestion ? 'hidden md:flex' : 'flex'}
        `}>
          {/* Search Section - Fixed at top */}
          <div className="flex-shrink-0 p-5 border-b border-border-default bg-bg-secondary">
            <SearchBar
              onSearch={handleSearch}
              isLoading={isSearching}
              showQuickSearches={!currentQuestion}
            />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto min-h-0">
            <div className="p-5">
              {/* Back to Search Button - Show when question is selected */}
              {currentQuestion && (
                <div className="mb-4 md:hidden">
                  <Button
                    onClick={handleBackToSearch}
                    variant="secondary"
                    size="sm"
                    className="w-full"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Search
                  </Button>
                </div>
              )}

              {/* Loading State */}
              {isSearching && (
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-4">Search Results</h3>
                  <SearchResultsSkeleton />
                </div>
              )}

              {/* Search Results - Show only when no question is selected */}
              {!isSearching && !currentQuestion && searchResults.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-text-primary mb-4">Search Results</h3>
                  <div className="space-y-3">
                    {searchResults.map((result) => {
                      const difficultyVariant = {
                        'Easy': 'easy',
                        'Medium': 'medium',
                        'Hard': 'hard',
                      }[result.metadata.difficulty] || 'default';

                      return (
                        <button
                          key={result.id}
                          onClick={() => selectQuestion(result)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${currentQuestion?.id === result.id
                            ? 'bg-accent-blue text-white shadow-lg transform scale-[1.02]'
                            : 'bg-bg-tertiary hover:bg-bg-hover text-text-primary border border-border-default hover:border-accent-blue/50 hover:shadow-md'
                            }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm mb-2 truncate leading-tight">{result.title}</h4>
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant={difficultyVariant}>
                                  {result.metadata.difficulty}
                                </Badge>
                                {result.metadata.topics.slice(0, 2).map(topic => (
                                  <Badge key={topic} variant="topic">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className={`text-xs font-semibold px-2 py-1 rounded ${currentQuestion?.id === result.id
                              ? 'bg-white/20 text-white'
                              : 'bg-bg-primary text-text-tertiary'
                              }`}>
                              {(result._searchScore * 100).toFixed(0)}%
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Question Display - Show when question is selected */}
              {currentQuestion && (
                <div className="bg-bg-tertiary rounded-lg p-5 border border-border-default">
                  <QuestionDisplay question={currentQuestion} />
                </div>
              )}

              {/* Empty State - Enhanced */}
              {!isSearching && !currentQuestion && searchResults.length === 0 && (
                <div className="text-center py-20">
                  <div className="inline-flex items-center justify-center w-20 h-20 max-w-[5rem] max-h-[5rem] bg-accent-blue/10 rounded-2xl mb-6 flex-shrink-0">
                    <svg className="w-10 h-10 max-w-[2.5rem] max-h-[2.5rem] text-accent-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-bold text-text-primary mb-2">Ready to Practice?</h3>
                  <p className="text-sm text-text-secondary mb-1">Search for coding interview questions</p>
                  <p className="text-xs text-text-tertiary">Try searching for "array", "graph", or "tree"</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Code Editor */}
        <div className={`
          flex-1 flex-col bg-bg-primary
          ${!currentQuestion ? 'hidden md:flex' : 'flex'}
        `}>
          {/* Code Editor Header */}
          <div className="flex-shrink-0 h-[7vh] bg-bg-secondary border-b border-border-default flex items-center justify-between px-5">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-text-primary">Code Editor</span>
              {currentQuestion && (
                <>
                  <span className="text-text-tertiary">•</span>
                  <span className="text-xs text-text-secondary truncate max-w-xs">{currentQuestion.title}</span>
                </>
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

          {/* Bottom Panel - Audio & Submit */}
          <div className="flex-shrink-0 bg-bg-secondary border-t border-border-default p-5 space-y-4 max-h-[30vh] overflow-y-auto">
            <AudioRecorder
              onRecordingComplete={handleRecordingComplete}
              disabled={isSubmitting || !currentQuestion}
            />

            {/* Feedback */}
            {feedback && (
              <Feedback
                type={feedback.type}
                message={feedback.message}
                details={feedback.details}
              />
            )}

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              variant="success"
              size="lg"
              isLoading={isSubmitting}
              disabled={!currentQuestion || !audioBlob}
              className="w-full"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Submit Solution
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>

  );
}
