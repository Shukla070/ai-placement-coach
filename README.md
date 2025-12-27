# 🎯 AI Placement Coach

> **Multimodal AI-powered coding interview practice platform** - Get instant feedback on your code AND explanation using Google Cloud AI

[![Google Cloud](https://img.shields.io/badge/Google_Cloud-Vertex_AI-4285F4?logo=google-cloud\u0026logoColor=white)](https://cloud.google.com/vertex-ai)
[![Live Demo](https://img.shields.io/badge/Live_MVP-🚀_Try_Now-success)](#) <!-- Update with deployment URL -->
[![Demo Video](https://img.shields.io/badge/Demo-▶_Watch_(3_min)-red?logo=youtube)](#) <!-- Update with YouTube link -->

---

## 📖 Overview

**AI Placement Coach** helps you ace technical interviews by evaluating both your **coding skills** and **communication ability** - just like a real interview.

Most practice platforms only check if your code runs. We use **Google Vertex AI** to analyze your code quality, efficiency, AND how well you explain your approach.

### 🎥 [Watch Demo Video (3 min)](#) <!-- Add YouTube link -->

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Google Cloud account with Vertex AI enabled
- Service account credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shukla070/ai-placement-coach.git
   cd ai-placement-coach
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up Google Cloud credentials**
   ```bash
   # Create credentials directory
   mkdir credentials
   
   # Add your service account JSON file
   # credentials/service-account.json
   ```

4. **Configure environment variables**
   ```bash
   # Copy example files
   cp .env.example .env
   cp client/.env.example client/.env
   
   # Edit .env with your values
   GOOGLE_CLOUD_PROJECT_ID=your-project-id
   GOOGLE_APPLICATION_CREDENTIALS=./credentials/service-account.json
   ```

5. **Generate vector embeddings**
   ```bash
   npm run seed
   ```

6. **Start the application**
   ```bash
   # Terminal 1: Start backend
   npm start
   
   # Terminal 2: Start frontend
   cd client
   npm run dev
   ```

7. **Open in browser**
   ```
   http://localhost:5173
   ```

---

## ✨ Features

### 🔍 Semantic Question Search
- Find coding problems by concept, not just keywords
- Filter by difficulty, topic, company
- Hybrid search (vector + keyword matching)
- 35+ curated LeetCode-style questions

### 💻 Professional Code Editor
- Monaco Editor (same as VS Code)
- Syntax highlighting
- Auto-completion
- Real-time error detection

### 🎙️ Voice Explanation
- Record your thought process
- Playback before submission
- Browser-based audio capture

### 🤖 AI-Powered Evaluation
- **Google Vertex AI** (Gemini 1.5 Flash) analyzes your submission
- Evaluates code correctness, efficiency, and style
- Assesses explanation clarity and completeness
- Provides detailed, actionable feedback

---

## 🏗️ Architecture

```
User Browser (React)
      ↓
Express Backend
      ↓
Google Cloud Services:
  • Vertex AI (Code + Explanation Judge)
  • Speech-to-Text (Audio Transcription)
  • Embeddings (Semantic Search)
```

**Full architecture diagram**: [`docs/diagrams/architecture.png`](docs/diagrams/architecture.png)

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI library
- **Vite** - Fast build tool
- **TailwindCSS 4** - Utility-first styling
- **Monaco Editor** - Professional code editor
- **React Markdown** - Render problem statements

### Backend
- **Node.js + Express** - Server framework
- **Vector Search** - Semantic question matching
- **In-memory DB** - Fast question retrieval

### Google Cloud
- **Vertex AI** - Gemini 1.5 Flash for judging
- **Cloud Speech-to-Text** - Audio transcription
- **Generative AI** - Embeddings for search

---

## 📊 Google Techsprint Submission

This project was built for **Google Techsprint 2025**.

📄 **Full submission details**: [TECHSPRINT_SUBMISSION.md](TECHSPRINT_SUBMISSION.md)

### What Makes It Special?
✅ **Multimodal AI** - Only platform that evaluates code + explanation  
✅ **Google Cloud Native** - Built entirely on GCP services  
✅ **Real Interview Simulation** - Practice like you'll be tested  
✅ **Instant Feedback** - Zero marginal cost, unlimited practice  

### Submission Materials:
- **Problem Statement**: Interview prep is expensive ($200-500/session) and lacks scalable feedback
- **Solution**: AI-powered multimodal assessment using Google Cloud
- **Differentiation**: First platform to evaluate explanation quality, not just code
- **Process Flow**: [docs/diagrams/process_flow.png](docs/diagrams/process_flow.png)
- **Use Case Diagram**: [docs/diagrams/usecase.png](docs/diagrams/usecase.png)
- **Screenshots**: [docs/screenshots/](docs/screenshots/)

---

## 📸 Screenshots

### Search Interface
![Search](docs/screenshots/search.png)

### Code Editor
![Editor](docs/screenshots/editor.png)

### AI Feedback
![Feedback](docs/screenshots/feedback.png)

---

## 🔗 Links

- **Live MVP**: _[Deployment URL]_ <!-- Update after deployment -->
- **Demo Video**: _[YouTube Link]_ <!-- Add 3-min demo video -->
- **GitHub**: [https://github.com/Shukla070/ai-placement-coach](https://github.com/Shukla070/ai-placement-coach)

---

## 📈 Future Roadmap

### Phase 1 (Next 3 months)
- 500+ questions covering all major topics
- Company-specific interview tracks (Google, Amazon, Microsoft)
- Support for Python, Java, C++

### Phase 2 (Next 6 months)
- User authentication and progress tracking
- Mock interview mode with timer
- Collaborative features and discussion forums

### Phase 3 (Next 12 months)
- Premium tier with advanced features
- Enterprise edition for bootcamps/universities
- Job matching for top performers

---

## 🤝 Contributing

Contributions are welcome! Please see our contributing guidelines.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file

---

## 👨‍💻 Author

**[Your Name]**  
📧 [Your Email]  
🎓 [Your University]  

---

## 🙏 Acknowledgments

Built with ❤️ using:
- Google Cloud Platform (Vertex AI, Speech-to-Text)
- React ecosystem
- Monaco Editor
- Open source community

Special thanks to **Google Techsprint** for the opportunity to innovate in AI-powered education.

---

Made with 🚀 by [Your Team] for Google Techsprint 2025
