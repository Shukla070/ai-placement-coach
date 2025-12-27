# AI Placement Coach - Google Techsprint Submission

## 1. Problem Statement

**The Challenge:**
Coding interview preparation is expensive, time-consuming, and lacks personalized feedback:
- Professional mock interviews cost **$200-500 per session**
- Traditional practice platforms like LeetCode only check if code runs, not if you can explain it
- Real technical interviews test **both** coding skills **and** communication ability
- Job seekers need practice explaining their thought process, not just writing code

**Who It Affects:**
- Computer science students preparing for campus placements
- Software engineers switching jobs
- Bootcamp graduates entering the industry
- Anyone preparing for technical interviews at competitive companies

---

## 2. Our Solution

**AI Placement Coach** is a multimodal AI-powered interview practice platform that evaluates **both your code AND your explanation**, providing instant, detailed feedback.

### How It Works:
1. **Smart Question Search**: Semantic search powered by vector embeddings finds relevant problems
2. **Code Your Solution**: Write code in a professional Monaco editor with syntax highlighting
3. **Explain Your Approach**: Record a voice explanation of your solution strategy
4. **AI-Powered Evaluation**: Google's Vertex AI analyzes both code quality and explanation clarity
5. **Detailed Feedback**: Receive actionable insights on correctness, efficiency, and communication

---

## 3. What Makes Us Different

| Feature | LeetCode | InterviewBit | HackerRank | **AI Placement Coach** |
|---------|----------|--------------|------------|------------------------|
| Code Execution | ✅ | ✅ | ✅ | ✅ |
| Test Cases | ✅ | ✅ | ✅ | ✅ |
| Voice Explanation Evaluation | ❌ | ❌ | ❌ | ✅ |
| AI-Powered Feedback | ❌ | ❌ | ❌ | ✅ |
| Communication Skills Assessment | ❌ | ❌ | ❌ | ✅ |
| Multimodal Analysis | ❌ | ❌ | ❌ | ✅ |

### Key Differentiators:
- **Only platform that evaluates explanation quality** - Real interviews aren't just about working code
- **Multimodal AI assessment** - Analyzes code structure, efficiency, AND verbal reasoning
- **Instant feedback** - No waiting for human reviewers (zero marginal cost per session)
- **Semantic search** - RAG-based question discovery finds relevant problems by concept, not just keywords
- **Powered by Google Cloud** - Enterprise-grade AI using Vertex AI's latest models

---

## 4. How It Solves the Problem

### For Job Seekers:
✅ **Affordable Practice**: Free tier enables unlimited practice without expensive coaching  
✅ **Realistic Simulation**: Mimics real interview conditions (code + explain)  
✅ **Personalized Feedback**: AI identifies specific weaknesses in both coding and communication  
✅ **Scalable Learning**: Practice anytime, anywhere, at your own pace  

### Technical Solution:
- **Vector Search (RAG)**: Finds relevant questions using semantic similarity, not just keywords
- **Multimodal AI**: Combines code analysis with speech-to-text transcription for holistic evaluation
- **Intelligent Judging**: Vertex AI compares solutions against optimal approaches, identifies edge cases
- **Zero Marginal Cost**: AI scales to millions of users without human graders

---

## 5. Features

### Core Features

#### 🔍 **Semantic Question Search**
- Vector embedding-based search using Google Cloud
- Filter by difficulty, topic, company
- Hybrid search combining keyword + semantic matching
- 35+ curated LeetCode-style questions

#### 💻 **Professional Code Editor**
- Monaco Editor (same as VS Code)
- Syntax highlighting for JavaScript
- Auto-completion and error detection
- Responsive design for all screen sizes

#### 🎙️ **Voice Recording**
- Browser-based audio capture
- Real-time recording indicator
- Playback before submission
- WebM format for optimal size

