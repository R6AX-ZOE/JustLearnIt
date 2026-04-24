import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProjects, fetchPractices, fetchStudentInProgress, fetchStudentHistory, startSession, deleteStudentHistory, deleteStudentSession } from './services/api';
import { styles } from './styles';
import { pluginSystem } from '../../plugins';

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

  const [contextMenu, setContextMenu] = useState({
    show: false,
    x: 0,
    y: 0,
    type: null,
    item: null
  });

  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null
  });

  const [reviewMode, setReviewMode] = useState(false);
  const [reviewData, setReviewData] = useState({
    incorrectQuestions: [],
    stats: null,
    loading: false,
    error: null
  });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [selectedPracticesForReview, setSelectedPracticesForReview] = useState([]);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [showDateFilter, setShowDateFilter] = useState(false);
  const [showPracticeFilter, setShowPracticeFilter] = useState(false);
  const [selectedProjectForFilter, setSelectedProjectForFilter] = useState(null);

  const longPressTimerRef = useRef(null);
  const isLongPressRef = useRef(false);
  const pressedItemRef = useRef(null);

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
      const sortedHistory = [...history].sort((a, b) => {
        return new Date(b.completedAt) - new Date(a.completedAt);
      });
      setHistorySessions(sortedHistory);
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
  }, [user?.id]);

  const loadReviewData = useCallback(async (practiceIds = [], startDate = null, endDate = null) => {
    if (!user) return;

    setReviewData(prev => ({ ...prev, loading: true, error: null }));

    try {
      await pluginSystem.loadPlugin('review');
      
      const [incorrectQuestions, stats] = await Promise.all([
        pluginSystem.executePluginMethod('review', 'getIncorrectQuestions', user.id, practiceIds, startDate, endDate),
        pluginSystem.executePluginMethod('review', 'getReviewStats', user.id, practiceIds, startDate, endDate)
      ]);

      setReviewData({
        incorrectQuestions,
        stats,
        loading: false,
        error: null
      });
      setSelectedQuestions([]);
    } catch (error) {
      console.error('Error loading review data:', error);
      setReviewData(prev => ({ ...prev, loading: false, error: error.message }));
    }
  }, [user?.id]);

  const handleStartReview = async () => {
    if (!user) return;

    try {
      await pluginSystem.loadPlugin('review');
      
      const result = await pluginSystem.executePluginMethod('review', 'startReviewSession', user.id, selectedPracticesForReview, dateFilter.startDate, dateFilter.endDate);
      
      if (result.session) {
        navigate(`/practice/student/session/${result.session.id}`);
      } else {
        alert(result.message || 'No incorrect questions found');
      }
    } catch (error) {
      console.error('Error starting review session:', error);
      alert('Failed to start review session: ' + error.message);
    }
  };

  const handleSelectQuestion = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  const handleSelectAllQuestions = () => {
    if (selectedQuestions.length === reviewData.incorrectQuestions.length) {
      setSelectedQuestions([]);
    } else {
      const allQuestionIds = reviewData.incorrectQuestions.map(item => item.question.id);
      setSelectedQuestions(allQuestionIds);
    }
  };

  const handleCreateReviewSession = async () => {
    if (!user || selectedQuestions.length === 0) return;

    try {
      await pluginSystem.loadPlugin('review');
      
      const result = await pluginSystem.executePluginMethod('review', 'createReviewSession', 
        user.id, selectedQuestions, selectedPracticeForReview, 'Custom Review Session');
      
      if (result.session) {
        navigate(`/practice/student/session/${result.session.id}`);
      } else {
        alert(result.message || 'Failed to create review session');
      }
    } catch (error) {
      console.error('Error creating review session:', error);
      alert('Failed to create review session: ' + error.message);
    }
  };

  const handleToggleReviewMode = () => {
    setReviewMode(!reviewMode);
    if (!reviewMode) {
      setShowDateFilter(false);
      setShowPracticeFilter(false);
      setDateFilter({ startDate: '', endDate: '' });
      setSelectedPracticesForReview([]);
      setSelectedProjectForFilter(null);
      loadReviewData();
      setSelectedQuestions([]);
    }
  };

  const handlePracticeSelectForReview = (practiceId) => {
    setSelectedPracticesForReview(prev => {
      if (prev.includes(practiceId)) {
        const newSelected = prev.filter(id => id !== practiceId);
        loadReviewData(newSelected, dateFilter.startDate, dateFilter.endDate);
        return newSelected;
      } else {
        const newSelected = [...prev, practiceId];
        loadReviewData(newSelected, dateFilter.startDate, dateFilter.endDate);
        return newSelected;
      }
    });
  };

  const handleDateFilterChange = (field, value) => {
    setDateFilter(prev => {
      const newFilter = { ...prev, [field]: value };
      loadReviewData(selectedPracticesForReview, newFilter.startDate, newFilter.endDate);
      return newFilter;
    });
  };

  const handleProjectSelectForFilter = (projectId) => {
    setSelectedProjectForFilter(projectId);
    // 重置practice选择，因为project已经改变
    setSelectedPracticesForReview([]);
    loadReviewData([], dateFilter.startDate, dateFilter.endDate);
  };

  useEffect(() => {
    const handleClick = () => {
      if (!isLongPressRef.current) {
        setContextMenu(prev => ({ ...prev, show: false }));
      }
      isLongPressRef.current = false;
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleContextMenu = (e, type, item) => {
    e.preventDefault();
    e.stopPropagation();
    setContextMenu({
      show: true,
      x: e.clientX,
      y: e.clientY,
      type,
      item
    });
    isLongPressRef.current = true;
  };

  const handleMouseDown = (e, type, item) => {
    if (e.button !== 0) return;

    isLongPressRef.current = false;
    pressedItemRef.current = { type, item };

    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      handleContextMenu(e, type, item);
    }, 500);
  };

  const handleMouseUp = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    pressedItemRef.current = null;
  };

  const handleMouseLeave = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleMouseMove = () => {
    if (longPressTimerRef.current && !isLongPressRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchStart = (e, type, item) => {
    isLongPressRef.current = false;
    pressedItemRef.current = { type, item };

    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      if (e.changedTouches && e.changedTouches[0]) {
        handleContextMenu(e.changedTouches[0], type, item);
      } else {
        handleContextMenu(e, type, item);
      }
    }, 500);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    pressedItemRef.current = null;
  };

  const handleItemClick = (callback, id) => {
    if (!isLongPressRef.current) {
      callback(id);
    }
  };

  const showConfirmDialog = (title, message, onConfirm, onCancel) => {
    setConfirmDialog({
      show: true,
      title,
      message,
      onConfirm,
      onCancel
    });
  };

  const hideConfirmDialog = () => {
    setConfirmDialog({
      show: false,
      title: '',
      message: '',
      onConfirm: null,
      onCancel: null
    });
  };

  const handleDeleteHistory = () => {
    if (!contextMenu.item || !user) return;

    showConfirmDialog(
      'Confirm Delete',
      'Are you sure you want to delete this history record? This action cannot be undone.',
      async () => {
        try {
          await deleteStudentHistory(user.id, contextMenu.item.id);
          setHistorySessions(prev => prev.filter(h => h.id !== contextMenu.item.id));
          setContextMenu({ show: false, x: 0, y: 0, type: null, item: null });
          hideConfirmDialog();
        } catch (error) {
          console.error('Error deleting history:', error);
          hideConfirmDialog();
        }
      },
      hideConfirmDialog
    );
  };

  const handleDeleteInProgress = () => {
    if (!contextMenu.item || !user) return;

    showConfirmDialog(
      'Confirm Delete',
      'Are you sure you want to delete this in-progress session? This action cannot be undone.',
      async () => {
        try {
          await deleteStudentSession(user.id, contextMenu.item.id);
          setInProgressSessions(prev => prev.filter(s => s.id !== contextMenu.item.id));
          setContextMenu({ show: false, x: 0, y: 0, type: null, item: null });
          hideConfirmDialog();
        } catch (error) {
          console.error('Error deleting session:', error);
          hideConfirmDialog();
        }
      },
      hideConfirmDialog
    );
  };

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
    <div className="practice-level" onMouseMove={handleMouseMove}>
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
                <div className="menu-header"> Select an Option</div>
                <div className="menu-item review-item" onClick={handleToggleReviewMode}>
                  <span className="menu-item-icon">📝</span>
                  <span>Review Incorrect Questions</span>
                </div>
                <div className="menu-divider"></div>
                <div className="menu-subheader">Select a Project</div>
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
                    onClick={() => handleItemClick(handleContinueSession, session.id)}
                    onContextMenu={(e) => handleContextMenu(e, 'inProgress', session)}
                    onMouseDown={(e) => handleMouseDown(e, 'inProgress', session)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={(e) => handleTouchStart(e, 'inProgress', session)}
                    onTouchEnd={handleTouchEnd}
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
                    onClick={() => handleItemClick(handleViewHistory, entry.sessionId)}
                    onContextMenu={(e) => handleContextMenu(e, 'history', entry)}
                    onMouseDown={(e) => handleMouseDown(e, 'history', entry)}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={(e) => handleTouchStart(e, 'history', entry)}
                    onTouchEnd={handleTouchEnd}
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
          {reviewMode ? (
            <div className="review-section">
              <div className="review-header">
                <h3>Review Incorrect Questions</h3>
                <div className="review-controls">
                  <div className="practice-filter-container">
                    <button 
                      className="btn btn-secondary practice-filter-btn"
                      onClick={() => setShowPracticeFilter(!showPracticeFilter)}
                    >
                      Filter by Practice
                    </button>
                    {showPracticeFilter && (
                      <div className="practice-filter-popup">
                        <div className="practice-filter-content">
                          <div className="project-drawer">
                            <h4>Select Project</h4>
                            <div className="project-list">
                              {projects.map(project => (
                                <div 
                                  key={project.id} 
                                  className={`project-item ${selectedProjectForFilter === project.id ? 'selected' : ''}`}
                                  onClick={() => handleProjectSelectForFilter(project.id)}
                                >
                                  {project.name}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="practice-checkboxes">
                            <h4>Select Practices</h4>
                            <div className="practice-list">
                              {projects
                                .filter(project => !selectedProjectForFilter || project.id === selectedProjectForFilter)
                                .flatMap(project => 
                                  project.practices.map(practice => (
                                    <div key={practice.id} className="practice-checkbox-item">
                                      <input
                                        type="checkbox"
                                        id={`practice-${practice.id}`}
                                        checked={selectedPracticesForReview.includes(practice.id)}
                                        onChange={() => handlePracticeSelectForReview(practice.id)}
                                      />
                                      <label htmlFor={`practice-${practice.id}`}>
                                        {project.name} - {practice.name}
                                      </label>
                                    </div>
                                  ))
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="date-filter-container">
                    <button 
                      className="btn btn-secondary date-filter-btn"
                      onClick={() => setShowDateFilter(!showDateFilter)}
                    >
                      Date Filter
                    </button>
                    {showDateFilter && (
                      <div className="date-filter-popup">
                        <div className="date-filter">
                          <label htmlFor="start-date">Start Date:</label>
                          <input
                            type="date"
                            id="start-date"
                            value={dateFilter.startDate}
                            onChange={(e) => handleDateFilterChange('startDate', e.target.value)}
                          />
                          <label htmlFor="end-date">End Date:</label>
                          <input
                            type="date"
                            id="end-date"
                            value={dateFilter.endDate}
                            onChange={(e) => handleDateFilterChange('endDate', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <button className="btn btn-secondary" onClick={handleToggleReviewMode}>
                    Back
                  </button>
                </div>
              </div>
              {reviewData.loading ? (
                <div className="loading-spinner">Loading...</div>
              ) : reviewData.error ? (
                <div className="error-message">{reviewData.error}</div>
              ) : (
                <div className="review-content">
                  {reviewData.stats && (
                    <div className="review-stats">
                      <div className="stat-card">
                        <div className="stat-number">{reviewData.stats.totalIncorrect}</div>
                        <div className="stat-label">Total Incorrect</div>
                      </div>
                      {Object.entries(reviewData.stats.byType).map(([type, count]) => (
                        <div key={type} className="stat-card">
                          <div className="stat-number">{count}</div>
                          <div className="stat-label">{type}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="review-actions">
                    <button
                      className="btn btn-primary"
                      onClick={() => handleStartReview()}
                      disabled={reviewData.incorrectQuestions.length === 0}
                    >
                      Review All Incorrect
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={handleSelectAllQuestions}
                      disabled={reviewData.incorrectQuestions.length === 0}
                    >
                      {selectedQuestions.length === reviewData.incorrectQuestions.length ? 'Deselect All' : 'Select All'}
                    </button>
                    <button
                      className="btn btn-accent"
                      onClick={handleCreateReviewSession}
                      disabled={selectedQuestions.length === 0}
                    >
                      Create Custom Session
                    </button>
                  </div>
                  {reviewData.incorrectQuestions.length === 0 && (
                    <div className="empty-message">
                      <p>Great! No incorrect questions found.</p>
                      <p>You're doing well!</p>
                    </div>
                  )}
                  {reviewData.incorrectQuestions.length > 0 && (
                    <div className="questions-section">
                      <div className="questions-header">
                        <h4>Select Questions to Review ({selectedQuestions.length}/{reviewData.incorrectQuestions.length})</h4>
                      </div>
                      <div className="question-list">
                        {reviewData.incorrectQuestions.map((item, index) => (
                          <div key={item.question.id} className="question-item">
                            <input
                              type="checkbox"
                              className="question-checkbox"
                              checked={selectedQuestions.includes(item.question.id)}
                              onChange={() => handleSelectQuestion(item.question.id)}
                            />
                            <div className="question-content">
                              <p className="question-text">{index + 1}. {item.question.question}</p>
                              <div className="question-meta">
                                <span className="question-type">{item.question.type}</span>
                                <span className="question-practice">{item.practiceName}</span>
                              </div>
                              <div className="user-answer">
                                <span className="user-answer-label">Your answer:</span>
                                <span className="user-answer-text">{item.userAnswer}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : previewMode && previewSession && selectedPractice ? (
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

      {contextMenu.show && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            top: contextMenu.y,
            left: contextMenu.x,
            zIndex: 1000
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.type === 'history' && (
            <>
              <div className="context-menu-item" onClick={() => handleViewHistory(contextMenu.item.sessionId)}>
                View Details
              </div>
              <div className="context-menu-item danger" onClick={handleDeleteHistory}>
                Delete
              </div>
            </>
          )}
          {contextMenu.type === 'inProgress' && (
            <>
              <div className="context-menu-item" onClick={() => handleContinueSession(contextMenu.item.id)}>
                Continue
              </div>
              <div className="context-menu-item danger" onClick={handleDeleteInProgress}>
                Delete
              </div>
            </>
          )}
        </div>
      )}

      {confirmDialog.show && (
        <div className="confirm-dialog-overlay" onClick={hideConfirmDialog}>
          <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="confirm-dialog-header">
              <h3>{confirmDialog.title}</h3>
            </div>
            <div className="confirm-dialog-body">
              <p>{confirmDialog.message}</p>
            </div>
            <div className="confirm-dialog-footer">
              <button className="btn btn-secondary" onClick={confirmDialog.onCancel}>
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDialog.onConfirm}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{styles}</style>

      <style>{`
        .context-menu {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          padding: 8px 0;
          min-width: 150px;
        }

        .context-menu-item {
          padding: 10px 16px;
          cursor: pointer;
          color: var(--text);
          transition: background 0.2s;
        }

        .context-menu-item:hover {
          background: var(--bg);
        }

        .context-menu-item.danger {
          color: #dc3545;
        }

        .context-menu-item.danger:hover {
          background: #ffebee;
        }

        .confirm-dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2000;
        }

        .confirm-dialog {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
          max-width: 480px;
          width: 90%;
          padding: 24px;
        }

        .confirm-dialog-header {
          margin-bottom: 20px;
        }

        .confirm-dialog-header h3 {
          margin: 0;
          color: var(--text-h);
          font-size: 20px;
        }

        .confirm-dialog-body {
          margin-bottom: 24px;
        }

        .confirm-dialog-body p {
          margin: 0;
          color: var(--text);
          line-height: 1.6;
        }

        .confirm-dialog-footer {
          display: flex;
          gap: 12px;
          justify-content: flex-end;
        }

        .btn-danger {
          background: #dc3545;
          border: 1px solid #dc3545;
          color: white;
        }

        .error-text {
          color: #dc3545;
        }

        .menu-item-icon {
          margin-right: 8px;
        }

        .menu-divider {
          height: 1px;
          background: var(--border);
          margin: 8px 0;
        }

        .menu-subheader {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-h);
          margin: 8px 16px;
        }

        .menu-item.review-item {
          background: var(--accent-bg);
          border-left: 4px solid var(--accent);
        }

        .review-section {
          background: var(--bg);
          border-radius: 12px;
          border: 1px solid var(--border);
          padding: 24px;
          box-shadow: var(--shadow);
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .review-controls {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .practice-selector {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .practice-selector label {
          font-size: 14px;
          color: var(--text);
          font-weight: 500;
        }

        .practice-selector select {
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg);
          color: var(--text);
          font-size: 14px;
          min-width: 200px;
        }

        .practice-selector select:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .practice-filter-container {
          position: relative;
          margin-right: 8px;
        }

        .practice-filter-btn {
          margin-right: 8px;
        }

        .practice-filter-popup {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 400px;
          max-height: 400px;
          overflow-y: auto;
        }

        .practice-filter-content {
          display: flex;
          gap: 20px;
        }

        .project-drawer {
          flex: 1;
          min-width: 150px;
        }

        .project-drawer h4,
        .practice-checkboxes h4 {
          margin-top: 0;
          margin-bottom: 12px;
          color: var(--text-h);
          font-size: 14px;
        }

        .project-list {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .project-item {
          padding: 8px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .project-item:hover {
          background: var(--accent-bg);
        }

        .project-item.selected {
          background: var(--accent);
          color: white;
        }

        .practice-checkboxes {
          flex: 2;
        }

        .practice-checkbox-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 6px 0;
        }

        .practice-checkbox-item input[type="checkbox"] {
          margin: 0;
        }

        .practice-checkbox-item label {
          cursor: pointer;
          font-size: 14px;
          color: var(--text);
        }

        .date-filter-container {
          position: relative;
        }

        .date-filter-btn {
          margin-right: 8px;
        }

        .date-filter-popup {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 8px;
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          z-index: 1000;
          min-width: 300px;
        }

        .date-filter {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .date-filter label {
          font-size: 14px;
          color: var(--text);
          font-weight: 500;
        }

        .date-filter input[type="date"] {
          padding: 8px 12px;
          border: 1px solid var(--border);
          border-radius: 6px;
          background: var(--bg);
          color: var(--text);
          font-size: 14px;
        }

        .date-filter input[type="date"]:focus {
          outline: none;
          border-color: var(--accent);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .review-header h3 {
          margin: 0;
          color: var(--text-h);
        }

        .review-stats {
          display: flex;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .stat-card {
          background: var(--accent-bg);
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          min-width: 120px;
          flex: 1;
        }

        .stat-number {
          font-size: 32px;
          font-weight: 600;
          color: var(--text-h);
          margin-bottom: 8px;
        }

        .stat-label {
          font-size: 14px;
          color: var(--text);
        }

        .review-actions {
          text-align: center;
          margin: 32px 0;
        }

        .empty-message {
          text-align: center;
          padding: 40px 20px;
          color: var(--text);
        }

        .error-message {
          text-align: center;
          padding: 40px 20px;
          color: #dc3545;
        }

        .loading-spinner {
          text-align: center;
          padding: 40px 20px;
          color: var(--text);
        }

        .questions-section {
          margin-top: 40px;
        }

        .questions-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .questions-header h4 {
          margin: 0;
          color: var(--text-h);
        }

        .select-all-btn {
          font-size: 14px;
          padding: 6px 12px;
        }

        .question-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .question-item {
          background: var(--bg);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          transition: border-color 0.2s;
        }

        .question-item:hover {
          border-color: var(--accent);
        }

        .question-checkbox {
          margin-top: 4px;
        }

        .question-content {
          flex: 1;
        }

        .question-text {
          margin: 0 0 8px 0;
          color: var(--text);
        }

        .question-meta {
          font-size: 14px;
          color: var(--text);
          display: flex;
          gap: 16px;
        }

        .question-type {
          background: var(--accent-bg);
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .question-practice {
          font-size: 12px;
          color: var(--text);
        }

        .user-answer {
          margin-top: 8px;
          font-size: 14px;
          color: var(--text);
        }

        .user-answer-label {
          font-weight: 600;
          margin-right: 8px;
        }

        .user-answer-text {
          font-style: italic;
        }
      `}</style>
    </div>
  );
};

export default PracticeLevelStudentHome;
