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
      
      {/* Description */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
        <p className="text-gray-700">{job.description}</p>
      </div>
      
      {/* Requirements */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Requirements</h3>
        <ul className="list-disc pl-5 text-gray-700">
          {job.requirements.map((req, idx) => (
            <li key={idx} className="mb-1">{req}</li>
          ))}
        </ul>
      </div>
      
      {/* Preferred Skills */}
      {job.preferred_skills && job.preferred_skills.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Preferred Skills</h3>
          <ul className="list-disc pl-5 text-gray-700">
            {job.preferred_skills.map((skill, idx) => (
              <li key={idx} className="mb-1">{skill}</li>
            ))}
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