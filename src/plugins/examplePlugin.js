import { createPlugin } from './pluginSystem';

// 创建示例插件
const examplePlugin = createPlugin('example', {
  dependencies: [],
  init: async () => {
    console.log('Example plugin initialized');
    // 初始化时的操作
  },
  destroy: () => {
    console.log('Example plugin destroyed');
    // 清理操作
  },
  methods: {
    // DOM 操作示例
    manipulateDOM: (selector, text) => {
      const element = document.querySelector(selector);
      if (element) {
        element.textContent = text;
        return true;
      }
      return false;
    },
    
    // API 访问示例
    fetchData: async (url) => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('API fetch error:', error);
        throw error;
      }
    },
    
    // 练习系统 API 示例
    submitAnswer: async (questionId, answer) => {
      try {
        const response = await fetch(`/api/practice/question/${questionId}/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ answer })
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
      } catch (error) {
        console.error('Submit answer error:', error);
        throw error;
      }
    },
    
    // 工具方法示例
    formatMessage: (isCorrect, message) => {
      return isCorrect ? `✅ ${message}` : `❌ ${message}`;
    }
  }
});

export default examplePlugin;