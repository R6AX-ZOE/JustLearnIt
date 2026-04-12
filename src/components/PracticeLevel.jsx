import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PracticeLevel = () => {
  // 从localStorage获取用户信息
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  
  // 状态管理
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1); // -1 表示在总结页
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  
  // 表单状态
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showPracticeForm, setShowPracticeForm] = useState(false);
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  
  // 表单数据
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [newPractice, setNewPractice] = useState({ name: '', description: '' });
  const [newQuestion, setNewQuestion] = useState({
    type: 'multiple-choice',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    feedback: ''
  });
  
  // API基础URL
  const API_BASE = '/api/practice';
  
  // 加载项目
  useEffect(() => {
    if (user) {
      fetchProjects();
    }
  }, [user]);
  
  // 加载练习
  useEffect(() => {
    if (selectedProject) {
      fetchPractices();
    }
  }, [selectedProject]);
  
  // 加载问题
  useEffect(() => {
    if (selectedPractice) {
      fetchQuestions();
    }
  }, [selectedPractice]);
  
  // 获取所有项目
  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE}/projects`);
      const userProjects = response.data.projects.filter(project => project.userId === user.id);
      setProjects(userProjects);
      if (userProjects.length > 0 && !selectedProject) {
        setSelectedProject(userProjects[0]);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };
  
  // 获取项目的练习
  const fetchPractices = async () => {
    try {
      const response = await axios.get(`${API_BASE}/project/${selectedProject.id}/practices`);
      setPractices(response.data.practices || []);
      if (response.data.practices && response.data.practices.length > 0 && !selectedPractice) {
        setSelectedPractice(response.data.practices[0]);
      } else {
        setSelectedPractice(null);
      }
    } catch (error) {
      console.error('Error fetching practices:', error);
    }
  };
  
  // 获取练习的问题
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE}/practice/${selectedPractice.id}/questions`);
      setQuestions(response.data.questions || []);
      setCurrentQuestionIndex(-1); // 初始状态在总结页
      setUserAnswers({});
      setFeedback({});
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };
  
  // 创建新项目
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/projects`, {
        name: newProject.name,
        description: newProject.description,
        userId: user.id
      });
      setProjects([...projects, response.data.project]);
      setSelectedProject(response.data.project);
      setShowProjectForm(false);
      setNewProject({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };
  
  // 创建新练习
  const handleCreatePractice = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/project/${selectedProject.id}/practices`, {
        name: newPractice.name,
        description: newPractice.description
      });
      setPractices([...practices, response.data.practice]);
      setSelectedPractice(response.data.practice);
      setShowPracticeForm(false);
      setNewPractice({ name: '', description: '' });
    } catch (error) {
      console.error('Error creating practice:', error);
    }
  };
  
  // 创建新问题
  const handleCreateQuestion = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_BASE}/practice/${selectedPractice.id}/questions`, {
        type: newQuestion.type,
        question: newQuestion.question,
        options: newQuestion.options.filter(opt => opt),
        correctAnswer: newQuestion.correctAnswer,
        feedback: newQuestion.feedback
      });
      setQuestions([...questions, response.data.question]);
      setShowQuestionForm(false);
      setNewQuestion({
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        feedback: ''
      });
    } catch (error) {
      console.error('Error creating question:', error);
    }
  };
  
  // 提交答案
  const handleSubmitAnswer = async (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));
    
    // 模拟服务器反馈
    let feedbackMessage = '';
    if (currentQuestion.type === 'multiple-choice') {
      if (answer === currentQuestion.correctAnswer) {
        feedbackMessage = 'Correct! ' + (currentQuestion.feedback || 'Well done.');
      } else {
        feedbackMessage = 'Incorrect. ' + (currentQuestion.feedback || 'Try again.');
      }
    } else if (currentQuestion.type === 'fill-blank') {
      if (answer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()) {
        feedbackMessage = 'Correct! ' + (currentQuestion.feedback || 'Well done.');
      } else {
        feedbackMessage = 'Incorrect. ' + (currentQuestion.feedback || 'Try again.');
      }
    } else if (currentQuestion.type === 'essay') {
      // 现阶段暂时把解答题反馈设置为用户回答本身
      feedbackMessage = 'Your answer: ' + answer;
    }
    
    setFeedback(prev => ({ ...prev, [currentQuestion.id]: feedbackMessage }));
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
  
  // 渲染选择题
  const renderMultipleChoiceQuestion = (question) => {
    const userAnswer = userAnswers[question.id];
    const questionFeedback = feedback[question.id];
    
    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="options">
          {question.options.map((option, index) => {
            const optionLabel = String.fromCharCode(65 + index);
            return (
              <div key={optionLabel} className="option">
                <input
                  type="radio"
                  id={`option-${optionLabel}`}
                  name={`question-${question.id}`}
                  value={optionLabel}
                  checked={userAnswer === optionLabel}
                  onChange={(e) => setUserAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
                />
                <label htmlFor={`option-${optionLabel}`}>
                  <span className="option-label">{optionLabel}.</span> {option}
                </label>
              </div>
            );
          })}
        </div>
        <div className="submit-button-container">
          <button
            className="btn btn-primary"
            onClick={handleSubmitButtonClick}
            disabled={!userAnswer}
          >
            Submit Answer
          </button>
        </div>
        {questionFeedback && (
          <div className="feedback">
            {questionFeedback}
          </div>
        )}
      </div>
    );
  };
  
  // 渲染填空题
  const renderFillBlankQuestion = (question) => {
    const userAnswer = userAnswers[question.id];
    const questionFeedback = feedback[question.id];
    
    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="fill-blank">
          <input
            type="text"
            value={userAnswer || ''}
            onChange={(e) => setUserAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Enter your answer here"
          />
        </div>
        <div className="submit-button-container">
          <button
            className="btn btn-primary"
            onClick={handleSubmitButtonClick}
            disabled={!userAnswer}
          >
            Submit Answer
          </button>
        </div>
        {questionFeedback && (
          <div className="feedback">
            {questionFeedback}
          </div>
        )}
      </div>
    );
  };
  
  // 渲染解答题
  const renderEssayQuestion = (question) => {
    const userAnswer = userAnswers[question.id];
    const questionFeedback = feedback[question.id];
    
    return (
      <div className="question-content">
        <p>{question.question}</p>
        <div className="essay">
          <textarea
            value={userAnswer || ''}
            onChange={(e) => setUserAnswers(prev => ({ ...prev, [question.id]: e.target.value }))}
            placeholder="Write your answer here"
            rows={5}
          />
        </div>
        <div className="submit-button-container">
          <button
            className="btn btn-primary"
            onClick={handleSubmitButtonClick}
            disabled={!userAnswer}
          >
            Submit Answer
          </button>
        </div>
        {questionFeedback && (
          <div className="feedback">
            {questionFeedback}
          </div>
        )}
      </div>
    );
  };
  
  // 渲染总结页
  const renderSummaryPage = () => {
    if (questions.length === 0) {
      return <p className="no-questions">No questions available. Create a question to get started!</p>;
    }
    
    const answeredQuestions = Object.keys(userAnswers).length;
    const totalQuestions = questions.length;
    const completionRate = totalQuestions > 0 ? Math.round((answeredQuestions / totalQuestions) * 100) : 0;
    
    return (
      <div className="summary-page">
        <h3>Practice Summary</h3>
        <div className="summary-stats">
          <div className="stat-item">
            <span className="stat-label">Total Questions:</span>
            <span className="stat-value">{totalQuestions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Answered Questions:</span>
            <span className="stat-value">{answeredQuestions}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Completion Rate:</span>
            <span className="stat-value">{completionRate}%</span>
          </div>
        </div>
        
        <div className="summary-actions">
          <button
            className="btn btn-primary"
            onClick={() => {
              setUserAnswers({});
              setFeedback({});
              setCurrentQuestionIndex(0);
            }}
            disabled={totalQuestions === 0}
          >
            Start Practice
          </button>
        </div>
        
        {answeredQuestions > 0 && (
          <div className="summary-details">
            <h4>Your Answers</h4>
            <div className="answers-list">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[question.id];
                const questionFeedback = feedback[question.id];
                
                return (
                  <div key={question.id} className="answer-item">
                    <div className="answer-header">
                      <span className="answer-number">Q{index + 1}:</span>
                      <span className="answer-question">{question.question}</span>
                    </div>
                    {userAnswer && (
                      <div className="answer-content">
                        <span className="answer-label">Your Answer:</span>
                        <span className="answer-value">{userAnswer}</span>
                      </div>
                    )}
                    {questionFeedback && (
                      <div className="answer-feedback">
                        <span className="feedback-label">Feedback:</span>
                        <span className="feedback-value">{questionFeedback}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // 渲染问题
  const renderQuestion = () => {
    if (questions.length === 0) {
      return <p className="no-questions">No questions available. Create a question to get started!</p>;
    }
    
    if (currentQuestionIndex === -1) {
      return renderSummaryPage();
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion) return null;
    
    switch (currentQuestion.type) {
      case 'multiple-choice':
        return renderMultipleChoiceQuestion(currentQuestion);
      case 'fill-blank':
        return renderFillBlankQuestion(currentQuestion);
      case 'essay':
        return renderEssayQuestion(currentQuestion);
      default:
        return <p>Invalid question type</p>;
    }
  };
  
  return (
    <div className="practice-level">
      <div className="practice-header">
        <div className="header-left">
          <h2>Practice Level</h2>
          <div className="navigation-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/input" className="nav-link">Input Level</a>
            <a href="/integration" className="nav-link">Integration Level</a>
          </div>
          <div className="user-status">
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </div>
        </div>
      </div>
      
      <div className="practice-content">
        {/* 左侧项目和练习列表 */}
        <div className="practice-sidebar">
          <div className="sidebar-section">
            <h3>Projects</h3>
            <div className="projects-list">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => setSelectedProject(project)}
                >
                  {project.name}
                </div>
              ))}
              <button
                className="create-btn"
                onClick={() => setShowProjectForm(true)}
              >
                + New Project
              </button>
            </div>
          </div>
          
          {selectedProject && (
            <div className="sidebar-section">
              <h3>Practices</h3>
              <div className="practices-list">
                {practices.map(practice => (
                  <div
                    key={practice.id}
                    className={`practice-item ${selectedPractice?.id === practice.id ? 'active' : ''}`}
                    onClick={() => setSelectedPractice(practice)}
                  >
                    {practice.name}
                  </div>
                ))}
                <button
                  className="create-btn"
                  onClick={() => setShowPracticeForm(true)}
                >
                  + New Practice
                </button>
              </div>
            </div>
          )}
          
          {selectedPractice && (
            <div className="sidebar-section">
              <h3>Questions</h3>
              <div className="questions-list">
                {questions.map((question, index) => (
                  <div
                    key={question.id}
                    className={`question-item ${currentQuestionIndex === index ? 'active' : ''}`}
                    onClick={() => setCurrentQuestionIndex(index)}
                  >
                    Q{index + 1}: {question.question.substring(0, 30)}...
                  </div>
                ))}
                <button
                  className="create-btn"
                  onClick={() => setShowQuestionForm(true)}
                >
                  + New Question
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* 右侧练习内容 */}
        <div className="practice-main">
          {!selectedProject ? (
            <div className="empty-state">
              <h3>Select a Project</h3>
              <p>Choose a project or create a new one to get started.</p>
            </div>
          ) : !selectedPractice ? (
            <div className="empty-state">
              <h3>Select a Practice</h3>
              <p>Choose a practice or create a new one to get started.</p>
            </div>
          ) : (
            <div className="practice-interface">
              <div className="practice-header-info">
                <h3>{selectedPractice.name}</h3>
                <p>{selectedPractice.description}</p>
              </div>
              
              <div className="question-container">
                <div className="question-header">
                  <h4>{currentQuestionIndex === -1 ? 'Practice Summary' : `Question ${currentQuestionIndex + 1} of ${questions.length}`}</h4>
                </div>
                {renderQuestion()}
                
                <div className="question-navigation">
                  <button
                    className="btn btn-secondary"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={handleNextQuestion}
                    disabled={questions.length === 0}
                  >
                    {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 创建项目表单 */}
      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Project</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowProjectForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 创建练习表单 */}
      {showPracticeForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Practice</h3>
            <form onSubmit={handleCreatePractice}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newPractice.name}
                  onChange={(e) => setNewPractice({ ...newPractice, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPractice.description}
                  onChange={(e) => setNewPractice({ ...newPractice, description: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowPracticeForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 创建问题表单 */}
      {showQuestionForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Create New Question</h3>
            <form onSubmit={handleCreateQuestion}>
              <div className="form-group">
                <label>Question Type</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="fill-blank">Fill in the Blank</option>
                  <option value="essay">Essay</option>
                </select>
              </div>
              <div className="form-group">
                <label>Question</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  required
                />
              </div>
              {newQuestion.type === 'multiple-choice' && (
                <div className="form-group">
                  <label>Options</label>
                  {newQuestion.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  ))}
                </div>
              )}
              {newQuestion.type !== 'essay' && (
                <div className="form-group">
                  <label>Correct Answer</label>
                  {newQuestion.type === 'multiple-choice' ? (
                    <select
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    >
                      <option value="">Select</option>
                      {newQuestion.options.map((option, index) => (
                        <option key={index} value={String.fromCharCode(65 + index)}>
                          {String.fromCharCode(65 + index)}. {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                      required
                    />
                  )}
                </div>
              )}
              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  value={newQuestion.feedback}
                  onChange={(e) => setNewQuestion({ ...newQuestion, feedback: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowQuestionForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .practice-level {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background-color: #f5f5f5;
        }
        
        .practice-header {
          background-color: #fff;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          margin-bottom: 20px;
        }
        
        .header-left {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        h2 {
          margin: 0;
          color: #333;
        }
        
        .navigation-links {
          display: flex;
          gap: 15px;
          margin: 10px 0;
        }
        
        .nav-link {
          color: #2196F3;
          text-decoration: none;
          font-size: 14px;
        }
        
        .nav-link:hover {
          text-decoration: underline;
        }
        
        .user-status {
          font-size: 14px;
          color: #666;
        }
        
        .practice-content {
          display: flex;
          flex: 1;
          gap: 20px;
          padding: 0 20px 20px;
        }
        
        .practice-sidebar {
          width: 300px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          overflow-y: auto;
        }
        
        .sidebar-section {
          margin-bottom: 30px;
        }
        
        .sidebar-section h3 {
          margin: 0 0 15px;
          color: #333;
          font-size: 16px;
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
        }
        
        .projects-list, .practices-list, .questions-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        
        .project-item, .practice-item, .question-item {
          padding: 10px;
          border-radius: 4px;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .project-item:hover, .practice-item:hover, .question-item:hover {
          background-color: #f0f0f0;
        }
        
        .project-item.active, .practice-item.active, .question-item.active {
          background-color: #e3f2fd;
          color: #1976D2;
        }
        
        .create-btn {
          padding: 10px;
          border: 1px dashed #ccc;
          background-color: #f9f9f9;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          color: #666;
          transition: all 0.2s;
        }
        
        .create-btn:hover {
          background-color: #f0f0f0;
          border-color: #2196F3;
          color: #2196F3;
        }
        
        .practice-main {
          flex: 1;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          padding: 20px;
          overflow-y: auto;
        }
        
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
          color: #666;
        }
        
        .practice-interface {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .practice-header-info h3 {
          margin: 0;
          color: #333;
        }
        
        .practice-header-info p {
          margin: 5px 0 0;
          color: #666;
          font-size: 14px;
        }
        
        .question-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .question-header h4 {
          margin: 0;
          color: #333;
        }
        
        .question-content {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
        }
        
        .question-content p {
          margin: 0 0 20px;
          color: #333;
          font-size: 16px;
        }
        
        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .option {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .option-label {
          font-weight: bold;
          min-width: 20px;
        }
        
        .fill-blank input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .essay textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          resize: vertical;
        }
        
        .feedback {
          margin-top: 15px;
          padding: 10px;
          border-radius: 4px;
          background-color: #e8f5e8;
          color: #2e7d32;
          font-size: 14px;
        }
        
        .submit-button-container {
          margin-top: 20px;
          display: flex;
          justify-content: flex-start;
        }
        
        .summary-page {
          background-color: #f9f9f9;
          padding: 20px;
          border-radius: 8px;
        }
        
        .summary-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin: 20px 0;
        }
        
        .stat-item {
          background-color: #fff;
          padding: 15px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          min-width: 150px;
        }
        
        .stat-label {
          display: block;
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        
        .stat-value {
          display: block;
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        
        .summary-actions {
          margin: 20px 0;
        }
        
        .summary-details {
          margin-top: 30px;
        }
        
        .summary-details h4 {
          margin: 0 0 15px;
          color: #333;
        }
        
        .answers-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .answer-item {
          background-color: #fff;
          padding: 15px;
          border-radius: 4px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .answer-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin-bottom: 10px;
        }
        
        .answer-number {
          font-weight: bold;
          min-width: 40px;
        }
        
        .answer-question {
          flex: 1;
          color: #333;
        }
        
        .answer-content {
          margin: 10px 0;
          padding-left: 50px;
        }
        
        .answer-label {
          font-weight: bold;
          margin-right: 10px;
        }
        
        .answer-feedback {
          margin: 10px 0;
          padding-left: 50px;
        }
        
        .feedback-label {
          font-weight: bold;
          margin-right: 10px;
        }
        
        .feedback-value {
          color: #2e7d32;
        }
        
        .question-navigation {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: background-color 0.2s;
        }
        
        .btn-primary {
          background-color: #2196F3;
          color: white;
        }
        
        .btn-primary:hover {
          background-color: #1976D2;
        }
        
        .btn-secondary {
          background-color: #f0f0f0;
          color: #333;
        }
        
        .btn-secondary:hover {
          background-color: #e0e0e0;
        }
        
        .btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          padding: 30px;
          border-radius: 8px;
          width: 400px;
          max-width: 90%;
        }
        
        .modal-content h3 {
          margin: 0 0 20px;
          color: #333;
        }
        
        .form-group {
          margin-bottom: 15px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 5px;
          color: #333;
          font-size: 14px;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 80px;
        }
        
        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }
        
        .no-questions {
          text-align: center;
          color: #666;
          padding: 40px 0;
        }
      `}</style>
    </div>
  );
};

export default PracticeLevel;