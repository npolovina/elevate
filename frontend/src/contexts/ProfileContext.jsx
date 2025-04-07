// frontend/src/contexts/ProfileContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updatedProfile) => {
    setIsLoading(true);
    try {
      const data = await api.updateProfile(updatedProfile);
      setProfile(data);
      setError(null);
      return true;
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading, error, fetchProfile, updateProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;