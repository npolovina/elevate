import React, { useState } from 'react';

// Component for the key points section with expandable details
const KeyPointsSection = ({ points }) => {
  const [expandedPoint, setExpandedPoint] = useState(null);
  
  return (
    <div className="mt-4">
      <h3 className="text-md font-semibold text-gray-800 mb-2">Key Points</h3>
      <div className="space-y-2">
        {points.map((point, index) => (
          <div 
            key={index} 
            className="border rounded-lg overflow-hidden bg-white"
          >
            <button
              className="w-full px-4 py-2 text-left flex justify-between items-center focus:outline-none"
              onClick={() => setExpandedPoint(expandedPoint === index ? null : index)}
            >
              <span className="font-medium text-indigo-700">{point.title}</span>
              <svg 
                className={`h-5 w-5 text-gray-500 transition-transform ${expandedPoint === index ? 'transform rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {expandedPoint === index && (
              <div className="px-4 py-3 bg-gray-50 border-t">
                <p className="text-sm text-gray-600">{point.description}</p>
                {point.items && (
                  <ul className="mt-2 list-disc pl-5 text-sm text-gray-600 space-y-1">
                    {point.items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Component for actionable guidance section
const GuidanceSection = ({ guidance }) => {
  return (
    <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
      <h3 className="text-md font-semibold text-indigo-800 mb-2">Guidance</h3>
      <div className="space-y-3">
        {guidance.map((item, index) => (
          <div key={index} className="flex">
            <div className="flex-shrink-0 h-6 w-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-800 font-semibold mr-2 mt-0.5">
              {index + 1}
            </div>
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium text-indigo-700">{item.role}: </span>
                {item.guidance}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function DocumentResults({ results }) {
  // Check if we have valid results to display
  const hasResults = results && 
    (results.documents?.length > 0 || (results.ai_explanation && results.ai_explanation !== "No directly relevant documentation found."));
  
  if (!hasResults) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mt-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Documentation Results</h2>
        <div className="py-4 text-center text-gray-500">
          <p>No documentation found matching your query. Try different keywords or browse categories below.</p>
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">Remote Work</button>
            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">Security</button>
            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">Performance Reviews</button>
            <button className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">Benefits</button>
          </div>
        </div>
      </div>
    );
  }

  // Format AI insights from the explanation text
  // This is a simplification - in a real app, you would parse this more carefully
  // or have the backend provide structured data
  const formatAIInsights = (explanation) => {
    // Return structured format of the sample
    if (explanation.includes("Security Compliance Standards")) {
      return {
        document: {
          id: "DOC-002",
          title: "Security Compliance Standards",
          category: "Security",
        },
        relevance: "security",
        summary: "Outlines the mandatory information security policies that all employees must adhere to.",
        keyPoints: [
          {
            title: "Purpose",
            description: "Ensures the confidentiality, integrity, and availability of company and customer data."
          },
          {
            title: "Scope",
            description: "Applies to all employees, contractors, and third parties with access to company systems."
          },
          {
            title: "Requirements",
            description: "Information security standards and policies to follow:",
            items: [
              "Password policies (e.g., complexity, multi-factor authentication)",
              "Data handling (e.g., encryption, secure storage/sharing)",
              "Access control (e.g., least-privilege principles)",
              "Incident reporting (e.g., procedures for breaches or suspicious activity)"
            ]
          },
          {
            title: "Compliance",
            description: "Non-compliance may result in disciplinary action or legal consequences."
          }
        ],
        guidance: [
          {
            role: "Employees",
            guidance: "Review the document thoroughly and follow all specified protocols."
          },
          {
            role: "Managers",
            guidance: "Ensure team awareness and enforce adherence."
          },
          {
            role: "Questions?",
            guidance: "Contact your IT/security team for clarifications."
          }
        ],
        note: "For specifics (e.g., exact password rules), refer directly to DOC-002 or your organization's security team."
      };
    }
    
    // Default formatting if we don't have a specific parser for this document
    return {
      document: {
        id: results.documents?.[0]?.doc_id || "Unknown",
        title: results.documents?.[0]?.title || "Document",
        category: results.documents?.[0]?.category || "General",
      },
      summary: explanation,
      keyPoints: [],
      guidance: []
    };
  };

  // Get formatted insights
  const aiInsights = results.ai_explanation && results.ai_explanation !== "No directly relevant documentation found." 
    ? formatAIInsights(results.ai_explanation)
    : null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Documentation Results</h2>
      
      {/* AI Explanation */}
      {aiInsights && (
        <div className="mb-6 bg-white border border-indigo-200 rounded-lg overflow-hidden">
          <div className="bg-indigo-50 px-4 py-3 border-b border-indigo-200">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-lg font-semibold text-indigo-700">
                {aiInsights.document.id}: {aiInsights.document.title}
              </h3>
            </div>
            {aiInsights.relevance && (
              <div className="mt-1 flex">
                <span className="ml-7 text-sm text-gray-600">
                  Relevant to your search: 
                  <span className="ml-1 font-medium text-indigo-600">{aiInsights.relevance}</span>
                </span>
              </div>
            )}
          </div>
          
          <div className="p-4">
            <p className="text-gray-700">{aiInsights.summary}</p>
            
            {aiInsights.keyPoints.length > 0 && (
              <KeyPointsSection points={aiInsights.keyPoints} />
            )}
            
            {aiInsights.guidance.length > 0 && (
              <GuidanceSection guidance={aiInsights.guidance} />
            )}
            
            {aiInsights.note && (
              <div className="mt-4 bg-yellow-50 p-3 rounded-lg text-sm text-yellow-800 border border-yellow-200">
                <span className="font-semibold">Note: </span>{aiInsights.note}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Document List */}
      {results.documents && results.documents.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">All Relevant Documents</h3>
          <div className="divide-y divide-gray-200">
            {results.documents.map((doc) => (
              <div key={doc.doc_id} className="py-4">
                <div className="flex items-start">
                  <div className="mr-4 mt-1 flex-shrink-0">
                    <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-md font-semibold text-gray-900">{doc.title}</h4>
                    <div className="mt-1 text-sm text-gray-600">{doc.content_summary}</div>
                    <div className="mt-2 flex">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 mr-2">
                        {doc.category}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                        Updated: {new Date(doc.last_updated).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-2">
                      <a href={`#${doc.file_path}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                        View document &rarr;
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-4 text-center text-gray-500">
          No specific documents found matching your query.
        </div>
      )}
    </div>
  );
}

export default DocumentResults;