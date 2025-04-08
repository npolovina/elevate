import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SkillInput from '../components/profile/SkillInput';
import profileService from '../services/profileService';

function ProfileEdit() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    skills: [],
    interests: [],
    desired_skills: [],
    bio: '',
    experience: '',
    education: []
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
          interests: userData.interests || [],
          desired_skills: userData.desired_skills || [],
          bio: userData.bio || '',
          experience: userData.experience || '',
          education: userData.education || []
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

  const handleInterestsChange = (newInterests) => {
    setProfileData(prev => ({
      ...prev,
      interests: newInterests
    }));
  };

  const handleDesiredSkillsChange = (newDesiredSkills) => {
    setProfileData(prev => ({
      ...prev,
      desired_skills: newDesiredSkills
    }));
  };

  const handleAddEducation = () => {
    setProfileData(prev => ({
      ...prev,
      education: [...prev.education, { 
        institution: '', 
        degree: '', 
        field: '', 
        year: '' 
      }]
    }));
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profileData.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setProfileData(prev => ({
      ...prev,
      education: updatedEducation
    }));
  };

  const handleRemoveEducation = (index) => {
    setProfileData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await profileService.updateUserProfile(profileData);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
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
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
          <p className="mt-2 text-gray-600">
            Update your profile information to get personalized recommendations and connections.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 bg-green-100 border-l-4 border-green-500 text-green-700 p-4" role="alert">
            <p>{successMessage}</p>
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
                  />
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                    Professional Bio
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="4"
                    value={profileData.bio}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    placeholder="Tell us about your professional background, interests, and goals..."
                  ></textarea>
                </div>

                <div className="col-span-1 sm:col-span-2">
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    name="experience"
                    id="experience"
                    min="0"
                    max="50"
                    value={profileData.experience}
                    onChange={handleInputChange}
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  />
                </div>

                {/* Skills Section */}
                <div className="col-span-1 sm:col-span-2 mt-4">
                  <div className="bg-gray-50 px-4 py-5 sm:px-6">
                    <h2 className="text-lg font-medium text-gray-900">Skills & Interests</h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Update your current skills, interests, and skills you want to develop. 
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
                    skills={profileData.interests}
                    onSkillsChange={handleInterestsChange}
                    label="Professional Interests"
                    placeholder="Add areas of professional interest (e.g., Machine Learning, DevOps)"
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

                {/* Education Section */}
                <div className="col-span-1 sm:col-span-2 mt-4">
                  <div className="bg-gray-50 px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900">Education</h2>
                      <p className="mt-1 text-sm text-gray-500">
                        Add your educational background.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddEducation}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Add Education
                    </button>
                  </div>
                </div>

                {profileData.education.map((edu, index) => (
                  <div key={index} className="col-span-1 sm:col-span-2 border rounded-md p-4 relative">
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(index)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Institution
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="University or Institution Name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Degree
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Bachelor's, Master's, etc."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Field of Study
                        </label>
                        <input
                          type="text"
                          value={edu.field}
                          onChange={(e) => handleEducationChange(index, 'field', e.target.value)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="Computer Science, Business, etc."
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Graduation Year
                        </label>
                        <input
                          type="text"
                          value={edu.year}
                          onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          placeholder="YYYY"
                        />
                      </div>
                    </div>
                  </div>
                ))}
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
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;