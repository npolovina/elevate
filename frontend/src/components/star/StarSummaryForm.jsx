import React, { useState, useEffect } from 'react';
import starService from '../../services/starService';
import Loading from '../common/Loading';

function StarSummaryForm({ onGenerateSummary, isLoading }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [ticketDetails, setTicketDetails] = useState(null);
  const [additionalContext, setAdditionalContext] = useState('');
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [isLoadingTicketDetails, setIsLoadingTicketDetails] = useState(false);
  const [error, setError] = useState(null);

  // Fetch available completed tickets
  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoadingTickets(true);
      setError(null);
      try {
        const completedTickets = await starService.getCompletedTickets();
        console.log('Completed tickets loaded:', completedTickets.length);
        setTickets(completedTickets);
        
        if (completedTickets.length > 0) {
          setSelectedTicket(completedTickets[0].ticket_id);
          // Load details for the first ticket
          fetchTicketDetails(completedTickets[0].ticket_id);
        } else {
          setError('No completed tickets found. Complete a ticket to generate a STAR summary.');
        }
      } catch (err) {
        console.error('Error fetching tickets:', err);
        setError('Failed to load tickets. Please refresh and try again.');
      } finally {
        setIsLoadingTickets(false);
      }
    };

    fetchTickets();
  }, []);

  // Fetch ticket details when selection changes
  const fetchTicketDetails = async (ticketId) => {
    if (!ticketId) return;
    
    setIsLoadingTicketDetails(true);
    try {
      const details = await starService.getTicketById(ticketId);
      setTicketDetails(details);
      
      // Pre-populate additional context with ticket description
      if (details.description) {
        setAdditionalContext(details.description);
      }
    } catch (err) {
      console.error('Error fetching ticket details:', err);
      // Don't set error here as it's not critical
    } finally {
      setIsLoadingTicketDetails(false);
    }
  };

  // Handle ticket selection change
  const handleTicketChange = (e) => {
    const ticketId = e.target.value;
    setSelectedTicket(ticketId);
    setAdditionalContext(''); // Reset additional context
    fetchTicketDetails(ticketId);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTicket) {
      setError('Please select a ticket.');
      return;
    }

    setError(null);
    console.log(`Generating STAR summary for ticket ${selectedTicket}`);
    onGenerateSummary(selectedTicket, additionalContext);
  };

  if (isLoadingTickets) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">STAR Summary Generator</h2>
        <Loading message="Loading completed tickets..." />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <label htmlFor="ticketSelect" className="block text-gray-700 text-sm font-bold mb-2">
          Select Completed Ticket
        </label>
        
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
            <p>{error}</p>
          </div>
        )}
        
        {tickets.length > 0 ? (
          <select
            id="ticketSelect"
            value={selectedTicket}
            onChange={handleTicketChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            disabled={isLoading}
          >
            {tickets.map((ticket) => (
              <option key={ticket.ticket_id} value={ticket.ticket_id}>
                {ticket.ticket_id}: {ticket.title} (Completed: {new Date(ticket.completion_date).toLocaleDateString()})
              </option>
            ))}
          </select>
        ) : !error && (
          <div className="bg-gray-100 text-gray-700 p-4 rounded">
            No completed tickets found.
          </div>
        )}
      </div>
      
      {isLoadingTicketDetails && (
        <div className="mb-4">
          <Loading message="Loading ticket details..." />
        </div>
      )}
      
      {ticketDetails && (
        <div className="mb-6 bg-gray-50 p-4 rounded">
          <h3 className="font-medium text-gray-700 mb-2">Ticket Details</h3>
          <p><span className="font-medium">Description:</span> {ticketDetails.description}</p>
          {ticketDetails.comments && ticketDetails.comments.length > 0 && (
            <div className="mt-2">
              <p className="font-medium">Comments:</p>
              <ul className="list-disc pl-5 text-sm text-gray-600">
                {ticketDetails.comments.map((comment, idx) => (
                  <li key={idx}>
                    <span className="font-medium">{comment.user}:</span> {comment.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div className="mb-6">
        <label htmlFor="additionalContext" className="block text-gray-700 text-sm font-bold mb-2">
          Additional Context (Optional)
        </label>
        <textarea
          id="additionalContext"
          value={additionalContext}
          onChange={(e) => setAdditionalContext(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="4"
          placeholder="Add any additional information that might be helpful for generating a comprehensive STAR summary..."
          disabled={isLoading}
        ></textarea>
        <p className="text-xs text-gray-500 mt-1">
          Include specific challenges faced, solutions implemented, and measurable results achieved.
        </p>
      </div>
      
      <div className="flex items-center justify-end">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center"
          disabled={isLoading || !selectedTicket}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate STAR Summary'
          )}
        </button>
      </div>
    </form>
  );
}

export default StarSummaryForm;