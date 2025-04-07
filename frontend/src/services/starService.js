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
      const response = await api.post('/create/star-summary', {
        ticket_id: ticketId,
        additional_context: additionalContext
      });
      return response.data;
    } catch (error) {
      console.error('Error generating STAR summary:', error);
      throw error;
    }
  },

  /**
   * Get a list of completed JIRA tickets
   * This would typically come from the API, but for demo purposes,
   * we'll return a static list that matches our mock data
   * @returns {Array} Array of completed JIRA tickets
   */
  getCompletedTickets: async () => {
    // In a real app, this would be an API call
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
  }
};

export default starService;