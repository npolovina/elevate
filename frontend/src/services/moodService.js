import api from './api';

const moodService = {
  /**
   * Submit a mood check with optional feedback
   * @param {string} mood - The mood value (e.g., 'great', 'good', 'okay', 'stressed', 'overwhelmed')
   * @param {string} feedback - Optional feedback about the mood
   * @returns {Promise} Promise object representing the mood check submission
   */
  submitMoodCheck: async (mood, feedback = '') => {
    try {
      const response = await api.post('/create/mood-check', {
        mood: mood,
        feedback: feedback
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting mood check:', error);
      throw error;
    }
  },
  
  /**
   * Get a list of available moods
   * @returns {Array} Array of mood options
   */
  getMoodOptions: () => {
    return [
      { value: 'great', label: 'Great', emoji: '😀', color: 'green' },
      { value: 'good', label: 'Good', emoji: '🙂', color: 'green' },
      { value: 'okay', label: 'Okay', emoji: '😐', color: 'yellow' },
      { value: 'stressed', label: 'Stressed', emoji: '😓', color: 'orange' },
      { value: 'overwhelmed', label: 'Overwhelmed', emoji: '😩', color: 'red' }
    ];
  },
  
  /**
   * Find mood details by value
   * @param {string} value - The mood value to look up
   * @returns {Object|null} The mood object or null if not found
   */
  findMoodByValue: (value) => {
    const options = moodService.getMoodOptions();
    return options.find(mood => mood.value === value) || null;
  }
};

export default moodService;