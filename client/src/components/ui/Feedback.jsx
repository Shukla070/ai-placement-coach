/**
 * Feedback Component - Reusable feedback/alert component
 */

export function Feedback({ type = 'info', message, details, className = '', ...props }) {
  const typeConfig = {
    error: {
      bg: 'bg-red-500/10',
      text: 'text-red-300',
      border: 'border-red-500/30',
      icon: '❌',
    },
    warning: {
      bg: 'bg-yellow-500/10',
      text: 'text-yellow-300',
      border: 'border-yellow-500/30',
      icon: '⚠️',
    },
    success: {
      bg: 'bg-green-500/10',
      text: 'text-green-300',
      border: 'border-green-500/30',
      icon: '✅',
    },
    info: {
      bg: 'bg-accent-blue/10',
      text: 'text-accent-blue',
      border: 'border-accent-blue/30',
      icon: 'ℹ️',
    },
  };

  const config = typeConfig[type] || typeConfig.info;

  if (!message) return null;

  return (
    <div
      className={`rounded-lg p-4 text-sm border ${config.bg} ${config.border} ${config.text} ${className}`}
      {...props}
    >
      <p className="font-semibold mb-2 flex items-center gap-2">
        <span>{config.icon}</span>
        {message}
      </p>
      {details && (
        <div className="mt-3 space-y-2">
          {details.breakdown && (
            <div className="grid grid-cols-3 gap-2">
              {/* DSA Format: correctness, efficiency, communication */}
              {details.breakdown.correctness !== undefined && (
                <>
                  <div className="bg-bg-primary rounded p-2 text-center border border-border-default">
                    <div className="text-xs text-text-tertiary mb-1">Correctness</div>
                    <div className="text-lg font-bold text-accent-blue">{details.breakdown.correctness}/40</div>
                  </div>
                  <div className="bg-bg-primary rounded p-2 text-center border border-border-default">
                    <div className="text-xs text-text-tertiary mb-1">Efficiency</div>
                    <div className="text-lg font-bold text-purple-400">{details.breakdown.efficiency}/30</div>
                  </div>
                  <div className="bg-bg-primary rounded p-2 text-center border border-border-default">
                    <div className="text-xs text-text-tertiary mb-1">Communication</div>
                    <div className="text-lg font-bold text-green-400">{details.breakdown.communication}/30</div>
                  </div>
                </>
              )}
              {/* Theory Format: clarity, completeness, accuracy */}
              {details.breakdown.clarity !== undefined && (
                <>
                  <div className="bg-bg-primary rounded p-2 text-center border border-border-default">
                    <div className="text-xs text-text-tertiary mb-1">Clarity</div>
                    <div className="text-lg font-bold text-accent-blue">{details.breakdown.clarity}/30</div>
                  </div>
                  <div className="bg-bg-primary rounded p-2 text-center border border-border-default">
                    <div className="text-xs text-text-tertiary mb-1">Completeness</div>
                    <div className="text-lg font-bold text-purple-400">{details.breakdown.completeness}/40</div>
                  </div>
                  <div className="bg-bg-primary rounded p-2 text-center border border-border-default">
                    <div className="text-xs text-text-tertiary mb-1">Accuracy</div>
                    <div className="text-lg font-bold text-green-400">{details.breakdown.accuracy}/30</div>
                  </div>
                </>
              )}
            </div>
          )}
          {details.feedback && (
            <div className="text-xs mt-2 p-2 bg-bg-primary rounded border border-border-default">
              <strong className="text-text-primary">Feedback:</strong>
              <p className="mt-1 text-text-secondary">{details.feedback}</p>
            </div>
          )}
          {details.strengths && details.strengths.length > 0 && (
            <div className="text-xs">
              <strong className="text-green-400">✅ Strengths:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-text-secondary ml-2">
                {details.strengths.map((s, i) => <li key={i}>{s}</li>)}
              </ul>
            </div>
          )}
          {details.improvements && details.improvements.length > 0 && (
            <div className="text-xs">
              <strong className="text-yellow-400">💡 Improvements:</strong>
              <ul className="list-disc list-inside mt-1 space-y-0.5 text-text-secondary ml-2">
                {details.improvements.map((imp, i) => <li key={i}>{imp}</li>)}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
