import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import JobList from '../components/jobs/JobList';
import JobDetails from '../components/jobs/JobDetails';
import jobService from '../services/jobService';
import { useProfile } from '../context/ProfileContext';

function Jobs() {
  const { profile, lastUpdated } = useProfile();
  const [jobData, setJobData] = useState({
    recommended_jobs: [],
    ai_recommendations: ''
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchJobRecommendations();
  };

  const fetchJobRecommendations = async () => {
    setIsLoading(isRefreshing ? false : true);
    setError(null);

    try {
      // Use the current profile to get relevant job recommendations
      const data = await jobService.getCurrentUserJobRecommendations(profile);
      setJobData(data);
    } catch (err) {
      setError('Failed to load job recommendations. Please try again later.');
      console.error('Error fetching job recommendations:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch job recommendations whenever profile is updated
    if (profile) {
      fetchJobRecommendations();
    }
  }, [profile, lastUpdated]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    // Scroll to top when selecting a job
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
  };

  if (isLoading && !isRefreshing) {
    return (
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Job Recommendations</h1>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <p className="text-gray-600 mb-3 sm:mb-0">
            Discover job opportunities that match your skills and career interests. 
            These recommendations are personalized based on your profile and experience.
          </p>
          <div className="flex space-x-2">
            <Link 
              to="/profile-setup"
              className="inline-flex items-center px-3 py-2 border border-indigo-300 shadow-sm text-sm leading-4 font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Update Skills
            </Link>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isRefreshing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Refreshing...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Jobs
                </>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isRefreshing && (
        <div className="bg-blue-50 p-4 rounded-md mb-6 flex items-center">
          <svg className="animate-spin mr-3 h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-blue-700">Refreshing job recommendations based on your profile...</span>
        </div>
      )}
      
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
          
          {jobData.ai_recommendations && !selectedJob && (
            <div className="mt-6 bg-indigo-50 p-6 rounded-lg">
              <h2 className="text-xl font-bold mb-4 text-indigo-700">AI Career Insights</h2>
              <div className="text-gray-700 prose max-w-none">
                {jobData.ai_recommendations}
              </div>
            </div>
          )}
          
          {jobData.recommended_jobs.length === 0 && !isLoading && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    No job recommendations found. Try updating your skills profile to get more personalized job recommendations.
                  </p>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <Link
                        to="/profile-setup"
                        className="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                      >
                        Update Skills
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Jobs;