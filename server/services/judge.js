/**
 * Judge Service - AI-powered code evaluation
 * 
 * Strategy:
 * 1. Load judge context (optimal solution, edge cases)
 * 2. Build structured prompt with XML delimiters
 * 3. Call Gemini Flash with JSON schema
 * 4. Parse and validate response
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

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
 * Evaluate a coding submission
 * 
 * @param {Object} question - Full question object with judge_context
 * @param {string} userCode - User's code submission
 * @param {string} transcript - Transcribed audio explanation
 * @returns {Promise<Object>} - Evaluation result
 */
export async function evaluateSubmission(question, userCode, transcript) {
  try {
    console.log('⚖️  Starting evaluation...');
    console.log(`   Question: ${question.title}`);
    console.log(`   Code length: ${userCode.length} chars`);
    console.log(`   Transcript length: ${transcript.length} chars`);

    // Build prompt
    const prompt = buildJudgePrompt(question, userCode, transcript);

    // Call Gemini Flash (fast and cheap for evaluation)
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-1.5-flash',
      generationConfig: {
        temperature: 0.3, // Lower temperature for more consistent scoring
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

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