/**
 * API Service - Communication layer with backend
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Search for questions using hybrid search
 */
export async function searchQuestions(query, filters = {}, topK = 5) {
  try {
    const response = await api.post('/api/search', {
      query,
      filters,
      topK,
    });
    return response.data;
  } catch (error) {
    console.error('Search error:', error);
    throw new Error(error.response?.data?.error || 'Failed to search questions');
  }
}

/**
 * Get a single question by ID
 */
export async function getQuestionById(questionId) {
  try {
    const response = await api.get(`/api/questions/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Get question error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch question');
  }
}

/**
 * List all questions (metadata only)
 */
export async function listAllQuestions() {
  try {
    const response = await api.get('/api/questions');
    return response.data;
  } catch (error) {
    console.error('List questions error:', error);
    throw new Error(error.response?.data?.error || 'Failed to list questions');
  }
}

/**
 * Submit code + audio for evaluation (DSA)
 */
export async function submitSolution(questionId, code, audioBlob) {
  const formData = new FormData();
  formData.append('questionId', questionId);
  formData.append('code', code);
  formData.append('audio', audioBlob, 'answer.webm');

  try {
    const response = await api.post('/api/evaluate', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Submit solution error:', error);
    throw new Error(error.response?.data?.error || 'Failed to submit solution');
  }
}

/**
 * Get random theory question for a subject
 */
export async function getRandomTheoryQuestion(subject, excludeIds = []) {
  try {
    const excludeParam = excludeIds.length > 0 ? `?exclude=${excludeIds.join(',')}` : '';
    const response = await api.get(`/api/questions/random/${subject}${excludeParam}`);
    return response.data;
  } catch (error) {
    console.error('Get random question error:', error);
    throw new Error(error.response?.data?.error || 'Failed to fetch question');
  }
}

/**
 * Submit theory answer for evaluation
 */
export async function submitTheoryAnswer(subject, questionId, answer) {
  try {
    const response = await api.post('/api/evaluate/theory', {
      subject,
      questionId,
      answer,
    });
    return response.data;
  } catch (error) {
    console.error('Submit theory answer error:', error);
    throw new Error(error.response?.data?.error || 'Failed to evaluate answer');
  }
}

export default api;