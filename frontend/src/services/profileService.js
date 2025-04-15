import api from './api';

const profileService = {
  /**
   * Get the current user's profile
   * @returns {Promise} Promise object representing the user profile
   */
  getCurrentUserProfile: async () => {
    try {
      // For demo purposes, we're using mock data
      // In a real application, this would be an API call like:
      // const response = await api.get('/user/profile');
      // return response.data;
      
      // Profile cache - store the profile to avoid unnecessary reloads
      if (profileService.cachedProfile) {
        console.log('Using cached profile data');
        return profileService.cachedProfile;
      }

      console.log('Loading user profile data');
      
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
      
      // Cache the profile for future use
      profileService.cachedProfile = profile;
      
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
      // const response = await api.put('/user/profile', profileData);
      // const updatedProfile = response.data;
      
      console.log('Updating profile:', profileData);
      
      // Update the cached profile
      profileService.cachedProfile = {
        ...profileService.cachedProfile,
        ...profileData
      };
      
      // Return the updated profile
      return profileService.cachedProfile;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  },
  
  /**
   * Get current user ID
   * @returns {string} User ID
   */
  getCurrentUserId: () => {
    return "user123"; // In a real app, this would come from authentication
  },
  
  // Cache for profile data
  cachedProfile: null
};

export default profileService;