import React, { useState, useRef } from 'react';

const Sidebar = ({
  projects,
  selectedProject,
  setSelectedProject,
  practices,
  selectedPractice,
  setSelectedPractice,
  questions,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  onCreateProject,
  onCreatePractice,
  onDeleteProject,
  onDeletePractice,
  isStudentMode = false
}) => {
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    x: 0,
    y: 0,
    item: null,
    type: ''
  });
  const longPressTimer = useRef(null);

  const handleContextMenu = (e, item, type) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      item,
      type
    });
  };

  const startLongPress = (e, item, type) => {
    longPressTimer.current = setTimeout(() => {
      handleContextMenu(e, item, type);
    }, 500);
  };

  const cancelLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleMenuItemClick = (action) => {
    const { item, type } = contextMenu;
    
    if (type === 'project' && action === 'delete' && onDeleteProject) {
      onDeleteProject(item.id);
    } else if (type === 'practice' && action === 'delete' && onDeletePractice) {
      onDeletePractice(item.id);
    }
    
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  return (
    <div className="practice-sidebar" onClick={handleClick}>
      <div className="sidebar-section">
        <h3>Projects</h3>
        <div className="projects-list">
          {projects.map(project => (
            <div
              key={project.id}
              className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
              onClick={() => {
                setSelectedProject(project);
                console.log('Project clicked:', project);
              }}
              onContextMenu={!isStudentMode ? (e) => handleContextMenu(e, project, 'project') : undefined}
              onMouseDown={!isStudentMode ? (e) => startLongPress(e, project, 'project') : undefined}
              onMouseUp={!isStudentMode ? cancelLongPress : undefined}
              onMouseLeave={!isStudentMode ? cancelLongPress : undefined}
              onTouchStart={!isStudentMode ? (e) => startLongPress(e, project, 'project') : undefined}
              onTouchEnd={!isStudentMode ? cancelLongPress : undefined}
              onTouchCancel={!isStudentMode ? cancelLongPress : undefined}
            >
              {project.name}
            </div>
          ))}
          {!isStudentMode && onCreateProject && (
            <button
              className="create-btn"
              onClick={onCreateProject}
            >
              + New Project
            </button>
          )}
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
                onClick={() => {
                  setSelectedPractice(practice);
                  console.log('Practice clicked:', practice);
                  console.log('Selected project:', selectedProject);
                }}
                onContextMenu={!isStudentMode ? (e) => handleContextMenu(e, practice, 'practice') : undefined}
                onMouseDown={!isStudentMode ? (e) => startLongPress(e, practice, 'practice') : undefined}
                onMouseUp={!isStudentMode ? cancelLongPress : undefined}
                onMouseLeave={!isStudentMode ? cancelLongPress : undefined}
                onTouchStart={!isStudentMode ? (e) => startLongPress(e, practice, 'practice') : undefined}
                onTouchEnd={!isStudentMode ? cancelLongPress : undefined}
                onTouchCancel={!isStudentMode ? cancelLongPress : undefined}
              >
                {practice.name}
              </div>
            ))}
            {!isStudentMode && onCreatePractice && (
              <button
                className="create-btn"
                onClick={onCreatePractice}
              >
                + New Practice
              </button>
            )}
          </div>
        </div>
      )}
      
      {selectedPractice && isStudentMode && (
        <div className="sidebar-section">
          <h3>Questions</h3>
          <div className="questions-list">
            {questions.map((question, index) => (
              <div
                key={question.id}
                className={`question-item ${currentQuestionIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                Q{index + 1}
              </div>
            ))}
          </div>
        </div>
      )}

      {!isStudentMode && contextMenu.visible && (
        <div 
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 1000
          }}
        >
          <div className="context-menu-item" onClick={() => handleMenuItemClick('delete')}>
            Delete
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;