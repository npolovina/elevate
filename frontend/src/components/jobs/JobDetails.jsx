import React from 'react';

function JobDetails({ job, aiRecommendations, onBack }) {
  if (!job) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{job.title}</h2>
          <div className="flex flex-wrap gap-x-4 mt-1">
            <div className="text-sm text-gray-600">{job.department}</div>
            <div className="text-sm text-gray-600">{job.location}</div>
            <div className="text-sm text-gray-600">Posted: {new Date(job.posted_date).toLocaleDateString()}</div>
          </div>
        </div>
        
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to list
        </button>
      </div>
      
      {/* Status and Salary */}
      <div className="flex flex-wrap gap-3 mt-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          job.status === 'Open' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-yellow-100 text-yellow-800'
        }`}>
          {job.status}
        </span>
        {job.salary_range && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {job.salary_range}
          </span>
        )}
        {job.internal_only && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Internal Only
          </span>
        )}
      </div>
      
      {/* Skill Match Overview */}
      {job.skillMatchPercentage !== undefined && (
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Match</h3>
          <div className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium text-gray-700">Skills Match</span>
              <span className={`text-sm font-medium ${job.skillMatchPercentage > 70 ? 'text-green-600' : job.skillMatchPercentage > 40 ? 'text-blue-600' : 'text-gray-600'}`}>
                {job.skillMatchPercentage}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className={`h-2.5 rounded-full ${job.skillMatchPercentage > 70 ? 'bg-green-600' : job.skillMatchPercentage > 40 ? 'bg-blue-500' : 'bg-gray-500'}`} 
                style={{ width: `${job.skillMatchPercentage}%` }}
              ></div>
            </div>
          </div>
          
          {(job.matchingSkills && job.matchingSkills.length > 0) && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">
                <span className="font-medium text-green-700">Matching Skills:</span> {job.matchingSkills.join(', ')}
              </span>
            </div>
          )}
          
          {(job.matchingDesiredSkills && job.matchingDesiredSkills.length > 0) && (
            <div className="mb-2">
              <span className="text-sm text-gray-600">
                <span className="font-medium text-blue-700">Skills You Want to Develop:</span> {job.matchingDesiredSkills.join(', ')}
              </span>
            </div>
          )}
          
          {(job.matchingPreferredSkills && job.matchingPreferredSkills.length > 0) && (
            <div>
              <span className="text-sm text-gray-600">
                <span className="font-medium text-purple-700">Matching Preferred Skills:</span> {job.matchingPreferredSkills.join(', ')}
              </span>
            </div>
          )}
        </div>
      )}
      
      {/* Description */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
        <p className="text-gray-700">{job.description}</p>
      </div>
      
      {/* Requirements */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {job.requirements.map((req, idx) => {
            // Check if this requirement matches user skills
            const isMatchingSkill = job.matchingSkills && job.matchingSkills.includes(req);
            const isMatchingDesiredSkill = job.matchingDesiredSkills && job.matchingDesiredSkills.includes(req);
            
            let iconColor = 'text-gray-500';
            let bgColor = 'bg-white';
            let borderColor = '';
            
            if (isMatchingSkill) {
              iconColor = 'text-green-500';
              bgColor = 'bg-green-50';
              borderColor = 'border border-green-200';
            } else if (isMatchingDesiredSkill) {
              iconColor = 'text-blue-500';
              bgColor = 'bg-blue-50';
              borderColor = 'border border-blue-200';
            }
            
            return (
              <li 
                key={idx} 
                className={`flex items-start p-2 rounded-md ${bgColor} ${borderColor}`}
              >
                <svg
                  className={`h-5 w-5 ${iconColor} mr-2 flex-shrink-0 mt-0.5`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isMatchingSkill ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  )}
                </svg>
                <span className="text-gray-700">
                  {req}
                  {isMatchingSkill && (
                    <span className="ml-1 text-xs text-green-600 font-medium">(You have this skill)</span>
                  )}
                  {isMatchingDesiredSkill && (
                    <span className="ml-1 text-xs text-blue-600 font-medium">(Skill you want to develop)</span>
                  )}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
      
      {/* Preferred Skills */}
      {job.preferred_skills && job.preferred_skills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Preferred Skills</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {job.preferred_skills.map((skill, idx) => {
              // Check if this preferred skill matches user skills
              const isMatchingPreferred = job.matchingPreferredSkills && job.matchingPreferredSkills.includes(skill);
              
              let iconColor = 'text-gray-500';
              let bgColor = 'bg-white';
              let borderColor = '';
              
              if (isMatchingPreferred) {
                iconColor = 'text-purple-500';
                bgColor = 'bg-purple-50';
                borderColor = 'border border-purple-200';
              }
              
              return (
                <li 
                  key={idx} 
                  className={`flex items-start p-2 rounded-md ${bgColor} ${borderColor}`}
                >
                  <svg
                    className={`h-5 w-5 ${iconColor} mr-2 flex-shrink-0 mt-0.5`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-700">
                    {skill}
                    {isMatchingPreferred && (
                      <span className="ml-1 text-xs text-purple-600 font-medium">(Matching skill)</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {/* AI Recommendations */}
      {aiRecommendations && (
        <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">AI Career Insights</h3>
          <div className="text-gray-700 prose max-w-none">
            {aiRecommendations}
          </div>
        </div>
      )}
      
      {/* Application Actions */}
      <div className="mt-8 flex justify-end">
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow mr-3"
          onClick={() => window.open(`mailto:recruiting@company.com?subject=Interest in ${job.job_id}: ${job.title}`)}
        >
          Save for Later
        </button>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => window.open(`mailto:recruiting@company.com?subject=Application for ${job.job_id}: ${job.title}`)}
        >
          Apply Now
        </button>
      </div>
    </div>
  );
}

export default JobDetails;