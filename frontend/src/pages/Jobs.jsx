import React, { useEffect, useState } from 'react';
import JobList from '../components/jobs/JobList';
import JobDetails from '../components/jobs/JobDetails';
import jobService from '../services/jobService';

function Jobs() {
  const [jobData, setJobData] = useState({
    recommended_jobs: [],
    ai_recommendations: ''
  });
  const [selectedJob, setSelectedJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobRecommendations = async () => {
      setIsLoading(true);
      setError(null);

      try {
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
  }, []);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    // Scroll to top when selecting a job
    window.scrollTo(0, 0);
  };

  const handleBackToList = () => {
    setSelectedJob(null);
  };

  if (isLoading) {
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
        <p className="text-gray-600">
          Discover job opportunities that match your skills and career interests. 
          These recommendations are personalized based on your profile and experience.
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