/**
 * Audio Processing Service - Normalizes and transcribes audio
 * 
 * Pipeline:
 * 1. Receive WebM/MP4/OGG from browser
 * 2. Convert to WAV (16kHz, mono, PCM) using FFmpeg
 * 3. Send to Google Cloud Speech-to-Text
 * 4. Return transcript
 */

import ffmpeg from 'fluent-ffmpeg';
import speech from '@google-cloud/speech';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Google Cloud Speech client
const speechClient = new speech.SpeechClient({
  apiKey: process.env.GOOGLE_AI_API_KEY, // Uses same key as Gemini
});

/**
 * Normalize audio file to WAV format for STT
 * 
 * @param {string} inputPath - Path to input audio file
 * @param {string} outputPath - Path to output WAV file
 * @returns {Promise<string>} - Path to normalized audio
 */
export async function normalizeAudio(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    console.log('🔊 Normalizing audio...');
    
    ffmpeg(inputPath)
      .audioCodec('pcm_s16le') // Linear PCM 16-bit
      .audioChannels(1)         // Mono
      .audioFrequency(16000)    // 16kHz sample rate
      .format('wav')
      .on('start', (commandLine) => {
        console.log('   FFmpeg command:', commandLine);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`   Progress: ${Math.round(progress.percent)}%`);
        }
      })
      .on('end', () => {
        console.log('✅ Audio normalized successfully');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('❌ FFmpeg error:', err.message);
        reject(new Error(`Audio normalization failed: ${err.message}`));
      })
      .save(outputPath);
  });
}

/**
 * Transcribe audio using Google Cloud Speech-to-Text
 * 
 * @param {string} audioPath - Path to normalized WAV file
 * @returns {Promise<string>} - Transcribed text
 */
export async function transcribeAudio(audioPath) {
  try {
    console.log('🎙️  Transcribing audio...');

    // Read audio file
    const audioBytes = await fs.readFile(audioPath);
    const audioContent = audioBytes.toString('base64');

    // Configure STT request
    const request = {
      audio: {
        content: audioContent,
      },
      config: {
        encoding: 'LINEAR16',
        sampleRateHertz: 16000,
        languageCode: process.env.STT_LANGUAGE_CODE || 'en-US',
        model: process.env.STT_MODEL || 'latest_long',
        enableAutomaticPunctuation: true,
        useEnhanced: false, // Use standard model (cheaper)
      },
    };

    // Call STT API
    const [response] = await speechClient.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join(' ');

    if (!transcription || transcription.trim().length === 0) {
      console.warn('⚠️  Empty transcription (silent audio?)');
      return '';
    }

    console.log(`✅ Transcription complete (${transcription.length} chars)`);
    console.log(`   Preview: "${transcription.substring(0, 100)}..."`);

    return transcription;
  } catch (error) {
    console.error('❌ Transcription error:', error.message);
    
    // If audio is silent or invalid, return empty string instead of failing
    if (error.message.includes('empty') || error.message.includes('silent')) {
      console.warn('⚠️  Treating as empty transcription');
      return '';
    }
    
    throw new Error(`Audio transcription failed: ${error.message}`);
  }
}

/**
 * Clean up temporary files
 */
export async function cleanupTempFiles(...paths) {
  for (const filePath of paths) {
    try {
      await fs.unlink(filePath);
      console.log(`🗑️  Cleaned up: ${path.basename(filePath)}`);
    } catch (error) {
      // Ignore errors (file might not exist)
    }
  }
}