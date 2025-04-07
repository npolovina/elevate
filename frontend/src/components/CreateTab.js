import React, { useState } from 'react';
import { 
  Search, 
  SmileIcon, 
  MehIcon, 
  FrownIcon 
} from 'lucide-react';
import ApiService from './ApiService';

// Mock JIRA tickets (ideally this would come from backend or props)
const MOCK_JIRA_TICKETS = [
  { ticket_id: "PROJ-101", title: "Implement Authentication Service", status: "Completed" },
  { ticket_id: "PROJ-102", title: "Dashboard Analytics Visualization", status: "Completed" },
  { ticket_id: "PROJ-103", title: "Database Performance Optimization", status: "In Progress" }
];

// Mood icons mapping
const MOOD_ICONS = {
  'happy': { icon: SmileIcon, color: 'text-green-500' },
  'neutral': { icon: MehIcon, color: 'text-yellow-500' },
  'sad': { icon: FrownIcon, color: 'text-red-500' }
};

const CreateTab = ({ userId }) => {
  // State management
  const [selectedTicket, setSelectedTicket] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [starSummary, setStarSummary] = useState('');
  
  // Documentation search states
  const [documentationQuery, setDocumentationQuery] = useState('');
  const [documentationResults, setDocumentationResults] = useState(null);
  
  // Mood check states
  const [mood, setMood] = useState('');
  const [moodFeedback, setMoodFeedback] = useState('');

  // Generate STAR Summary
  const generateSTARSummary = async () => {
    if (!selectedTicket) {
      alert('Please select a ticket');
      return;
    }

    try {
      const result = await ApiService.generateSTARSummary(
        selectedTicket, 
        additionalContext
      );
      setStarSummary(result.star_summary);
    } catch (error) {
      alert('Failed to generate STAR summary');
    }
  };

  // Search Documentation
  const searchDocumentation = async () => {
    if (!documentationQuery) {
      alert('Please enter a search query');
      return;
    }

    try {
      const results = await ApiService.getDocumentation(documentationQuery);
      setDocumentationResults(results);
    } catch (error) {
      alert('Failed to search documentation');
    }
  };

  // Submit Mood Check
  const submitMoodCheck = async () => {
    if (!mood) {
      alert('Please select a mood');
      return;
    }

    try {
      await ApiService.submitMoodCheck(mood, moodFeedback);
      alert('Mood check submitted successfully!');
      // Reset mood check
      setMood('');
      setMoodFeedback('');
    } catch (error) {
      alert('Failed to submit mood check');
    }
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Create & Reflect</h1>

      {/* STAR Summary Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Completed Work STAR Summary</h2>
        
        <select 
          className="w-full p-2 border rounded mb-4"
          value={selectedTicket}
          onChange={(e) => setSelectedTicket(e.target.value)}
        >
          <option value="">Select a Completed Ticket</option>
          {MOCK_JIRA_TICKETS.filter(ticket => ticket.status === 'Completed').map(ticket => (
            <option key={ticket.ticket_id} value={ticket.ticket_id}>
              {ticket.title}
            </option>
          ))}
        </select>

        <textarea 
          placeholder="Add additional context (optional)"
          className="w-full p-2 border rounded mb-4 h-24"
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
        />

        <button 
          onClick={generateSTARSummary}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Generate STAR Summary
        </button>

        {starSummary && (
          <div className="mt-4 p-4 bg-blue-50 rounded">
            <h3 className="font-bold mb-2 text-blue-700">STAR Summary:</h3>
            <p className="text-gray-700">{starSummary}</p>
          </div>
        )}
      </div>

      {/* Documentation Search Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Company Documentation</h2>
        
        <div className="flex">
          <input 
            type="text" 
            placeholder="Search documentation"
            className="flex-1 p-2 border rounded-l"
            value={documentationQuery}
            onChange={(e) => setDocumentationQuery(e.target.value)}
          />
          <button 
            onClick={searchDocumentation}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition"
          >
            <Search size={20} />
          </button>
        </div>

        {documentationResults && (
          <div className="mt-4 space-y-2">
            {documentationResults.documents.map(doc => (
              <div 
                key={doc.doc_id} 
                className="p-3 bg-gray-100 rounded hover:bg-gray-200 transition"
              >
                <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                <p className="text-gray-600">{doc.content_summary}</p>
              </div>
            ))}

            {documentationResults.ai_explanation && (
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-blue-700">AI Insight:</h4>
                <p className="text-gray-700">{documentationResults.ai_explanation}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mood Check Section */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Vibe Check</h2>
        
        <div className="flex justify-center space-x-6 mb-6">
          {Object.entries(MOOD_ICONS).map(([moodKey, { icon: MoodIcon, color }]) => (
            <button
              key={moodKey}
              onClick={() => setMood(moodKey)}
              className={`
                p-3 rounded-full transition 
                ${mood === moodKey ? `${color} bg-opacity-20` : 'text-gray-400 hover:bg-gray-100'}
              `}
            >
              <MoodIcon size={40} />
              <span className="block text-xs mt-1 capitalize">{moodKey}</span>
            </button>
          ))}
        </div>

        <textarea 
          placeholder="What's on your mind? Share your thoughts..."
          className="w-full p-2 border rounded mb-4 h-24"
          value={moodFeedback}
          onChange={(e) => setMoodFeedback(e.target.value)}
        />

        <button 
          onClick={submitMoodCheck}
          disabled={!mood}
          className={`
            w-full py-2 rounded transition
            ${mood 
              ? 'bg-blue-500 text-white hover:bg-blue-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Submit Mood Check
        </button>
      </div>
    </div>
  );
};

export default CreateTab;