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
            h3: ({ node, ...props }) => (
              <h3 className="text-base font-bold text-text-primary mt-6 mb-3 first:mt-0" {...props} />
            ),
            p: ({ node, ...props }) => (
              <p className="text-text-secondary mb-5 leading-loose text-sm" {...props} />
            ),
            code: ({ node, ...props }) => {
              // In react-markdown v9+, inline prop was removed
              // Inline code has node.tagName === 'code', block code is wrapped in 'pre'
              const isInline = node.tagName === 'code';
              return isInline ?
                <code className="font-bold text-text-primary font-mono" {...props} /> :
                <code className="block bg-bg-primary p-4 rounded text-xs text-text-primary overflow-x-auto border border-border-default my-3 font-mono leading-relaxed" {...props} />;
            },
            ul: ({ node, ...props }) => (
              <ul className="list-none text-text-secondary space-y-2 mb-5 text-sm ml-0" {...props} />
            ),
            li: ({ node, ...props }) => (
              <li className="text-text-secondary leading-loose pl-0" {...props} />
            ),
            strong: ({ node, ...props }) => (
              <strong className="text-text-primary font-bold" {...props} />
            ),
            pre: ({ node, ...props }) => (
              <pre className="bg-bg-primary p-4 rounded border border-border-default overflow-x-auto my-3" {...props} />
            ),
          }}
        >
          {display_markdown}
        </ReactMarkdown>
      </div>
    </div>
  );
}
