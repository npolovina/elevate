import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import connectionService from '../services/connectionService';
import starService from '../services/starService';

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    completedTickets: [],
    recommendations: {
      potential_connections: [],
      recommended_learning: []
    },
    userName: 'Alex Johnson'
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Get user data
        const userId = connectionService.getCurrentUserId();
        
        // Get tickets data
        const tickets = await starService.getCompletedTickets();
        
        // Get recommendations
        const recommendations = await connectionService.getRecommendations(userId);
        
        setDashboardData({
          completedTickets: tickets,
          recommendations: recommendations,
          userName: 'Alex Johnson' // In a real app, you'd get this from a user service
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {dashboardData.userName}!</h1>
        <p className="text-gray-600 mt-2">Let's continue growing your career today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link to="/star-summary" className="p-4 border rounded-lg hover:bg-indigo-50 transition-colors flex flex-col items-center text-center">
              <svg className="h-8 w-8 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="text-gray-800 font-medium">Create STAR Summary</span>
            </Link>
            <Link to="/documentation" className="p-4 border rounded-lg hover:bg-indigo-50 transition-colors flex flex-col items-center text-center">
              <svg className="h-8 w-8 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-gray-800 font-medium">Find Documentation</span>
            </Link>
            <Link to="/connections" className="p-4 border rounded-lg hover:bg-indigo-50 transition-colors flex flex-col items-center text-center">
              <svg className="h-8 w-8 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-gray-800 font-medium">Explore Connections</span>
            </Link>
            <Link to="/jobs" className="p-4 border rounded-lg hover:bg-indigo-50 transition-colors flex flex-col items-center text-center">
              <svg className="h-8 w-8 text-indigo-600 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-800 font-medium">Job Recommendations</span>
            </Link>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Completed Tickets</h2>
          {dashboardData.completedTickets.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {dashboardData.completedTickets.slice(0, 4).map((ticket) => (
                <div key={ticket.ticket_id} className="py-3">
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm font-medium text-gray-800">{ticket.ticket_id}</span>
                      <h3 className="text-sm text-gray-700">{ticket.title}</h3>
                    </div>
                    <Link 
                      to={`/star-summary?ticket=${ticket.ticket_id}`}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                    >
                      Generate STAR
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No completed tickets found.</p>
          )}
          <div className="mt-4">
            <Link to="/star-summary" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View all tickets &rarr;
            </Link>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Connection Recommendations */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recommended Connections</h2>
          {dashboardData.recommendations.potential_connections.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {dashboardData.recommendations.potential_connections.slice(0, 4).map((connection) => (
                <div key={connection.user_id} className="py-3 border rounded-lg p-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start">
                    <div className="mr-3 flex-shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 text-sm font-semibold">
                      {connection.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">{connection.name}</h3>
                      <p className="text-xs text-gray-600">{connection.role}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {connection.skills.slice(0, 2).map((skill, idx) => (
                          <span key={idx} className="text-xs inline-block py-0.5 px-1.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-indigo-100 text-indigo-700 rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No connection recommendations available.</p>
          )}
          <div className="mt-4">
            <Link to="/connections" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View all connections &rarr;
            </Link>
          </div>
        </div>
        
        {/* Learning Recommendations */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Learning Opportunities</h2>
          {dashboardData.recommendations.recommended_learning.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {dashboardData.recommendations.recommended_learning.slice(0, 3).map((course) => (
                <div key={course.material_id} className="py-3">
                  <h3 className="text-sm font-medium text-gray-800">{course.title}</h3>
                  <p className="text-xs text-gray-600">{course.type} • {course.duration}</p>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {course.skills.slice(0, 2).map((skill, idx) => (
                      <span key={idx} className="text-xs inline-block py-0.5 px-1.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-indigo-100 text-indigo-700 rounded">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No learning recommendations available.</p>
          )}
          <div className="mt-4">
            <Link to="/connections" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
              View all learning resources &rarr;
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mood Check */}
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">How are you feeling today?</h2>
        <p className="text-gray-600 mb-4">
          Taking a moment to check in with yourself can help improve your wellbeing and productivity.
        </p>
        <div className="flex justify-center gap-4 my-4">
          <Link to="/mood-check?mood=great" className="p-4 border rounded-lg hover:bg-green-50 transition-colors flex flex-col items-center">
            <span className="text-2xl">😀</span>
            <span className="text-green-700 font-medium mt-2">Great</span>
          </Link>
          <Link to="/mood-check?mood=good" className="p-4 border rounded-lg hover:bg-green-50 transition-colors flex flex-col items-center">
            <span className="text-2xl">🙂</span>
            <span className="text-green-600 font-medium mt-2">Good</span>
          </Link>
          <Link to="/mood-check?mood=okay" className="p-4 border rounded-lg hover:bg-yellow-50 transition-colors flex flex-col items-center">
            <span className="text-2xl">😐</span>
            <span className="text-yellow-600 font-medium mt-2">Okay</span>
          </Link>
          <Link to="/mood-check?mood=stressed" className="p-4 border rounded-lg hover:bg-orange-50 transition-colors flex flex-col items-center">
            <span className="text-2xl">😓</span>
            <span className="text-orange-600 font-medium mt-2">Stressed</span>
          </Link>
          <Link to="/mood-check?mood=overwhelmed" className="p-4 border rounded-lg hover:bg-red-50 transition-colors flex flex-col items-center">
            <span className="text-2xl">😩</span>
            <span className="text-red-600 font-medium mt-2">Overwhelmed</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;