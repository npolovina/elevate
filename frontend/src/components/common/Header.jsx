import React from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';

function Header() {
  const { profile, isLoading } = useProfile();
  
  return (
    <header className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <span className="text-white text-xl font-bold">Elevate Career Coach</span>
            </Link>
          </div>
          <div className="flex items-center">
            <div className="ml-4 flex items-center md:ml-6">
              <Link to="/profile-setup" className="bg-indigo-700 p-1 rounded-full text-gray-100 hover:bg-indigo-800">
                <span className="sr-only">View profile</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
              <div className="ml-3">
                {isLoading ? (
                  <div className="text-sm font-medium text-white">Loading...</div>
                ) : (
                  <>
                    <div className="text-sm font-medium text-white">{profile?.name || 'User'}</div>
                    <div className="text-xs text-indigo-200">{profile?.role || 'Role'}</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;