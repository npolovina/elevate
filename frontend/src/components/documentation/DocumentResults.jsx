import React from 'react';

function DocumentResults({ results }) {
  if (!results || (!results.documents?.length && !results.ai_explanation)) {
    return null;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Documentation Results</h2>
      
      {/* AI Explanation */}
      {results.ai_explanation && (
        <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-indigo-700 mb-2">AI-Powered Insights</h3>
          <div className="text-gray-700 prose max-w-none">
            {results.ai_explanation}
          </div>
        </div>
      )}
      
      {/* Document List */}
      {results.documents && results.documents.length > 0 ? (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Relevant Documents</h3>
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