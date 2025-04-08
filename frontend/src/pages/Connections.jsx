import React, { useEffect, useState } from 'react';
import ConnectionRecommendations from '../components/connections/ConnectionRecommendations';
import LearningRecommendations from '../components/connections/LearningRecommendations';
import connectionService from '../services/connectionService';

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
        setRecommendations(data);
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
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Network & Learning</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
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