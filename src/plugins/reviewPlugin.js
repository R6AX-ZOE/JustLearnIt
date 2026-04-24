import { createPlugin } from './pluginSystem';

const reviewPlugin = createPlugin('review', {
  dependencies: [],
  init: async () => {
    console.log('Review plugin initialized');
  },
  destroy: () => {
    console.log('Review plugin destroyed');
  },
  methods: {
    getIncorrectQuestions: async function(userId, practiceIds = [], startDate = null, endDate = null) {
      try {
        const params = new URLSearchParams();
        if (practiceIds && practiceIds.length > 0) {
          // 确保practiceIds是数组
          const ids = Array.isArray(practiceIds) ? practiceIds : [practiceIds];
          ids.forEach(id => params.append('practiceId', id));
        }
        if (startDate) {
          params.append('startDate', startDate);
        }
        if (endDate) {
          params.append('endDate', endDate);
        }
        
        const response = await fetch(`/api/practice/student/${userId}/incorrect-questions?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.incorrectQuestions || [];
      } catch (error) {
        console.error('Error fetching incorrect questions:', error);
        throw error;
      }
    },
    getIncorrectQuestionsByPractice: async function(userId, practiceId) {
      return await this.methods.getIncorrectQuestions(userId, practiceId);
    },
    startReviewSession: async function(userId, practiceIds = [], startDate = null, endDate = null) {
      try {
        // 确保practiceIds是数组
        const ids = Array.isArray(practiceIds) ? practiceIds : [practiceIds];
        const incorrectQuestions = await this.methods.getIncorrectQuestions(userId, ids, startDate, endDate);
        
        if (incorrectQuestions.length === 0) {
          return { message: 'No incorrect questions found', questions: [] };
        }
        
        const reviewQuestions = incorrectQuestions.map(item => item.question);
        
        const response = await fetch(`/api/practice/student/${userId}/session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            practiceId: ids.length > 0 ? ids[0] : null,
            sourceQuestions: reviewQuestions
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error starting review session:', error);
        throw error;
      }
    },
    getReviewStats: async function(userId, practiceIds = [], startDate = null, endDate = null) {
      try {
        // 确保practiceIds是数组
        const ids = Array.isArray(practiceIds) ? practiceIds : [practiceIds];
        const incorrectQuestions = await this.methods.getIncorrectQuestions(userId, ids, startDate, endDate);
        
        const stats = {
          totalIncorrect: incorrectQuestions.length,
          byPractice: {},
          byType: {}
        };
        
        incorrectQuestions.forEach(item => {
          // By practice
          if (!stats.byPractice[item.practiceName]) {
            stats.byPractice[item.practiceName] = 0;
          }
          stats.byPractice[item.practiceName]++;
          
          // By question type
          if (!stats.byType[item.question.type]) {
            stats.byType[item.question.type] = 0;
          }
          stats.byType[item.question.type]++;
        });
        
        return stats;
      } catch (error) {
        console.error('Error getting review stats:', error);
        throw error;
      }
    },
    createReviewSession: async function(userId, questionIds, practiceId = null, practiceName = null) {
      try {
        const response = await fetch(`/api/practice/student/${userId}/review-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            questionIds,
            practiceId,
            practiceName
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error creating review session:', error);
        throw error;
      }
    }
  }
});

export default reviewPlugin;