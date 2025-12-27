/**
 * Badge Component - Reusable badge for difficulty, topics, etc.
 */

export function Badge({ children, variant = 'default', className = '', ...props }) {
  const baseClasses = 'text-xs px-2.5 py-1 rounded font-semibold border transition-colors';
  
  const variants = {
    easy: 'bg-green-500/25 text-green-300 border-green-500/40',
    medium: 'bg-yellow-500/25 text-yellow-300 border-yellow-500/40',
    hard: 'bg-red-500/25 text-red-300 border-red-500/40',
    topic: 'bg-accent-blue/25 text-accent-blue border-accent-blue/40',
    default: 'bg-bg-tertiary text-text-secondary border-border-default',
  };

  return (
    <span 
      className={`${baseClasses} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
