import axios from 'axios';

const API_BASE = '/api/practice';

export const fetchProjects = async (userId) => {
  try {
    console.log('Fetching projects from server');
    const response = await axios.get(`${API_BASE}/projects`);
    return response.data.projects.filter(project => project.userId === userId);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
};

export const fetchPractices = async (projectId) => {
  try {
    const response = await axios.get(`${API_BASE}/project/${projectId}/practices`);
    return response.data.practices || [];
  } catch (error) {
    console.error('Error fetching practices:', error);
    return [];
  }
};

export const fetchQuestions = async (practiceId) => {
  try {
    const response = await axios.get(`${API_BASE}/practice/${practiceId}/questions`);
    return response.data.questions || [];
  } catch (error) {
    console.error('Error fetching questions:', error);
    return [];
  }
};

export const createProject = async (projectData) => {
  try {
    const response = await axios.post(`${API_BASE}/projects`, projectData);
    return response.data.project;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const createPractice = async (projectId, practiceData) => {
  try {
    const response = await axios.post(`${API_BASE}/project/${projectId}/practices`, practiceData);
    return response.data.practice;
  } catch (error) {
    console.error('Error creating practice:', error);
    throw error;
  }
};

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

export const deleteQuestion = async (questionId) => {
  try {
    const response = await axios.delete(`${API_BASE}/question/${questionId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const response = await axios.delete(`${API_BASE}/projects/${projectId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting project:', error);
    throw error;
  }
};

export const deletePractice = async (practiceId) => {
  try {
    const response = await axios.delete(`${API_BASE}/practices/${practiceId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting practice:', error);
    throw error;
  }
};

export const fetchStudentInProgress = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/student/${userId}/in-progress`);
    return response.data.sessions || [];
  } catch (error) {
    console.error('Error fetching in-progress sessions:', error);
    return [];
  }
};

export const fetchStudentHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE}/student/${userId}/history`);
    return response.data.history || [];
  } catch (error) {
    console.error('Error fetching student history:', error);
    return [];
  }
};

export const startSession = async (userId, practiceId, sourceQuestions = null) => {
  try {
    const response = await axios.post(`${API_BASE}/student/${userId}/session`, {
      practiceId,
      sourceQuestions
    });
    return response.data;
  } catch (error) {
    console.error('Error starting session:', error);
    throw error;
  }
};

export const fetchSession = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE}/session/${sessionId}`);
    return response.data.session;
  } catch (error) {
    console.error('Error fetching session:', error);
    throw error;
  }
};

export const fetchSessionPreview = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE}/session/${sessionId}/preview`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session preview:', error);
    throw error;
  }
};

export const fetchSessionStart = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE}/session/${sessionId}/start`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session start info:', error);
    throw error;
  }
};

export const submitAnswer = async (sessionId, answer) => {
  try {
    const response = await axios.post(`${API_BASE}/session/${sessionId}/submit`, { answer });
    return response.data;
  } catch (error) {
    console.error('Error submitting answer:', error);
    throw error;
  }
};

export const nextQuestion = async (sessionId) => {
  try {
    const response = await axios.post(`${API_BASE}/session/${sessionId}/next`);
    return response.data;
  } catch (error) {
    console.error('Error fetching next question:', error);
    throw error;
  }
};

export const completeSession = async (sessionId) => {
  try {
    const response = await axios.post(`${API_BASE}/session/${sessionId}/complete`);
    return response.data;
  } catch (error) {
    console.error('Error completing session:', error);
    throw error;
  }
};

export const fetchSessionEnd = async (sessionId) => {
  try {
    const response = await axios.get(`${API_BASE}/session/${sessionId}/end`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session end info:', error);
    throw error;
  }
};
