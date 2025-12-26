import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

console.log('Testing Gemini API Key...');
console.log('Key from env:', process.env.GOOGLE_AI_API_KEY?.substring(0, 20) + '...');

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

try {
  const result = await model.generateContent('Say "test successful"');
  const response = await result.response;
  console.log('✅ API Key works!');
  console.log('Response:', response.text());
} catch (error) {
  console.error('❌ API Key failed:', error.message);
}