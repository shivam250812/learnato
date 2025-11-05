import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ currentUser }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-primary-600 text-white rounded-lg p-2">
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Discussion Forum
            </h1>
          </Link>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-600 hidden sm:inline">
              👤 {currentUser}
            </span>
            <button
              onClick={() => navigate('/create')}
              className="btn-primary flex items-center space-x-2"
            >
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              <span>New Post</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;