#### 🤖 **AI-Powered Judge**
- **Google Vertex AI** (Gemini 1.5 Flash) for evaluation
- Analyzes code correctness, efficiency, style
- Evaluates explanation clarity and completeness
- Considers edge cases and alternative approaches
- Generates score (0-100) with detailed rubric

#### 📊 **Detailed Feedback**
- Breakdown by category (correctness, complexity, explanation)
- Specific improvement suggestions
- Comparison to optimal solution
- Visual score display

---

## 6. Google Technologies Used

### Primary Google Cloud Services:

#### 1. **Vertex AI (Gemini 1.5 Flash)**
- **Purpose**: Multimodal AI judge
- **Usage**: Evaluates code + transcribed audio explanation
- **Why**: State-of-the-art reasoning, handles complex code analysis, cost-effective
- **Integration**: `/api/evaluate` endpoint sends code + transcript via Vertex AI SDK

#### 2. **Google Cloud Speech-to-Text**
- **Purpose**: Convert voice explanations to text
- **Usage**: Transcribes user audio recordings for AI analysis
- **Why**: High accuracy, supports technical vocabulary
- **Integration**: Server-side transcription using `@google-cloud/speech` package

#### 3. **Google Generative AI Embeddings**
- **Purpose**: Vector embeddings for semantic search
- **Usage**: Generate embeddings for question descriptions and user queries
- **Why**: Enables semantic similarity matching (finding "two pointer problems" without exact keyword)
- **Integration**: `@google/generative-ai` package for embedding generation

### Technology Stack:

**Frontend:**
- React 19 with Vite
- TailwindCSS 4 for styling
- Monaco Editor for code editing
- React Markdown for question rendering

**Backend:**
- Node.js with Express
- Google Cloud libraries
- In-memory vector database
- RESTful API

**Google Cloud Architecture:**
```
User → Frontend → Backend API → Vertex AI (Judge) → Feedback
                      ↓
                  Speech-to-Text (Transcription)
                      ↓
                  Vector Search (Embeddings)
```

---

## 7. Process Flow Diagram

See [`docs/diagrams/process_flow.png`](docs/diagrams/process_flow.png) for visual representation.

**Step-by-Step Flow:**

1. **User searches** for coding question (e.g., "array two pointers")
2. **Backend generates embedding** for query using Google AI
3. **Vector search** finds semantically similar questions
4. **Hybrid ranking** combines vector similarity + keyword match
5. **Frontend displays** search results with relevance scores
6. **User selects** question and reads problem statement
7. **User writes code** in Monaco editor
8. **User records audio** explanation (30-60 seconds)
9. **Frontend submits** code + audio to backend
10. **Backend transcribes audio** using Cloud Speech-to-Text
11. **Backend sends** to Vertex AI with context:
    - User's code
    - Audio transcript
    - Question details
    - Optimal solution (for comparison)
12. **Vertex AI analyzes** and generates structured feedback
13. **Frontend displays** score and detailed feedback

---

## 8. Use Case Diagram

See [`docs/diagrams/usecase.png`](docs/diagrams/usecase.png)

**Actors:**
- Job Seeker (Primary User)
- AI Judge (System/Google Cloud)

**Use Cases:**
- Search for Questions
- Select Question
- Write Solution
- Record Explanation
- Submit for Evaluation
- Receive Feedback

---

## 9. Architecture Diagram

See [`docs/diagrams/architecture.png`](docs/diagrams/architecture.png)

**System Architecture:**

