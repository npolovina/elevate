import React from 'react';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col items-center justify-center h-96">
        <svg className="h-24 w-24 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h1 className="text-4xl font-bold text-gray-800 mt-6">404</h1>
        <p className="text-xl text-gray-600 mt-2">Page not found</p>
        <p className="text-gray-500 mt-2 mb-6">The page you're looking for doesn't exist or has been moved.</p>
        <Link 
          to="/" 
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFound;