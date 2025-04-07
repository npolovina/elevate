import api from './api';
import connectionService from './connectionService';

const jobService = {
  /**
   * Get job recommendations for a user
   * @param {string} userId - The user ID
   * @returns {Promise} Promise object representing the job recommendations
   */
  getJobRecommendations: async (userId) => {
    try {
      const response = await api.post('/elevate/job-recommendations', {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Get current user's job recommendations
   * Uses the current user ID from connectionService
   * @returns {Promise} Promise object representing the job recommendations
   */
  getCurrentUserJobRecommendations: async () => {
    const userId = connectionService.getCurrentUserId();
    return jobService.getJobRecommendations(userId);
  }
};

export default jobService;