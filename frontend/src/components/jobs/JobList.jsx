import React, { useState } from 'react';

function JobList({ jobs, onSelectJob }) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter jobs based on current filter
  const filteredJobs = jobs.filter(job => {
    // Filter by type (remote/hybrid/all)
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'remote' && job.location.toLowerCase().includes('remote')) ||
      (filter === 'hybrid' && job.location.toLowerCase().includes('hybrid'));
    
    // Filter by search term
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.requirements.some(req => req.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 md:mb-0">Recommended Jobs</h2>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search jobs..."
              className="shadow appearance-none border rounded w-full py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Filter buttons */}
          <div className="inline-flex rounded-md shadow-sm">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`relative inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                filter === 'all' 
                  ? 'bg-indigo-100 text-indigo-700 z-10' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter('remote')}
              className={`relative inline-flex items-center px-4 py-2 border-t border-b border-gray-300 text-sm font-medium ${
                filter === 'remote' 
                  ? 'bg-indigo-100 text-indigo-700 z-10' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Remote
            </button>
            <button
              type="button"
              onClick={() => setFilter('hybrid')}
              className={`relative inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                filter === 'hybrid' 
                  ? 'bg-indigo-100 text-indigo-700 z-10' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Hybrid
            </button>
          </div>
        </div>
      </div>
      
      {filteredJobs.length > 0 ? (
        <div className="divide-y divide-gray-200">
          {filteredJobs.map((job) => (
            <div 
              key={job.job_id} 
              className="py-4 cursor-pointer hover:bg-gray-50 rounded-md p-2"
              onClick={() => onSelectJob(job)}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-4 mt-1">
                    <div className="text-sm text-gray-500">{job.department}</div>
                    <div className="text-sm text-gray-500">{job.location}</div>
                    <div className="text-sm text-gray-500">Posted: {new Date(job.posted_date).toLocaleDateString()}</div>
                  </div>
                </div>
                
                <div className="mt-2 md:mt-0">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'Open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {job.requirements.slice(0, 3).map((req, idx) => {
                  // Check if this is a matching skill with the user's profile
                  const isMatchingSkill = job.skillMatch > 0 && idx < job.skillMatch;
                  return (
                    <span key={idx} className={`text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium rounded ${
                      isMatchingSkill 
                        ? 'bg-green-100 text-green-700' // Highlight matching skills
                        : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {req}
                      {isMatchingSkill && (
                        <span className="ml-1" title="Matching skill">✓</span>
                      )}
                    </span>
                  );
                })}
                {job.requirements.length > 3 && (
                  <span className="text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-gray-100 text-gray-700 rounded">
                    +{job.requirements.length - 3} more
                  </span>
                )}
              </div>
              
              <div className="mt-3 text-right">
                <button 
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectJob(job);
                  }}
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
          <p className="mt-1 text-sm text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
}

export default JobList;