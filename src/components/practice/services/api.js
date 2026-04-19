import axios from 'axios';

const API_BASE = '/api/practice';

// 全局变量，用于跟踪最近的API请求时间
let lastFetchTime = 0;
const requestThrottle = 1000; // 1秒内不重复请求

// 获取所有项目
export const fetchProjects = async (userId) => {
  try {
    const now = Date.now();
    if (now - lastFetchTime < requestThrottle) {
      console.log('Request throttled - skipping fetchProjects');
      return [];
    }
    lastFetchTime = now;
    
    console.log('Fetching projects from server');
    const response = await axios.get(`${API_BASE}/projects`);
    return response.data.projects.filter(project => project.userId === userId);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

// 获取项目的练习
export const fetchPractices = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE}/project/${projectId}/practices`);
    return response.data.practices || [];
  } catch (error) {
    console.error('Error fetching practices:', error);
    return [];
  }
};

// 获取练习的问题
export const fetchQuestions = async (practiceId) => {
  try {
    const response = await axios.get(`${API_BASE}/practice/${practiceId}/questions`);
    return response.data.questions || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

// 创建新项目
export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_BASE}/projects`, projectData);
    return response.data.project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

// 创建新练习
export const createPractice = async (projectId, practiceData) => {
  try {
    const response = await axios.post(`${API_BASE}/project/${projectId}/practices`, practiceData);
    return response.data.practice;
  } catch (error) {
    console.error('Error creating practice:', error);
    throw error;
  }
};

// 创建新问题
export const createQuestion = async (practiceId, questionData) => {
  try {
    const response = await axios.post(`${API_BASE}/practice/${practiceId}/questions`, {
      ...questionData,
      options: questionData.options.filter(opt => opt)
    });
    return response.data.question;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
};

// 更新问题
export const updateQuestion = async (questionId, questionData) => {
  try {
    const response = await axios.put(`${API_BASE}/question/${questionId}`, {
      ...questionData,
      options: questionData.options.filter(opt => opt)
    });
    return response.data.question;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
};

// 删除问题
export const deleteQuestion = async (questionId) => {
  try {
    const response = await axios.delete(`${API_BASE}/question/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};