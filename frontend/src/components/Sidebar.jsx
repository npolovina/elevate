// frontend/src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Clipboard, Users, BarChart2, MessageCircle } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname === path + '/';
  };
  
  const navItems = [
    { path: '/create', name: 'Create', icon: Clipboard },
    { path: '/connect', name: 'Connect', icon: Users },
    { path: '/elevate', name: 'Elevate', icon: BarChart2 },
    { path: '/chat', name: 'Chat', icon: MessageCircle },
  ];
  
  return (
    <aside className="hidden md:block w-56 bg-white border-r border-gray-200 h-full overflow-y-auto">
      <nav className="py-6 px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-3 py-2 rounded-md ${
                  isActive(item.path) 
                    ? 'bg-teal-50 text-teal-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="mr-3" size={18} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;