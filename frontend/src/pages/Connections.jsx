import React, { useEffect, useState } from 'react';
import ConnectionRecommendations from '../components/connections/ConnectionRecommendations';
import LearningRecommendations from '../components/connections/LearningRecommendations';
import connectionService from '../services/connectionService';
import Loading from '../components/common/Loading';

function Connections() {
  const [recommendations, setRecommendations] = useState({
    potential_connections: [],
    recommended_learning: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const userId = connectionService.getCurrentUserId();
        const data = await connectionService.getRecommendations(userId);
        
        console.log(`Received ${data.potential_connections?.length || 0} potential connections`);
        
        setRecommendations({
          potential_connections: data.potential_connections || [],
          recommended_learning: data.recommended_learning || []
        });
      } catch (err) {
        setError('Failed to load recommendations. Please try again later.');
        console.error('Error fetching recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Network & Learning</h1>
        <Loading message="Finding colleagues that match your skills and interests..." />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Network & Learning</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 bg-red-100 hover:bg-red-200 text-red-700 font-bold py-1 px-2 rounded text-sm"
          >
            Try Again
          </button>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600">
          Expand your professional network and develop new skills with personalized recommendations.
          Connect with colleagues who share your interests and discover learning resources tailored to your career goals.
        </p>
      </div>
      
      <ConnectionRecommendations connections={recommendations.potential_connections} />
      
      <LearningRecommendations learning={recommendations.recommended_learning} />
    </div>
  );
}

export default Connections;