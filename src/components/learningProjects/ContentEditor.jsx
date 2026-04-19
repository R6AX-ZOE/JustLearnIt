import React from 'react';
import MDEditor from '@uiw/react-markdown-editor';
import MarkdownWithKaTeX from './MarkdownWithKaTeX';

// 内容编辑器组件
const ContentEditor = ({ 
  show, 
  isEdit, 
  onSubmit, 
  onCancel, 
  newContent, 
  setNewContent, 
  uploadingImage, 
  onImageUpload 
}) => {
  if (!show) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <div className="markdown-editor">
      <h4>{isEdit ? 'Edit Content' : 'Add New Content'}</h4>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input 
            type="text" 
            value={newContent.title} 
            onChange={(e) => setNewContent({ ...newContent, title: e.target.value })} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Content *</label>
          <MDEditor
            value={newContent.content}
            onChange={(value) => setNewContent({ ...newContent, content: value || '' })}
            height={400}
            preview="edit"
          />
        </div>
        
        {/* 图片上传区域 */}
        <div className="form-group">
          <label>Insert Image</label>
          <div className="image-upload-section">
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              disabled={uploadingImage}
              id={isEdit ? "image-upload-edit" : "image-upload"}
              style={{ display: 'none' }}
            />
            <label 
              htmlFor={isEdit ? "image-upload-edit" : "image-upload"} 
              className={`upload-btn ${uploadingImage ? 'disabled' : ''}`}
            >
              {uploadingImage ? 'Uploading...' : '📷 Upload Image'}
            </label>
            <span className="upload-hint">Click to upload image (max 10MB)</span>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Update Content' : 'Save Content'}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

// 内容列表组件
const ContentList = ({ 
  contents, 
  onSelectContent, 
  onContextMenu, 
  onMouseDown, 
  onMouseUp 
}) => {
  return (
    <div className="content-list-section">
      <h4>Contents</h4>
      {contents && contents.length > 0 ? (
        <div className="content-list">
          {contents.map(content => (
            <div 
              key={content.id} 
              className="content-item main-content-item"
              data-content-id={content.id}
              onClick={() => onSelectContent && onSelectContent(content)}
              onContextMenu={(e) => onContextMenu(e, content, 'content')}
              onMouseDown={(e) => onMouseDown(e, content, 'content')}
              onMouseUp={onMouseUp}
              onTouchStart={(e) => {
                const timer = setTimeout(() => onContextMenu(e, content, 'content'), 500);
                return () => clearTimeout(timer);
              }}
            >
              <div className="content-item-header">
                <span className="content-icon">📄</span>
                <span className="content-title">{content.title}</span>
              </div>
              <div className="content-item-body">
                <MarkdownWithKaTeX 
                  source={content.content} 
                  style={{ whiteSpace: 'pre-wrap' }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-content">
          <p>No content yet. Click "Add Content" to start creating.</p>
        </div>
      )}
    </div>
  );
};

// 子目录显示组件
const SubdirectoriesList = ({ 
  subdirectories, 
  onSelectDirectory, 
  onContextMenu 
}) => {
  if (!subdirectories || subdirectories.length === 0) return null;

  return (
    <div className="subdirectories-section">
      <h4>Subdirectories</h4>
      <div className="subdirectories-list">
        {subdirectories.map(subdir => (
          <div 
            key={subdir.id}
            className="subdirectory-item"
            onClick={() => onSelectDirectory(subdir)}
            onContextMenu={(e) => onContextMenu(e, subdir, 'directory')}
            onTouchStart={(e) => {
              const timer = setTimeout(() => onContextMenu(e, subdir, 'directory'), 500);
              return () => clearTimeout(timer);
            }}
          >
            <span className="folder-icon">📁</span>
            <span className="folder-name">{subdir.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// 项目概览组件
const ProjectOverview = ({ project, onSelectDirectory, onContextMenu }) => {
  return (
    <div className="project-overview">
      <h3>{project.name}</h3>
      <p>{project.description || project.overview || 'No description'}</p>
      <p className="project-stats">
        Created: {new Date(project.createdAt).toLocaleDateString()}
      </p>
      <h4>Root Directories</h4>
      {project.structure?.directories && project.structure.directories.length > 0 ? (
        <div className="root-directories-list">
          {project.structure.directories.map(directory => (
            <div 
              key={directory.id}
              className="root-directory-item"
              onClick={() => onSelectDirectory(directory)}
              onContextMenu={(e) => onContextMenu(e, directory, 'directory')}
              onTouchStart={(e) => {
                const timer = setTimeout(() => onContextMenu(e, directory, 'directory'), 500);
                return () => clearTimeout(timer);
              }}
            >
              <span className="folder-icon">📁</span>
              <span className="folder-name">{directory.name}</span>
              {directory.description && <span className="folder-description">- {directory.description}</span>}
            </div>
          ))}
        </div>
      ) : (
        <p>No directories yet. Add a directory to get started.</p>
      )}
    </div>
  );
};

// 内容区域组件
const ContentArea = ({ 
  selectedProject, 
  selectedDirectory, 
  showContentForm, 
  showEditContentForm, 
  newContent, 
  setNewContent, 
  uploadingImage, 
  onSelectDirectory, 
  onSelectContent, 
  onAddContent, 
  onSubmitContent, 
  onCancelContent, 
  onSubmitEditContent, 
  onCancelEditContent, 
  onImageUpload, 
  onContextMenu, 
  onMouseDown, 
  onMouseUp 
}) => {
  if (!selectedProject) {
    return (
      <div className="no-selection">
        <p>Select a project to view its contents</p>
      </div>
    );
  }

  if (!selectedDirectory) {
    return (
      <ProjectOverview 
        project={selectedProject}
        onSelectDirectory={onSelectDirectory}
        onContextMenu={onContextMenu}
      />
    );
  }

  return (
    <div className="content-section">
      <div className="content-header">
        <h3>{selectedDirectory.name}</h3>
        <button 
          onClick={onAddContent} 
          className="add-btn"
        >
          Add Content
        </button>
      </div>

      {/* Markdown编辑器/查看器 */}
      <div className="markdown-editor-section">
        {showContentForm && (
          <ContentEditor 
            show={showContentForm}
            isEdit={false}
            onSubmit={onSubmitContent}
            onCancel={onCancelContent}
            newContent={newContent}
            setNewContent={setNewContent}
            uploadingImage={uploadingImage}
            onImageUpload={onImageUpload}
          />
        )}
        
        {showEditContentForm && (
          <ContentEditor 
            show={showEditContentForm}
            isEdit={true}
            onSubmit={onSubmitEditContent}
            onCancel={onCancelEditContent}
            newContent={newContent}
            setNewContent={setNewContent}
            uploadingImage={uploadingImage}
            onImageUpload={onImageUpload}
          />
        )}
        
        {/* 浮动的添加内容按钮 */}
        {selectedDirectory && !showContentForm && !showEditContentForm && (
          <button 
            onClick={onAddContent} 
            className="floating-add-btn"
          >
            +
          </button>
        )}
      </div>

      {/* 内容列表 */}
      <ContentList 
        contents={selectedDirectory.content}
        onSelectContent={onSelectContent}
        onContextMenu={onContextMenu}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
      />

      {/* 子目录显示 */}
      <SubdirectoriesList 
        subdirectories={selectedDirectory.subdirectories}
        onSelectDirectory={onSelectDirectory}
        onContextMenu={onContextMenu}
      />
    </div>
  );
};

export default ContentArea;