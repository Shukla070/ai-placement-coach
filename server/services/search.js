/**
 * Hybrid Search Service - Combines filtering + vector similarity
 * 
 * Strategy:
 * 1. Apply hard filters (metadata) to narrow candidates
 * 2. Generate embedding for query
 * 3. Compute cosine similarity against candidates
 * 4. Return top-k results
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

function getGenAI() {
    if (!process.env.GOOGLE_AI_API_KEY) {
        throw new Error('GOOGLE_AI_API_KEY not loaded at runtime');
    }
    return new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
}


/**
 * Compute cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length) {
    throw new Error('Vectors must have same dimensions');
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

/**
 * Generate embedding for search query
 */
// async function generateQueryEmbedding(queryText) {
//   try {
//     const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
//     const result = await model.embedContent(queryText);
//     return result.embedding.values;
//   } catch (error) {
//     throw new Error(`Failed to generate query embedding: ${error.message}`);
//   }
// }

async function generateQueryEmbedding(queryText) {
    try {
        const genAI = getGenAI();
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(queryText);
        return result.embedding.values;
    } catch (error) {
        throw new Error(`Failed to generate query embedding: ${error.message}`);
    }
}


/**
 * Apply metadata filters to narrow down candidates
 * 
 * Filters object structure:
 * {
 *   difficulty: "Easy" | "Medium" | "Hard",
 *   topics: ["Array", "Graph"],  // Match ANY
 *   companies: ["Google"],        // Match ANY
 *   minFrequency: 3               // >= threshold
 * }
 */
function applyFilters(questions, filters) {
  if (!filters || Object.keys(filters).length === 0) {
    return questions;
  }

  return questions.filter(q => {
    // Difficulty filter (exact match)
    if (filters.difficulty && q.metadata.difficulty !== filters.difficulty) {
      return false;
    }

    // Topics filter (match ANY topic)
    if (filters.topics && filters.topics.length > 0) {
      const hasMatchingTopic = filters.topics.some(topic =>
        q.metadata.topics.includes(topic)
      );
      if (!hasMatchingTopic) return false;
    }

    // Companies filter (match ANY company)
    if (filters.companies && filters.companies.length > 0) {
      const hasMatchingCompany = filters.companies.some(company =>
        q.metadata.companies.includes(company)
      );
      if (!hasMatchingCompany) return false;
    }

    // Frequency filter (minimum threshold)
    if (filters.minFrequency && q.metadata.frequency_rating < filters.minFrequency) {
      return false;
    }

    return true;
  });
}

/**
 * Strip sensitive judge_context before sending to client
 */
function sanitizeQuestion(question) {
  const { judge_context, embedding, _metadata, _error, ...safeQuestion } = question;
  return safeQuestion;
}

/**
 * Main hybrid search function
 * 
 * @param {Array} vectorDB - Full questions database with embeddings
 * @param {string} queryText - User's search query
 * @param {Object} filters - Optional metadata filters
 * @param {number} topK - Number of results to return (default: 5)
 * @returns {Promise<Array>} - Top matching questions (sanitized)
 */
export async function hybridSearch(vectorDB, queryText, filters = {}, topK = 5) {
  const startTime = Date.now();

  // Step 1: Apply hard filters
  let candidates = applyFilters(vectorDB, filters);
  
  console.log(`🔍 Search: "${queryText}"`);
  console.log(`   Filters applied: ${JSON.stringify(filters)}`);
  console.log(`   Candidates after filtering: ${candidates.length}/${vectorDB.length}`);

  // If no candidates match filters, return empty
  if (candidates.length === 0) {
    return {
      results: [],
      metadata: {
        query: queryText,
        filters,
        candidatesCount: 0,
        totalCount: vectorDB.length,
        searchTimeMs: Date.now() - startTime
      }
    };
  }

  // Step 2: Generate query embedding
  const queryEmbedding = await generateQueryEmbedding(queryText);
  console.log(`   Query embedding: ${queryEmbedding.length} dims`);

  // Step 3: Compute cosine similarity for all candidates
  const scoredCandidates = candidates
    .filter(q => q.embedding && q.embedding.length > 0) // Skip questions with failed embeddings
    .map(question => ({
      question,
      similarity: cosineSimilarity(queryEmbedding, question.embedding)
    }));

  // Step 4: Sort by similarity (descending) and take top-k
  const topResults = scoredCandidates
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK)
    .map(({ question, similarity }) => ({
      ...sanitizeQuestion(question),
      _searchScore: similarity
    }));

  const searchTimeMs = Date.now() - startTime;
  console.log(`   ✅ Found ${topResults.length} results in ${searchTimeMs}ms`);

  return {
    results: topResults,
    metadata: {
      query: queryText,
      filters,
      candidatesCount: candidates.length,
      totalCount: vectorDB.length,
      searchTimeMs
    }
  };
}

/**
 * Get a single question by ID (sanitized)
 */
export function getQuestionById(vectorDB, questionId) {
  const question = vectorDB.find(q => q.id === questionId);
  
  if (!question) {
    return null;
  }

  return sanitizeQuestion(question);
}

/**
 * Get judge context for a specific question (server-side only)
 * This should NEVER be exposed via API
 */
export function getJudgeContext(vectorDB, questionId) {
  const question = vectorDB.find(q => q.id === questionId);
  return question ? question.judge_context : null;
}