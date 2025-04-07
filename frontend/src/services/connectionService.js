import api from './api';

const connectionService = {
  /**
   * Get connection and learning recommendations for a user
   * @param {string} userId - The user ID
   * @returns {Promise} Promise object representing the recommendations
   */
  getRecommendations: async (userId) => {
    try {
      const response = await api.post('/connect/recommendations', {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Get current user ID
   * For demo purposes, we'll return a static user ID
   * In a real app, this would be retrieved from auth context
   * @returns {string} User ID
   */
  getCurrentUserId: () => {
    // In a real app, this would be from auth context or similar
    return 'user123'; // Alex Johnson from the mock data
  }
};

export default connectionService;