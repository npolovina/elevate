import React, { useState, useEffect, useMemo } from 'react';
import { 
  UserCircle, 
  BookOpen, 
  Clock, 
  Star, 
  Search, 
  Filter 
} from 'lucide-react';
import ApiService from './ApiService';

const ConnectTab = ({ userId }) => {
  // State for recommendations and filtering
  const [connections, setConnections] = useState([]);
  const [learningMaterials, setLearningMaterials] = useState([]);
  
  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter and search states
  const [connectionFilters, setConnectionFilters] = useState({
    department: '',
    skill: ''
  });
  const [learningFilters, setLearningFilters] = useState({
    type: '',
    skill: ''
  });
  const [connectionSearch, setConnectionSearch] = useState('');
  const [learningSearch, setLearningSearch] = useState('');

  // Fetch recommendations on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true);
        const recommendations = await ApiService.getConnectionRecommendations(userId);
        
        setConnections(recommendations.potential_connections || []);
        setLearningMaterials(recommendations.recommended_learning || []);
      } catch (err) {
        setError('Failed to fetch recommendations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId]);

  // Memoized filtered connections
  const filteredConnections = useMemo(() => {
    return connections.filter(connection => {
      // Department filter
      const departmentMatch = !connectionFilters.department || 
        connection.department.toLowerCase() === connectionFilters.department.toLowerCase();
      
      // Search filter
      const searchMatch = !connectionSearch || 
        connection.name.toLowerCase().includes(connectionSearch.toLowerCase()) ||
        connection.skills.some(skill => 
          skill.toLowerCase().includes(connectionSearch.toLowerCase())
        );
      
      // Skill filter
      const skillMatch = !connectionFilters.skill || 
        connection.skills.some(skill => 
          skill.toLowerCase().includes(connectionFilters.skill.toLowerCase())
        );
      
      return departmentMatch && searchMatch && skillMatch;
    });
  }, [connections, connectionFilters, connectionSearch]);

  // Memoized filtered learning materials
  const filteredLearningMaterials = useMemo(() => {
    return learningMaterials.filter(material => {
      // Type filter
      const typeMatch = !learningFilters.type || 
        material.type.toLowerCase() === learningFilters.type.toLowerCase();
      
      // Search filter
      const searchMatch = !learningSearch || 
        material.title.toLowerCase().includes(learningSearch.toLowerCase()) ||
        material.skills.some(skill => 
          skill.toLowerCase().includes(learningSearch.toLowerCase())
        );
      
      // Skill filter
      const skillMatch = !learningFilters.skill || 
        material.skills.some(skill => 
          skill.toLowerCase().includes(learningFilters.skill.toLowerCase())
        );
      
      return typeMatch && searchMatch && skillMatch;
    });
  }, [learningMaterials, learningFilters, learningSearch]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        <h2 className="text-2xl font-bold mb-4">Oops! Something Went Wrong</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Connect & Grow</h1>

      {/* Potential Connections Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
            <UserCircle className="mr-3 text-blue-500" />
            Potential Connections
          </h2>
          
          <div className="flex space-x-4">
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search connections"
                className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={connectionSearch}
                onChange={(e) => setConnectionSearch(e.target.value)}
              />
              <Search className="absolute left-2 top-3 text-gray-400" size={16} />
            </div>
            
            {/* Department Filter */}
            <select 
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={connectionFilters.department}
              onChange={(e) => setConnectionFilters(prev => ({
                ...prev, 
                department: e.target.value
              }))}
            >
              <option value="">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="Product">Product</option>
              <option value="Design">Design</option>
            </select>
          </div>
        </div>

        {/* Connections Grid */}
        {filteredConnections.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No connections found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map(connection => (
              <div 
                key={connection.user_id} 
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <UserCircle className="w-12 h-12 mr-4 text-blue-500" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {connection.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {connection.role} | {connection.department}
                    </p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {connection.skills.slice(0, 3).map(skill => (
                      <span 
                        key={skill} 
                        className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">
                  Connect
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Learning Recommendations Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-700 flex items-center">
            <BookOpen className="mr-3 text-green-500" />
            Learning Recommendations
          </h2>
          
          <div className="flex space-x-4">
            {/* Search Input */}
            <div className="relative">
              <input 
                type="text"
                placeholder="Search learning materials"
                className="pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={learningSearch}
                onChange={(e) => setLearningSearch(e.target.value)}
              />
              <Search className="absolute left-2 top-3 text-gray-400" size={16} />
            </div>
            
            {/* Type Filter */}
            <select 
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              value={learningFilters.type}
              onChange={(e) => setLearningFilters(prev => ({
                ...prev, 
                type: e.target.value
              }))}
            >
              <option value="">All Types</option>
              <option value="Course">Course</option>
              <option value="Workshop">Workshop</option>
              <option value="Webinar">Webinar</option>
            </select>
          </div>
        </div>

        {/* Learning Materials Grid */}
        {filteredLearningMaterials.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No learning materials found matching your criteria
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLearningMaterials.map(material => (
              <div 
                key={material.material_id} 
                className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg text-gray-800">
                    {material.title}
                  </h3>
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-5 h-5 mr-1" />
                    <span className="font-medium">{material.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  {material.description}
                </p>
                
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock className="w-5 h-5 mr-2" />
                  <span className="text-sm">{material.duration}</span>
                </div>
                
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Skills Covered
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {material.skills.slice(0, 3).map(skill => (
                      <span 
                        key={skill} 
                        className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                  Start Learning
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ConnectTab;