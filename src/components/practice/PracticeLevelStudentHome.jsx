import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjects, fetchPractices, fetchStudentInProgress, fetchStudentHistory, startSession } from './services/api';
import { styles } from './styles';

const PracticeLevelStudentHome = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoadingRef = useRef(false);

  const [projects, setProjects] = useState([]);
  const [practices, setPractices] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedPractice, setSelectedPractice] = useState(null);
  const [inProgressSessions, setInProgressSessions] = useState([]);
  const [historySessions, setHistorySessions] = useState([]);
  const [showPracticeMenu, setShowPracticeMenu] = useState(false);
  const [showProjectMenu, setShowProjectMenu] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewSession, setPreviewSession] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (isLoadingRef.current) return;
    if (!user) return;

    isLoadingRef.current = true;
    setLoading(true);

    try {
      const [userProjects, inProgress, history] = await Promise.all([
        fetchProjects(user.id),
        fetchStudentInProgress(user.id),
        fetchStudentHistory(user.id)
      ]);
      setProjects(userProjects);
      setInProgressSessions(inProgress);
      setHistorySessions(history);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [user?.id]);

  useEffect(() => {
    isLoadingRef.current = false;
    loadData();
  }, [loadData]);

  const handleStartPracticeClick = () => {
    setShowPracticeMenu(!showPracticeMenu);
    if (showPracticeMenu) {
      setShowProjectMenu(false);
      setSelectedProject(null);
      setSelectedPractice(null);
    }
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setShowProjectMenu(true);
  };

  const handlePracticeSelect = async (practice) => {
    setSelectedPractice(practice);
    setShowPracticeMenu(false);
    setShowProjectMenu(false);

    try {
      const response = await startSession(user.id, practice.id);
      if (response && response.session) {
        setPreviewSession(response.session);
        setPreviewMode(true);
      }
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };

  const handleStartPractice = () => {
    if (previewSession) {
      navigate(`/practice/student/session/${previewSession.id}`);
    }
  };

  const handleContinueSession = (sessionId) => {
    navigate(`/practice/student/session/${sessionId}`);
  };

  const handleViewHistory = (sessionId) => {
    navigate(`/practice/student/session/${sessionId}/end`);
  };

  const handleModeChange = (newMode) => {
    if (newMode === 'creator') {
      navigate('/practice/creator');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateProgress = (session) => {
    const answeredCount = Object.keys(session.answers || {}).length;
    return `${answeredCount}/${session.totalQuestions}`;
  };

  if (loading) {
    return (
      <div className="practice-level">
        <div className="loading-spinner">Loading...</div>
        <style>{styles}</style>
      </div>
    );
  }

  return (
    <div className="practice-level">
      <div className="practice-header">
        <div className="header-left">
          <h2>Practice Level</h2>
          <div className="navigation-links">
            <a href="/" className="nav-link">Home</a>
            <a href="/integration" className="nav-link">Integration Level</a>
          </div>
        </div>
        <div className="header-right">
          <div className="mode-switcher">
            <button
              className="mode-btn active"
              onClick={() => {}}
            >
              Practice Mode
            </button>
            <button
              className="mode-btn"
              onClick={() => handleModeChange('creator')}
            >
              Create Mode
            </button>
          </div>
        </div>
      </div>

      <div className="practice-content">
        <div className="practice-sidebar">
          <div className="sidebar-section">
            <button
              className="btn btn-primary start-practice-btn"
              onClick={handleStartPracticeClick}
            >
              Start Practice
            </button>

            {showPracticeMenu && (
              <div className="practice-menu">
                <div className="menu-header">Select a Project</div>
                {projects.length === 0 ? (
                  <div className="menu-empty">No projects found</div>
                ) : (
                  projects.map(project => (
                    <div key={project.id} className="menu-item" onClick={() => handleProjectSelect(project)}>
                      {project.name}
                      {project.practices && project.practices.length > 0 && (
                        <span className="menu-item-count">({project.practices.length})</span>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}

            {showProjectMenu && selectedProject && (
              <div className="practice-menu project-submenu">
                <div className="menu-header">
                  <span onClick={() => setShowProjectMenu(false)} className="menu-back">&larr; Back</span>
                  {selectedProject.name}
                </div>
                {selectedProject.practices && selectedProject.practices.length > 0 ? (
                  selectedProject.practices.map(practice => (
                    <div key={practice.id} className="menu-item" onClick={() => handlePracticeSelect(practice)}>
                      {practice.name}
                    </div>
                  ))
                ) : (
                  <div className="menu-empty">No practices in this project</div>
                )}
              </div>
            )}
          </div>

          {previewMode && previewSession && selectedPractice && (
            <div className="sidebar-section">
              <h3>Preview</h3>
              <div className="preview-info">
                <p><strong>{selectedPractice.name}</strong></p>
                <p>{previewSession.totalQuestions} Questions</p>
                <button className="btn btn-secondary" onClick={() => setPreviewMode(false)}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleStartPractice}>
                  Start
                </button>
              </div>
            </div>
          )}

          <div className="sidebar-section">
            <h3>In Progress ({inProgressSessions.length})</h3>
            <div className="practices-list">
              {inProgressSessions.length === 0 ? (
                <div className="empty-text">No practices in progress</div>
              ) : (
                inProgressSessions.map(session => (
                  <div
                    key={session.id}
                    className="practice-item"
                    onClick={() => handleContinueSession(session.id)}
                  >
                    <div>{session.practiceName}</div>
                    <div className="session-progress">
                      {calculateProgress(session)}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="sidebar-section">
            <h3>History ({historySessions.length})</h3>
            <div className="practices-list">
              {historySessions.length === 0 ? (
                <div className="empty-text">No practice history</div>
              ) : (
                historySessions.map(entry => (
                  <div
                    key={entry.id}
                    className="practice-item"
                    onClick={() => handleViewHistory(entry.sessionId)}
                  >
                    <div>{entry.practiceName}</div>
                    <div className="session-score">{entry.score}%</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="practice-main">
          {previewMode && previewSession && selectedPractice ? (
            <div className="preview-section">
              <div className="preview-header">
                <h3>{selectedPractice.name}</h3>
                <p>{selectedPractice.description}</p>
              </div>
              <div className="preview-content">
                <div className="preview-sidebar">
                  <h4>Questions ({previewSession.totalQuestions})</h4>
                  <div className="question-list">
                    {previewSession.questions.slice(0, 10).map((q, idx) => (
                      <div key={q.id} className="question-item">
                        <span className="question-number">{idx + 1}.</span>
                        <span className="question-preview">{q.question.substring(0, 30)}...</span>
                      </div>
                    ))}
                    {previewSession.totalQuestions > 10 && (
                      <div className="more-questions">
                        ... and {previewSession.totalQuestions - 10} more
                      </div>
                    )}
                  </div>
                </div>
                <div className="preview-main">
                  <h4>Preview (First 2 Questions)</h4>
                  {previewSession.questions.slice(0, 2).map((q, idx) => (
                    <div key={q.id} className="preview-question-card">
                      <div className="question-type">{q.type}</div>
                      <div className="question-text">{q.question}</div>
                      {q.options && q.options.length > 0 && (
                        <div className="question-options">
                          {q.options.map((opt, optIdx) => (
                            <div key={optIdx} className="option-preview">{opt}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div className="preview-actions">
                <button className="btn btn-secondary" onClick={() => setPreviewMode(false)}>Cancel</button>
                <button className="btn btn-primary" onClick={handleStartPractice}>Start Practice</button>
              </div>
            </div>
          ) : (
            <div className="empty-state">
              <h3>Welcome to Practice Mode</h3>
              <p>Select a practice from the sidebar to begin, or continue an in-progress session.</p>
              <div className="stats-overview">
                <div className="stat-card">
                  <div className="stat-number">{inProgressSessions.length}</div>
                  <div className="stat-label">In Progress</div>
                </div>
                <div className="stat-card">
                  <div className="stat-number">{historySessions.length}</div>
                  <div className="stat-label">Completed</div>
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

export default PracticeLevelStudentHome;
