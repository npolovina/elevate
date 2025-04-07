// frontend/src/components/elevate/JobDetailModal.jsx
import React from 'react';
import { X, Briefcase, MapPin, Calendar, Check, ExternalLink, Bookmark, Share2 } from 'lucide-react';

const JobDetailModal = ({ isOpen, onClose, job }) => {
  if (!isOpen || !job) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>

        {/* Modal panel */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 sm:mt-0 sm:ml-4 sm:text-left w-full">
                <div className="flex justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {job.job.title}
                  </h3>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={onClose}
                  >
                    <X size={24} aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-4">
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Briefcase size={16} className="mr-1.5" />
                      <span>{job.job.department}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={16} className="mr-1.5" />
                      <span>{job.job.location}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={16} className="mr-1.5" />
                      <span>Posted: {new Date(job.job.posted_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-500">{job.job.description}</p>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-sm mb-2">Match Score: {job.match_score}%</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${job.match_score}%` }}></div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className="font-medium text-sm mb-2">Your Matching Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {job.matches.current_skills_match.map((skill, index) => (
                        <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <Check size={12} className="mr-1" />
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <ExternalLink size={16} className="mr-2" />
              Apply Now
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;