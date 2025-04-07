import React, { useState } from 'react';
import MoodCheckForm from '../components/mood/MoodCheckForm';
import moodService from '../services/moodService';

function MoodCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  const handleSubmitMood = async (mood, feedback) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await moodService.submitMoodCheck(mood, feedback);
      setSubmissionResult(result);
    } catch (err) {
      setError('Failed to submit your mood check. Please try again later.');
      console.error('Error submitting mood check:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Mood Check</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Taking a moment to check in with yourself can help improve your wellbeing and productivity.
          Your responses are used to provide personalized support and identify any trends that might affect your career journey.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      {submissionResult ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="text-center mb-6">
            <div className="inline-block rounded-full p-3 bg-green-100 text-green-500 mb-4">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800">Thank You for Checking In</h2>
            <p className="text-gray-600 mt-2">
              Your mood has been recorded and will help us provide better support for your career journey.
            </p>
          </div>
          
          {submissionResult.ai_insight && (
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-700 mb-2">AI Insights</h3>
              <div className="text-gray-700 prose max-w-none">
                {submissionResult.ai_insight}
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Resources That Might Help</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-800">Stress Management Techniques</h4>
                <p className="text-sm text-gray-600 mt-1">Learn effective ways to manage workplace stress.</p>
                <button onClick={() => {}} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 inline-block">View Resource →</button>
              </div>
              <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <h4 className="font-medium text-gray-800">Work-Life Balance Workshop</h4>
                <p className="text-sm text-gray-600 mt-1">Virtual workshop on maintaining a healthy balance.</p>
                <button onClick={() => {}} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-2 inline-block">Register →</button>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setSubmissionResult(null)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded"
            >
              Submit Another Check
            </button>
          </div>
        </div>
      ) : (
        <MoodCheckForm onSubmit={handleSubmitMood} isLoading={isLoading} />
      )}
    </div>
  );
}

export default MoodCheck;