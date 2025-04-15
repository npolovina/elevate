import React from 'react';

function ConnectionRecommendations({ connections }) {
  if (!connections || connections.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Recommended Connections</h2>
        <p className="text-gray-600">No connection recommendations available at this time.</p>
      </div>
    );
  }

  // Always show exactly 4 connections if available, or all connections if less than 4
  const displayConnections = connections.slice(0, 4);
  
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Recommended Connections</h2>
      <p className="text-gray-600 mb-4">
        Connect with colleagues who share your skills and interests to expand your network.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayConnections.map((connection) => (
          <div key={connection.user_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start">
              <div className="mr-4 h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-lg font-semibold">
                {connection.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">{connection.name}</h3>
                <p className="text-sm text-gray-600">{connection.role}</p>
                <p className="text-sm text-gray-600">{connection.department}</p>
                
                {/* Match reason if available */}
                {connection.match_reason && (
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {connection.match_reason}
                  </div>
                )}
                
                <div className="mt-2">
                  <h4 className="text-xs font-semibold text-gray-500">SKILLS</h4>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(connection.skills || []).slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-indigo-100 text-indigo-700 rounded">
                        {skill}
                      </span>
                    ))}
                    {(connection.skills || []).length > 3 && (
                      <span className="text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-gray-100 text-gray-700 rounded">
                        +{connection.skills.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Interest tags */}
                {connection.interests && connection.interests.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-xs font-semibold text-gray-500">INTERESTS</h4>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {connection.interests.slice(0, 2).map((interest, idx) => (
                        <span key={idx} className="text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-blue-100 text-blue-700 rounded">
                          {interest}
                        </span>
                      ))}
                      {connection.interests.length > 2 && (
                        <span className="text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-gray-100 text-gray-700 rounded">
                          +{connection.interests.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                )}
                
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
      
      {connections.length > 4 && (
        <div className="mt-4 text-center">
          <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
            View All Recommendations ({connections.length})
          </button>
        </div>
      )}
    </div>
  );
}

export default ConnectionRecommendations;