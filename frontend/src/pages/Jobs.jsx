import React, { useEffect, useState } from 'react';
import JobList from '../components/jobs/JobList';
import JobDetails from '../components/jobs/JobDetails';
import jobService from '../services/jobService';
import profileService from '../services/profileService';
import Loading from '../components/common/Loading';

function Jobs() {
  const [jobData, setJobData] = useState({
    recommended_jobs: [],
    ai_recommendations: ''
  });
  const [userProfile, setUserProfile] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [error, setError] = useState(null);

  // First, fetch the user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoadingProfile(true);
      try {
        const profile = await profileService.getCurrentUserProfile();
        setUserProfile(profile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        // Continue even if profile fetch fails
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Then, fetch job recommendations once we have the profile
  useEffect(() => {
    const fetchJobRecommendations = async () => {
      // Only proceed if profile is loaded (or failed to load)
      if (isLoadingProfile) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Pass the user profile to the job service for better matching
        const data = await jobService.getCurrentUserJobRecommendations();
        setJobData(data);
      } catch (err) {
        setError('Failed to load job recommendations. Please try again later.');
        console.error('Error fetching job recommendations:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRecommendations();
  }, [isLoadingProfile]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    // Scroll to top when selecting a job
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
  };

  if (isLoading || isLoadingProfile) {
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Recommendations</h1>
        <Loading message={
          isLoadingProfile 
            ? "Loading your profile for personalized job matching..." 
            : "Finding personalized job recommendations..."
        } />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Recommendations</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600">
          Discover job opportunities that match your skills and career interests. 
          These recommendations are personalized based on your profile, existing skills, and desired skills.
        </p>
      </div>
      
      {selectedJob ? (
        <JobDetails 
          job={selectedJob} 
          aiRecommendations={jobData.ai_recommendations} 
          onBack={handleBackToList} 
        />
      ) : (
        <JobList 
          jobs={jobData.recommended_jobs} 
          onSelectJob={handleSelectJob} 
        />
      )}
      
      {!selectedJob && jobData.ai_recommendations && (
        <div className="mt-6 bg-indigo-50 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4 text-indigo-700">AI Career Insights</h2>
          <div className="text-gray-700 prose max-w-none">
            {jobData.ai_recommendations}
          </div>
        </div>
      )}
    </div>
  );
}

export default Jobs;