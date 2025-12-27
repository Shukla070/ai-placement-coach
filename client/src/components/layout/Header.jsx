import { Badge } from '../ui/Badge';

export function Header({ searchResults = [], currentQuestion = null, submissionScore = null }) {
  const isSolved = submissionScore && submissionScore >= 70;
  return (
    <header className="flex-shrink-0 h-[8vh] bg-bg-secondary border-b border-border-default flex items-center px-6">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center gap-3">
          <div className="w-[5vh] h-[5vh] bg-gradient-to-br from-accent-blue to-accent-blue-dark rounded-lg flex items-center justify-center text-white font-bold text-base shadow-lg">
            AI
          </div>
          <h1 className="text-lg font-bold text-text-primary">Placement Coach</h1>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-3">
          {searchResults.length > 0 && !currentQuestion && (
            <div className="px-3 py-1.5 bg-accent-blue/20 border border-accent-blue/40 rounded-lg">
              <span className="text-sm text-accent-blue font-semibold">{searchResults.length} found</span>
            </div>
          )}
          {currentQuestion && (
            <div className={`px-3 py-1.5 rounded-lg ${isSolved ? 'bg-green-500/20 border border-green-500/40' : 'bg-yellow-500/20 border border-yellow-500/40'}`}>
              <span className={`text-sm font-semibold ${isSolved ? 'text-green-400' : 'text-yellow-400'}`}>
                {isSolved ? 'Solved ✓' : 'Solving'}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
