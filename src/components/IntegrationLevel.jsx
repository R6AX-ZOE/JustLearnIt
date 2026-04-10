import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  addEdge,
  ConnectionLineType
} from 'reactflow';
import 'reactflow/dist/style.css';
import MDEditor from '@uiw/react-markdown-editor';
import '@uiw/react-markdown-editor/markdown-editor.css';
import axios from 'axios';

const API_BASE = '/api/integration';

const IntegrationLevel = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [newNode, setNewNode] = useState({ title: '', type: 'input' });
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [newLink, setNewLink] = useState({ title: '', targetNodeId: '', nodeIds: [] });
  const [showRequisitionForm, setShowRequisitionForm] = useState(false);
  const [newRequisition, setNewRequisition] = useState({ title: '' });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [newApplication, setNewApplication] = useState({ title: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [edgeToDelete, setEdgeToDelete] = useState(null);
  const [showMarkdownEditor, setShowMarkdownEditor] = useState(false);
  const [nodeMarkdown, setNodeMarkdown] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [showGraphForm, setShowGraphForm] = useState(false);
  const [newGraph, setNewGraph] = useState({ name: '', description: '' });
  const [showGraphEditForm, setShowGraphEditForm] = useState(false);
  const [editingGraph, setEditingGraph] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const saveGraphToServer = useCallback(async () => {
    if (!selectedProject || !selectedGraph || isSaving) return;
    
    setIsSaving(true);
    try {
      await axios.put(`${API_BASE}/project/${selectedProject.id}/graph/${selectedGraph.id}`, {
        nodes,
        edges
      });
    } catch (error) {
      console.error('Error saving graph:', error);
    } finally {
      setIsSaving(false);
    }
  }, [selectedProject, selectedGraph, nodes, edges, isSaving]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveGraphToServer();
    }, 1000);
    return () => clearTimeout(timer);
  }, [nodes, edges, saveGraphToServer]);

  useEffect(() => {
    if (user) {
      loadProjects();
    }
  }, [user]);

  const loadProjects = async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_BASE}/projects/${user.id}`);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleCreateProject = async () => {
    if (!user || !newProject.name) return;
    try {
      const response = await axios.post(`${API_BASE}/projects`, {
        name: newProject.name,
        description: newProject.description,
        userId: user.id
      });
      setProjects([...projects, response.data.project]);
      setNewProject({ name: '', description: '' });
      setShowProjectForm(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleCreateGraph = async () => {
    if (!selectedProject || !newGraph.name) return;
    try {
      const updatedProject = {
        ...selectedProject,
        graphs: [
          ...(selectedProject.graphs || []),
          {
            id: Date.now().toString(),
            name: newGraph.name,
            description: newGraph.description,
            nodes: [],
            edges: []
          }
        ],
        updatedAt: new Date()
      };

      const response = await axios.put(`${API_BASE}/project/${selectedProject.id}`, {
        graphs: updatedProject.graphs
      });

      setProjects(projects.map(project => 
        project.id === selectedProject.id ? response.data.project : project
      ));
      setNewGraph({ name: '', description: '' });
      setShowGraphForm(false);
    } catch (error) {
      console.error('Error creating graph:', error);
    }
  };

  const handleEditGraph = (graph) => {
    setEditingGraph(graph);
    setNewGraph({ name: graph.name, description: graph.description });
    setShowGraphEditForm(true);
  };

  const handleUpdateGraph = async () => {
    if (!selectedProject || !editingGraph || !newGraph.name) return;
    try {
      const updatedGraphs = selectedProject.graphs.map(graph => 
        graph.id === editingGraph.id 
          ? { ...graph, name: newGraph.name, description: newGraph.description }
          : graph
      );

      const response = await axios.put(`${API_BASE}/project/${selectedProject.id}`, {
        graphs: updatedGraphs
      });

      setProjects(projects.map(project => 
        project.id === selectedProject.id ? response.data.project : project
      ));
      setEditingGraph(null);
      setNewGraph({ name: '', description: '' });
      setShowGraphEditForm(false);
    } catch (error) {
      console.error('Error updating graph:', error);
    }
  };

  useEffect(() => {
    if (selectedProject && selectedGraph) {
      const graphData = selectedProject.graphs?.find(g => g.id === selectedGraph.id);
      if (graphData) {
        setNodes(graphData.nodes || []);
        setEdges(graphData.edges || []);
      }
    }
  }, [selectedProject, selectedGraph, setNodes, setEdges]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      className: 'graph-edge'
    }, eds));
  }, []);

  const handleDeleteEdge = (edgeId) => {
    setEdges(edges.filter(edge => edge.id !== edgeId));
  };

  const handleEdgeDoubleClick = (event, edge) => {
    setEdgeToDelete(edge);
    setShowDeleteConfirm(true);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setSelectedGraph(null);
    setSelectedNode(null);
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    console.log('Node clicked:', node);
    const updatedNodes = nodes.map(n => ({
      ...n,
      className: `graph-node ${n.data.type || 'input'} ${n.id === node.id ? 'selected' : ''}`
    }));
    setNodes(updatedNodes);
  };

  const handleAddNode = () => {
    const newId = Date.now().toString();
    const newNodeObj = {
      id: newId,
      position: { x: 100, y: 100 },
      data: { 
        label: newNode.title, 
        type: newNode.type,
        prerequisites: [],
        applications: []
      },
      className: `graph-node ${newNode.type}`
    };
    setNodes([...nodes, newNodeObj]);
    setNewNode({ title: '', type: 'input' });
    setShowNodeForm(false);
  };

  const handleEditNode = (node) => {
    setEditingNode(node);
    setNewNode({ title: node.data.label, type: node.data.type });
    setShowNodeForm(true);
  };

  const handleUpdateNode = () => {
    if (editingNode) {
      const updatedNodes = nodes.map(node => 
        node.id === editingNode.id 
          ? {
              ...node,
              data: { ...node.data, label: newNode.title, type: newNode.type },
              className: `graph-node ${newNode.type} ${node.id === selectedNode?.id ? 'selected' : ''}`
            }
          : {
              ...node,
              className: `graph-node ${node.data.type || 'input'} ${node.id === selectedNode?.id ? 'selected' : ''}`
            }
      );
      setNodes(updatedNodes);
      setEditingNode(null);
      setNewNode({ title: '', type: 'input' });
      setShowNodeForm(false);
    }
  };

  const handleDeleteNode = (nodeId) => {
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    const updatedEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
    const updatedLinks = externalLinks.map(link => ({
      ...link,
      nodeIds: link.nodeIds.filter(id => id !== nodeId)
    })).filter(link => link.nodeIds.length > 0);
    
    setNodes(updatedNodes);
    setEdges(updatedEdges);
    setExternalLinks(updatedLinks);
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleAddLink = () => {
    const newLinkObj = {
      id: Date.now().toString(),
      title: newLink.title,
      targetNodeId: newLink.targetNodeId,
      nodeIds: newLink.nodeIds
    };
    setExternalLinks([...externalLinks, newLinkObj]);
    setNewLink({ title: '', targetNodeId: '', nodeIds: [] });
    setShowLinkForm(false);
  };

  const handleEditLink = (link) => {
    setEditingLink(link);
    setNewLink({ title: link.title, targetNodeId: link.targetNodeId, nodeIds: [...link.nodeIds] });
    setShowLinkForm(true);
  };

  const handleUpdateLink = () => {
    if (editingLink) {
      const updatedLinks = externalLinks.map(link => 
        link.id === editingLink.id 
          ? { ...link, title: newLink.title, targetNodeId: newLink.targetNodeId, nodeIds: newLink.nodeIds }
          : link
      );
      setExternalLinks(updatedLinks);
      setEditingLink(null);
      setNewLink({ title: '', targetNodeId: '', nodeIds: [] });
      setShowLinkForm(false);
    }
  };

  const handleDeleteLink = (linkId) => {
    setExternalLinks(externalLinks.filter(link => link.id !== linkId));
  };

  const handleAddRequisition = () => {
    if (selectedNode) {
      const targetNodeId = newRequisition.title;
      const targetNode = nodes.find(n => n.id === targetNodeId);
      if (!targetNode) {
        alert('Target node not found');
        return;
      }
      
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              prerequisites: [...(node.data.prerequisites || []), targetNodeId]
            }
          };
        } else if (node.id === targetNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              applications: [...(node.data.applications || []), selectedNode.id]
            }
          };
        }
        return node;
      });
      
      setNodes(updatedNodes);
      setNewRequisition({ title: '' });
      setShowRequisitionForm(false);
    }
  };

  const handleDeleteRequisition = (requisitionId) => {
    if (selectedNode) {
      const targetNode = nodes.find(n => n.id === requisitionId);
      
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              prerequisites: (node.data.prerequisites || []).filter(id => id !== requisitionId)
            }
          };
        } else if (targetNode && node.id === requisitionId) {
          return {
            ...node,
            data: {
              ...node.data,
              applications: (node.data.applications || []).filter(id => id !== selectedNode.id)
            }
          };
        }
        return node;
      });
      
      setNodes(updatedNodes);
    }
  };

  const handleAddApplication = () => {
    if (selectedNode) {
      const targetNodeId = newApplication.title;
      const targetNode = nodes.find(n => n.id === targetNodeId);
      if (!targetNode) {
        alert('Target node not found');
        return;
      }
      
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              applications: [...(node.data.applications || []), targetNodeId]
            }
          };
        } else if (node.id === targetNodeId) {
          return {
            ...node,
            data: {
              ...node.data,
              prerequisites: [...(node.data.prerequisites || []), selectedNode.id]
            }
          };
        }
        return node;
      });
      
      setNodes(updatedNodes);
      setNewApplication({ title: '' });
      setShowApplicationForm(false);
    }
  };

  const handleDeleteApplication = (applicationId) => {
    if (selectedNode) {
      const targetNode = nodes.find(n => n.id === applicationId);
      
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              applications: (node.data.applications || []).filter(id => id !== applicationId)
            }
          };
        } else if (targetNode && node.id === applicationId) {
          return {
            ...node,
            data: {
              ...node.data,
              prerequisites: (node.data.prerequisites || []).filter(id => id !== selectedNode.id)
            }
          };
        }
        return node;
      });
      
      setNodes(updatedNodes);
    }
  };

  const filteredExternalLinks = selectedNode 
    ? externalLinks.filter(link => link.nodeIds.includes(selectedNode.id))
    : [];

  return (
    <div className="integration-level">
      <div className="integration-header">
        <div className="header-left">
          <h2>Integration Level</h2>
          <div className="navigation-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/input" className="nav-link">Input Level</Link>
          </div>
          <div className="user-status">
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </div>
        </div>
        <div className="header-right">
          <button className="control-btn" onClick={() => setShowProjectForm(true)}>
            New Project
          </button>
        </div>
      </div>
      
      <div className="project-selection">
        <h3>Select Project</h3>
        <div className="projects-list">
          {projects.map(project => (
            <div 
              key={project.id}
              className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
              onClick={() => handleProjectSelect(project)}
            >
              <h4>{project.name}</h4>
              <p>{project.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {selectedProject && (
        <div className="graph-selection">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>Select Graph ({selectedProject.graphs?.length || 0} graphs)</h3>
            <button className="control-btn" onClick={() => setShowGraphForm(true)}>
              New Graph
            </button>
          </div>
          <div className="graphs-list">
            {selectedProject.graphs?.map(graph => (
              <div 
                key={graph.id}
                className={`graph-item ${selectedGraph?.id === graph.id ? 'selected' : ''}`}
                onClick={() => setSelectedGraph(graph)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  handleEditGraph(graph);
                }}
              >
                <h4>{graph.name}</h4>
                <p>{graph.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {selectedProject && selectedGraph && (
        <div className="integration-content">
          <div className="main-content">
            <div className="graph-section">
              <div className="graph-header">
                <h3>Graph {isSaving && <span>(Saving...)</span>}</h3>
                <div className="graph-controls">
                  <button className="control-btn" onClick={() => setShowNodeForm(true)}>Add Node</button>
                  {selectedNode && (
                    <>
                      <button className="control-btn" onClick={() => handleEditNode(selectedNode)}>Edit Node</button>
                      <button className="control-btn delete-btn" onClick={() => handleDeleteNode(selectedNode.id)}>Delete Node</button>
                    </>
                  )}
                </div>
              </div>
              <div className="graph-container">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={handleNodeClick}
                  onEdgeDoubleClick={handleEdgeDoubleClick}
                  connectionLineType={ConnectionLineType.Bezier}
                  defaultZoom={1.2}
                  minZoom={0.5}
                  maxZoom={2}
                >
                  <Background variant="dots" gap={12} size={1} />
                  <Controls />
                  <MiniMap />
                </ReactFlow>
              </div>
              
              <div className="external-links-section">
                <div className="section-header">
                  <h3>External Links</h3>
                  <button className="add-btn" onClick={() => setShowLinkForm(true)}>Add Link</button>
                </div>
                <div className="external-links-container">
                  {filteredExternalLinks.length > 0 ? (
                    filteredExternalLinks.map(link => (
                      <div key={link.id} className="external-link-item">
                        <div className="link-content">
                          {link.targetNodeId ? (
                            <button 
                              className="node-link-btn"
                              onClick={() => {
                                const targetNode = nodes.find(node => node.id === link.targetNodeId);
                                if (targetNode) {
                                  alert(`Link to: ${targetNode.data.label}`);
                                }
                              }}
                            >
                              {link.title}
                            </button>
                          ) : (
                            <span>{link.title}</span>
                          )}
                        </div>
                        <div className="link-actions">
                          <button className="action-btn" onClick={() => handleEditLink(link)}>Edit</button>
                          <button className="action-btn delete-btn" onClick={() => handleDeleteLink(link.id)}>Delete</button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-links">{selectedNode ? 'No external links for this node' : 'Select a node to view external links'}</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="management-section">
              {selectedNode && (
                <div className="prerequisites-section">
                  <div className="section-header">
                    <h3>Prerequisites</h3>
                    <button 
                      className="control-btn"
                      onClick={() => setShowRequisitionForm(true)}
                    >
                      Add
                    </button>
                  </div>
                  <div className="prerequisites-list">
                    {selectedNode?.data?.prerequisites?.length > 0 ? (
                      selectedNode.data.prerequisites.map((prereqId, index) => {
                        const prereqNode = nodes.find(n => n.id === prereqId);
                        return (
                          <div key={index} className="prerequisite-item">
                            <span>{prereqNode?.data?.label || `Node ${prereqId}`}</span>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteRequisition(prereqId)}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="no-items">No prerequisites</p>
                    )}
                  </div>
                </div>
              )}
              
              {selectedNode && (
                <div className="node-info-section">
                  <div className="section-header">
                    <h3>Node Info</h3>
                    <button 
                      className="control-btn"
                      onClick={() => {
                        setNodeMarkdown(selectedNode.data.description || '');
                        setShowMarkdownEditor(true);
                      }}
                    >
                      Edit Description
                    </button>
                  </div>
                  <div className="node-info">
                    <p><strong>Label:</strong> {selectedNode.data.label}</p>
                    <p><strong>Type:</strong> {selectedNode.data.type}</p>
                    <div className="node-description">
                      <p><strong>Description:</strong></p>
                      <div className="description-content">
                        {selectedNode.data.description ? (
                          <MDEditor.Markdown source={selectedNode.data.description} />
                        ) : (
                          <p className="no-description">No description</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedNode && (
                <div className="applications-section">
                  <div className="section-header">
                    <h3>Applications</h3>
                    <button 
                      className="control-btn"
                      onClick={() => setShowApplicationForm(true)}
                    >
                      Add
                    </button>
                  </div>
                  <div className="applications-list">
                    {selectedNode?.data?.applications?.length > 0 ? (
                      selectedNode.data.applications.map((appId, index) => {
                        const appNode = nodes.find(n => n.id === appId);
                        return (
                          <div key={index} className="application-item">
                            <span>{appNode?.data?.label || `Node ${appId}`}</span>
                            <button 
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteApplication(appId)}
                            >
                              Delete
                            </button>
                          </div>
                        );
                      })
                    ) : (
                      <p className="no-items">No applications</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
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
                  <select 
                    value={newNode.type}
                    onChange={(e) => setNewNode({ ...newNode, type: e.target.value })}
                  >
                    <option value="input">Input</option>
                    <option value="connection">Connection</option>
                  </select>
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
      
      {showLinkForm && (
        <div className="dialog-overlay">
          <div className="dialog">
            <div className="dialog-header">
              <h3>{editingLink ? 'Edit External Link' : 'Add External Link'}</h3>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowLinkForm(false);
                  setEditingLink(null);
                  setNewLink({ title: '', url: '', nodeIds: [] });
                }}
              >
                ×
              </button>
            </div>
            <div className="dialog-content">
              <form onSubmit={(e) => {
                e.preventDefault();
                editingLink ? handleUpdateLink() : handleAddLink();
              }}>
                <div className="form-group">
                  <label>Title *</label>
                  <input 
                    type="text" 
                    value={newLink.title}
                    onChange={(e) => setNewLink({ ...newLink, title: e.target.value })}
                    required
                    placeholder="Enter link title"
                  />
                </div>
                <div className="form-group">
                  <label>Target Node</label>
                  <select 
                    value={newLink.targetNodeId}
                    onChange={(e) => setNewLink({ ...newLink, targetNodeId: e.target.value })}
                    required
                  >
                    <option value="">Select target node</option>
                    {nodes.map(node => (
                      <option key={node.id} value={node.id}>{node.data.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Apply to Nodes</label>
                  <div className="node-selector">
                    {nodes.map(node => (
                      <label key={node.id} className="node-checkbox">
                        <input 
                          type="checkbox"
                          checked={newLink.nodeIds.includes(node.id)}
                          onChange={(e) => {
                            const newNodeIds = e.target.checked 
                              ? [...newLink.nodeIds, node.id]
                              : newLink.nodeIds.filter(id => id !== node.id);
                            setNewLink({ ...newLink, nodeIds: newNodeIds });
                          }}
                        />
                        {node.data.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">{editingLink ? 'Update' : 'Add'}</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowLinkForm(false);
                    setEditingLink(null);
                    setNewLink({ title: '', url: '', nodeIds: [] });
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
                  setNewRequisition({ title: '' });
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
                  <label>Target Node *</label>
                  <select 
                    value={newRequisition.title}
                    onChange={(e) => setNewRequisition({ title: e.target.value })}
                    required
                  >
                    <option value="">Select target node</option>
                    {nodes.filter(n => n.id !== selectedNode?.id).map(node => (
                      <option key={node.id} value={node.id}>{node.data.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Add</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowRequisitionForm(false);
                    setNewRequisition({ title: '' });
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
                  setNewApplication({ title: '' });
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
                  <label>Target Node *</label>
                  <select 
                    value={newApplication.title}
                    onChange={(e) => setNewApplication({ title: e.target.value })}
                    required
                  >
                    <option value="">Select target node</option>
                    {nodes.filter(n => n.id !== selectedNode?.id).map(node => (
                      <option key={node.id} value={node.id}>{node.data.label}</option>
                    ))}
                  </select>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Add</button>
                  <button type="button" className="btn btn-secondary" onClick={() => {
                    setShowApplicationForm(false);
                    setNewApplication({ title: '' });
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
      
      <style>{`
        .integration-level {
          padding: 20px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: 80vh;
          background: #f8f9fa;
        }
        
        .integration-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }
        
        .header-left h2 {
          margin: 0 0 15px 0;
          color: #333;
          font-size: 28px;
        }
        
        .navigation-links {
          display: flex;
          gap: 15px;
        }
        
        .nav-link {
          text-decoration: none;
          color: #667eea;
          font-weight: 500;
          padding: 8px 16px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .nav-link:hover {
          background: #f0f0f0;
          transform: translateY(-1px);
        }
        
        .project-selection {
          margin-bottom: 30px;
        }
        
        .project-selection h3 {
          margin-bottom: 15px;
          color: #333;
        }
        
        .projects-list {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 10px 0;
        }
        
        .project-item {
          flex: 0 0 250px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .project-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .project-item.selected {
          border: 2px solid #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .project-item h4 {
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .project-item p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .graph-selection h3 {
          margin-bottom: 15px;
          color: #333;
        }
        
        .graphs-list {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          padding: 10px 0;
        }
        
        .graph-item {
          flex: 0 0 250px;
          padding: 20px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .graph-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .graph-item.selected {
          border: 2px solid #667eea;
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .graph-item h4 {
          margin: 0 0 10px 0;
          color: #333;
        }
        
        .graph-item p {
          margin: 0;
          color: #666;
          font-size: 14px;
        }
        
        .main-content {
          display: flex;
          gap: 20px;
          min-height: 600px;
        }
        
        .graph-section {
          flex: 1;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .graph-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }
        
        .graph-header h3 {
          margin: 0;
          color: #333;
        }
        
        .graph-controls {
          display: flex;
          gap: 10px;
        }
        
        .control-btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .control-btn:hover {
          background: #f0f0f0;
        }
        
        .control-btn.delete-btn {
          background: #ffebee;
          border-color: #f44336;
          color: #c62828;
        }
        
        .control-btn.delete-btn:hover {
          background: #ffcdd2;
        }
        
        .graph-container {
          height: 500px;
        }
        
        .management-section {
          width: 350px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .node-info-section,
        .prerequisites-section,
        .applications-section,
        .external-links-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }
        
        .section-header h3 {
          margin: 0;
          color: #333;
        }
        
        .node-info,
        .prerequisites-list,
        .applications-list,
        .external-links-container {
          padding: 20px;
        }
        
        .node-info p {
          margin: 5px 0;
          color: #666;
        }
        
        .node-description {
          margin-top: 15px;
        }
        
        .node-description p {
          margin: 0 0 10px 0;
        }
        
        .description-content {
          background: #fafafa;
          padding: 15px;
          border-radius: 8px;
        }
        
        .no-description {
          color: #999;
          font-style: italic;
        }
        
        .prerequisite-item,
        .application-item,
        .external-link-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .prerequisite-item:last-child,
        .application-item:last-child,
        .external-link-item:last-child {
          border-bottom: none;
        }
        
        .node-link-btn {
          background: none;
          border: none;
          color: #667eea;
          cursor: pointer;
          text-decoration: underline;
          padding: 0;
          font-size: inherit;
        }
        
        .node-link-btn:hover {
          color: #5a67d8;
        }
        
        .action-btn {
          padding: 4px 8px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          margin-left: 8px;
        }
        
        .action-btn.delete-btn {
          background: #ffebee;
          border-color: #f44336;
          color: #c62828;
        }
        
        .no-items,
        .no-links {
          color: #999;
          text-align: center;
          margin: 0;
        }
        
        .add-btn {
          padding: 6px 12px;
          border: none;
          background: #667eea;
          color: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        
        .add-btn:hover {
          background: #5a67d8;
        }
        
        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        
        .dialog {
          background: white;
          border-radius: 12px;
          padding: 0;
          min-width: 400px;
          max-width: 90vw;
          max-height: 90vh;
          overflow: auto;
        }
        
        .dialog.markdown-dialog {
          width: 600px;
        }
        
        .dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .dialog-header h3 {
          margin: 0;
          color: #333;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #666;
          line-height: 1;
        }
        
        .close-btn:hover {
          color: #333;
        }
        
        .dialog-content {
          padding: 20px;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-group label {
          display: block;
          margin-bottom: 8px;
          color: #333;
          font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 14px;
        }
        
        .form-group textarea {
          resize: vertical;
          min-height: 100px;
        }
        
        .node-selector {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .node-checkbox {
          display: flex;
          align-items: center;
          gap: 5px;
          cursor: pointer;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 20px;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
        }
        
        .btn-primary {
          background: #667eea;
          color: white;
        }
        
        .btn-primary:hover {
          background: #5a67d8;
        }
        
        .btn-secondary {
          background: #f0f0f0;
          color: #333;
        }
        
        .btn-secondary:hover {
          background: #e0e0e0;
        }
        
        .btn-danger {
          background: #f44336;
          color: white;
        }
        
        .btn-danger:hover {
          background: #d32f2f;
        }
        
        .graph-node {
          border-radius: 8px;
          padding: 10px 15px;
          font-size: 14px;
          font-weight: 500;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          cursor: grab;
        }
        
        .graph-node.selected {
          box-shadow: 0 0 0 3px #667eea, 0 2px 8px rgba(102, 126, 234, 0.4);
        }
        
        .graph-node.input {
          background: #e3f2fd;
          border: 2px solid #2196f3;
        }
        
        .graph-node.connection {
          background: #fff3e0;
          border: 2px solid #ff9800;
        }
        
        .graph-edge {
          stroke: #667eea;
          stroke-width: 6;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        
        .react-flow__edge-path {
          stroke: #667eea;
          stroke-width: 10;
          stroke-opacity: 0.2;
          stroke-linecap: round;
          stroke-linejoin: round;
        }
        
        .react-flow__edge-path:hover {
          stroke-opacity: 0.4;
        }
        
        @media (max-width: 1200px) {
          .main-content {
            flex-direction: column;
          }
          
          .management-section {
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
          }
          
          .node-info-section,
          .prerequisites-section,
          .applications-section,
          .external-links-section {
            flex: 1;
            min-width: 300px;
          }
          
          .graph-container {
            height: 400px;
          }
        }
        
        @media (max-width: 768px) {
          .integration-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 15px;
          }
          
          .projects-list,
          .graphs-list {
            flex-direction: column;
          }
          
          .project-item,
          .graph-item {
            flex: none;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default IntegrationLevel;
