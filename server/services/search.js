/**
 * Hybrid Search Service - Combines filtering + vector similarity
 * Uses Vertex AI for embeddings via REST API
 */

import fetch from 'node-fetch';

// Get access token for API calls
async function getAccessToken() {
  const { GoogleAuth } = await import('google-auth-library');
  const auth = new GoogleAuth({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  const client = await auth.getClient();
  const token = await client.getAccessToken();
  return token.token;
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
 * Generate embedding for search query using Vertex AI REST API
 */
async function generateQueryEmbedding(queryText) {
    try {
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
        const location = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
        const accessToken = await getAccessToken();
        
        const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/text-embedding-004:predict`;
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            instances: [{ content: queryText }],
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(`API error ${response.status}: ${error}`);
        }

        const result = await response.json();
        
        // Extract embedding values
        if (result.predictions && result.predictions[0]) {
          const prediction = result.predictions[0];
          
          if (prediction.embeddings && prediction.embeddings.values) {
            return prediction.embeddings.values;
          }
          
          if (prediction.values) {
            return prediction.values;
          }
        }
        
        throw new Error('Could not extract embedding values from response');
    } catch (error) {
        console.error('Embedding error details:', error);
        throw new Error(`Failed to generate query embedding: ${error.message}`);
    }
}

/**
 * Apply metadata filters to narrow down candidates
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
    .filter(q => q.embedding && q.embedding.length > 0)
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
 */
export function getJudgeContext(vectorDB, questionId) {
  const question = vectorDB.find(q => q.id === questionId);
  return question ? question.judge_context : null;
}