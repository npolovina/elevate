// frontend/src/components/elevate/JobRecommendations.jsx
import React, { useState, useEffect } from 'react';
import { Briefcase, MapPin, Calendar, Check } from 'lucide-react';
import { useProfile } from '../../contexts/ProfileContext';
import JobDetailModal from './JobDetailModal';

const JobRecommendations = () => {
  const { profile } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Mock data for POC
  const [jobs, setJobs] = useState([
    {
      job: {
        title: "Senior Frontend Engineer",
        department: "Engineering",
        location: "San Francisco, CA (Hybrid)",
        posted_date: "2025-03-01",
        description: "Join our frontend team to build responsive and accessible user interfaces",
        salary_range: "$140,000 - $180,000",
        internal_only: false
      },
      match_score: 92,
      matches: {
        current_skills_match: ["React", "JavaScript"],
        desired_skills_match: ["Design Systems"],
        missing_requirements: ["Performance Optimization"]
      }
    },
    {
      job: {
        title: "DevOps Engineer",
        department: "Infrastructure",
        location: "Remote",
        posted_date: "2025-03-05",
        description: "Help us build and maintain our cloud infrastructure and CI/CD pipelines",
        salary_range: "$130,000 - $160,000",
        internal_only: false
      },
      match_score: 78,
      matches: {
        current_skills_match: ["AWS"],
        desired_skills_match: ["Kubernetes"],
        missing_requirements: ["Terraform", "Infrastructure as Code"]
      }
    }
  ]);
  
  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Job Recommendations</h2>
        
        <div className="flex gap-2">
          <select className="border border-gray-300 rounded text-sm px-2 py-1">
            <option>All Jobs</option>
            <option>Internal Only</option>
            <option>External</option>
          </select>
          
          <select className="border border-gray-300 rounded text-sm px-2 py-1">
            <option>Sort by Match</option>
            <option>Sort by Date</option>
            <option>Sort by Salary</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job, index) => (
          <div key={index} className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden flex flex-col">
            <div className="p-4 border-b">
              <div className="flex space-x-2 mb-1">
                <span className={`text-xs px-2 py-0.5 rounded ${
                  job.job.internal_only ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {job.job.internal_only ? "Internal Only" : "Open Position"}
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
                  {job.match_score}% Match
                </span>
              </div>
              <h3 className="font-medium text-base mt-2">{job.job.title}</h3>
            </div>
            
            <div className="p-4 space-y-3 flex-1">
              <div className="text-sm text-gray-600 flex items-center">
                <Briefcase size={14} className="mr-1.5" />
                <span>{job.job.department}</span>
              </div>
              
              <div className="text-sm text-gray-600 flex items-center">
                <MapPin size={14} className="mr-1.5" />
                <span>{job.job.location}</span>
              </div>
              
              <div className="text-sm text-gray-600 flex items-center">
                <Calendar size={14} className="mr-1.5" />
                <span>Posted: {job.job.posted_date}</span>
              </div>
              
              <p className="text-sm text-gray-700">{job.job.description}</p>
              
              <div>
                <p className="text-sm font-bold mb-1">Your Matching Skills</p>
                <div className="flex flex-wrap gap-1">
                  {job.matches.current_skills_match.map((skill, i) => (
                    <span key={i} className="inline-flex items-center text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">
                      <Check size={10} className="mr-1" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm font-bold">Salary Range</p>
                <p className="text-green-600">{job.job.salary_range}</p>
              </div>
            </div>
            
            <div className="p-4 border-t">
              <button
                className="w-full py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm"
                onClick={() => handleViewDetails(job)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <JobDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        job={selectedJob}
      />
    </div>
  );
};

export default JobRecommendations;