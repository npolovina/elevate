import api from './api';
import profileService from './profileService';

const jobService = {
  /**
   * Get job recommendations for a user
   * @param {string} userId - The user ID
   * @param {object} userProfile - User profile data
   * @returns {Promise} Promise object representing the job recommendations
   */
  getJobRecommendations: async (userId, userProfile) => {
    try {
      // Make sure we have the user profile
      if (!userProfile) {
        console.warn('No user profile provided - fetching it');
        userProfile = await profileService.getCurrentUserProfile();
      }
      
      // Log profile data for debugging
      console.log('Getting job recommendations with profile:', 
                 {userId, skills: userProfile.skills, desired_skills: userProfile.desired_skills});
      
      // Make the API call
      const response = await api.post('/elevate/job-recommendations', {
        user_id: userId
      });
      
      const result = response.data;
      
      // Ensure we have the expected data structure
      if (!result.recommended_jobs) {
        console.warn('API response missing recommended_jobs array');
        result.recommended_jobs = [];
      }
      
      // Client-side enhancement: highlight matching skills
      if (userProfile && result.recommended_jobs.length > 0) {
        const userSkills = new Set(userProfile.skills || []);
        const userDesiredSkills = new Set(userProfile.desired_skills || []);
        
        result.recommended_jobs = result.recommended_jobs.map(job => {
          // Ensure job has requirements
          if (!job.requirements) {
            job.requirements = [];
          }
          
          // Ensure job has preferred_skills
          if (!job.preferred_skills) {
            job.preferred_skills = [];
          }
          
          // Find requirements that match user's current skills
          const matchingSkills = job.requirements.filter(req => {
            const reqLower = req.toLowerCase();
            // Check exact matches and skill keywords in the requirement
            return Array.from(userSkills).some(skill => 
              reqLower === skill.toLowerCase() || 
              reqLower.includes(skill.toLowerCase())
            );
          });
          
          // Find requirements that match user's desired skills
          const matchingDesiredSkills = job.requirements.filter(req => {
            const reqLower = req.toLowerCase();
            // Check exact matches and skill keywords in the requirement
            return Array.from(userDesiredSkills).some(skill => 
              reqLower === skill.toLowerCase() || 
              reqLower.includes(skill.toLowerCase())
            );
          });
          
          // Find preferred skills that match user's current or desired skills
          const matchingPreferredSkills = job.preferred_skills.filter(skill => {
            const skillLower = skill.toLowerCase();
            // Check if it's in current skills or desired skills
            return Array.from(userSkills).some(s => skillLower === s.toLowerCase() || skillLower.includes(s.toLowerCase())) ||
                   Array.from(userDesiredSkills).some(s => skillLower === s.toLowerCase() || skillLower.includes(s.toLowerCase()));
          });
          
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
            skillMatchPercentage: job.requirements.length > 0 
              ? Math.min(100, Math.round((matchingSkills.length / job.requirements.length) * 100))
              : 0
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
   * Get current user's job recommendations with AI insights
   * Uses the current user profile to personalize recommendations
   * @returns {Promise} Promise object representing the job recommendations
   */
  getCurrentUserJobRecommendations: async () => {
    try {
      // Load user profile first
      const userProfile = await profileService.getCurrentUserProfile();
      
      // Convert profile into a format suitable for DeepSeek API
      const profileSummary = {
        name: userProfile.name,
        current_role: userProfile.role, 
        department: userProfile.department,
        experience_years: userProfile.experience || 0,
        current_skills: userProfile.skills || [],
        desired_skills: userProfile.desired_skills || [],
        interests: userProfile.interests || []
      };
      
      console.log('Using profile data for job recommendations:', profileSummary);
      
      // Get user ID
      const userId = userProfile.user_id || 'user123';
      
      // Call backend API with profile data
      return jobService.getJobRecommendations(userId, userProfile);
    } catch (error) {
      console.error('Error getting current user job recommendations:', error);
      throw error;
    }
  }
};

export default jobService;