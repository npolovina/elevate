import React, { useState, useEffect } from 'react';
import starService from '../../services/starService';

function StarSummaryForm({ onGenerateSummary, isLoading }) {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [isLoadingTickets, setIsLoadingTickets] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoadingTickets(true);
      setError(null);
      try {
        const completedTickets = await starService.getCompletedTickets();
        setTickets(completedTickets);
        if (completedTickets.length > 0) {
          setSelectedTicket(completedTickets[0].ticket_id);
        }
      } catch (err) {
        setError('Failed to load tickets. Please try again later.');
        console.error('Error fetching tickets:', err);
      } finally {
        setIsLoadingTickets(false);
      }
    };

    fetchTickets();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedTicket) {
      setError('Please select a ticket.');
      return;
    }

    onGenerateSummary(selectedTicket, additionalContext);
  };

  if (isLoadingTickets) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <label htmlFor="ticketSelect" className="block text-gray-700 text-sm font-bold mb-2">
          Select Completed Ticket
        </label>
        <select
          id="ticketSelect"
          value={selectedTicket}
          onChange={(e) => setSelectedTicket(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          disabled={isLoading}
        >
          {tickets.map((ticket) => (
            <option key={ticket.ticket_id} value={ticket.ticket_id}>
              {ticket.ticket_id}: {ticket.title} (Completed: {new Date(ticket.completion_date).toLocaleDateString()})
            </option>
          ))}
        </select>
      </div>
      
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
          placeholder="Add any additional information that might be helpful..."
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