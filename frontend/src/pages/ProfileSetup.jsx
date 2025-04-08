import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillInput from '../components/profile/SkillInput';
import profileService from '../services/profileService';

function ProfileSetup() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    skills: [],
    desired_skills: [],
  });

  // Load initial profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const userData = await profileService.getCurrentUserProfile();
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          department: userData.department || '',
          role: userData.role || '',
          skills: userData.skills || [],
          desired_skills: userData.desired_skills || [],
        });
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        console.error('Error loading profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (newSkills) => {
    setProfileData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const handleDesiredSkillsChange = (newDesiredSkills) => {
    setProfileData(prev => ({
      ...prev,
      desired_skills: newDesiredSkills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await profileService.updateUserProfile(profileData);
      // Navigate to dashboard after successful update
      navigate('/');
    } catch (err) {
      setError('Failed to update profile. Please try again later.');
      console.error('Error updating profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Elevate Career Coach</h1>
          <p className="mt-2 text-lg text-gray-600">
            Let's set up your profile to personalize your experience
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden rounded-lg">
          <form onSubmit={handleSubmit}>
            <div className="px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="col-span-1 sm:col-span-2">
                  <div className="bg-gray-50 px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Personal Information</h2>
                    <p className="mt-1 text-sm text-gray-500">Basic information about your profile.</p>
                  </div>
                </div>

                {/* Personal Information Fields */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                    Department
                  </label>
                  <input
                    type="text"
                    name="department"
                    id="department"
                    value={profileData.department}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    disabled
                  />
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Job Title
                  </label>
                  <input
                    type="text"
                    name="role"
                    id="role"
                    value={profileData.role}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    disabled
                  />
                </div>

                {/* Skills Section */}
                <div className="col-span-1 sm:col-span-2 mt-4">
                  <div className="bg-gray-50 px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Skills & Development</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your current skills and skills you want to develop. 
                      This helps us recommend relevant opportunities and connections.
                    </p>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <SkillInput 
                    skills={profileData.skills}
                    onSkillsChange={handleSkillsChange}
                    label="Current Skills"
                    placeholder="Add a skill you have (e.g., Python, Project Management, UX Design)"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <SkillInput 
                    skills={profileData.desired_skills}
                    onSkillsChange={handleDesiredSkillsChange}
                    label="Skills I Want to Develop"
                    placeholder="Add a skill you want to learn (e.g., Machine Learning, Leadership)"
                  />
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : (
                  'Continue to Dashboard'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileSetup;