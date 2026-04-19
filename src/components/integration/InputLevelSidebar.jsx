import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InputLevelSidebar = ({ onSelectContent }) => {
  const [directories, setDirectories] = useState([]);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [contents, setContents] = useState([]);
  const [selectedContent, setSelectedContent] = useState(null);
  const [expandedDirectories, setExpandedDirectories] = useState([]);

  useEffect(() => {
    loadDirectories();
  }, []);

  const loadDirectories = async () => {
    try {
      const response = await axios.get('/api/input-level/directories');
      setDirectories(response.data.directories);
    } catch (error) {
      console.error('Error loading directories:', error);
    }
  };

  const loadContents = async (directoryId) => {
    try {
      const response = await axios.get(`/api/input-level/directory/${directoryId}/contents`);
      setContents(response.data.contents);
    } catch (error) {
      console.error('Error loading contents:', error);
    }
  };

  const handleDirectoryClick = (directory) => {
    setSelectedDirectory(directory);
    setSelectedContent(null);
    loadContents(directory.id);
    
    // Toggle expanded state
    setExpandedDirectories(prev => {
      if (prev.includes(directory.id)) {
        return prev.filter(id => id !== directory.id);
      } else {
        return [...prev, directory.id];
      }
    });
  };

  const handleContentClick = (content) => {
    setSelectedContent(content);
  };

  const handleConfirm = () => {
    if (selectedContent) {
      onSelectContent(selectedContent);
    }
  };

  const renderDirectoryTree = (dirs, level = 0) => {
    return dirs.map(directory => (
      <div key={directory.id} className="directory-tree-node">
        <div 
          className={`directory-tree-item ${selectedDirectory?.id === directory.id ? 'selected' : ''}`}
          onClick={() => handleDirectoryClick(directory)}
          style={{ paddingLeft: `${level * 20}px` }}
        >
          <span className="folder-icon">📁</span>
          <span className="folder-name">{directory.name}</span>
        </div>
        {expandedDirectories.includes(directory.id) && directory.subdirectories && directory.subdirectories.length > 0 && (
          renderDirectoryTree(directory.subdirectories, level + 1)
        )}
      </div>
    ));
  };

  return (
    <div className="input-level-sidebar">
      <div className="sidebar-section">
        <h4>Directories</h4>
        <div className="directory-tree">
          {renderDirectoryTree(directories)}
        </div>
      </div>
      
      {selectedDirectory && (
        <div className="sidebar-section">
          <h4>Contents in {selectedDirectory.name}</h4>
          <div className="content-list">
            {contents.map(content => (
              <div 
                key={content.id}
                className={`directory-tree-item ${selectedContent?.id === content.id ? 'selected' : ''}`}
                onClick={() => handleContentClick(content)}
              >
                <span className="note-icon">📄</span>
                <span className="note-name">{content.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedContent && (
        <div className="sidebar-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
};

export default InputLevelSidebar;