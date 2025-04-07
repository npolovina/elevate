// frontend/src/components/connect/PeopleRecommendations.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Building } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';

const PeopleRecommendations = () => {
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock data for the POC
  const [people, setPeople] = useState([
    {
      user: {
        name: "Jamie Smith",
        role: "DevOps Engineer",
        department: "Engineering"
      },
      match_score: 85,
      matching_skills: ["AWS", "CI/CD"],
      matching_interests: ["Cloud Architecture"]
    },
    {
      user: {
        name: "Taylor Williams",
        role: "Data Scientist",
        department: "Data Science"
      },
      match_score: 78,
      matching_skills: ["Python"],
      matching_interests: ["Deep Learning"]
    }
  ]);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-lg font-medium mb-6">People You Should Connect With</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map((person, index) => (
          <div key={index} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
                    {person.user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{person.user.name}</h3>
                    <p className="text-sm text-gray-500">{person.user.role}</p>
                  </div>
                </div>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
                  {person.match_score}% Match
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <div className="mb-3">
                <p className="text-sm font-bold mb-1">Department</p>
                <p className="text-sm">{person.user.department}</p>
              </div>
              
              <div className="mb-3">
                <p className="text-sm font-bold mb-1">Shared Skills</p>
                <div className="flex flex-wrap gap-1">
                  {person.matching_skills.map((skill, i) => (
                    <span key={i} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-bold mb-1">Shared Interests</p>
                <div className="flex flex-wrap gap-1">
                  {person.matching_interests.map((interest, i) => (
                    <span key={i} className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <button className="flex-1 py-1 px-2 text-xs border border-teal-500 text-teal-500 rounded">
                  Message
                </button>
                <button className="flex-1 py-1 px-2 text-xs bg-teal-500 text-white rounded">
                  Schedule 1:1
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PeopleRecommendations;