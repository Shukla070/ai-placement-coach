/**
 * Express Server - AI Placement Coach Backend
 */

import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables FIRST (before any other imports)
dotenv.config({ path: path.join(__dirname, '../.env') });

// DEBUG: Verify environment variables are loaded
console.log('🔑 Environment Check:');
console.log('   GOOGLE_CLOUD_PROJECT_ID:', process.env.GOOGLE_CLOUD_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('   GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? '✅ Set' : '❌ Missing');
console.log('');

// NOW import other modules (after .env is loaded)
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { hybridSearch, getQuestionById } from './services/search.js';
import { loadQuestionBank, getRandomQuestion } from './services/questionLoader.js';
import evaluateRouter from './routes/evaluate.js';

// Configuration
const PORT = process.env.PORT || 3001;
const VECTOR_DB_PATH = process.env.VECTOR_DB_PATH || path.join(__dirname, '../data/questions_with_vectors.json');

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Global in-memory vector database
let VECTOR_DB = [];

/**
 * Load vector database into memory on server startup
 */
async function loadVectorDatabase() {
  console.log('📂 Loading vector database...');
  console.log(`   Path: ${VECTOR_DB_PATH}`);

  try {
    const rawData = await fs.readFile(VECTOR_DB_PATH, 'utf-8');
    VECTOR_DB = JSON.parse(rawData);

    const validQuestions = VECTOR_DB.filter(q => q.embedding && q.embedding.length > 0);
    const failedQuestions = VECTOR_DB.length - validQuestions.length;

    console.log(`✅ Loaded ${validQuestions.length} questions with embeddings`);
    if (failedQuestions > 0) {
      console.warn(`⚠️  ${failedQuestions} questions have missing embeddings`);
    }

    // Calculate memory usage
    const memoryMB = (JSON.stringify(VECTOR_DB).length / 1024 / 1024).toFixed(2);
    console.log(`💾 Memory usage: ~${memoryMB} MB`);

    // Store in app for access by routes
    app.set('VECTOR_DB', VECTOR_DB);

    return true;
  } catch (error) {
    console.error('❌ Failed to load vector database:', error.message);
    console.error('   Make sure to run: npm run seed');
    return false;
  }
}

/**
 * API Routes
 */

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    questionsLoaded: VECTOR_DB.length
  });
});

// Search questions
// POST /api/search
// Body: { query: string, filters?: {...}, topK?: number }
app.post('/api/search', async (req, res) => {
  try {
    const { query, filters, topK } = req.body;

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        error: 'Query is required and must be a string'
      });
    }

    const result = await hybridSearch(VECTOR_DB, query, filters, topK);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single question by ID
// GET /api/questions/:id
app.get('/api/questions/:id', (req, res) => {
  try {
    const question = getQuestionById(VECTOR_DB, req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found'
      });
    }

    res.json({
      success: true,
      question
    });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List all questions (metadata only)
// GET /api/questions
app.get('/api/questions', (req, res) => {
  try {
    const questions = VECTOR_DB.map(q => ({
      id: q.id,
      title: q.title,
      metadata: q.metadata
    }));

    res.json({
      success: true,
      count: questions.length,
      questions
    });
  } catch (error) {
    console.error('List questions error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Random question endpoint for theory subjects
// GET /api/questions/random/:subject?exclude=id1,id2,id3
app.get('/api/questions/random/:subject', async (req, res) => {
  try {
    const { subject } = req.params;
    const exclude = req.query.exclude ? req.query.exclude.split(',') : [];

    // Validate subject
    const validSubjects = ['OS', 'DBMS', 'OOPS'];
    if (!validSubjects.includes(subject)) {
      return res.status(400).json({
        success: false,
        error: `Invalid subject. Must be one of: ${validSubjects.join(', ')}`
      });
    }

    // Get random question
    const question = getRandomQuestion(subject, exclude);

    if (!question) {
      return res.json({
        success: false,
        message: 'No more questions available',
        allAnswered: true
      });
    }

    // Return sanitized question (without reference_answer for security)
    const { reference_answer, expected_points, keywords, ...clientQuestion } = question;

    res.json({
      success: true,
      question: clientQuestion
    });
  } catch (error) {
    console.error('Random question error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Mount evaluation router
app.use('/api', evaluateRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

/**
 * Server startup
 */
async function startServer() {
  console.log('🚀 Starting AI Placement Coach Server...\n');

  // Load vector database (for DSA)
  const dbLoaded = await loadVectorDatabase();
  if (!dbLoaded) {
    console.error('\n❌ Cannot start server without vector database');
    process.exit(1);
  }

  // Load theory question banks
  console.log('\n📚 Loading theory question banks...');
  try {
    await loadQuestionBank('OS');
    await loadQuestionBank('DBMS');
    await loadQuestionBank('OOPS');
    console.log('✅ All theory question banks loaded');
  } catch (error) {
    console.error('❌ Failed to load theory questions:', error.message);
    // Don't exit - DSA can still work
  }

  // Start Express server
  app.listen(PORT, () => {
    console.log(`\n✅ Server running on http://localhost:${PORT}`);
    console.log(`\n📚 Available endpoints:`);
    console.log(`   GET  /health`);
    console.log(`   GET  /api/questions`);
    console.log(`   GET  /api/questions/:id`);
    console.log(`   POST /api/search`);
    console.log(`\n💡 Try: curl -X POST http://localhost:${PORT}/api/search -H "Content-Type: application/json" -d '{"query":"array problems"}'`);
  });
}

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});