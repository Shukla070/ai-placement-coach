/**
 * Theory Judge Service - AI-powered theory answer evaluation using Vertex AI
 */

import { VertexAI } from '@google-cloud/vertexai';

/**
 * Build the judge prompt for theory questions
 */
function buildTheoryJudgePrompt(question, userAnswer) {
    return `You are evaluating a student's answer to a technical interview question.

QUESTION:
${question.question}

REFERENCE ANSWER:
${question.reference_answer}

EXPECTED KEY POINTS:
${question.expected_points.map((p, i) => `${i + 1}. ${p}`).join('\n')}

IMPORTANT KEYWORDS:
${question.keywords.join(', ')}

STUDENT'S ANSWER:
${userAnswer}

EVALUATION CRITERIA:
1. Clarity (0-30): Is the answer well-structured and easy to understand?
2. Completeness (0-40): Does it cover the expected key points?
3. Accuracy (0-30): Is the technical information correct?

OUTPUT FORMAT (JSON only, no markdown):
{
  "score": <total 0-100>,
  "breakdown": {
    "clarity": <0-30>,
    "completeness": <0-40>,
    "accuracy": <0-30>
  },
  "feedback": "<2-3 sentence constructive feedback>",
  "matchedKeywords": ["keyword1", "keyword2"],
  "missedPoints": ["point they should have mentioned"],
  "strengths": ["what they did well"],
  "improvements": ["specific areas to improve"]
}

Respond with ONLY the JSON object, no additional text.`;
}

/**
 * Evaluate a theory answer using Vertex AI Gemini
 */
export async function evaluateTheoryAnswer(question, userAnswer) {
    try {
        console.log('⚖️  Evaluating theory answer...');
        console.log(`   Question ID: ${question.id}`);
        console.log(`   Answer length: ${userAnswer.length} chars`);

        // Build prompt
        const prompt = buildTheoryJudgePrompt(question, userAnswer);

        // Initialize Vertex AI
        const vertexAI = new VertexAI({
            project: process.env.GOOGLE_CLOUD_PROJECT_ID,
            location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
        });

        // Get Gemini model
        const generativeModel = vertexAI.getGenerativeModel({
            model: 'gemini-2.0-flash-exp',
            generationConfig: {
                temperature: 0.3,
                topP: 0.8,
                topK: 40,
                maxOutputTokens: 4096,
            },
        });

        console.log('🤖 Calling Vertex AI Gemini...');

        // Generate evaluation
        const result = await generativeModel.generateContent(prompt);
        const response = result.response;
        const responseText = response.candidates[0].content.parts[0].text;

        console.log('🤖 AI Response received');

        // Parse JSON response
        const cleanedResponse = responseText
            .replace(/```json\n?/g, '')
            .replace(/```\n?/g, '')
            .trim();

        let evaluation;
        try {
            evaluation = JSON.parse(cleanedResponse);
        } catch (parseError) {
            console.error('❌ Failed to parse AI response:', cleanedResponse);
            throw new Error('AI returned invalid JSON format');
        }

        // Validate structure
        if (!evaluation.score || !evaluation.breakdown || !evaluation.feedback) {
            throw new Error('AI response missing required fields');
        }

        // Ensure score is within bounds
        evaluation.score = Math.max(0, Math.min(100, evaluation.score));

        console.log('✅ Evaluation complete');
        console.log(`   Final Score: ${evaluation.score}/100`);
        console.log(`   Breakdown: Clarity=${evaluation.breakdown.clarity}, Completeness=${evaluation.breakdown.completeness}, Accuracy=${evaluation.breakdown.accuracy}`);

        return evaluation;

    } catch (error) {
        console.error('❌ Evaluation error:', error.message);
        throw new Error(`Failed to evaluate answer: ${error.message}`);
    }
}
