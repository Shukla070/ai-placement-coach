import { VertexAI } from '@google-cloud/vertexai';
import dotenv from 'dotenv';

dotenv.config();

const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

async function testEmbedding() {
  try {
    console.log('Testing Vertex AI Text Embeddings...\n');
    
    const model = vertexAI.preview.getGenerativeModel({
      model: 'text-embedding-004',
    });
    
    const request = {
      content: { role: 'user', parts: [{ text: 'test embedding' }] }
    };
    
    const result = await model.embedContent(request);
    
    console.log('✅ Embedding generated!');
    console.log('Result structure:', JSON.stringify(result, null, 2).substring(0, 500));
    
    // Try to find the values
    if (result.embeddings?.values) {
      console.log('\n✅ Found at: result.embeddings.values');
      console.log('Dimension:', result.embeddings.values.length);
    } else if (result.embedding?.values) {
      console.log('\n✅ Found at: result.embedding.values');
      console.log('Dimension:', result.embedding.values.length);
    } else {
      console.log('\n❌ Could not find embedding values');
      console.log('Full result:', JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

testEmbedding();