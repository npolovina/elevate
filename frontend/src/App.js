import React, { useState } from 'react';
import { 
  FileText, 
  UserCircle, 
  Briefcase 
} from 'lucide-react';

// Import tab components
import CreateTab from './components/CreateTab';
import ConnectTab from './components/ConnectTab';
import ElevateTab from './components/ElevateTab';

// Main application component
function App() {
  // State to manage active tab
  const [activeTab, setActiveTab] = useState('create');
  
  // Current user (typically would come from authentication context)
  const currentUser = 'user123';

  // Render the appropriate tab based on activeTab state
  const renderActiveTab = () => {
    switch(activeTab) {
      case 'create':
        return <CreateTab userId={currentUser} />;
      case 'connect':
        return <ConnectTab userId={currentUser} />;
      case 'elevate':
        return <ElevateTab userId={currentUser} />;
      default:
        return <CreateTab userId={currentUser} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <div className="w-20 bg-white shadow-md flex flex-col items-center py-6">
        <button 
          onClick={() => setActiveTab('create')} 
          className={`
            p-3 mb-4 rounded-lg transition
            ${activeTab === 'create' 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-500 hover:bg-gray-100'
            }
          `}
          title="Create & Reflect"
        >
          <FileText className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setActiveTab('connect')} 
          className={`
            p-3 mb-4 rounded-lg transition
            ${activeTab === 'connect' 
              ? 'bg-green-100 text-green-600' 
              : 'text-gray-500 hover:bg-gray-100'
            }
          `}
          title="Connect & Grow"
        >
          <UserCircle className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setActiveTab('elevate')} 
          className={`
            p-3 mb-4 rounded-lg transition
            ${activeTab === 'elevate' 
              ? 'bg-purple-100 text-purple-600' 
              : 'text-gray-500 hover:bg-gray-100'
            }
          `}
          title="Elevate Your Career"
        >
          <Briefcase className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {renderActiveTab()}
      </div>
    </div>
  );
}

export default App;