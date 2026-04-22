import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import Sidebar from './components/Sidebar';
import QuestionRenderer from './components/QuestionRenderer';
import { fetchProjects, fetchPractices, fetchQuestions } from './services/api';
import { styles } from './styles';
import axios from 'axios';

const API_BASE = '/api/practice';

const PracticeLevelStudent = ({ selectedProjectId, selectedPracticeId, questionIndex, onSelectionChange, onQuestionChange }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [userAnswers, setUserAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [integrationProjects, setIntegrationProjects] = useState([]);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (user && !isInitialized.current) {
      isInitialized.current = true;
      loadProjects();
      loadIntegrationProjects();
    }
  }, [user]);

  useEffect(() => {
    if (projects.length > 0 && selectedProjectId && !selectedProject) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        setSelectedProject(project);
      }
    }
  }, [projects, selectedProjectId, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      loadPractices();
    } else {
      setPractices([]);
      setSelectedPractice(null);
      setQuestions([]);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (practices.length > 0 && selectedPracticeId && !selectedPractice) {
      const practice = practices.find(p => p.id === selectedPracticeId);
      if (practice) {
        setSelectedPractice(practice);
      }
    }
  }, [practices, selectedPracticeId, selectedPractice]);

  useEffect(() => {
    if (selectedPractice) {
      loadQuestions();
    } else {
      setQuestions([]);
    }
  }, [selectedPractice]);

  useEffect(() => {
    if (practices.length > 0 && !selectedPractice) {
      setSelectedPractice(practices[0]);
    }
  }, [practices, selectedPractice]);

  useEffect(() => {
    if (questionIndex !== null && questions.length > 0) {
      const validIndex = Math.max(0, Math.min(questionIndex, questions.length - 1));
      setCurrentQuestionIndex(validIndex);
    }
  }, [questionIndex, questions]);

  const loadProjects = useCallback(async () => {
    try {
      console.log('Fetching projects from server');
      const userProjects = await fetchProjects(user.id);
      console.log('Projects fetched:', userProjects.length);
      setProjects(userProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [user]);

  const loadIntegrationProjects = useCallback(async () => {
    try {
      const response = await axios.get(`/api/integration/projects/${user.id}`);
      setIntegrationProjects(response.data.projects);
    } catch (error) {
      console.error('Error fetching integration projects:', error);
    }
  }, [user]);

  const nodeMap = useMemo(() => {
    const map = new Map();
    for (const project of integrationProjects) {
      for (const graph of project.graphs || []) {
        for (const node of graph.nodes || []) {
          map.set(node.id, {
            ...node,
            projectId: project.id,
            projectName: project.name,
            graphId: graph.id,
            graphName: graph.name
          });
        }
      }
    }
    return map;
  }, [integrationProjects]);

  const loadPractices = useCallback(async () => {
    try {
      const projectPractices = await fetchPractices(selectedProject.id);
      setPractices(projectPractices);
    } catch (error) {
      console.error('Error fetching practices:', error);
    }
  }, [selectedProject]);

  const loadQuestions = useCallback(async () => {
    try {
      const practiceQuestions = await fetchQuestions(selectedPractice.id);
      setQuestions(practiceQuestions);
      setCurrentQuestionIndex(-1);
      setUserAnswers({});
      setFeedback({});
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }, [selectedPractice]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setSelectedPractice(null);
    setQuestions([]);
    if (onSelectionChange) {
      onSelectionChange(project.id, null);
    }
  };

  const handlePracticeSelect = (practice) => {
    setSelectedPractice(practice);
    if (onSelectionChange) {
      onSelectionChange(selectedProject?.id, practice.id);
    }
  };

  const handleSubmitAnswer = async (answer) => {
    const currentQuestion = questions[currentQuestionIndex];
    setUserAnswers(prev => ({ ...prev, [currentQuestion.id]: answer }));

    try {
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

  const handleSubmitButtonClick = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = userAnswers[currentQuestion.id];
    if (userAnswer) {
      handleSubmitAnswer(userAnswer);
    }
  };

  const handleNextQuestion = (startFromFirst) => {
    if (startFromFirst) {
      setCurrentQuestionIndex(0);
      if (onQuestionChange) {
        onQuestionChange(0);
      }
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      if (onQuestionChange) {
        onQuestionChange(currentQuestionIndex + 1);
      }
    } else if (currentQuestionIndex === questions.length - 1) {
      setCurrentQuestionIndex(-1);
      if (onQuestionChange) {
        onQuestionChange(null);
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex === -1) {
      setCurrentQuestionIndex(questions.length - 1);
      if (onQuestionChange) {
        onQuestionChange(questions.length - 1);
      }
    } else if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      if (onQuestionChange) {
        onQuestionChange(currentQuestionIndex - 1);
      }
    }
  };

  const handleSidebarQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    if (onQuestionChange) {
      onQuestionChange(index);
    }
  };

  return (
    <div className="practice-level">
      <div className="practice-content">
        <Sidebar
          projects={projects}
          selectedProject={selectedProject}
          setSelectedProject={handleProjectSelect}
          practices={practices}
          selectedPractice={selectedPractice}
          setSelectedPractice={handlePracticeSelect}
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={handleSidebarQuestionSelect}
          isStudentMode={true}
        />

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
                setFeedback={setFeedback}
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