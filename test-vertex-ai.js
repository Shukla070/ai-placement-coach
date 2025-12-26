import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

dotenv.config();

console.log('Testing Vertex AI Connection...\n');
console.log('Project:', process.env.GOOGLE_CLOUD_PROJECT_ID);
console.log('Location:', process.env.GOOGLE_CLOUD_LOCATION || 'us-central1');
console.log('Credentials:', process.env.GOOGLE_APPLICATION_CREDENTIALS);

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

async function test() {
  try {
    const model = vertexAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
    });

    const result = await model.generateContent('Say "Vertex AI works!"');
    const response = result.response;
    const text = response.candidates[0].content.parts[0].text;
    
    console.log('\n✅ SUCCESS!');
    console.log('Response:', text);
  } catch (error) {
    console.error('\n❌ FAILED:', error.message);
  }
}

test();