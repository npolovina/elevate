import React, { useState } from 'react';

const JobInsightCard = ({ title, alignment, alignmentLevel, skills, verdict, isSelected, onClick }) => {
  // Define color classes based on alignment level
  const getAlignmentColor = (level) => {
    switch (level.toLowerCase()) {
      case 'strong': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-blue-100 text-blue-800';
      case 'partial': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const alignmentColor = getAlignmentColor(alignmentLevel);

  return (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'}`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
      <div className="mt-2 flex items-center">
        <span className="text-sm text-gray-600 mr-2">Alignment:</span>
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${alignmentColor}`}>
          {alignmentLevel}
        </span>
      </div>
      <p className="mt-2 text-sm text-gray-600">{alignment}</p>
      {isSelected && (
        <>
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700">Desired Skills Match</h4>
            <p className="text-sm text-gray-600">{skills}</p>
          </div>
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700">Verdict</h4>
            <p className="text-sm text-gray-600">{verdict}</p>
          </div>
        </>
      )}
      <div className="mt-2 text-center">
        <button className={`text-xs ${isSelected ? 'text-indigo-600' : 'text-gray-500'}`}>
          {isSelected ? 'Show less' : 'Read more'}
        </button>
      </div>
    </div>
  );
};

function AIJobInsights({ insights }) {
  // State to track which job card is expanded
  const [expandedJob, setExpandedJob] = useState(null);
  
  // Format our job insights data
  const jobsData = [
    {
      id: 1,
      title: "Senior Frontend Engineer",
      alignmentLevel: "Low",
      alignment: "Focuses heavily on React/TypeScript, which isn't Alex's core strength (backend/Python).",
      skills: "No overlap with Kubernetes, ML, or leadership.",
      verdict: "Poor fit. Only consider if pivoting to frontend is a goal."
    },
    {
      id: 2,
      title: "Senior Backend Engineer",
      alignmentLevel: "Strong",
      alignment: "Matches Alex's Python, FastAPI, and database skills.",
      skills: "Could indirectly develop leadership (e.g., mentoring junior engineers) but lacks Kubernetes/ML.",
      verdict: "Best current skills match, but limited growth in desired areas. Ideal if prioritizing stability over upskilling."
    },
    {
      id: 3,
      title: "Data Scientist",
      alignmentLevel: "Partial",
      alignment: "Requires ML/stats experience Alex may lack, but Python is a strength.",
      skills: "Direct path to Machine Learning (core interest) and potential to learn ML tools (e.g., TensorFlow).",
      verdict: "High-risk, high-reward. Best if Alex is willing to bridge ML knowledge gaps (e.g., via courses)."
    },
    {
      id: 4,
      title: "Security Engineer",
      alignmentLevel: "Moderate",
      alignment: "Matches security skills and AWS/cloud experience.",
      skills: "Aligns with Cybersecurity interest; cloud security could lead to Kubernetes exposure (DevOps crossover).",
      verdict: "Strong fit for career pivot into security. Offers growth in cloud/DevOps (e.g., securing Kubernetes clusters)."
    }
  ];

  // Top recommendations
  const recommendations = [
    {
      rank: 1,
      job: "Security Engineer",
      reason: "Best balance—leverages current skills (security, AWS) while aligning with interests (cybersecurity) and offering DevOps/Kubernetes exposure."
    },
    {
      rank: 2,
      job: "Backend Engineer",
      reason: "Safe choice if Alex prefers to stay in backend engineering, but lacks ML/Kubernetes."
    },
    {
      rank: 3,
      job: "Data Scientist",
      reason: "Only if Alex is committed to upskilling in ML (may require a step-down role)."
    }
  ];

  return (
    <div className="bg-indigo-50 p-6 rounded-lg">
      <div className="flex items-center mb-4">
        <svg className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <h2 className="text-xl font-bold text-indigo-700">AI Career Insights</h2>
      </div>
      
      <p className="text-gray-700 mb-6">
        Below is a personalized analysis of how Alex Johnson's skills and career goals align with current job opportunities.
      </p>
      
      {/* Job Cards Grid */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Job Match Analysis</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {jobsData.map(job => (
          <JobInsightCard
            key={job.id}
            {...job}
            isSelected={expandedJob === job.id}
            onClick={() => setExpandedJob(expandedJob === job.id ? null : job.id)}
          />
        ))}
      </div>
      
      {/* Top Recommendations */}
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Top Recommendations</h3>
      <div className="bg-white rounded-lg p-4">
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div key={rec.rank} className="flex">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold mr-3">
                {rec.rank}
              </div>
              <div>
                <h4 className="font-medium text-gray-800">{rec.job}</h4>
                <p className="text-sm text-gray-600">{rec.reason}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Actionable Insight */}
      <div className="mt-6 bg-white p-4 rounded-lg border-l-4 border-indigo-500">
        <h3 className="font-semibold text-gray-800">Actionable Insights</h3>
        <ul className="mt-2 text-gray-600 pl-5 list-disc">
          <li>Prioritize <span className="font-medium">Security Engineer</span> for a strategic pivot into cybersecurity/DevOps.</li>
          <li>If ML is non-negotiable, pursue <span className="font-medium">Data Scientist</span> but pair with ML certifications (e.g., Coursera's ML Specialization).</li>
        </ul>
      </div>
    </div>
  );
}

export default AIJobInsights;