```
┌──────────────────────────────────────────┐
│          User Browser                    │
│  ┌────────────────────────────────────┐  │
│  │   React Frontend (Vite)            │  │
│  │   - Search UI                      │  │
│  │   - Code Editor (Monaco)           │  │
│  │   - Audio Recorder                 │  │
│  │   - Feedback Display               │  │
│  └────────────┬───────────────────────┘  │
└───────────────┼──────────────────────────┘
                │ HTTPS/REST API
                ▼
┌──────────────────────────────────────────┐
│       Express Backend (Node.js)          │
│  ┌────────────────────────────────────┐  │
│  │  API Routes:                       │  │
│  │  - POST /api/search                │  │
│  │  - POST /api/evaluate              │  │
│  │  - GET /api/questions/:id          │  │
│  └────────────┬───────────────────────┘  │
│               │                           │
│  ┌────────────┴───────────────────────┐  │
│  │  Services:                         │  │
│  │  - Search (Hybrid + Vector)        │  │
│  │  - Judge (AI Evaluation)           │  │
│  │  - Audio (Transcription)           │  │
│  └────────────┬───────────────────────┘  │
│               │                           │
│  ┌────────────┴───────────────────────┐  │
│  │  Vector Database (In-Memory)       │  │
│  │  - 35 questions with embeddings    │  │
│  └────────────────────────────────────┘  │
└───────────────┼──────────────────────────┘
                │
                ▼
┌──────────────────────────────────────────┐
│       Google Cloud Platform              │
│  ┌────────────────────────────────────┐  │
│  │  Vertex AI (Gemini 1.5 Flash)      │  │
│  │  └─ Code + Explanation Analysis    │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Cloud Speech-to-Text API          │  │
│  │  └─ Audio Transcription            │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Generative AI Embeddings          │  │
│  │  └─ Vector Generation              │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

## 10. MVP Snapshots

See [`docs/screenshots/`](docs/screenshots/) directory for detailed screenshots:

1. **Landing Page**: Search interface with filters
2. **Search Results**: Semantic + keyword matches with relevance scores
3. **Question View**: Problem statement with metadata (difficulty, topics, companies)
4. **Code Editor**: Monaco editor with syntax highlighting
5. **Audio Recorder**: Recording interface with waveform
6. **Feedback Screen**: AI-generated score and detailed feedback

---

## 11. Future Development

### Phase 1: Content Expansion (Next 3 months)
- **500+ Questions**: Expand question bank covering all major topics
- **Company-Specific Tracks**: Google, Microsoft, Amazon interview patterns
- **Multiple Languages**: Support Python, Java, C++ (currently JavaScript only)
- **Difficulty Progression**: Guided learning paths from Easy → Hard

### Phase 2: Enhanced Features (Next 6 months)
- **User Authentication**: Track progress across sessions
- **Progress Analytics**: Weak areas identification, improvement over time
- **Collaborative Features**: Peer code reviews, discussion forums
- **Mock Interview Mode**: Timed sessions simulating real interviews
- **Video Recording**: Capture screen + face like real video interviews

### Phase 3: Scale & Monetization (Next 12 months)
- **Premium Tier**: Advanced features, unlimited submissions, priority support
- **Enterprise**: Bootcamps and universities can use for student assessment
- **Real Human Reviewers**: Hybrid AI + human feedback for premium users
- **Job Matching**: Connect high performers with hiring companies

### Technical Improvements:
- **Database**: Migrate from in-memory to PostgreSQL + pgvector for scale
- **Real-time**: WebSocket for live feedback during coding
- **Performance**: Code execution sandbox for actual testing
- **ML Fine-tuning**: Custom-trained models for specific company interview styles

---

## 12. Links

### Required Submission Links:

- **GitHub Repository**: [https://github.com/Shukla070/ai-placement-coach](https://github.com/Shukla070/ai-placement-coach)
- **Demo Video (3 min)**: _[To be uploaded to YouTube]_
- **Live MVP**: _[To be deployed to Cloud Run + Vercel]_

---

## Team Information

- **Developer**: [Your Name]
- **University**: [Your University]
- **Contact**: [Your Email]

---

## Acknowledgments

Built using Google Cloud Platform technologies:
- Vertex AI (Gemini 1.5 Flash)
- Cloud Speech-to-Text
- Generative AI Embeddings

Special thanks to the Google Techsprint program for the opportunity to innovate in AI-powered education.
