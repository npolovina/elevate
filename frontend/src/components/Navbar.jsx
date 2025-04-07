// frontend/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu, User, Bell } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

const Navbar = () => {
  const { profile } = useProfile();
  
  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <button className="md:hidden mr-4 text-gray-500">
            <Menu size={24} />
          </button>
          <Link to="/" className="text-xl font-bold text-teal-600">Elevate</Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100">
            <Bell size={20} />
          </button>
          
          <Link to="/profile" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold mr-2">
              {profile?.name ? profile.name.charAt(0) : 'U'}
            </div>
            <span className="hidden md:block">{profile?.name || 'User'}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;