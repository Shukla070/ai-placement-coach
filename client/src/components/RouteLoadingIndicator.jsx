/**
 * Route Loading Indicator
 * Shows a loading bar at the top of the page during route transitions
 */

import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function RouteLoadingIndicator() {
    const [loading, setLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Show loading when route changes
        setLoading(true);

        // Hide loading after a brief delay to show the transition
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    if (!loading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div className="h-1 bg-accent-blue animate-pulse">
                <div className="h-full bg-accent-blue-dark animate-[loading_0.5s_ease-in-out_infinite]" style={{
                    width: '30%',
                    animation: 'loading 0.8s ease-in-out infinite'
                }}></div>
            </div>
            <style>{`
        @keyframes loading {
          0% { width: 0%; margin-left: 0%; }
          50% { width: 50%; margin-left: 25%; }
          100% { width: 0%; margin-left: 100%; }
        }
      `}</style>
        </div>
    );
}
