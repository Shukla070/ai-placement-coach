/**
 * QuestionDisplay Component - Enhanced design
 */

import ReactMarkdown from 'react-markdown';

export default function QuestionDisplay({ question }) {
  if (!question) {
    return null;
  }

  const { title, metadata, display_markdown } = question;

  return (
    <div className="card p-6 space-y-4">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-3">{title}</h2>
        
        {/* Metadata Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            metadata.difficulty === 'Easy' ? 'bg-green-900 text-green-200 border border-green-700' :
            metadata.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200 border border-yellow-700' :
            'bg-red-900 text-red-200 border border-red-700'
          }`}>
            {metadata.difficulty}
          </span>
          
          {metadata.topics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-900 text-blue-200 border border-blue-700"
            >
              {topic}
            </span>
          ))}
          
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-900 text-purple-200 border border-purple-700">
            ⭐ {metadata.frequency_rating}/5
          </span>
        </div>

        {/* Companies */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Asked at:</span>
          <div className="flex flex-wrap gap-2">
            {metadata.companies.map((company) => (
              <span 
                key={company} 
                className="px-2 py-1 bg-gray-800 rounded text-xs font-semibold text-gray-300 border border-gray-600"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700"></div>

      {/* Problem Statement */}
      <div className="prose prose-invert prose-sm max-w-none">
        <ReactMarkdown
          components={{
            h3: ({node, ...props}) => <h3 className="text-lg font-bold text-white mt-4 mb-2" {...props} />,
            p: ({node, ...props}) => <p className="text-gray-300 mb-3 leading-relaxed" {...props} />,
            code: ({node, inline, ...props}) => 
              inline ? 
                <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm text-blue-300" {...props} /> :
                <code className="block bg-gray-900 p-4 rounded-lg text-sm text-gray-200 overflow-x-auto" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-300 space-y-1 mb-3" {...props} />,
            li: ({node, ...props}) => <li className="text-gray-300" {...props} />,
          }}
        >
          {display_markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}