import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

class ApiService {
  static async generateSTARSummary(ticketId, additionalContext) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/create/star-summary`, {
        ticket_id: ticketId,
        additional_context: additionalContext
      });
      return response.data;
    } catch (error) {
      console.error('Error generating STAR summary:', error);
      throw error;
    }
  }

  static async getDocumentation(query) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/create/documentation`, {
        query
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching documentation:', error);
      throw error;
    }
  }

  static async getConnectionRecommendations(userId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/connect/recommendations`, {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching connection recommendations:', error);
      throw error;
    }
  }

  static async getJobRecommendations(userId) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/elevate/job-recommendations`, {
        user_id: userId
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching job recommendations:', error);
      throw error;
    }
  }

  static async submitMoodCheck(mood, feedback) {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/create/mood-check`, {
        mood,
        feedback
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting mood check:', error);
      throw error;
    }
  }
}

export default ApiService;