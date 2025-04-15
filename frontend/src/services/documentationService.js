import api from './api';

const documentationService = {
  /**
   * Search company documentation based on a query
   * @param {string} query - The search query
   * @returns {Promise} Promise object representing the search results
   */
  searchDocumentation: async (query) => {
    try {
      // Sanitize and validate the query
      const sanitizedQuery = query.trim();
      if (!sanitizedQuery) {
        throw new Error('Search query cannot be empty');
      }
      
      // Make the API call
      const response = await api.post('/create/documentation', {
        query: sanitizedQuery
      });
      
      // Process and validate the response
      const results = response.data;
      
      // Make sure the results have the expected structure
      if (!results) {
        return {
          documents: [],
          ai_explanation: "No documentation found matching your query."
        };
      }
      
      // Ensure documents is always an array
      if (!results.documents || !Array.isArray(results.documents)) {
        results.documents = [];
      }
      
      // Ensure ai_explanation exists and has sensible content
      if (!results.ai_explanation || results.ai_explanation === "No directly relevant documentation found.") {
        // If we have documents but no AI explanation, add a helpful one
        if (results.documents.length > 0) {
          results.ai_explanation = `Found ${results.documents.length} document(s) related to "${sanitizedQuery}". Browse the results below for relevant information.`;
        } else {
          // No documents and no explanation
          results.ai_explanation = "No documentation found matching your query. Try different keywords or browse categories.";
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error searching documentation:', error);
      // Return a structured error object
      throw {
        message: error.message || 'Failed to search documentation',
        status: error.response?.status || 500,
        isApiError: true
      };
    }
  },
  
  /**
   * Get popular documentation categories
   * @returns {Promise} Promise object representing the popular categories
   */
  getPopularCategories: async () => {
    // This would be an API call in a real app
    // For now, return mock data
    return [
      { id: 'hr', name: 'HR', count: 12 },
      { id: 'security', name: 'Security', count: 8 },
      { id: 'engineering', name: 'Engineering', count: 15 },
      { id: 'finance', name: 'Finance', count: 5 }
    ];
  }
};

export default documentationService;