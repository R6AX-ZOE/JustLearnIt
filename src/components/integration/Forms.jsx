import React, { useState, useEffect } from 'react';
import MDEditor from '@uiw/react-markdown-editor';
import Sidebar from '../learningProjects/Sidebar';

const Forms = ({
  showProjectForm,
  setShowProjectForm,
  newProject,
  setNewProject,
  handleCreateProject,
  showGraphForm,
  setShowGraphForm,
  newGraph,
  setNewGraph,
  handleCreateGraph,
  showGraphEditForm,
  setShowGraphEditForm,
  editingGraph,
  setEditingGraph,
  handleUpdateGraph,
  showNodeForm,
  setShowNodeForm,
  editingNode,
  setEditingNode,
  newNode,
  setNewNode,
  handleAddNode,
  handleUpdateNode,
  showRequisitionForm,
  setShowRequisitionForm,
  newRequisition,
  setNewRequisition,
  handleAddRequisition,
  showApplicationForm,
  setShowApplicationForm,
  newApplication,
  setNewApplication,
  handleAddApplication,
  showMarkdownEditor,
  setShowMarkdownEditor,
  nodeMarkdown,
  setNodeMarkdown,
  selectedNode,
  nodes,
  setNodes,
  setSelectedNode,
  showDeleteConfirm,
  setShowDeleteConfirm,
  edgeToDelete,
  setEdgeToDelete,
  handleDeleteEdge,
  projects,
  showExternalLinkDialog,
  setShowExternalLinkDialog,
  handleAddExternalLink,
  showQuestionLinkForm,
  setShowQuestionLinkForm,
  newQuestionLink,
  setNewQuestionLink,
  handleAddQuestionLink,
  practiceProjects
}) => {
  // Sidebar state
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDirectory, setSelectedDirectory] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [projectsCollapsed, setProjectsCollapsed] = useState(false);
  const [collapsedDirectories, setCollapsedDirectories] = useState(new Set());
  const [showDirectoryForm, setShowDirectoryForm] = useState(false);
  const [newDirectory, setNewDirectory] = useState({ name: '', description: '', parentId: null });
  const [contents, setContents] = useState([]);
  const [learningProjects, setLearningProjects] = useState([]);

  // Load learning projects on mount
  useEffect(() => {
    const loadLearningProjects = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const response = await fetch(`/api/learning/projects/${user.id}`);
          if (response.ok) {
            const data = await response.json();
            setLearningProjects(data.projects);
            if (data.projects && data.projects.length > 0) {
              setSelectedProject(data.projects[0]);
            }
          }
        }
      } catch (error) {
        console.error('Error loading learning projects:', error);
      }
    };
    loadLearningProjects();
  }, []);

  // Handle directory selection
  const handleSelectDirectory = (directory) => {
    setSelectedDirectory(directory);
    setSelectedContent(null);
    // Load contents for the selected directory
    if (directory.content) {
      setContents(directory.content);
    } else {
      setContents([]);
    }
  };

  // Handle content selection
  const handleSelectContent = (content) => {
    setSelectedContent(content);
  };

  // Handle project selection
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    setSelectedDirectory(null);
    setSelectedContent(null);
    setContents([]);
  };

  // Handle directory collapse toggle
  const handleToggleDirectoryCollapse = (directoryId) => {
    setCollapsedDirectories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(directoryId)) {
        newSet.delete(directoryId);
      } else {
        newSet.add(directoryId);
      }
      return newSet;
    });
  };

  // Handle projects collapse toggle
  const handleToggleProjectsCollapse = () => {
    setProjectsCollapsed(prev => !prev);
  };

  // Handle directory form toggle
  const handleToggleDirectoryForm = () => {
    setShowDirectoryForm(prev => !prev);
  };

  // Handle directory form submit
  const handleSubmitDirectory = (e) => {
    e.preventDefault();
    // This would normally call an API to create the directory
    setShowDirectoryForm(false);
    setNewDirectory({ name: '', description: '', parentId: null });
  };

  // Handle context menu (not used in this context, but required by Sidebar component)
  const handleContextMenu = () => {};
  const handleMouseDown = () => {};
  const handleMouseUp = () => {};
  return (
    <>
      {showProjectForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>New Project</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowProjectForm(false);
                  setNewProject({ name: '', description: '' });
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateProject();
              }}>
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    required
                    placeholder="Project name"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Project description"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Create</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowProjectForm(false);
                    setNewProject({ name: '', description: '' });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showGraphForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>New Graph</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowGraphForm(false);
                  setNewGraph({ name: '', description: '' });
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleCreateGraph();
              }}>
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    value={newGraph.name}
                    onChange={(e) => setNewGraph({ ...newGraph, name: e.target.value })}
                    required
                    placeholder="Graph name"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={newGraph.description}
                    onChange={(e) => setNewGraph({ ...newGraph, description: e.target.value })}
                    placeholder="Graph description"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Create</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowGraphForm(false);
                    setNewGraph({ name: '', description: '' });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showGraphEditForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Edit Graph</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowGraphEditForm(false);
                  setEditingGraph(null);
                  setNewGraph({ name: '', description: '' });
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleUpdateGraph();
              }}>
                <div className="form-group">
                  <label>Name *</label>
                  <input 
                    type="text" 
                    value={newGraph.name}
                    onChange={(e) => setNewGraph({ ...newGraph, name: e.target.value })}
                    required
                    placeholder="Graph name"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea 
                    value={newGraph.description}
                    onChange={(e) => setNewGraph({ ...newGraph, description: e.target.value })}
                    placeholder="Graph description"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Update</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowGraphEditForm(false);
                    setEditingGraph(null);
                    setNewGraph({ name: '', description: '' });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {showNodeForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>{editingNode ? 'Edit Node' : 'Add Node'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowNodeForm(false);
                  setEditingNode(null);
                  setNewNode({ title: '', type: 'input' });
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                editingNode ? handleUpdateNode() : handleAddNode();
              }}>
                <div className="form-group">
                  <label>Title *</label>
                  <input 
                    type="text" 
                    value={newNode.title}
                    onChange={(e) => setNewNode({ ...newNode, title: e.target.value })}
                    required
                    placeholder="Enter node title"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <input 
                    type="text" 
                    value={newNode.type}
                    onChange={(e) => setNewNode({ ...newNode, type: e.target.value })}
                    placeholder="Enter node type"
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editingNode ? 'Update' : 'Add'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowNodeForm(false);
                    setEditingNode(null);
                    setNewNode({ title: '', type: 'input' });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {showRequisitionForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Add Requisition</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowRequisitionForm(false);
                  setNewRequisition({ projectId: '', graphId: '', nodeId: '' });
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddRequisition();
              }}>
                <div className="form-group">
                  <label>Project *</label>
                  <select 
                    value={newRequisition.projectId}
                    onChange={(e) => {
                      const projectId = e.target.value;
                      setNewRequisition({ projectId, graphId: '', nodeId: '' });
                    }}
                    required
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Graph *</label>
                  <select 
                    value={newRequisition.graphId}
                    onChange={(e) => {
                      const graphId = e.target.value;
                      setNewRequisition(prev => ({ ...prev, graphId, nodeId: '' }));
                    }}
                    required
                    disabled={!newRequisition.projectId}
                  >
                    <option value="">Select graph</option>
                    {projects.find(p => p.id === newRequisition.projectId)?.graphs?.map(graph => (
                      <option key={graph.id} value={graph.id}>{graph.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Node *</label>
                  <select 
                    value={newRequisition.nodeId}
                    onChange={(e) => {
                      const nodeId = e.target.value;
                      setNewRequisition(prev => ({ ...prev, nodeId }));
                    }}
                    required
                    disabled={!newRequisition.graphId}
                  >
                    <option value="">Select node</option>
                    {projects.find(p => p.id === newRequisition.projectId)?.graphs?.find(g => g.id === newRequisition.graphId)?.nodes?.filter(n => n.id !== selectedNode?.id).map(node => (
                      <option key={node.id} value={node.id}>{node.data.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Add</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowRequisitionForm(false);
                    setNewRequisition({ projectId: '', graphId: '', nodeId: '' });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {showApplicationForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Add Application</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowApplicationForm(false);
                  setNewApplication({ projectId: '', graphId: '', nodeId: '' });
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddApplication();
              }}>
                <div className="form-group">
                  <label>Project *</label>
                  <select 
                    value={newApplication.projectId}
                    onChange={(e) => {
                      const projectId = e.target.value;
                      setNewApplication({ projectId, graphId: '', nodeId: '' });
                    }}
                    required
                  >
                    <option value="">Select project</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Graph *</label>
                  <select 
                    value={newApplication.graphId}
                    onChange={(e) => {
                      const graphId = e.target.value;
                      setNewApplication(prev => ({ ...prev, graphId, nodeId: '' }));
                    }}
                    required
                    disabled={!newApplication.projectId}
                  >
                    <option value="">Select graph</option>
                    {projects.find(p => p.id === newApplication.projectId)?.graphs?.map(graph => (
                      <option key={graph.id} value={graph.id}>{graph.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Node *</label>
                  <select 
                    value={newApplication.nodeId}
                    onChange={(e) => {
                      const nodeId = e.target.value;
                      setNewApplication(prev => ({ ...prev, nodeId }));
                    }}
                    required
                    disabled={!newApplication.graphId}
                  >
                    <option value="">Select node</option>
                    {projects.find(p => p.id === newApplication.projectId)?.graphs?.find(g => g.id === newApplication.graphId)?.nodes?.filter(n => n.id !== selectedNode?.id).map(node => (
                      <option key={node.id} value={node.id}>{node.data.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Add</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowApplicationForm(false);
                    setNewApplication({ projectId: '', graphId: '', nodeId: '' });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      
      {showMarkdownEditor && selectedNode && (
        <div className="dialog-overlay">
          <div className="dialog markdown-dialog">
            <div className="dialog-header">
              <h3>Edit Node Description</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowMarkdownEditor(false);
                  setNodeMarkdown('');
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <MDEditor
                value={nodeMarkdown}
                onChange={(value) => setNodeMarkdown(value)}
                height={400}
              />
              <div className="form-actions">
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    const updatedNodes = nodes.map(node => 
                      node.id === selectedNode.id 
                        ? { 
                            ...node, 
                            data: { 
                              ...node.data, 
                              description: nodeMarkdown
                            } 
                          }
                        : node
                    );
                    setNodes(updatedNodes);
                    // 更新selectedNode为最新的节点数据
                    if (selectedNode) {
                      const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);
                      if (updatedSelectedNode) {
                        setSelectedNode(updatedSelectedNode);
                      }
                    }
                    setShowMarkdownEditor(false);
                    setNodeMarkdown('');
                  }}
                >
                  Save
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowMarkdownEditor(false);
                    setNodeMarkdown('');
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showDeleteConfirm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Confirm Deletion</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setEdgeToDelete(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <p>Are you sure you want to delete this edge?</p>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-danger"
                  onClick={() => {
                    if (edgeToDelete) {
                      handleDeleteEdge(edgeToDelete.id);
                    }
                    setShowDeleteConfirm(false);
                    setEdgeToDelete(null);
                  }}
                >
                  Delete
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setEdgeToDelete(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showExternalLinkDialog && selectedNode && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Add External Link</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowExternalLinkDialog(false);
                  setSelectedContent(null);
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <div className="form-group">
                <label>Select Content</label>
                <div className="directory-selector">
                  <Sidebar 
                    sidebarOpen={true}
                    projects={learningProjects}
                    selectedProject={selectedProject}
                    selectedDirectory={selectedDirectory}
                    selectedContent={selectedContent}
                    projectsCollapsed={projectsCollapsed}
                    collapsedDirectories={collapsedDirectories}
                    showDirectoryForm={showDirectoryForm}
                    newDirectory={newDirectory}
                    contents={contents}
                    onSelectProject={handleSelectProject}
                    onSelectDirectory={handleSelectDirectory}
                    onSelectContent={handleSelectContent}
                    onToggleProjectsCollapse={handleToggleProjectsCollapse}
                    onToggleDirectoryCollapse={handleToggleDirectoryCollapse}
                    onToggleDirectoryForm={handleToggleDirectoryForm}
                    onSubmitDirectory={handleSubmitDirectory}
                    setNewDirectory={setNewDirectory}
                    onContextMenu={handleContextMenu}
                    onMouseDown={handleMouseDown}
                    onMouseUp={handleMouseUp}
                    isNarrow={false}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  onClick={() => {
                    if (selectedContent && selectedProject && selectedDirectory) {
                      handleAddExternalLink({
                        contentId: selectedContent.id,
                        contentName: selectedContent.title,
                        contentPath: selectedContent.path || selectedContent.id,
                        projectId: selectedProject.id,
                        directoryId: selectedDirectory.id
                      });
                      setShowExternalLinkDialog(false);
                      setSelectedContent(null);
                    }
                  }}
                  disabled={!selectedContent}
                >
                  Confirm
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => {
                    setShowExternalLinkDialog(false);
                    setSelectedContent(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {showQuestionLinkForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>Add Question Links</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowQuestionLinkForm(false);
                  setNewQuestionLink({ projectId: '', practiceId: '', questionIds: [], selectAll: false });
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleAddQuestionLink();
              }}>
                <div className="form-group">
                  <label>Practice Project *</label>
                  <select 
                    value={newQuestionLink.projectId}
                    onChange={(e) => {
                      const projectId = e.target.value;
                      setNewQuestionLink({ projectId, practiceId: '', questionIds: [], selectAll: false });
                    }}
                    required
                  >
                    <option value="">Select practice project</option>
                    {practiceProjects.map(project => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Practice *</label>
                  <select 
                    value={newQuestionLink.practiceId}
                    onChange={(e) => {
                      const practiceId = e.target.value;
                      setNewQuestionLink(prev => ({ ...prev, practiceId, questionIds: [], selectAll: false }));
                    }}
                    required
                    disabled={!newQuestionLink.projectId}
                  >
                    <option value="">Select practice</option>
                    {practiceProjects.find(p => p.id === newQuestionLink.projectId)?.practices?.map(practice => (
                      <option key={practice.id} value={practice.id}>{practice.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Questions</label>
                  <div className="checkbox-group">
                    <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                      <input 
                        type="checkbox" 
                        checked={newQuestionLink.selectAll}
                        onChange={(e) => {
                          const selectAll = e.target.checked;
                          setNewQuestionLink(prev => ({
                            ...prev,
                            selectAll,
                            questionIds: selectAll ? 
                              practiceProjects
                                .find(p => p.id === newQuestionLink.projectId)
                                ?.practices
                                ?.find(p => p.id === newQuestionLink.practiceId)
                                ?.questions
                                ?.map(q => q.id) || []
                              : []
                          }));
                        }}
                        disabled={!newQuestionLink.practiceId}
                      />
                      <span style={{ marginLeft: '8px' }}>Select All Questions</span>
                    </label>
                    {practiceProjects.find(p => p.id === newQuestionLink.projectId)?.practices?.find(p => p.id === newQuestionLink.practiceId)?.questions?.map(question => (
                      <label key={question.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                        <input 
                          type="checkbox" 
                          checked={newQuestionLink.questionIds.includes(question.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewQuestionLink(prev => ({
                                ...prev,
                                questionIds: [...prev.questionIds, question.id],
                                selectAll: false
                              }));
                            } else {
                              setNewQuestionLink(prev => ({
                                ...prev,
                                questionIds: prev.questionIds.filter(id => id !== question.id),
                                selectAll: false
                              }));
                            }
                          }}
                          disabled={newQuestionLink.selectAll || !newQuestionLink.practiceId}
                        />
                        <span style={{ marginLeft: '8px' }}>{question.question}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary" disabled={!newQuestionLink.questionIds.length}>
                    Add Links
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowQuestionLinkForm(false);
                    setNewQuestionLink({ projectId: '', practiceId: '', questionIds: [], selectAll: false });
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Forms;