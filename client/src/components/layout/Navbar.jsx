/**
 * Navbar Component - Navigation links for subject pages
 */

import { Link, useLocation } from 'react-router-dom';

export function Navbar() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home' },
        { path: '/dsa', label: 'DSA' },
        { path: '/os', label: 'OS' },
        { path: '/dbms', label: 'DBMS' },
        { path: '/oops', label: 'OOPS' }
    ];

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="bg-bg-secondary border-b border-border-default">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-text-primary">AI Placement Coach</span>
                    </Link>

                    {/* Nav Links */}
                    <div className="flex space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(item.path)
                                    ? 'bg-accent-blue text-white'
                                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-hover'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
}
