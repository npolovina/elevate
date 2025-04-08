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
      // First, get the current user profile to have access to the latest skills
      const currentUserProfile = await profileService.getCurrentUserProfile();
      
      // Call the optimize method that does the actual work
      return connectionService.getRecommendationsWithProfile(userId, currentUserProfile);
    } catch (error) {
      console.error('Error getting recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Get recommendations using a provided profile (to avoid duplicate API calls)
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
      
      // Filter recommendations based on latest skills and desired skills
      const result = response.data;
      
      if (!userProfile) {
        return result; // If no profile is provided, return raw results
      }
      
      if (result.potential_connections && result.potential_connections.length > 0) {
        // Filter connections based on skills match with current profile
        const userSkills = new Set(userProfile.skills || []);
        const userDesiredSkills = new Set(userProfile.desired_skills || []);
        
        // Enhance matching by checking skill overlap
        result.potential_connections = result.potential_connections.map(connection => {
          // Calculate matching skills and relevant skills to display first
          const connectionSkills = connection.skills || [];
          const matchingSkills = connectionSkills.filter(skill => 
            userDesiredSkills.has(skill) || userSkills.has(skill)
          );
          
          // Sort skills to show matching ones first
          const sortedSkills = [
            ...matchingSkills,
            ...connectionSkills.filter(skill => !matchingSkills.includes(skill))
          ];
          
          return {
            ...connection,
            skills: sortedSkills,
            matchScore: matchingSkills.length // Add a match score for potential sorting
          };
        });
        
        // Sort connections by match score (highest first)
        result.potential_connections.sort((a, b) => b.matchScore - a.matchScore);
      }
      
      if (result.recommended_learning && result.recommended_learning.length > 0) {
        // Filter learning resources based on desired skills match with current profile
        const userDesiredSkills = new Set(userProfile.desired_skills || []);
        
        // Only include learning resources that match current desired skills
        result.recommended_learning = result.recommended_learning
          .filter(resource => 
            resource.skills && resource.skills.some(skill => 
              userDesiredSkills.has(skill)
            )
          )
          .map(resource => {
            // Calculate matching skills
            const resourceSkills = resource.skills || [];
            const matchingSkills = resourceSkills.filter(skill => 
              userDesiredSkills.has(skill)
            );
            
            return {
              ...resource,
              skills: [
                ...matchingSkills,
                ...resourceSkills.filter(skill => !matchingSkills.includes(skill))
              ],
              matchScore: matchingSkills.length
            };
          });
        
        // Sort learning resources by match score (highest first)
        result.recommended_learning.sort((a, b) => b.matchScore - a.matchScore);
      }
      
      return result;
    } catch (error) {
      console.error('Error getting recommendations with profile:', error);
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