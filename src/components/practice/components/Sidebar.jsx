import React, { useState } from 'react';

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

  const handleClick = () => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  };

  const handleMenuItemClick = (action) => {
    const { item, type } = contextMenu;
    
    if (type === 'project' && action === 'delete') {
      onDeleteProject(item.id);
    } else if (type === 'practice' && action === 'delete') {
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
              onClick={() => setSelectedProject(project)}
              onContextMenu={!isStudentMode ? (e) => handleContextMenu(e, project, 'project') : undefined}
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
                onClick={() => setSelectedPractice(practice)}
                onContextMenu={!isStudentMode ? (e) => handleContextMenu(e, practice, 'practice') : undefined}
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
                Q{index + 1}: {question.question.substring(0, 30)}...
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