import api from './api';
import profileService from './profileService';

const jobService = {
  /**
   * Get job recommendations for a user
   * @param {string} userId - The user ID
   * @param {object} userProfile - Optional user profile data
   * @returns {Promise} Promise object representing the job recommendations
   */
  getJobRecommendations: async (userId, userProfile = null) => {
    try {
      // If no profile was provided but we need it, fetch it
      if (!userProfile) {
        userProfile = await profileService.getCurrentUserProfile();
      }
      
      // Make the API call with user profile context
      const response = await api.post('/elevate/job-recommendations', {
        user_id: userId
      });
      
      const result = response.data;
      
      // Client-side enhancement: highlight matching skills
      if (userProfile && result.recommended_jobs) {
        const userSkills = new Set(userProfile.skills || []);
        const userDesiredSkills = new Set(userProfile.desired_skills || []);
        
        result.recommended_jobs = result.recommended_jobs.map(job => {
          // Find requirements that match user's current skills
          const matchingSkills = job.requirements.filter(req => 
            userSkills.has(req) || userSkills.has(req.split(' ')[0])
          );
          
          // Find requirements that match user's desired skills
          const matchingDesiredSkills = job.requirements.filter(req => 
            userDesiredSkills.has(req) || userDesiredSkills.has(req.split(' ')[0])
          );
          
          // Find preferred skills that match user's current or desired skills
          const matchingPreferredSkills = job.preferred_skills ? 
            job.preferred_skills.filter(skill => 
              userSkills.has(skill) || 
              userDesiredSkills.has(skill) || 
              userSkills.has(skill.split(' ')[0]) ||
              userDesiredSkills.has(skill.split(' ')[0])
            ) : [];
          
          // Calculate overall match score based on matches
          // Weight current skills higher than desired skills
          const matchScore = (matchingSkills.length * 3) + 
                             (matchingDesiredSkills.length * 1) + 
                             (matchingPreferredSkills.length * 2);
          
          // Add match information to job
          return {
            ...job,
            matchingSkills,
            matchingDesiredSkills,
            matchingPreferredSkills,
            matchScore,
            skillMatchPercentage: Math.min(
              100, 
              Math.round((matchingSkills.length / Math.max(1, job.requirements.length)) * 100)
            )
          };
        });
        
        // Sort by match score (highest first)
        result.recommended_jobs.sort((a, b) => b.matchScore - a.matchScore);
      }
      
      return result;
    } catch (error) {
      console.error('Error getting job recommendations:', error);
      throw error;
    }
  },
  
  /**
   * Get current user's job recommendations
   * Uses the current user ID and profile from profileService
   * @returns {Promise} Promise object representing the job recommendations
   */
  getCurrentUserJobRecommendations: async () => {
    try {
      const userId = profileService.getCurrentUserId();
      const userProfile = await profileService.getCurrentUserProfile();
      
      return jobService.getJobRecommendations(userId, userProfile);
    } catch (error) {
      console.error('Error getting current user job recommendations:', error);
      throw error;
    }
  }
};

export default jobService;