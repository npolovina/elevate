import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import moodService from '../../services/moodService';

function MoodCheckForm({ onSubmit, isLoading }) {
  const [searchParams] = useSearchParams();
  const [selectedMood, setSelectedMood] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState(null);
  
  const moodOptions = moodService.getMoodOptions();
  
  // Check if a mood was pre-selected from URL params
  useEffect(() => {
    const moodFromUrl = searchParams.get('mood');
    if (moodFromUrl) {
      const mood = moodService.findMoodByValue(moodFromUrl);
      if (mood) {
        setSelectedMood(mood.value);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedMood) {
      setError('Please select how you\'re feeling today.');
      return;
    }
    
    setError(null);
    onSubmit(selectedMood, feedback);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">How are you feeling today?</h2>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <div className="grid grid-cols-5 gap-4">
            {moodOptions.map((mood) => {
              const isSelected = selectedMood === mood.value;
              let colorClasses;
              
              switch (mood.color) {
                case 'green':
                  colorClasses = isSelected ? "bg-green-100 border-green-500" : "hover:bg-green-50";
                  break;
                case 'yellow':
                  colorClasses = isSelected ? "bg-yellow-100 border-yellow-500" : "hover:bg-yellow-50";
                  break;
                case 'orange':
                  colorClasses = isSelected ? "bg-orange-100 border-orange-500" : "hover:bg-orange-50";
                  break;
                case 'red':
                  colorClasses = isSelected ? "bg-red-100 border-red-500" : "hover:bg-red-50";
                  break;
                default:
                  colorClasses = isSelected ? "bg-gray-100 border-gray-500" : "hover:bg-gray-50";
              }
              
              return (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setSelectedMood(mood.value)}
                  className={`p-4 border-2 rounded-lg transition-colors flex flex-col items-center ${
                    isSelected ? `${colorClasses} border-2` : `border border-gray-200 ${colorClasses}`
                  }`}
                  disabled={isLoading}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className={`font-medium mt-2 text-${mood.color}-700`}>{mood.label}</span>
                </button>
              );
            })}
          </div>
          <p className="text-sm text-gray-500 mt-3">
            Regular check-ins help us provide better support for your career journey.
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="feedback" className="block text-gray-700 text-sm font-bold mb-2">
            What's contributing to how you feel? (Optional)
          </label>
          <textarea
            id="feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="4"
            placeholder="Share any thoughts, challenges, or wins that are affecting your mood today..."
            disabled={isLoading}
          ></textarea>
        </div>
        
        <div className="flex items-center justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </>
            ) : (
              'Submit Mood Check'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default MoodCheckForm;