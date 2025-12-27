export function MainLayout({ children, className = "" }) {
    return (
        <div className={`h-screen flex flex-col bg-bg-primary text-text-primary overflow-hidden ${className}`}>
            {children}
        </div>
    );
}
