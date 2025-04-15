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
        <h2 className="text-xl font-bold text-gray-800 mb-3 md:mb-0">Recommended Jobs ({filteredJobs.length})</h2>
        
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
                
                <div className="mt-2 md:mt-0 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    job.status === 'Open' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {job.status}
                  </span>
                  
                  {job.internal_only && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Internal
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-3">
                <p className="text-sm text-gray-600">{job.description}</p>
              </div>
              
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-xs font-medium text-gray-500">REQUIREMENTS:</p>
                  {job.skillMatchPercentage !== undefined && (
                    <span className="text-xs text-gray-500">
                      Match: <span className={`font-medium ${job.skillMatchPercentage > 50 ? 'text-green-600' : 'text-gray-600'}`}>
                        {job.skillMatchPercentage}%
                      </span>
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {job.requirements.map((req, idx) => {
                    // Check if this requirement matches user skills
                    const isMatchingSkill = job.matchingSkills && job.matchingSkills.includes(req);
                    const isMatchingDesiredSkill = job.matchingDesiredSkills && job.matchingDesiredSkills.includes(req);
                    
                    let colorClasses = 'bg-gray-100 text-gray-700';
                    if (isMatchingSkill) {
                      colorClasses = 'bg-green-100 text-green-700 border border-green-300';
                    } else if (isMatchingDesiredSkill) {
                      colorClasses = 'bg-blue-100 text-blue-700 border border-blue-300';
                    }
                    
                    return (
                      <span 
                        key={idx} 
                        className={`text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium rounded ${colorClasses}`}
                      >
                        {req}
                        {isMatchingSkill && (
                          <svg className="inline-block ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </span>
                    );
                  })}
                  {job.requirements.length > 6 && (
                    <span className="text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-gray-100 text-gray-700 rounded">
                      +{job.requirements.length - 6} more
                    </span>
                  )}
                </div>
              </div>
              
              {job.preferred_skills && job.preferred_skills.length > 0 && (
                <div className="mt-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">PREFERRED:</p>
                  <div className="flex flex-wrap gap-1">
                    {job.preferred_skills.map((skill, idx) => {
                      // Check if this preferred skill matches user skills
                      const isMatchingPreferred = job.matchingPreferredSkills && job.matchingPreferredSkills.includes(skill);
                      
                      let colorClasses = 'bg-gray-100 text-gray-700';
                      if (isMatchingPreferred) {
                        colorClasses = 'bg-purple-100 text-purple-700 border border-purple-300';
                      }
                      
                      if (idx < 4 || isMatchingPreferred) {
                        return (
                          <span 
                            key={idx} 
                            className={`text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium rounded ${colorClasses}`}
                          >
                            {skill}
                            {isMatchingPreferred && (
                              <svg className="inline-block ml-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </span>
                        );
                      }
                      return null;
                    }).filter(Boolean)}
                    {job.preferred_skills.length > 4 && (
                      <span className="text-xs inline-block py-1 px-2 leading-none text-center whitespace-nowrap align-baseline font-medium bg-gray-100 text-gray-700 rounded">
                        +{job.preferred_skills.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}
              
              {job.salary_range && (
                <div className="mt-2 text-sm text-gray-600">
                  <span className="font-medium">Salary Range:</span> {job.salary_range}
                </div>
              )}
              
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