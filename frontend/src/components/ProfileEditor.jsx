// frontend/src/components/ProfileEditor.jsx
import React, { useState } from 'react';
import { User, Briefcase, Building, Code, Heart, Star } from 'lucide-react';
import { useProfile } from '../contexts/ProfileContext';

const ProfileEditor = () => {
  const { profile, isLoading: profileLoading, updateProfile } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({});
  
  // Initialize form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        role: profile.role || '',
        department: profile.department || '',
        skills: (profile.skills || []).join(', '),
        interests: (profile.interests || []).join(', '),
        desired_skills: (profile.desired_skills || []).join(', '),
        experience_years: profile.experience_years || 0
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Convert comma-separated strings to arrays
    const processedData = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
      interests: formData.interests.split(',').map(s => s.trim()).filter(Boolean),
      desired_skills: formData.desired_skills.split(',').map(s => s.trim()).filter(Boolean),
      experience_years: parseInt(formData.experience_years) || 0
    };
    
    const success = await updateProfile(processedData);
    if (success) {
      setIsEditing(false);
    }
    
    setIsSaving(false);
  };

  if (profileLoading || !profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Your Profile</h2>
        <button
          className={`px-4 py-2 rounded ${isEditing ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <User className="w-5 h-5 text-gray-500 mr-2" />
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="border rounded p-2 flex-grow"
              placeholder="Your Name"
            />
          ) : (
            <p className="text-lg">{profile.name}</p>
          )}
        </div>

        <div className="flex items-center">
          <Briefcase className="w-5 h-5 text-gray-500 mr-2" />
          {isEditing ? (
            <input
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border rounded p-2 flex-grow"
              placeholder="Your Role"
            />
          ) : (
            <p>{profile.role}</p>
          )}
        </div>

        <div className="flex items-center">
          <Building className="w-5 h-5 text-gray-500 mr-2" />
          {isEditing ? (
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="border rounded p-2 flex-grow"
              placeholder="Your Department"
            />
          ) : (
            <p>{profile.department}</p>
          )}
        </div>

        <div>
          <div className="flex items-center mb-2">
            <Code className="w-5 h-5 text-gray-500 mr-2" />
            <span className="font-medium">Skills</span>
          </div>
          {isEditing ? (
            <textarea
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Skills (comma-separated)"
              rows={2}
            />
          ) : (
            <div className="flex flex-wrap gap-2 pl-7">
              {profile.skills.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center mb-2">
            <Heart className="w-5 h-5 text-gray-500 mr-2" />
            <span className="font-medium">Interests</span>
          </div>
          {isEditing ? (
            <textarea
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Interests (comma-separated)"
              rows={2}
            />
          ) : (
            <div className="flex flex-wrap gap-2 pl-7">
              {profile.interests.map((interest, index) => (
                <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                  {interest}
                </span>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 text-gray-500 mr-2" />
            <span className="font-medium">Skills You Want to Develop</span>
          </div>
          {isEditing ? (
            <textarea
              name="desired_skills"
              value={formData.desired_skills}
              onChange={handleChange}
              className="border rounded p-2 w-full"
              placeholder="Desired Skills (comma-separated)"
              rows={2}
            />
          ) : (
            <div className="flex flex-wrap gap-2 pl-7">
              {profile.desired_skills.map((skill, index) => (
                <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileEditor;