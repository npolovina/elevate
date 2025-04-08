import React, { useState, useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import SkillInput from '../components/profile/SkillInput';
import Loading from '../components/common/Loading';
import { 
  UserCircle, 
  Briefcase, 
  MapPin, 
  Mail, 
  Book, 
  Star, 
  Clock,
  TrendingUp
} from 'lucide-react';

function ProfilePage() {
  const { 
    profile, 
    isLoading: profileLoading, 
    updateProfile, 
    error: profileError 
  } = useProfile();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Initialize form data when profile loads
  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || '',
        email: profile.email || '',
        department: profile.department || '',
        role: profile.role || '',
        skills: profile.skills || [],
        desired_skills: profile.desired_skills || [],
        bio: profile.bio || '',
        years_of_experience: profile.experience?.toString() || '',
        linkedin_url: profile.linkedin_url || '',
        github_url: profile.github_url || ''
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillsChange = (skills, type) => {
    setProfileData(prev => ({
      ...prev,
      [type]: skills
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);

    try {
      // Convert years of experience to number
      const dataToSubmit = {
        ...profileData,
        experience: profileData.years_of_experience 
          ? parseInt(profileData.years_of_experience, 10) 
          : null
      };

      await updateProfile(dataToSubmit);
      setIsEditing(false);
    } catch (error) {
      setSaveError('Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (profileLoading) {
    return <Loading message="Loading profile..." />;
  }

  if (!profile) {
    return <div>No profile found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-6 flex items-center">
          <div className="flex-shrink-0 mr-6">
            <UserCircle className="h-24 w-24 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-gray-600">
                <Briefcase className="h-5 w-5 mr-2" />
                <span>{profile.role} | {profile.department}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Remote</span>
              </div>
            </div>
            <div className="flex items-center text-gray-600 mt-2">
              <Mail className="h-5 w-5 mr-2" />
              <span>{profile.email}</span>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Bio & Experience */}
          <div className="md:col-span-2 space-y-6">
            {/* Bio Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Book className="mr-3 text-indigo-600" />
                Professional Bio
              </h2>
              <p className="text-gray-600">{profile.bio}</p>
            </div>

            {/* Skills Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Star className="mr-3 text-indigo-600" />
                Current Skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Desired Skills Section */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="mr-3 text-green-600" />
                Skills to Develop
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.desired_skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Professional Details */}
          <div className="space-y-6">
            {/* Experience & Career Details */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-3 text-blue-600" />
                Career Overview
              </h2>
              <div className="space-y-2">
                <div>
                  <span className="text-gray-600 font-medium">Experience:</span>
                  <span className="ml-2 text-gray-800">{profile.experience} years</span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Joined:</span>
                  <span className="ml-2 text-gray-800">
                    {new Date(profile.joined_date).toLocaleDateString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 font-medium">Reporting to:</span>
                  <span className="ml-2 text-gray-800">Manager {profile.manager_id}</span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Professional Links
              </h2>
              <div className="space-y-2">
                {profile.linkedin_url && (
                  <a 
                    href={`https://linkedin.com/in/${profile.linkedin_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-indigo-600 hover:text-indigo-800"
                  >
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
                {profile.github_url && (
                  <a 
                    href={`https://github.com/${profile.github_url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center text-gray-800 hover:text-black"
                  >
                    <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    GitHub Profile
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;