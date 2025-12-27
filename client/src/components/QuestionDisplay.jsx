/**
 * QuestionDisplay Component - Enhanced with new UI components
 */

import ReactMarkdown from 'react-markdown';
import { Badge } from './ui/Badge';

export default function QuestionDisplay({ question }) {
  if (!question) return null;

  const { title, metadata, display_markdown } = question;

  const difficultyVariant = {
    'Easy': 'easy',
    'Medium': 'medium',
    'Hard': 'hard',
  }[metadata.difficulty] || 'default';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-text-primary leading-tight">{title}</h2>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant={difficultyVariant}>
          {metadata.difficulty}
        </Badge>
        
        {metadata.topics.slice(0, 3).map((topic) => (
          <Badge key={topic} variant="topic">
            {topic}
          </Badge>
        ))}
      </div>

      <div className="border-t border-border-default my-3"></div>

      <div className="prose prose-invert prose-sm max-w-none max-h-[500px] overflow-y-auto pr-2">
        <ReactMarkdown
          components={{
            h3: ({node, ...props}) => (
              <h3 className="text-base font-bold text-text-primary mt-4 mb-2" {...props} />
            ),
            p: ({node, ...props}) => (
              <p className="text-text-secondary mb-3 leading-relaxed text-sm" {...props} />
            ),
            code: ({node, inline, ...props}) => 
              inline ? 
                <code className="bg-bg-primary px-1.5 py-0.5 rounded text-xs text-accent-blue font-mono" {...props} /> :
                <code className="block bg-bg-primary p-3 rounded text-xs text-text-primary overflow-x-auto border border-border-default my-2 font-mono" {...props} />,
            ul: ({node, ...props}) => (
              <ul className="list-disc list-inside text-text-secondary space-y-1 mb-3 text-sm" {...props} />
            ),
            li: ({node, ...props}) => (
              <li className="text-text-secondary leading-relaxed" {...props} />
            ),
            strong: ({node, ...props}) => (
              <strong className="text-text-primary font-bold" {...props} />
            ),
          }}
        >
          {display_markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
