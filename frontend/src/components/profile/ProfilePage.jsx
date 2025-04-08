import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SkillInput from '../components/SkillInput'; // Keeping import for potential future use
import profileService from '../services/profileService';
import ProfileForm from '../components/ProfileForm';
import ProfileView from '../components/ProfileView';

const ProfilePage = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Placeholder handler to resolve no-unused-vars warnings
  const handleInputChange = (e) => {
    // Implement input change logic if needed
    console.log('Input changed', e.target.name, e.target.value);
  };

  // Placeholder handler to resolve no-unused-vars warnings
  const handleSkillsChange = (skills) => {
    // Implement skills change logic if needed
    console.log('Skills changed', skills);
  };

  // Placeholder handler to resolve no-unused-vars warnings
  const handleSubmit = async (e) => {
    // Implement submit logic if needed
    e.preventDefault();
    console.log('Form submitted');
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const fetchedProfile = await profileService.fetchProfile(userId);
        setProfile(fetchedProfile);
        setProfileError(null);
      } catch (error) {
        setProfileError(error.message);
        console.error('Error fetching profile:', error);
      }
    };

    loadProfile();
  }, [userId]);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
    setSaveError(null); // Clear any previous save errors when toggling edit mode
  };

  const handleSave = async (updatedProfile) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const savedProfile = await profileService.updateProfile(userId, updatedProfile);
      setProfile(savedProfile);
      setIsEditing(false);
    } catch (error) {
      setSaveError(error.message);
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Render loading state
  if (!profile && !profileError) {
    return <div className="loading">Loading profile...</div>;
  }

  // Render error state for profile fetching
  if (profileError) {
    return (
      <div className="error-container">
        <h2>Error Loading Profile</h2>
        <p>{profileError}</p>
        <button onClick={() => window.location.reload()}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {isEditing ? (
        <ProfileForm 
          profile={profile} 
          onSave={handleSave} 
          onCancel={toggleEdit}
          isSaving={isSaving}
        />
      ) : (
        <ProfileView 
          profile={profile} 
          onEdit={toggleEdit} 
        />
      )}
      {saveError && (
        <div className="error-banner">
          <p>{saveError}</p>
          <button onClick={() => setSaveError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;