import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import QuestionEditorInline from './components/QuestionEditorInline';
import { fetchProjects, fetchPractices, fetchQuestions, createQuestion, updateQuestion, deleteQuestion } from './services/api';
import { styles } from './styles';

const PracticeLevelCreator = ({ user }) => {
  // 状态管理
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  // 加载项目
  useEffect(() => {
    if (user) {
      loadProjects();
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
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [selectedPractice]);
  
  // 保存问题
  const handleSaveQuestion = async (questionData) => {
    try {
      if (questionData.id) {
        // 更新现有问题
        await updateQuestion(questionData.id, questionData);
      } else {
        // 创建新问题
        await createQuestion(selectedPractice.id, questionData);
      }
      await loadQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };
  
  // 删除问题
  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      await loadQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };
  
  // 在当前问题下方插入新问题
  const handleInsertQuestionBelow = async (index) => {
    try {
      // 创建一个新的空问题，传递插入位置
      const newQuestion = await createQuestion(selectedPractice.id, {
        type: 'multiple-choice',
        question: 'New Question',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'A',
        feedback: '',
        position: index + 1 // 在当前问题下方插入
      });
      
      // 重新加载问题列表
      await loadQuestions();
      
      console.log(`Inserted new question at position ${index + 1}`);
    } catch (error) {
      console.error('Error inserting question:', error);
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
          isStudentMode={false}
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
              
              <div className="questions-container">
                {questions.map((question, index) => (
                  <QuestionEditorInline
                    key={question.id}
                    question={question}
                    index={index}
                    onSave={handleSaveQuestion}
                    onDelete={handleDeleteQuestion}
                    onInsertBelow={() => handleInsertQuestionBelow(index)}
                  />
                ))}
                
                {/* 添加新问题按钮 */}
                <div className="add-question-container">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleInsertQuestionBelow(questions.length - 1)}
                  >
                    Add New Question
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <style>{styles}</style>
    </div>
  );
};

export default PracticeLevelCreator;