import React from 'react';

// 项目列表组件
const ProjectList = ({ 
  projects, 
  selectedProject, 
  onSelectProject, 
  projectsCollapsed, 
  onToggleProjectsCollapse, 
  onContextMenu, 
  onMouseDown, 
  onMouseUp 
}) => {
  return (
    <div className="projects-section">
      <div className="sidebar-header">
        <h3 onClick={onToggleProjectsCollapse} className="collapsible-header">
          <span className={`collapse-icon ${projectsCollapsed ? 'collapsed' : ''}`}>
            {projectsCollapsed ? '▶' : '▼'}
          </span>
          My Projects
        </h3>
      </div>
      {!projectsCollapsed && (
        <>
          {projects.length === 0 ? (
            <p className="no-projects">No projects yet. Create your first project to get started!</p>
          ) : (
            <div className="projects-list">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`project-item ${selectedProject?.id === project.id ? 'active' : ''}`}
                  onClick={() => onSelectProject(project)}
                  onContextMenu={(e) => onContextMenu(e, project, 'project')}
                  onMouseDown={(e) => onMouseDown(e, project, 'project')}
                  onMouseUp={onMouseUp}
                  onMouseLeave={onMouseUp}
                  onTouchStart={(e) => {
                    const timer = setTimeout(() => onContextMenu(e, project, 'project'), 500);
                    return () => clearTimeout(timer);
                  }}
                  onTouchEnd={onMouseUp}
                >
                  <span className="project-icon">📚</span>
                  <span className="project-name">{project.name}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

// 目录表单组件
const DirectoryForm = ({ 
  show, 
  onToggle, 
  onSubmit, 
  newDirectory, 
  setNewDirectory, 
  selectedProject 
}) => {
  return (
    <div className="directory-form-section">
      <button 
        onClick={onToggle} 
        className="toggle-form-btn"
      >
        {show ? 'Cancel' : 'Add Directory'}
      </button>
      
      {show && (
        <form onSubmit={onSubmit} className="directory-form">
          <input
            type="text"
            placeholder="Directory name"
            value={newDirectory.name}
            onChange={(e) => setNewDirectory({ ...newDirectory, name: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newDirectory.description}
            onChange={(e) => setNewDirectory({ ...newDirectory, description: e.target.value })}
          />
          <select
            value={newDirectory.parentId || ''}
            onChange={(e) => setNewDirectory({ ...newDirectory, parentId: e.target.value || null })}
          >
            <option value="">Root level</option>
            {selectedProject?.structure?.directories?.map(dir => (
              <option key={dir.id} value={dir.id}>{dir.name}</option>
            ))}
          </select>
          <button type="submit" className="btn btn-primary">Add</button>
        </form>
      )}
    </div>
  );
};

// 内容列表组件
const ContentList = ({ 
  contents, 
  selectedContent, 
  onSelectContent 
}) => {
  return (
    <div className="content-list-section">
      <h4>Contents</h4>
      {contents.length === 0 ? (
        <p className="no-contents">No contents in this directory</p>
      ) : (
        <div className="content-list">
          {contents.map(content => (
            <div 
              key={content.id}
              className={`content-item ${selectedContent?.id === content.id ? 'active' : ''}`}
              onClick={() => onSelectContent(content)}
            >
              <span className="note-icon">📄</span>
              <span className="note-name">{content.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 目录树组件
const DirectoryTree = ({ 
  directories, 
  selectedDirectory, 
  onSelectDirectory, 
  collapsedDirectories, 
  onToggleDirectoryCollapse, 
  onContextMenu, 
  onMouseDown, 
  onMouseUp 
}) => {
  const renderDirectoryTree = (dirs, level = 0) => {
    return dirs.map(dir => {
      const isCollapsed = collapsedDirectories.has(dir.id);
      const hasSubdirectories = dir.subdirectories && dir.subdirectories.length > 0;
      
      return (
        <div key={dir.id}>
          <div
            className={`directory-item ${selectedDirectory?.id === dir.id ? 'active' : ''}`}
            style={{ paddingLeft: `${level * 20 + 10}px` }}
            onClick={(e) => {
              e.stopPropagation();
              onSelectDirectory(dir);
            }}
            onContextMenu={(e) => onContextMenu(e, dir, 'directory')}
            onMouseDown={(e) => onMouseDown(e, dir, 'directory')}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchStart={(e) => {
              const timer = setTimeout(() => onContextMenu(e, dir, 'directory'), 500);
              return () => clearTimeout(timer);
            }}
            onTouchEnd={onMouseUp}
          >
            {hasSubdirectories && (
              <span 
                className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDirectoryCollapse(dir.id);
                }}
              >
                {isCollapsed ? '▶' : '▼'}
              </span>
            )}
            {!hasSubdirectories && <span className="collapse-icon-placeholder"></span>}
            <span className="folder-icon">📁</span>
            <span className="folder-name">{dir.name}</span>
          </div>
          {!isCollapsed && dir.subdirectories && renderDirectoryTree(dir.subdirectories, level + 1)}
        </div>
      );
    });
  };

  return (
    <div className="directories-section">
      <h4>Directories</h4>
      {renderDirectoryTree(directories)}
    </div>
  );
};

// 侧边栏组件
const Sidebar = ({ 
  sidebarOpen, 
  projects, 
  selectedProject, 
  selectedDirectory, 
  selectedContent, 
  projectsCollapsed, 
  collapsedDirectories, 
  showDirectoryForm, 
  newDirectory, 
  contents, 
  onSelectProject, 
  onSelectDirectory, 
  onSelectContent, 
  onToggleProjectsCollapse, 
  onToggleDirectoryCollapse, 
  onToggleDirectoryForm, 
  onSubmitDirectory, 
  setNewDirectory, 
  onContextMenu, 
  onMouseDown, 
  onMouseUp,
  isNarrow = false
}) => {
  return (
    <div className={`projects-sidebar ${sidebarOpen ? 'open' : ''} ${isNarrow ? 'sidebar-narrow' : ''}`}>
      <ProjectList 
        projects={projects}
        selectedProject={selectedProject}
        onSelectProject={onSelectProject}
        projectsCollapsed={projectsCollapsed}
        onToggleProjectsCollapse={onToggleProjectsCollapse}
        onContextMenu={onContextMenu}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />

      {selectedProject && (
        <DirectoryForm 
          show={showDirectoryForm}
          onToggle={onToggleDirectoryForm}
          onSubmit={onSubmitDirectory}
          newDirectory={newDirectory}
          setNewDirectory={setNewDirectory}
          selectedProject={selectedProject}
        />
      )}

      {selectedProject && (
        <div className="sidebar-content-wrapper">
          {selectedProject.structure?.directories && (
            <DirectoryTree 
              directories={selectedProject.structure.directories}
              selectedDirectory={selectedDirectory}
              onSelectDirectory={onSelectDirectory}
              collapsedDirectories={collapsedDirectories}
              onToggleDirectoryCollapse={onToggleDirectoryCollapse}
              onContextMenu={onContextMenu}
              onMouseDown={onMouseDown}
              onMouseUp={onMouseUp}
            />
          )}

          {selectedDirectory && contents && (
            <ContentList 
              contents={contents}
              selectedContent={selectedContent}
              onSelectContent={onSelectContent}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Sidebar;