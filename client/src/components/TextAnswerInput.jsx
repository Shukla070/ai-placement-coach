/**
 * TextAnswerInput Component - Large textarea for theory answers
 */

export function TextAnswerInput({ value, onChange, disabled, placeholder }) {
    const characterCount = value?.length || 0;
    const minChars = 50;
    const isValidLength = characterCount >= minChars;

    return (
        <div className="space-y-2">
            <label className="block text-sm font-semibold text-text-primary">
                Your Answer
            </label>

            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                placeholder={placeholder || "Type your answer here... Explain the concept clearly and mention key points."}
                className={`
          w-full min-h-[200px] p-4 rounded-lg
          bg-bg-tertiary border-2 transition-all duration-200
          text-text-primary placeholder-text-tertiary
          resize-y focus:outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${isValidLength
                        ? 'border-accent-blue focus:border-accent-blue focus:ring-2 focus:ring-accent-blue/20'
                        : 'border-border-default focus:border-accent-blue/50'
                    }
        `}
                rows={8}
            />

            <div className="flex items-center justify-between text-xs">
                <span className={`font-medium ${characterCount < minChars
                        ? 'text-text-tertiary'
                        : 'text-accent-blue'
                    }`}>
                    {characterCount} characters
                    {characterCount < minChars && ` (minimum ${minChars} recommended)`}
                </span>

                {characterCount > 0 && (
                    <span className="text-text-tertiary">
                        {Math.ceil(characterCount / 500)} min read
                    </span>
                )}
            </div>
        </div>
    );
}
