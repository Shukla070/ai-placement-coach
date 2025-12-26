/**
 * QuestionDisplay Component - LeetCode Style
 */

import ReactMarkdown from 'react-markdown';

export default function QuestionDisplay({ question }) {
  if (!question) return null;

  const { title, metadata, display_markdown } = question;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-white leading-tight">{title}</h2>
      
      <div className="flex flex-wrap gap-2">
        <span className={`text-xs px-2 py-1 rounded font-semibold ${
          metadata.difficulty === 'Easy' 
            ? 'bg-green-500/20 text-green-400' 
            : metadata.difficulty === 'Medium'
            ? 'bg-yellow-500/20 text-yellow-400'
            : 'bg-red-500/20 text-red-400'
        }`}>
          {metadata.difficulty}
        </span>
        
        {metadata.topics.slice(0, 3).map((topic) => (
          <span key={topic} className="text-xs px-2 py-1 rounded bg-[#0ea5e9]/20 text-[#0ea5e9]">
            {topic}
          </span>
        ))}
      </div>

      <div className="border-t border-leetcode-border my-3"></div>

      <div className="prose prose-invert prose-sm max-w-none max-h-[500px] overflow-y-auto pr-2">
        <ReactMarkdown
          components={{
            h3: ({node, ...props}) => (
              <h3 className="text-base font-bold text-white mt-4 mb-2" {...props} />
            ),
            p: ({node, ...props}) => (
              <p className="text-gray-300 mb-3 leading-relaxed text-sm" {...props} />
            ),
            code: ({node, inline, ...props}) => 
              inline ? 
                <code className="bg-[#1a1a1a] px-1.5 py-0.5 rounded text-xs text-[#0ea5e9] font-mono" {...props} /> :
                <code className="block bg-[#1a1a1a] p-3 rounded text-xs text-gray-200 overflow-x-auto border border-leetcode-border my-2 font-mono" {...props} />,
            ul: ({node, ...props}) => (
              <ul className="list-disc list-inside text-gray-300 space-y-1 mb-3 text-sm" {...props} />
            ),
            li: ({node, ...props}) => (
              <li className="text-gray-300 leading-relaxed" {...props} />
            ),
            strong: ({node, ...props}) => (
              <strong className="text-white font-bold" {...props} />
            ),
          }}
        >
          {display_markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
