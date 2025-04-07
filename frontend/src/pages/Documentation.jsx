import React, { useState } from 'react';
import DocumentSearch from '../components/documentation/DocumentSearch';
import DocumentResults from '../components/documentation/DocumentResults';
import documentationService from '../services/documentationService';

function Documentation() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const results = await documentationService.searchDocumentation(query);
      setSearchResults(results);
    } catch (err) {
      setError('Failed to search documentation. Please try again later.');
      console.error('Error searching documentation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Company Documentation</h1>
      
      <div className="mb-6">
        <p className="text-gray-600">
          Search through company policies, procedures, and guidelines. 
          Our AI-powered search helps you find what you need and provides context to help you understand it.
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <DocumentSearch onSearch={handleSearch} isLoading={isLoading} />
      
      <DocumentResults results={searchResults} />
    </div>
  );
}

export default Documentation;