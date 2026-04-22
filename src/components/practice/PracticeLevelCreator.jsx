import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/Sidebar';
import QuestionEditorInline from './components/QuestionEditorInline';
import { fetchProjects, fetchPractices, fetchQuestions, createQuestion, updateQuestion, deleteQuestion, deleteProject, deletePractice } from './services/api';
import { styles } from './styles';

const PracticeLevelCreator = ({ selectedProjectId, selectedPracticeId, questionIndex, onSelectionChange, onQuestionChange }) => {
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [practices, setPractices] = useState([]);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [scrollRef, setScrollRef] = useState(null);

  const isInitialized = useRef(false);

  useEffect(() => {
    if (user && !isInitialized.current) {
      isInitialized.current = true;
      loadProjects();
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
      if (scrollRef && scrollRef.childNodes[validIndex]) {
        scrollRef.childNodes[validIndex].scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [questionIndex, questions, scrollRef]);

  const loadProjects = useCallback(async () => {
    try {
      const userProjects = await fetchProjects(user.id);
      setProjects(userProjects);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [user]);

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

  const handleSaveQuestion = async (questionData) => {
    try {
      if (questionData.id) {
        await updateQuestion(questionData.id, questionData);
      } else {
        await createQuestion(selectedPractice.id, questionData);
      }
      await loadQuestions();
    } catch (error) {
      console.error('Error saving question:', error);
    }
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestion(questionId);
      await loadQuestions();
    } catch (error) {
      console.error('Error deleting question:', error);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteProject(projectId);
      await loadProjects();
      setSelectedProject(null);
      setPractices([]);
      setSelectedPractice(null);
      setQuestions([]);
      if (onSelectionChange) {
        onSelectionChange(null, null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleDeletePractice = async (practiceId) => {
    try {
      await deletePractice(practiceId);
      await loadPractices();
      setSelectedPractice(null);
      setQuestions([]);
      if (onSelectionChange) {
        onSelectionChange(selectedProject?.id, null);
      }
    } catch (error) {
      console.error('Error deleting practice:', error);
    }
  };

  const handleInsertQuestionBelow = async (index) => {
    try {
      const newQuestion = await createQuestion(selectedPractice.id, {
        type: 'multiple-choice',
        question: 'New Question',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'A',
        position: index + 1
      });

      await loadQuestions();

      console.log(`Inserted new question at position ${index + 1}`);
    } catch (error) {
      console.error('Error inserting question:', error);
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
          isStudentMode={false}
          onDeleteProject={handleDeleteProject}
          onDeletePractice={handleDeletePractice}
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

              <div 
                className="questions-container" 
                ref={(el) => setScrollRef(el)}
              >
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