import api from './api';
import connectionService from './connectionService';

const profileService = {
  /**
   * Get the current user's profile
   * @returns {Promise} Promise object representing the user profile
   */
  getCurrentUserProfile: async () => {
    try {
      // For demo purposes, we'll use a mock profile
      // In a real app, this would be an API call
      const userId = connectionService.getCurrentUserId();
      
      // Mock data - in a real app, this would come from the API
      const profile = {
        user_id: "user123",
        name: "Alex Johnson",
        email: "alex.johnson@company.com",
        department: "Engineering",
        role: "Senior Software Engineer",
        skills: ["Python", "React", "FastAPI", "AWS", "Database Optimization", "Security"],
        interests: ["Machine Learning", "DevOps", "Cybersecurity"],
        experience: 5,
        projects: ["Customer Portal", "Analytics Dashboard", "Payment System"],
        desired_skills: ["Kubernetes", "Machine Learning", "Leadership"],
        manager_id: "manager456",
        joined_date: "2020-03-15"
      };
      
      return profile;
    } catch (error) {
      console.error('Error getting user profile:', error);
      throw error;
    }
  },
  
  /**
   * Update the current user's profile
   * @param {Object} profileData - The profile data to update
   * @returns {Promise} Promise object representing the updated profile
   */
  updateUserProfile: async (profileData) => {
    try {
      // In a real app, this would be an API call
      // For demo, we'll just return the updated profile
      console.log('Profile updated:', profileData);
      return profileData;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }
};

export default profileService;