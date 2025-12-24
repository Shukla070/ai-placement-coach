/**
 * Evaluation Route - Handles code + audio submission
 */

import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { normalizeAudio, transcribeAudio, cleanupTempFiles } from '../services/audio.js';
import { evaluateSubmission } from '../services/judge.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: path.join(__dirname, '../../temp/'),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
  fileFilter: (req, file, cb) => {
    // Validate audio MIME types
    const allowedTypes = ['audio/webm', 'audio/mp4', 'audio/ogg', 'audio/wav'];
    const isValidType = allowedTypes.some(type => file.mimetype.includes(type));
    
    if (isValidType) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format: ${file.mimetype}`));
    }
  },
});

/**
 * POST /api/evaluate
 * 
 * Body (multipart/form-data):
 * - questionId: string
 * - code: string
 * - audio: file (audio blob)
 */
router.post('/evaluate', upload.single('audio'), async (req, res) => {
  const startTime = Date.now();
  let audioPath = null;
  let normalizedPath = null;

  try {
    console.log('\n🚀 === NEW EVALUATION REQUEST ===');
    
    // Extract form data
    const { questionId, code } = req.body;
    const audioFile = req.file;

    // Validation
    if (!questionId || !code || !audioFile) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: questionId, code, or audio',
      });
    }

    console.log('📝 Submission Details:');
    console.log(`   Question ID: ${questionId}`);
    console.log(`   Code length: ${code.length} chars`);
    console.log(`   Audio file: ${audioFile.originalname} (${(audioFile.size / 1024).toFixed(2)} KB)`);
    console.log(`   Audio type: ${audioFile.mimetype}`);

    // Load question with judge context
    const VECTOR_DB = req.app.get('VECTOR_DB');
    const question = VECTOR_DB.find(q => q.id === questionId);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: 'Question not found',
      });
    }

    if (!question.judge_context) {
      return res.status(500).json({
        success: false,
        error: 'Question missing judge context',
      });
    }

    // Step 1: Normalize audio
    audioPath = audioFile.path;
    normalizedPath = path.join(path.dirname(audioPath), `normalized_${path.basename(audioPath)}.wav`);
    
    await normalizeAudio(audioPath, normalizedPath);

    // Step 2: Transcribe audio
    const transcript = await transcribeAudio(normalizedPath);

    // Step 3: Evaluate with AI
    const evaluation = await evaluateSubmission(question, code, transcript);

    // Step 4: Return results
    const processingTime = Date.now() - startTime;
    console.log(`✅ Evaluation complete in ${(processingTime / 1000).toFixed(2)}s`);
    console.log('=================================\n');

    res.json({
      success: true,
      ...evaluation,
      metadata: {
        processingTimeMs: processingTime,
        transcriptLength: transcript.length,
        audioSizeKB: (audioFile.size / 1024).toFixed(2),
      },
    });

  } catch (error) {
    console.error('❌ Evaluation failed:', error.message);
    console.error(error.stack);

    res.status(500).json({
      success: false,
      error: error.message,
    });

  } finally {
    // Clean up temp files
    if (audioPath || normalizedPath) {
      await cleanupTempFiles(audioPath, normalizedPath);
    }
  }
});

export default router;