/**
 * Judge Service - AI-powered code evaluation using Vertex AI
 */

import { VertexAI } from '@google-cloud/vertexai';

/**
 * Build the judge prompt with XML structure
 */
function buildJudgePrompt(question, userCode, transcript) {
  return `You are a Senior Technical Interviewer evaluating a coding interview submission.

EVALUATION PROTOCOL:
1. Compare the user's code against the optimal solution
2. Check if the explanation (transcript) mentions time/space complexity
3. Assess code correctness, efficiency, and communication quality
4. If the transcript is empty, score communication as 0

QUESTION CONTEXT:
<question>
${question.search_text}
</question>

OPTIMAL SOLUTION:
<gold_standard>
Language: JavaScript
${question.judge_context.optimal_solution_code}

Time Complexity: ${question.judge_context.time_complexity}
Space Complexity: ${question.judge_context.space_complexity}

Key Insights:
${question.judge_context.key_insights.map(insight => `- ${insight}`).join('\n')}

Edge Cases to Consider:
${question.judge_context.edge_cases.map(edge => `- ${edge}`).join('\n')}
</gold_standard>

USER SUBMISSION:
<user_code>
${userCode}
</user_code>

<transcript>
${transcript || '[No verbal explanation provided]'}
</transcript>

SCORING RUBRIC:
- Correctness (0-40): Does the code solve the problem? Are edge cases handled?
- Efficiency (0-30): Is the time/space complexity optimal?
- Communication (0-30): Did they explain their approach, complexity, and trade-offs?

OUTPUT FORMAT (JSON only, no markdown):
{
  "score": <number 0-100>,
  "breakdown": {
    "correctness": <number 0-40>,
    "efficiency": <number 0-30>,
    "communication": <number 0-30>
  },
  "feedback": "<detailed feedback paragraph>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}

Respond with ONLY the JSON object, no additional text.`;
}

/**
 * Evaluate a coding submission using Vertex AI Gemini
 */
export async function evaluateSubmission(question, userCode, transcript) {
  try {
    console.log('⚖️  Starting evaluation...');
    console.log(`   Question: ${question.title}`);
    console.log(`   Code length: ${userCode.length} chars`);
    console.log(`   Transcript length: ${transcript.length} chars`);

    // Build prompt
    const prompt = buildJudgePrompt(question, userCode, transcript);

    // Initialize Vertex AI (create fresh each time to ensure env vars are loaded)
    const vertexAI = new VertexAI({
      project: process.env.GOOGLE_CLOUD_PROJECT_ID,
      location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
    });

    // Get Gemini 2.0 Flash model from Vertex AI
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.3,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 8192,
      },
    });

    console.log('🤖 Calling Vertex AI Gemini...');

    // Generate content
    const result = await generativeModel.generateContent(prompt);
    const response = result.response;
    const responseText = response.candidates[0].content.parts[0].text;

    console.log('🤖 AI Response received');
    console.log('   Raw response length:', responseText.length);

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
    console.log(`   Breakdown: C=${evaluation.breakdown.correctness}, E=${evaluation.breakdown.efficiency}, Co=${evaluation.breakdown.communication}`);

    return evaluation;

  } catch (error) {
    console.error('❌ Evaluation error:', error.message);
    throw new Error(`Failed to evaluate submission: ${error.message}`);
  }
}