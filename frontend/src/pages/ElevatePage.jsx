// frontend/src/pages/ElevatePage.jsx
import React from 'react';
import JobRecommendations from '../components/elevate/JobRecommendations';

const ElevatePage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Elevate Your Career</h1>
      <JobRecommendations />
    </div>
  );
};

export default ElevatePage;