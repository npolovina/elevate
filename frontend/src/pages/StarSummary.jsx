import React, { useState } from 'react';
import StarSummaryForm from '../components/star/StarSummaryForm';
import StarSummaryResult from '../components/star/StarSummaryResult';
import starService from '../services/starService';

function StarSummary() {
  const [starSummary, setStarSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTicket, setCurrentTicket] = useState(null);

  const handleGenerateSummary = async (ticketId, additionalContext) => {
    setIsLoading(true);
    setError(null);
    setCurrentTicket(ticketId);

    try {
      console.log(`Generating STAR summary for ticket ${ticketId}...`);
      const response = await starService.generateStarSummary(ticketId, additionalContext);
      
      if (!response || !response.star_summary) {
        throw new Error('Invalid response format from server');
      }
      
      console.log('STAR summary generated successfully');
      setStarSummary(response.star_summary);
    } catch (err) {
      console.error('Error generating STAR summary:', err);
      setError(err.message || 'Failed to generate STAR summary. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (!currentTicket) return;
    
    // Clear previous state and try again
    setError(null);
    setStarSummary(null);
    setIsLoading(true);
    
    // Retry the summary generation
    starService.generateStarSummary(currentTicket, '')
      .then(response => {
        if (!response || !response.star_summary) {
          throw new Error('Invalid response format from server');
        }
        
        setStarSummary(response.star_summary);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error in retry attempt:', err);
        setError(err.message || 'Failed to generate STAR summary. Please try again later.');
        setIsLoading(false);
      });
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">STAR Summary Generator</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          The STAR format (Situation, Task, Action, Result) is a structured way to present your 
          accomplishments for performance reviews, job interviews, and career development discussions.
          Generate a STAR summary from your completed JIRA tickets to highlight your impact.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm">{error}</p>
              <div className="mt-2">
                <button
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleRetry}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!starSummary ? (
        <StarSummaryForm onGenerateSummary={handleGenerateSummary} isLoading={isLoading} />
      ) : (
        <div>
          <StarSummaryResult summary={starSummary} />
          <div className="mt-6">
            <button
              onClick={() => setStarSummary(null)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Another Summary
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default StarSummary;