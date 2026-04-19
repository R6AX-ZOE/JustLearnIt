import React from 'react';

// 创建项目对话框
const CreateProjectDialog = ({ show, onClose, onSubmit, newProject, setNewProject }) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h3>Create New Project</h3>
          <button 
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="dialog-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="projectName">Project Name *</label>
              <input 
                type="text" 
                id="projectName"
                value={newProject.name} 
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })} 
                required 
                placeholder="Enter project name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="projectDescription">Description (optional)</label>
              <textarea 
                id="projectDescription"
                value={newProject.description} 
                onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} 
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Create Project</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// 编辑目录对话框
const EditDirectoryDialog = ({ show, onClose, onSubmit, newDirectory, setNewDirectory }) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog" style={{ width: '500px' }}>
        <div className="dialog-header">
          <h3>Edit Directory</h3>
          <button 
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="dialog-content">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Directory Name *</label>
              <input 
                type="text" 
                value={newDirectory.name} 
                onChange={(e) => setNewDirectory({ ...newDirectory, name: e.target.value })} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Description (optional)</label>
              <textarea 
                value={newDirectory.description}
                onChange={(e) => setNewDirectory({ ...newDirectory, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-primary">Update Directory</button>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// 确认删除对话框
const ConfirmDialog = ({ show, onClose, onConfirm, confirmAction }) => {
  if (!show || !confirmAction) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h3>Confirmation</h3>
          <button 
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="dialog-content">
          <p>
            Are you sure you want to delete 
            {confirmAction.type === 'project' && ` project "${confirmAction.target.name}"`}
            {confirmAction.type === 'directory' && ` directory "${confirmAction.target.name}"`}
            {confirmAction.type === 'content' && ` content "${confirmAction.target.title}"`}
            ?
          </p>
          <div className="form-actions">
            <button type="button" className="btn btn-danger" onClick={onConfirm}>
              Delete
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 复制对话框
const CopyDialog = ({ 
  show, 
  onClose, 
  onCopy, 
  copyTarget, 
  copyType, 
  projects, 
  selectedCopyProject, 
  setSelectedCopyProject, 
  selectedCopyDestination, 
  setSelectedCopyDestination, 
  expandedDirectories, 
  setExpandedDirectories 
}) => {
  if (!show || !copyTarget || projects.length === 0) return null;

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    const project = projects.find(p => p.id === projectId);
    setSelectedCopyProject(project);
    setSelectedCopyDestination(null);
    setExpandedDirectories(new Set());
  };

  const toggleDirectory = (directoryId) => {
    const newExpanded = new Set(expandedDirectories);
    if (newExpanded.has(directoryId)) {
      newExpanded.delete(directoryId);
    } else {
      newExpanded.add(directoryId);
    }
    setExpandedDirectories(newExpanded);
  };

  const renderDirectory = (dir, level = 1) => {
    const isExpanded = expandedDirectories.has(dir.id);
    
    return (
      <div key={dir.id} className="directory-tree-node">
        <div 
          className={`directory-tree-item ${selectedCopyDestination?.id === dir.id ? 'selected' : ''}`}
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {dir.subdirectories && dir.subdirectories.length > 0 && (
            <span 
              className="expand-icon"
              onClick={(e) => {
                e.stopPropagation();
                toggleDirectory(dir.id);
              }}
              style={{
                marginRight: '5px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              {isExpanded ? '▼' : '▶'}
            </span>
          )}
          <span 
            className="folder-icon"
            onClick={() => setSelectedCopyDestination(dir)}
          >
            📁
          </span>
          <span 
            className="folder-name"
            onClick={() => setSelectedCopyDestination(dir)}
          >
            {dir.name}
          </span>
        </div>
        {isExpanded && dir.subdirectories && dir.subdirectories.map(subdir => renderDirectory(subdir, level + 1))}
      </div>
    );
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog" style={{ width: '500px' }}>
        <div className="dialog-header">
          <h3>Copy {copyType === 'content' ? 'Content' : 'Directory'}</h3>
          <button 
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>
        </div>
        <div className="dialog-content">
          <p>Select destination for copying {copyType === 'content' ? `"${copyTarget.title}"` : `"${copyTarget.name}"`}</p>
          
          {/* 项目选择器 */}
          <div className="project-selector" style={{ marginBottom: '20px' }}>
            <h4>Project</h4>
            <select 
              value={selectedCopyProject?.id || ''}
              onChange={handleProjectChange}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #e0e0e0',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">Select a project</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
          
          {/* 目录结构选择器 */}
          {selectedCopyProject && (
            <div className="directory-selector">
              <h4>{copyType === 'content' ? 'Destination Directory *' : 'Destination'}</h4>
              {selectedCopyProject.structure?.directories && selectedCopyProject.structure.directories.length > 0 ? (
                <div className="directory-tree">
                  {/* 对于目录复制，显示"复制到根级别"选项 */}
                  {copyType === 'directory' && (
                    <div 
                      className={`directory-tree-item ${selectedCopyDestination === null ? 'selected' : ''}`}
                      onClick={() => setSelectedCopyDestination(null)}
                    >
                      <span className="folder-icon">📁</span>
                      <span className="folder-name">Root Level (No Parent)</span>
                    </div>
                  )}
                  
                  {/* 递归渲染目录结构 */}
                  {selectedCopyProject.structure.directories.map(directory => {
                    return renderDirectory(directory);
                  })}
                </div>
              ) : (
                <p style={{ color: '#999', padding: '10px' }}>
                  No directories available. Please create a directory first.
                </p>
              )}
            </div>
          )}
          
          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-primary"
              onClick={onCopy}
              disabled={!selectedCopyProject || (copyType === 'content' && !selectedCopyDestination)}
            >
              Copy
            </button>
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { CreateProjectDialog, EditDirectoryDialog, ConfirmDialog, CopyDialog };