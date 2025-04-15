import api from './api';

const starService = {
  /**
   * Generate STAR format summary for a completed JIRA ticket
   * @param {string} ticketId - The ID of the completed JIRA ticket
   * @param {string} additionalContext - Optional additional context about the ticket
   * @returns {Promise} Promise object representing the STAR summary
   */
  generateStarSummary: async (ticketId, additionalContext = '') => {
    try {
      console.log(`Generating STAR summary for ticket: ${ticketId}`);
      
      // Add detailed logging
      if (!ticketId) {
        console.error('Error: No ticket ID provided for STAR summary generation');
        throw new Error('Ticket ID is required');
      }
      
      // Make API call with improved error handling
      const response = await api.post('/create/star-summary', {
        ticket_id: ticketId,
        additional_context: additionalContext
      });
      
      console.log('STAR summary API response received:', response.status);
      
      // Verify the response has the expected shape
      if (!response.data || !response.data.star_summary) {
        console.error('Invalid response format from STAR summary API', response.data);
        throw new Error('Invalid response from server');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error generating STAR summary:', error);
      
      // Enhanced error reporting
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.status, error.response.data);
        
        // Format a user-friendly error message based on the server response
        const serverMessage = error.response.data?.detail || 'Unknown server error';
        throw new Error(`Server error: ${serverMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        throw new Error('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        throw new Error(`Request error: ${error.message}`);
      }
    }
  },

  /**
   * Get a list of completed JIRA tickets
   * @returns {Promise} Promise object representing the completed tickets
   */
  getCompletedTickets: async () => {
    try {
      // In a real app, this would be an API call like:
      // const response = await api.get('/tickets/completed');
      // return response.data;
      
      console.log('Fetching completed tickets');
      
      // For demo, we're returning mock data that matches the backend
      return [
        {
          ticket_id: "PROJ-101",
          title: "Implement Authentication Service",
          completion_date: "2025-01-28"
        },
        {
          ticket_id: "PROJ-102",
          title: "Dashboard Analytics Visualization",
          completion_date: "2025-02-10"
        },
        {
          ticket_id: "PROJ-104",
          title: "Mobile Responsive Design",
          completion_date: "2025-02-25"
        },
        {
          ticket_id: "PROJ-105",
          title: "API Rate Limiting Implementation",
          completion_date: "2025-01-12"
        },
        {
          ticket_id: "PROJ-107",
          title: "Automated Email Notification System",
          completion_date: "2025-02-14"
        },
        {
          ticket_id: "PROJ-108",
          title: "Documentation Update for API v2",
          completion_date: "2025-01-25"
        },
        {
          ticket_id: "PROJ-110",
          title: "Accessibility Compliance Audit",
          completion_date: "2025-03-01"
        }
      ];
    } catch (error) {
      console.error('Error getting completed tickets:', error);
      throw error;
    }
  },
  
  /**
   * Get ticket details by ID
   * @param {string} ticketId - The ticket ID to fetch
   * @returns {Promise} Promise object representing the ticket details
   */
  getTicketById: async (ticketId) => {
    try {
      console.log(`Getting details for ticket: ${ticketId}`);
      
      // For demo purposes, we use mock data
      // In a real app, this would be an API call
      const tickets = [
        {
          "ticket_id": "PROJ-101",
          "title": "Implement Authentication Service",
          "description": "Create a secure authentication service with JWT tokens for the customer portal",
          "status": "Completed",
          "assignee": "user123",
          "start_date": "2025-01-15",
          "completion_date": "2025-01-28",
          "priority": "High",
          "comments": [
            {"user": "manager456", "text": "Great implementation! The security audit passed with no issues.", "date": "2025-01-29"},
            {"user": "user123", "text": "Overcame challenge with token expiration by implementing refresh tokens", "date": "2025-01-28"}
          ]
        },
        {
          "ticket_id": "PROJ-102",
          "title": "Dashboard Analytics Visualization",
          "description": "Create data visualizations for the main dashboard to display key performance indicators",
          "status": "Completed",
          "assignee": "user123",
          "start_date": "2025-02-01",
          "completion_date": "2025-02-10",
          "priority": "Medium",
          "comments": [
            {"user": "user123", "text": "Used D3.js to create interactive charts that improved data interpretation", "date": "2025-02-08"},
            {"user": "manager456", "text": "The executive team was impressed with the visualizations", "date": "2025-02-12"}
          ]
        }
      ];
      
      const ticket = tickets.find(t => t.ticket_id === ticketId);
      
      if (!ticket) {
        throw new Error(`Ticket not found: ${ticketId}`);
      }
      
      return ticket;
    } catch (error) {
      console.error(`Error getting ticket ${ticketId}:`, error);
      throw error;
    }
  }
};

export default starService;