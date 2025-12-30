/**
 * Home Page - Welcome screen with subject selection
 */

import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';

export default function HomePage() {
  const navigate = useNavigate();

  const subjects = [
    {
      id: 'dsa',
      title: 'DSA',
      description: 'Practice coding problems with AI feedback',
      icon: '💻',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'hover:from-blue-600 hover:to-blue-700'
    },
    {
      id: 'os',
      title: 'Operating Systems',
      description: 'Test your OS fundamentals knowledge',
      icon: '⚙️',
      color: 'from-green-500 to-green-600',
      hoverColor: 'hover:from-green-600 hover:to-green-700'
    },
    {
      id: 'dbms',
      title: 'DBMS',
      description: 'Master Database Management concepts',
      icon: '🗄️',
      color: 'from-purple-500 to-purple-600',
      hoverColor: 'hover:from-purple-600 hover:to-purple-700'
    },
    {
      id: 'oops',
      title: 'OOPS',
      description: 'Review Object-Oriented Programming principles',
      icon: '🎯',
      color: 'from-orange-500 to-orange-600',
      hoverColor: 'hover:from-orange-600 hover:to-orange-700'
    }
  ];

  return (
    <MainLayout>
      {/* Header Section */}
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center p-8">
        <div className="max-w-6xl w-full">
          {/* Welcome Message */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-text-primary mb-4">
              AI Placement Coach
            </h1>
            <p className="text-xl text-text-secondary">
              What do you want to prepare for?
            </p>
          </div>

          {/* Subject Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => navigate(`/${subject.id}`)}
                className={`group relative bg-gradient-to-br ${subject.color} ${subject.hoverColor} rounded-2xl p-8 text-white transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}
              >
                {/* Icon */}
                <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {subject.icon}
                </div>

                {/* Title */}
                <h2 className="text-3xl font-bold mb-3">
                  {subject.title}
                </h2>

                {/* Description */}
                <p className="text-white/90 text-base">
                  {subject.description}
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </button>
            ))}
          </div>

          {/* Footer Note */}
          <div className="text-center mt-12">
            <p className="text-sm text-text-tertiary">
              Select a subject to start practicing
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
