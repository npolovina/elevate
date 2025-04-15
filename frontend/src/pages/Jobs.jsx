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
        // Get the user profile with all skills and preferences
        const profile = await profileService.getCurrentUserProfile();
        console.log('Profile loaded for job recommendations:', {
          name: profile.name,
          role: profile.role,
          skills: profile.skills,
          desired_skills: profile.desired_skills
        });
        setUserProfile(profile);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Unable to load your profile. Some personalization features may not work correctly.');
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Then, fetch job recommendations once we have the profile
  useEffect(() => {
    // Only proceed if profile is loaded (or failed to load)
    if (isLoadingProfile) return;
    
    const fetchJobRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
        console.log('Fetching job recommendations with profile data...');
        // Use the profile data to get personalized recommendations
        const data = await jobService.getCurrentUserJobRecommendations();
        
        console.log('Job recommendations received:', {
          count: data.recommended_jobs.length,
          has_ai_insights: !!data.ai_recommendations
        });
        
        setJobData(data);
      } catch (err) {
        console.error('Error fetching job recommendations:', err);
        setError('Failed to load job recommendations. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobRecommendations();
  }, [isLoadingProfile]);

  // Handle job selection
  const handleSelectJob = (job) => {
    setSelectedJob(job);
    // Track selected job in analytics (if implemented)
    console.log('Job selected:', job.job_id);
    // Scroll to top when selecting a job
    window.scrollTo(0, 0);
  };

  // Return to job list
  const handleBackToList = () => {
    setSelectedJob(null);
  };

  // Handle retry for failed requests
  const handleRetry = () => {
    // Reset and try again
    setError(null);
    setIsLoading(true);
    
    // First refresh the profile
    profileService.getCurrentUserProfile()
      .then(profile => {
        setUserProfile(profile);
        // Then get job recommendations with updated profile
        return jobService.getCurrentUserJobRecommendations();
      })
      .then(data => {
        setJobData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error in retry:', err);
        setError('Failed to load job recommendations. Please try again later.');
        setIsLoading(false);
      });
  };

  // Show loading state
  if (isLoading || isLoadingProfile) {
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Recommendations</h1>
        <Loading message={
          isLoadingProfile 
            ? "Loading your profile for personalized job matching..." 
            : "Finding job opportunities based on your skills and interests..."
        } />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Recommendations</h1>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
              <div className="mt-2">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mb-6">
        <p className="text-gray-600">
          Discover job opportunities that match your skills and career interests. 
          These recommendations are personalized based on your profile, existing skills, and desired skills.
        </p>
        
        {userProfile && (
          <div className="mt-3 bg-indigo-50 p-3 rounded-md">
            <h3 className="text-sm font-medium text-indigo-800">Your Profile Highlights</h3>
            <div className="mt-2">
              <span className="text-xs text-indigo-700 font-medium mr-2">Current Skills:</span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {userProfile.skills.slice(0, 5).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
                {userProfile.skills.length > 5 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    +{userProfile.skills.length - 5} more
                  </span>
                )}
              </div>
            </div>
            <div className="mt-1">
              <span className="text-xs text-blue-700 font-medium mr-2">Skills to Develop:</span>
              <div className="inline-flex flex-wrap gap-1 mt-1">
                {userProfile.desired_skills.slice(0, 3).map((skill, idx) => (
                  <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    {skill}
                  </span>
                ))}
                {userProfile.desired_skills.length > 3 && (
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                    +{userProfile.desired_skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {selectedJob ? (
        <JobDetails 
          job={selectedJob} 
          aiRecommendations={jobData.ai_recommendations} 
          onBack={handleBackToList} 
        />
      ) : (
        <>
          <JobList 
            jobs={jobData.recommended_jobs} 
            onSelectJob={handleSelectJob} 
          />
          
          {jobData.ai_recommendations && (
            <div className="mt-6 bg-indigo-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h2 className="text-xl font-bold text-indigo-700">AI Career Insights</h2>
              </div>
              <div className="text-gray-700 prose max-w-none">
                {jobData.ai_recommendations}
              </div>
              <div className="mt-4 text-xs text-indigo-600">
                * Career insights generated by DeepSeek AI based on your profile and matching job opportunities.
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Jobs;