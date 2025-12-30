/**
 * Question Loader Service - Loads and manages theory question banks
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// In-memory cache for question banks
const QUESTION_BANKS = {};

/**
 * Load a question bank for a specific subject
 */
export async function loadQuestionBank(subject) {
    // Return cached if available
    if (QUESTION_BANKS[subject]) {
        return QUESTION_BANKS[subject];
    }

    // Map subject codes to file names
    const fileMap = {
        'OS': 'OS_questionbank.json',
        'DBMS': 'DBMS_questionbank.json',
        'OOPS': 'OOPS_questionbank.json'
    };

    const fileName = fileMap[subject];
    if (!fileName) {
        throw new Error(`Unknown subject: ${subject}`);
    }

    try {
        const filePath = path.join(__dirname, '../../data', fileName);
        const data = await fs.readFile(filePath, 'utf-8');
        const questions = JSON.parse(data);

        // Cache it
        QUESTION_BANKS[subject] = questions;

        console.log(`✅ Loaded ${questions.length} ${subject} questions`);
        return questions;
    } catch (error) {
        console.error(`❌ Failed to load ${subject} questions:`, error.message);
        throw new Error(`Failed to load ${subject} question bank`);
    }
}

/**
 * Get a random question from a subject, excluding already answered ones
 */
export function getRandomQuestion(subject, excludeIds = []) {
    const questions = QUESTION_BANKS[subject];

    if (!questions) {
        throw new Error(`Question bank for ${subject} not loaded`);
    }

    // Filter out excluded questions
    const available = questions.filter(q => !excludeIds.includes(q.id));

    if (available.length === 0) {
        return null;
    }

    // Pick random
    const randomIndex = Math.floor(Math.random() * available.length);
    return available[randomIndex];
}

/**
 * Get question by ID
 */
export function getQuestionById(subject, questionId) {
    const questions = QUESTION_BANKS[subject];

    if (!questions) {
        throw new Error(`Question bank for ${subject} not loaded`);
    }

    return questions.find(q => q.id === questionId);
}

/**
 * Get question bank stats
 */
export function getQuestionBankStats(subject) {
    const questions = QUESTION_BANKS[subject];

    if (!questions) {
        return null;
    }

    return {
        total: questions.length,
        subject: subject
    };
}
