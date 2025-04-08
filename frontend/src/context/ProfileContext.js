import React, { createContext, useState, useContext, useEffect } from 'react';
import profileService from '../services/profileService';

// Create context
const ProfileContext = createContext();

// Provider component
export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Function to fetch profile data
  const fetchProfileData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const userData = await profileService.getCurrentUserProfile();
      setProfileData(userData);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to load profile data.');
      console.error('Error loading profile data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to update profile data
  const updateProfile = async (updatedData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await profileService.updateUserProfile(updatedData);
      setProfileData(result);
      setLastUpdated(new Date());
      return { success: true };
    } catch (err) {
      setError('Failed to update profile data.');
      console.error('Error updating profile data:', err);
      return { success: false, error: err.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Load profile data on initial mount
  useEffect(() => {
    fetchProfileData();
  }, []);

  // The context value that will be supplied to any descendants of this provider
  const contextValue = {
    profile: profileData,
    isLoading,
    error,
    lastUpdated,
    refreshProfile: fetchProfileData,
    updateProfile
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  
  return context;
};

export default ProfileContext;