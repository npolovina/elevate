import api from './api';
import profileService from './profileService';

const connectionService = {
  /**
   * Get connection and learning recommendations for a user
   * @param {string} userId - The user ID
   * @returns {Promise} Promise object representing the recommendations
   */
  getRecommendations: async (userId) => {
    try {
      // First, get the current user profile
      const currentUserProfile = await profileService.getCurrentUserProfile();
      
      // Call the method that does the actual work
      return connectionService.getRecommendationsWithProfile(userId, currentUserProfile);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Get recommendations using a provided profile
   * @param {string} userId - The user ID
   * @param {object} userProfile - The user profile data
   * @returns {Promise} Promise object representing the recommendations
   */
  getRecommendationsWithProfile: async (userId, userProfile) => {
    try {
      // Make the API call for recommendations
      const response = await api.post('/connect/recommendations', {
        user_id: userId
      });
      
      const result = response.data;
      
      if (!userProfile) {
        return result;
      }
      
      // Enhanced connection recommendations
      if (result.potential_connections && result.potential_connections.length > 0) {
        const userSkills = new Set(userProfile.skills || []);
        const userInterests = new Set(userProfile.interests || []);
        
        result.potential_connections = result.potential_connections
          .map(connection => {
            const connectionSkills = new Set(connection.skills || []);
            const connectionInterests = new Set(connection.interests || []);
            
            // Calculate skill and interest overlap
            const skillOverlap = [...connectionSkills].filter(skill => 
              userSkills.has(skill) || userInterests.has(skill)
            );
            
            const interestOverlap = [...connectionInterests].filter(interest => 
              userSkills.has(interest) || userInterests.has(interest)
            );
            
            return {
              ...connection,
              matchScore: skillOverlap.length * 2 + interestOverlap.length,
              matchingSkills: skillOverlap,
              matchingInterests: interestOverlap
            };
          })
          // Sort by match score, highest first
          .sort((a, b) => b.matchScore - a.matchScore);
      }
      
      // Enhanced learning recommendations
      if (result.recommended_learning && result.recommended_learning.length > 0) {
        const userDesiredSkills = new Set(userProfile.desired_skills || []);
        
        result.recommended_learning = result.recommended_learning
          .map(resource => {
            const resourceSkills = new Set(resource.skills || []);
            
            // Calculate skill overlap with desired skills
            const skillOverlap = [...resourceSkills].filter(skill => 
              userDesiredSkills.has(skill)
            );
            
            return {
              ...resource,
              matchScore: skillOverlap.length,
              matchingSkills: skillOverlap
            };
          })
          // Sort by match score, highest first
          .sort((a, b) => b.matchScore - a.matchScore);
      }
      
      // Log the number of connections for debugging
      console.log(`Returning ${result.potential_connections.length} potential connections`);
      
      return result;
    } catch (error) {
      console.error('Error getting recommendations with profile:', error);
      throw error;
    }
  },
  
  /**
   * Get current user ID
   * @returns {string} User ID
   */
  getCurrentUserId: () => {
    // In a real app, this would be from auth context
    return 'user123'; // Default user
  }
};

export default connectionService;