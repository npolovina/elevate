import React, { useState } from 'react';
import DocumentSearch from '../components/documentation/DocumentSearch';
import DocumentResults from '../components/documentation/DocumentResults';
import documentationService from '../services/documentationService';

function Documentation() {
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const results = await documentationService.searchDocumentation(query);
      
      // Check if we got empty or "not found" results
      if (!results || 
          (!results.documents?.length && 
           (!results.ai_explanation || 
            results.ai_explanation === "No directly relevant documentation found."))) {
        // Set proper empty results format
        setSearchResults({
          documents: [],
          ai_explanation: results?.ai_explanation || "No matching documentation found. Try different search terms."
        });
      } else {
        setSearchResults(results);
      }
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
      
      {hasSearched && searchResults && <DocumentResults results={searchResults} />}

      {!hasSearched && (
        <div className="bg-white shadow-md rounded-lg p-6 mt-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Popular Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-lg text-gray-800">Remote Work Policy</h3>
              <p className="text-sm text-gray-600 mt-2">Guidelines for remote work arrangements including eligibility and expectations.</p>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 inline-block">View policy &rarr;</a>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-lg text-gray-800">Performance Review Process</h3>
              <p className="text-sm text-gray-600 mt-2">Overview of the performance review cycle, expectations, and forms.</p>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 inline-block">View process &rarr;</a>
            </div>
            <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <h3 className="font-medium text-lg text-gray-800">Security Compliance</h3>
              <p className="text-sm text-gray-600 mt-2">Information security standards that all employees must follow.</p>
              <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium mt-3 inline-block">View standards &rarr;</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Documentation;