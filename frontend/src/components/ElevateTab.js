import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Zap, 
  TrendingUp 
} from 'lucide-react';
import ApiService from './ApiService';

const ElevateTab = ({ userId }) => {
  // State for job recommendations
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch job recommendations on component mount
  useEffect(() => {
    const fetchJobRecommendations = async () => {
      try {
        setIsLoading(true);
        const recommendations = await ApiService.getJobRecommendations(userId);
        
        setJobRecommendations(recommendations.recommended_jobs || []);
        setAiRecommendations(recommendations.ai_recommendations || '');
      } catch (err) {
        setError('Failed to fetch job recommendations');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRecommendations();
  }, [userId]);

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="text-center text-red-500 p-6">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Elevate Your Career</h1>

      {/* Job Recommendations Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex items-center mb-4">
          <Briefcase className="mr-2 text-purple-500" />
          <h2 className="text-xl font-semibold text-gray-700">Job Recommendations</h2>
        </div>

        {jobRecommendations.length === 0 ? (
          <div className="text-center text-gray-500 py-4">
            No job recommendations at the moment
          </div>
        ) : (
          <div className="space-y-4">
            {jobRecommendations.map(job => (
              <div 
                key={job.job_id} 
                className="p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                    
                    <div className="flex items-center text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="text-sm">{job.location}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 mb-2">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-sm">{job.salary_range}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                      {job.requirements.slice(0, 3).map(req => (
                        <span 
                          key={req} 
                          className="bg-purple-50 text-purple-700 px-2 py-1 rounded-full text-xs"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <button className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 transition flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Career Insights Section */}
      {aiRecommendations && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="mr-2 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-700">AI Career Insights</h2>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-gray-700">{aiRecommendations}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElevateTab;