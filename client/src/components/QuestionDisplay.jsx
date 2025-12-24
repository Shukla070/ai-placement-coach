/**
 * QuestionDisplay Component - Renders question with metadata
 */

import ReactMarkdown from 'react-markdown';

export default function QuestionDisplay({ question }) {
  if (!question) {
    return (
      <div className="card p-6 text-center text-gray-400">
        <p>Select a question to begin practicing</p>
      </div>
    );
  }

  const { title, metadata, display_markdown } = question;

  return (
    <div className="card p-6 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
        
        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            metadata.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
            metadata.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
            'bg-red-900 text-red-200'
          }`}>
            {metadata.difficulty}
          </span>
          
          {metadata.topics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900 text-blue-200"
            >
              {topic}
            </span>
          ))}
          
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900 text-purple-200">
            ⭐ {metadata.frequency_rating}/5
          </span>
        </div>
      </div>

      {/* Companies */}
      <div className="flex items-center gap-2 text-sm text-gray-400">
        <span>Asked at:</span>
        <div className="flex gap-2">
          {metadata.companies.map((company) => (
            <span key={company} className="font-semibold text-gray-300">
              {company}
            </span>
          ))}
        </div>
      </div>

      {/* Problem Statement */}
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown>{display_markdown}</ReactMarkdown>
      </div>
    </div>
  );
}