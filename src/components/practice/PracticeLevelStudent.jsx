import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import QuestionRenderer from './components/QuestionRenderer';
import { fetchProjects, fetchPractices, fetchQuestions } from './services/api';
import { styles } from './styles';
import axios from 'axios';

const API_BASE = '/api/practice';

const PracticeLevelStudent = ({ user }) => {
  // 状态管理
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 表示在总结页
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [integrationProjects, setIntegrationProjects] = useState([]);
  
  // 加载项目
  useEffect(() => {
    if (user) {
      loadProjects();
      loadIntegrationProjects();
    }
  }, [user]);
  
  // 当项目列表加载完成后，设置默认项目
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      setSelectedProject(projects[0]);
    }
  }, [projects, selectedProject]);
  
  // 加载练习
  useEffect(() => {
    if (selectedProject) {
      loadPractices();
    }
  }, [selectedProject]);
  
  // 加载问题
  useEffect(() => {
    if (selectedPractice) {
      loadQuestions();
    }
  }, [selectedPractice]);
  
  // 当练习列表加载完成后，设置默认练习
  useEffect(() => {
    if (practices.length > 0 && !selectedPractice) {
      setSelectedPractice(practices[0]);
    } else if (practices.length === 0) {
      setSelectedPractice(null);
    }
  }, [practices, selectedPractice]);
  
  // 获取所有项目
  const loadProjects = useCallback(async () => {
    try {
      const userProjects = await fetchProjects(user.id);
      setProjects(userProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [user]);
  
  // 获取集成项目
  const loadIntegrationProjects = useCallback(async () => {
    try {
      const response = await axios.get(`/api/integration/projects/${user.id}`);
      setIntegrationProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching integration projects:', error);
    }
  }, [user]);
  
  // 创建节点 ID 到节点信息的映射，用于快速查找
  const nodeMap = useMemo(() => {
    const map = new Map();
    for (const project of integrationProjects) {
      for (const graph of project.graphs || []) {
        for (const node of graph.nodes || []) {
          map.set(node.id, {
            ...node,
            projectName: project.name,
            graphName: graph.name
          });
        }
      }
    }
    return map;
  }, [integrationProjects]);
  
  // 获取项目的练习
  const loadPractices = useCallback(async () => {
    try {
      const projectPractices = await fetchPractices(selectedProject.id);
      setPractices(projectPractices);
    } catch (error) {
      console.error('Error fetching practices:', error);
    }
  }, [selectedProject]);
  
  // 获取练习的问题
  const loadQuestions = useCallback(async () => {
    try {
      const practiceQuestions = await fetchQuestions(selectedPractice.id);
      setQuestions(practiceQuestions);
      setCurrentQuestionIndex(-1); // 初始状态在总结页
      setUserAnswers({});
      setFeedback({});
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [selectedPractice]);
  
  // 提交答案
  const handleSubmitAnswer = async (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    try {
      // 调用服务器 API 获取真实反馈
      const response = await axios.post(`${API_BASE}/question/${currentQuestion.id}/submit`, {
        answer
      });
      
      setFeedback(prev => ({
        ...prev, 
        [currentQuestion.id]: {
          message: response.data.feedback,
          isCorrect: response.data.isCorrect
        }
      }));
    } catch (error) {
      console.error('Error submitting answer:', error);
      // 失败时使用本地模拟反馈
      let feedbackMessage = '';
      let isCorrect = false;
      if (currentQuestion.type === 'multiple-choice') {
        if (answer === currentQuestion.correctAnswer) {
          feedbackMessage = 'Correct! ' + (currentQuestion.feedback || 'Well done.');
          isCorrect = true;
        } else {
          feedbackMessage = 'Incorrect. ' + (currentQuestion.feedback || 'Try again.');
        }
      } else if (currentQuestion.type === 'fill-blank') {
        if (answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
          feedbackMessage = 'Correct! ' + (currentQuestion.feedback || 'Well done.');
          isCorrect = true;
        } else {
          feedbackMessage = 'Incorrect. ' + (currentQuestion.feedback || 'Try again.');
        }
      } else if (currentQuestion.type === 'essay') {
        feedbackMessage = 'Your answer: ' + answer;
        isCorrect = true;
      }
      
      setFeedback(prev => ({
        ...prev, 
        [currentQuestion.id]: {
          message: feedbackMessage,
          isCorrect
        }
      }));
    }
  };
  
  // 处理提交按钮点击
  const handleSubmitButtonClick = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestion.id];
    if (userAnswer) {
      handleSubmitAnswer(userAnswer);
    }
  };
  
  // 下一题
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentQuestionIndex === questions.length - 1) {
      // 完成所有题目后，跳转到总结页
      setCurrentQuestionIndex(-1);
    }
  };
  
  // 上一题
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex === -1) {
      // 在总结页时，跳转到最后一题
      setCurrentQuestionIndex(questions.length - 1);
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  return (
    <div className="practice-level">
      <div className="practice-content">
        {/* 左侧项目和练习列表 */}
        <Sidebar
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          practices={practices}
          selectedPractice={selectedPractice}
          setSelectedPractice={setSelectedPractice}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          isStudentMode={true}
        />
        
        {/* 右侧练习内容 */}
        <div className="practice-main">
          {!selectedProject ? (
            <div className="empty-state">
              <h3>Select a Project</h3>
              <p>Choose a project to get started.</p>
            </div>
          ) : !selectedPractice ? (
            <div className="empty-state">
              <h3>Select a Practice</h3>
              <p>Choose a practice to get started.</p>
            </div>
          ) : (
            <div className="practice-interface">
              <div className="practice-header-info">
                <h3>{selectedPractice.name}</h3>
                <p>{selectedPractice.description}</p>
              </div>
              
              <QuestionRenderer
                questions={questions}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                setUserAnswers={setUserAnswers}
                feedback={feedback}
                handleSubmitButtonClick={handleSubmitButtonClick}
                handlePreviousQuestion={handlePreviousQuestion}
                handleNextQuestion={handleNextQuestion}
                nodeMap={nodeMap}
              />
            </div>
          )}
        </div>
      </div>
      
      <style>{styles}</style>
    </div>
  );
};

export default PracticeLevelStudent;