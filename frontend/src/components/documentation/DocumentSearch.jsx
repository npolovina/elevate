import React, { useState } from 'react';

function DocumentSearch({ onSearch, isLoading }) {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError('Please enter a search query.');
      return;
    }
    
    setError(null);
    onSearch(query);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Search Company Documentation</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="flex">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search policies, processes, guidelines..."
            className="flex-grow shadow appearance-none border rounded-l w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-r focus:outline-none focus:shadow-outline flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Searching...
              </>
            ) : (
              <>
                <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </>
            )}
          </button>
        </div>
      </form>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600">
          Search across HR policies, security guidelines, engineering practices, and more.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-indigo-100 text-indigo-700 rounded">remote work</span>
          <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-indigo-100 text-indigo-700 rounded">benefits</span>
          <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-indigo-100 text-indigo-700 rounded">performance review</span>
          <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-indigo-100 text-indigo-700 rounded">security compliance</span>
          <span className="text-xs inline-block py-1 px-2.5 leading-none text-center whitespace-nowrap align-baseline font-medium bg-indigo-100 text-indigo-700 rounded">code review</span>
        </div>
      </div>
    </div>
  );
}

export default DocumentSearch;