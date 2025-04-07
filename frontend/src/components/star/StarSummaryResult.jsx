import React from 'react';

function StarSummaryResult({ summary }) {
  if (!summary) {
    return null;
  }

  // Split the summary by section headings (Situation, Task, Action, Result)
  const sections = extractStarSections(summary);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">STAR Summary</h2>
      
      {Object.entries(sections).map(([section, content]) => (
        <div key={section} className="mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{section}</h3>
          <p className="text-gray-700">{content}</p>
        </div>
      ))}
      
      <div className="mt-6 flex justify-between">
        <button
          className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
          onClick={() => {
            navigator.clipboard.writeText(summary);
          }}
        >
          Copy to Clipboard
        </button>
        
        <button
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={() => {
            // In a real app, this would save to a database or export a file
            alert('Summary saved successfully!');
          }}
        >
          Save to Portfolio
        </button>
      </div>
    </div>
  );
}

// Helper function to extract STAR sections from the text
function extractStarSections(text) {
  const sections = {
    'Situation': '',
    'Task': '',
    'Action': '',
    'Result': ''
  };
  
  // Find each section in the text
  let currentSection = null;
  
  // Split by lines to analyze each line
  const lines = text.split('\n');
  
  for (const line of lines) {
    // Check if this line starts a new section
    const trimmedLine = line.trim();
    
    if (trimmedLine.startsWith('Situation:') || trimmedLine.match(/^Situation\b/)) {
      currentSection = 'Situation';
      // Remove the heading from the content
      sections[currentSection] += trimmedLine.replace(/^Situation:?/i, '').trim();
    } else if (trimmedLine.startsWith('Task:') || trimmedLine.match(/^Task\b/)) {
      currentSection = 'Task';
      // Remove the heading from the content
      sections[currentSection] += trimmedLine.replace(/^Task:?/i, '').trim();
    } else if (trimmedLine.startsWith('Action:') || trimmedLine.match(/^Action\b/)) {
      currentSection = 'Action';
      // Remove the heading from the content
      sections[currentSection] += trimmedLine.replace(/^Action:?/i, '').trim();
    } else if (trimmedLine.startsWith('Result:') || trimmedLine.match(/^Result\b/)) {
      currentSection = 'Result';
      // Remove the heading from the content
      sections[currentSection] += trimmedLine.replace(/^Result:?/i, '').trim();
    } else if (currentSection && trimmedLine) {
      // Add the line to the current section
      sections[currentSection] += ' ' + trimmedLine;
    }
  }
  
  // If the AI didn't use clear STAR format, make a best effort split
  if (!sections['Situation'] && !sections['Task'] && !sections['Action'] && !sections['Result']) {
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
    
    if (paragraphs.length >= 4) {
      sections['Situation'] = paragraphs[0];
      sections['Task'] = paragraphs[1];
      sections['Action'] = paragraphs[2];
      sections['Result'] = paragraphs[3];
    } else if (paragraphs.length === 3) {
      sections['Situation'] = paragraphs[0];
      sections['Task/Action'] = paragraphs[1];
      sections['Result'] = paragraphs[2];
    } else if (paragraphs.length === 2) {
      sections['Situation/Task'] = paragraphs[0];
      sections['Action/Result'] = paragraphs[1];
    } else if (paragraphs.length === 1) {
      sections['STAR Summary'] = paragraphs[0];
    }
  }
  
  return sections;
}

export default StarSummaryResult;