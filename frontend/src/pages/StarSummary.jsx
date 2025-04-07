import React, { useState } from 'react';
import StarSummaryForm from '../components/star/StarSummaryForm';
import StarSummaryResult from '../components/star/StarSummaryResult';
import starService from '../services/starService';

function StarSummary() {
  const [starSummary, setStarSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSummary = async (ticketId, additionalContext) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await starService.generateStarSummary(ticketId, additionalContext);
      setStarSummary(response.star_summary);
    } catch (err) {
      setError('Failed to generate STAR summary. Please try again later.');
      console.error('Error generating STAR summary:', err);
    } finally {
      setIsLoading(false);
    }
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
          <p>{error}</p>
        </div>
      )}
      
      <StarSummaryForm onGenerateSummary={handleGenerateSummary} isLoading={isLoading} />
      
      {starSummary && <StarSummaryResult summary={starSummary} />}
    </div>
  );
}

export default StarSummary;