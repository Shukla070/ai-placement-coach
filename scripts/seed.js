/**
 * Embedding Pipeline - Generates vector embeddings for all questions
 * 
 * Usage: node scripts/seed.js
 * 
 * Requirements:
 * - GOOGLE_AI_API_KEY must be set in .env
 * - data/questions_master.json must exist
 * 
 * Output: data/questions_with_vectors.json
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Configuration
const CONFIG = {
  INPUT_PATH: path.join(__dirname, '../data/questions_master.json'),
  OUTPUT_PATH: path.join(__dirname, '../data/questions_with_vectors.json'),
  EMBEDDING_MODEL: 'text-embedding-004',
  BATCH_SIZE: 10, // Process 10 questions at a time to avoid rate limits
  RETRY_DELAY: 1000, // 1 second between retries
  MAX_RETRIES: 3
};

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

/**
 * Generate embedding for a single text string
 */
async function generateEmbedding(text, retries = 0) {
  try {
    const model = genAI.getGenerativeModel({ model: CONFIG.EMBEDDING_MODEL });
    const result = await model.embedContent(text);
    return result.embedding.values;
  } catch (error) {
    if (retries < CONFIG.MAX_RETRIES) {
      console.warn(`⚠️  Retry ${retries + 1}/${CONFIG.MAX_RETRIES} for text: "${text.substring(0, 50)}..."`);
      await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
      return generateEmbedding(text, retries + 1);
    }
    throw new Error(`Failed to generate embedding after ${CONFIG.MAX_RETRIES} retries: ${error.message}`);
  }
}

/**
 * Process questions in batches to avoid overwhelming the API
 */
async function processBatch(questions, startIdx) {
  const batch = questions.slice(startIdx, startIdx + CONFIG.BATCH_SIZE);
  const results = [];

  for (const question of batch) {
    console.log(`📝 Processing: ${question.title} (${question.id})`);
    
    try {
      const embedding = await generateEmbedding(question.search_text);
      results.push({
        ...question,
        embedding,
        _metadata: {
          embedding_model: CONFIG.EMBEDDING_MODEL,
          embedding_dim: embedding.length,
          generated_at: new Date().toISOString()
        }
      });
      
      console.log(`✅ Generated ${embedding.length}-dim vector for "${question.title}"`);
    } catch (error) {
      console.error(`❌ Failed to process "${question.title}": ${error.message}`);
      // Continue with other questions even if one fails
      results.push({
        ...question,
        embedding: null,
        _error: error.message
      });
    }
    
    // Small delay between API calls to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 200));
  }

  return results;
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Starting Embedding Pipeline...\n');

  // Validate API key
  if (!process.env.GOOGLE_AI_API_KEY) {
    throw new Error('GOOGLE_AI_API_KEY is not set in .env file');
  }

  // Read master questions file
  console.log(`📖 Reading: ${CONFIG.INPUT_PATH}`);
  const rawData = await fs.readFile(CONFIG.INPUT_PATH, 'utf-8');
  const questions = JSON.parse(rawData);
  console.log(`✅ Loaded ${questions.length} questions\n`);

  // Process in batches
  const processedQuestions = [];
  for (let i = 0; i < questions.length; i += CONFIG.BATCH_SIZE) {
    console.log(`\n🔄 Processing batch ${Math.floor(i / CONFIG.BATCH_SIZE) + 1}/${Math.ceil(questions.length / CONFIG.BATCH_SIZE)}`);
    const batch = await processBatch(questions, i);
    processedQuestions.push(...batch);
  }

  // Validation
  const successCount = processedQuestions.filter(q => q.embedding !== null).length;
  const failureCount = processedQuestions.length - successCount;

  console.log(`\n📊 Results:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);

  if (failureCount > 0) {
    console.warn(`\n⚠️  Some questions failed to process. Check the output file for _error fields.`);
  }

  // Save to file
  console.log(`\n💾 Saving to: ${CONFIG.OUTPUT_PATH}`);
  await fs.writeFile(
    CONFIG.OUTPUT_PATH,
    JSON.stringify(processedQuestions, null, 2),
    'utf-8'
  );

  console.log(`\n✨ Pipeline complete! Vector database ready at:\n   ${CONFIG.OUTPUT_PATH}`);
  console.log(`\n📦 File size: ${(await fs.stat(CONFIG.OUTPUT_PATH)).size / 1024} KB`);
}

// Execute
main().catch(error => {
  console.error('\n💥 Pipeline failed:', error.message);
  process.exit(1);
});