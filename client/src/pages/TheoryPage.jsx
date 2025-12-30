/**
 * Theory Page - Shared component for OS/DBMS/OOPS
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { MainLayout } from '../components/layout/MainLayout';
import QuestionDisplay from '../components/QuestionDisplay';
import { TextAnswerInput } from '../components/TextAnswerInput';
import { Button } from '../components/ui/Button';
import { Feedback } from '../components/ui/Feedback';
import { getRandomTheoryQuestion, submitTheoryAnswer } from '../services/api';

export default function TheoryPage({ subject }) {
    const navigate = useNavigate();

    // State
    const [isReady, setIsReady] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [userAnswer, setUserAnswer] = useState('');
    const [answeredIds, setAnsweredIds] = useState([]);
    const [questionCount, setQuestionCount] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);

    // Subject display names
    const subjectNames = {
        OS: 'Operating Systems',
        DBMS: 'Database Management Systems',
        OOPS: 'Object-Oriented Programming'
    };

    // Start function when user clicks "Start"
    function handleStart() {
        setIsReady(true);
        loadRandomQuestion();
    }

    async function loadRandomQuestion() {
        setIsLoading(true);
        setFeedback(null);

        try {
            // Convert subject to uppercase for API
            const apiSubject = subject.toUpperCase();
            const response = await getRandomTheoryQuestion(apiSubject, answeredIds);

            if (!response.success || !response.question) {
                setFeedback({
                    type: 'warning',
                    message: response.message || 'No more questions available'
                });
                setCurrentQuestion(null);
                return;
            }

            // Transform API response to match QuestionDisplay component expectations
            const transformedQuestion = {
                id: response.question.id,
                title: response.question.question,
                display_markdown: response.question.question,
                metadata: {
                    difficulty: response.question.difficulty || 'Medium',
                    topics: response.question.topic ? [response.question.topic] : []
                }
            };

            setCurrentQuestion(transformedQuestion);
            setUserAnswer('');
        } catch (error) {
            setFeedback({
                type: 'error',
                message: error.message
            });
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSubmit() {
        if (!userAnswer.trim() || userAnswer.trim().length < 50) {
            setFeedback({
                type: 'error',
                message: 'Please write at least 50 characters to provide a meaningful answer.'
            });
            return;
        }

        setIsSubmitting(true);
        setFeedback({
            type: 'info',
            message: 'Evaluating your answer... This may take a few seconds.'
        });

        try {
            // Convert subject to uppercase for API
            const apiSubject = subject.toUpperCase();
            const result = await submitTheoryAnswer(apiSubject, currentQuestion.id, userAnswer);

            setFeedback({
                type: 'success',
                message: `Score: ${result.score}/100`,
                details: result
            });

            // Update session tracking
            setAnsweredIds([...answeredIds, currentQuestion.id]);
            setQuestionCount(questionCount + 1);

        } catch (error) {
            setFeedback({
                type: 'error',
                message: error.message
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    function handleNextQuestion() {
        loadRandomQuestion();
    }

    function handleEndSession() {
        setSessionEnded(true);
    }

    function handleBackToHome() {
        navigate('/');
    }

    // Ready screen view
    if (!isReady) {
        return (
            <MainLayout>
                <Navbar />
                <div className="flex-1 flex items-center justify-center bg-bg-primary p-8">
                    <div className="max-w-md w-full text-center">
                        <div className="inline-flex items-center justify-center w-24 h-24 bg-accent-blue/10 rounded-2xl mb-6">
                            <span className="text-6xl">{subject === 'OS' ? '⚙️' : subject === 'DBMS' ? '🗄️' : '🎯'}</span>
                        </div>

                        <h2 className="text-4xl font-bold text-text-primary mb-4">
                            {subjectNames[subject.toUpperCase()] || subject}
                        </h2>

                        <p className="text-lg text-text-secondary mb-8">
                            Are you ready to start practicing?
                        </p>

                        <Button
                            onClick={handleStart}
                            variant="success"
                            size="lg"
                            className="w-full"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Start Practice
                        </Button>

                        <Button
                            onClick={handleBackToHome}
                            variant="secondary"
                            size="md"
                            className="w-full mt-3 bg-gray-700 hover:bg-gray-600 text-white"
                        >
                            Back to Home
                        </Button>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Session ended view
    if (sessionEnded) {
        return (
            <MainLayout>
                <Navbar />
                <div className="flex-1 flex items-center justify-center bg-bg-primary p-8">
                    <div className="max-w-md w-full text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-accent-blue/10 rounded-2xl mb-6">
                            <svg className="w-10 h-10 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-text-primary mb-4">
                            Session Ended
                        </h2>

                        <p className="text-xl text-text-secondary mb-8">
                            You answered <span className="font-bold text-accent-blue">{questionCount}</span> {questionCount === 1 ? 'question' : 'questions'}
                        </p>

                        <div className="space-y-3">
                            <Button
                                onClick={() => {
                                    setSessionEnded(false);
                                    setQuestionCount(0);
                                    setAnsweredIds([]);
                                    setIsReady(false);
                                }}
                                variant="success"
                                size="lg"
                                className="w-full"
                            >
                                Start New Session
                            </Button>

                            <Button
                                onClick={handleBackToHome}
                                variant="secondary"
                                size="lg"
                                className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                            >
                                Back to Home
                            </Button>
                        </div>
                    </div>
                </div>
            </MainLayout>
        );
    }

    // Main question view
    return (
        <MainLayout>
            <Navbar />

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 bg-bg-secondary border-b border-border-default px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-bold text-text-primary">
                                {subjectNames[subject] || subject}
                            </h1>
                            <p className="text-sm text-text-secondary">
                                Questions answered: {questionCount}
                            </p>
                        </div>

                        <Button
                            onClick={handleEndSession}
                            variant="danger"
                            size="sm"
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            End Session
                        </Button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-4xl mx-auto p-6 space-y-6">
                        {isLoading ? (
                            <div className="text-center py-20">
                                <div className="inline-block animate-spin w-8 h-8 border-4 border-accent-blue border-t-transparent rounded-full"></div>
                                <p className="text-text-secondary mt-4">Loading question...</p>
                            </div>
                        ) : currentQuestion ? (
                            <>
                                {/* Question Display */}
                                <div className="bg-bg-tertiary rounded-lg p-6 border border-border-default">
                                    <QuestionDisplay question={currentQuestion} />
                                </div>

                                {/* Answer Input */}
                                <TextAnswerInput
                                    value={userAnswer}
                                    onChange={setUserAnswer}
                                    disabled={isSubmitting}
                                />

                                {/* Feedback */}
                                {feedback && (
                                    <Feedback
                                        type={feedback.type}
                                        message={feedback.message}
                                        details={feedback.details}
                                    />
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    {feedback?.type === 'success' ? (
                                        <>
                                            <Button
                                                onClick={handleNextQuestion}
                                                variant="secondary"
                                                size="lg"
                                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white"
                                            >
                                                Next Question
                                            </Button>
                                            <Button
                                                onClick={handleEndSession}
                                                variant="danger"
                                                size="lg"
                                                className="flex-1 bg-red-600 hover:bg-red-700"
                                            >
                                                End Session
                                            </Button>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={handleSubmit}
                                            variant="success"
                                            size="lg"
                                            isLoading={isSubmitting}
                                            disabled={!userAnswer.trim() || userAnswer.trim().length < 50}
                                            className="w-full"
                                        >
                                            Submit Answer
                                        </Button>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-text-secondary">No more questions available</p>
                                <Button onClick={handleEndSession} variant="secondary" className="mt-4">
                                    End Session
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
