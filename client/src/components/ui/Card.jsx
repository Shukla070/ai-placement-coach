/**
 * Card Component - Reusable card container
 */

export function Card({ children, className = '', hover = false, ...props }) {
  const baseClasses = 'bg-bg-secondary rounded-lg border border-border-default shadow-lg';
  const hoverClasses = hover ? 'hover:border-border-hover hover:shadow-xl transition-all duration-200' : '';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

