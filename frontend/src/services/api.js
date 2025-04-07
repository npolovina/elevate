// services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // Change in production

const api = {
  instance: axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  }),

  // Set auth token for all future requests
  setAuthToken: (token) => {
    if (token) {
      api.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.instance.defaults.headers.common['Authorization'];
    }
  },

  // Auth endpoints
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    
    try {
      const response = await axios.post(`${API_URL}/token`, formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Generic API methods
  get: async (endpoint) => {
    try {
      const response = await api.instance.get(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await api.instance.post(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await api.instance.put(endpoint, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await api.instance.delete(endpoint);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // File uploads
  uploadFile: async (endpoint, file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.instance.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Specific API endpoints for the Elevate app
  
  // Create Tab
  getJiraTickets: () => api.get('/jira-tickets'),
  getStarExamples: () => api.get('/star-examples'),
  generateStar: (ticketId) => api.post('/generate-star', { ticket_id: ticketId }),
  askQuestion: (question, context) => api.post('/ask-question', { question, context }),
  
  // Connect Tab
  getPeopleRecommendations: () => api.get('/people-recommendations'),
  getLearningRecommendations: () => api.get('/learning-recommendations'),
  
  // Elevate Tab
  getJobRecommendations: () => api.get('/job-recommendations'),
  
  // Chat
  getConversations: () => api.get('/conversations'),
  getConversation: (conversationId) => api.get(`/conversations/${conversationId}`),
  createConversation: (message) => api.post('/conversations', { message }),
  addMessage: (conversationId, message) => api.post(`/conversations/${conversationId}/messages`, { message }),
};

export default api;