/**
 * LoadingSkeleton Component - Loading placeholders
 */

export function LoadingSkeleton({ variant = 'card', className = '' }) {
  const variants = {
    card: 'h-20 bg-bg-tertiary rounded-lg animate-pulse',
    text: 'h-4 bg-bg-tertiary rounded animate-pulse',
    button: 'h-10 bg-bg-tertiary rounded-lg animate-pulse',
    list: 'h-16 bg-bg-tertiary rounded-lg animate-pulse',
  };

  return <div className={`${variants[variant]} ${className}`} />;
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="p-4 bg-bg-tertiary rounded-lg border border-border-default">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <LoadingSkeleton variant="text" className="w-3/4" />
              <div className="flex gap-2">
                <LoadingSkeleton variant="text" className="w-16 h-6" />
                <LoadingSkeleton variant="text" className="w-20 h-6" />
              </div>
            </div>
            <LoadingSkeleton variant="text" className="w-12 h-4" />
          </div>
        </div>
      ))}
    </div>
  );
}

