import api from './api';
import profileService from './profileService';

const jobService = {
  /**
   * Get job recommendations for a user
   * @param {string} userId - The user ID
   * @param {object} userProfile - Optional user profile to avoid extra API call
   * @returns {Promise} Promise object representing the job recommendations
   */
  getJobRecommendations: async (userId, userProfile = null) => {
    try {
      // Make the API call
      const response = await api.post('/elevate/job-recommendations', {
        user_id: userId
      });
      
      // Get the raw response data
      const data = response.data;
      
      // If we have a profile, enhance the job recommendations
      if (userProfile && data.recommended_jobs && data.recommended_jobs.length > 0) {
        // Create sets for faster lookup
        const userSkills = new Set(userProfile.skills || []);
        const userDesiredSkills = new Set(userProfile.desired_skills || []);
        
        // Tag jobs with match scores
        data.recommended_jobs = data.recommended_jobs.map(job => {
          const jobRequirements = job.requirements || [];
          const matchingSkills = jobRequirements.filter(req => 
            userSkills.has(req) || 
            Array.from(userSkills).some(skill => req.includes(skill))
          );
          
          const desiredSkillMatches = jobRequirements.filter(req => 
            userDesiredSkills.has(req) || 
            Array.from(userDesiredSkills).some(skill => req.includes(skill))
          );
          
          return {
            ...job,
            skillMatch: matchingSkills.length,
            desiredSkillMatch: desiredSkillMatches.length,
            // Total match score (skills count more than desired skills)
            matchScore: (matchingSkills.length * 2) + desiredSkillMatches.length
          };
        });
        
        // Sort jobs by match score (highest first)
        data.recommended_jobs.sort((a, b) => b.matchScore - a.matchScore);
      }
      
      return data;
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Get current user's job recommendations
   * Uses the current user ID from profileService and optionally accepts a profile
   * @param {object} userProfile - Optional user profile to avoid extra API call
   * @returns {Promise} Promise object representing the job recommendations
   */
  getCurrentUserJobRecommendations: async (userProfile = null) => {
    const userId = profileService.getCurrentUserId();
    
    // If no profile was provided, fetch it (might happen on initial load)
    if (!userProfile) {
      userProfile = await profileService.getCurrentUserProfile();
    }
    
    return jobService.getJobRecommendations(userId, userProfile);
  }
};

export default jobService;