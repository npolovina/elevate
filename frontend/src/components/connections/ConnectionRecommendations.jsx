import React from 'react';

function ConnectionRecommendations({ connections }) {
  if (!connections || connections.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recommended Connections</h2>
        <p className="text-gray-600">No connection recommendations available at this time.</p>
        <p className="text-gray-600 mt-2">Try updating your skills in your profile to get personalized connection recommendations.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Recommended Connections</h2>
      <p className="text-gray-600 mb-4">
        Connect with colleagues who share your skills and interests to expand your network.
        Recommendations are based on your current profile skills and interests.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {connections.map((connection) => (
          <div key={connection.user_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="mr-4 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-lg font-semibold">
                {connection.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{connection.name}</h3>
                <p className="text-sm text-gray-600">{connection.role}</p>
                <p className="text-sm text-gray-600">{connection.department}</p>
                
                <div className="mt-2">
                  <h4 className="text-xs font-semibold text-gray-500">SKILLS</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {connection.skills.slice(0, 3).map((skill, idx) => {
                      // Check if this is a matching skill with the user's profile
                      const isMatchingSkill = idx < (connection.matchScore || 0);
                      return (
                        <span 
                          key={idx} 
                          className={`text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium rounded ${
                            isMatchingSkill 
                              ? 'bg-green-100 text-green-700' // Highlight matching skills
                              : 'bg-indigo-100 text-indigo-700'
                          }`}
                        >
                          {skill}
                          {isMatchingSkill && (
                            <span className="ml-1" title="Matching skill">✓</span>
                          )}
                        </span>
                      );
                    })}
                    {connection.skills.length > 3 && (
                      <span className="text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-gray-100 text-gray-700 rounded">
                        +{connection.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="mt-3">
                  <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Connect
                  </button>
                  <button className="ml-4 text-gray-600 hover:text-gray-800 text-sm font-medium">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ConnectionRecommendations;