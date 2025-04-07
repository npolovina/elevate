import api from './api';

const documentationService = {
  /**
   * Search company documentation based on a query
   * @param {string} query - The search query
   * @returns {Promise} Promise object representing the search results
   */
  searchDocumentation: async (query) => {
    try {
      const response = await api.post('/create/documentation', {
        query: query
      });
      return response.data;
    } catch (error) {
      console.error('Error searching documentation:', error);
      throw error;
    }
  }
};

export default documentationService;