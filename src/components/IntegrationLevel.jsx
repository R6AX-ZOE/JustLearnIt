import React, { useState, useEffect, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ReactFlowProvider } from 'reactflow';
import axios from 'axios';
import GraphComponent from './integration/GraphComponent';
import ManagementSection from './integration/ManagementSection';
import Forms from './integration/Forms';
import Dialog from './integration/Dialog';
import styles from './integration/styles';

const API_BASE = '/api/integration';

const IntegrationLevel = () => {
  return (
    <ReactFlowProvider>
      <IntegrationLevelContent />
    </ReactFlowProvider>
  );
};

const IntegrationLevelContent = () => {
  const { projectId, graphId, nodeId } = useParams();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [newNode, setNewNode] = useState({ title: '', type: 'input' });
  const [showRequisitionForm, setShowRequisitionForm] = useState(false);
  const [newRequisition, setNewRequisition] = useState({ projectId: '', graphId: '', nodeId: '' });
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [newApplication, setNewApplication] = useState({ projectId: '', graphId: '', nodeId: '' });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [edgeToDelete, setEdgeToDelete] = useState(null);
  const [showExternalLinkDialog, setShowExternalLinkDialog] = useState(false);
  const [selectedExternalLink, setSelectedExternalLink] = useState(null);
  const [showMarkdownEditor, setShowMarkdownEditor] = useState(false);
  const [nodeMarkdown, setNodeMarkdown] = useState('');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [showGraphForm, setShowGraphForm] = useState(false);
  const [newGraph, setNewGraph] = useState({ name: '', description: '' });
  const [showGraphEditForm, setShowGraphEditForm] = useState(false);
  const [editingGraph, setEditingGraph] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedNodes, setLastSavedNodes] = useState([]);
  const [lastSavedEdges, setLastSavedEdges] = useState([]);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, type: '', item: null });
  const [dialog, setDialog] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmVariant: 'primary'
  });
  const [editProjectData, setEditProjectData] = useState({ id: '', name: '', description: '' });
  const [showQuestionLinkForm, setShowQuestionLinkForm] = useState(false);
  const [newQuestionLink, setNewQuestionLink] = useState({ projectId: '', practiceId: '', questionIds: [], selectAll: false });
  const [practiceProjects, setPracticeProjects] = useState([]);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    console.log('User data from localStorage:', userData);
    if (userData) {
      const parsedUser = JSON.parse(userData);
      console.log('Parsed user:', parsedUser);
      setUser(parsedUser);
    }
  }, []);

  // 检查nodes、edges或externalLinks是否发生变化
  const hasChanges = useCallback(() => {
    // 检查长度变化
    if (lastSavedNodes.length !== nodes.length || lastSavedEdges.length !== edges.length) {
      return true;
    }

    // 检查nodes是否变化
    for (let i = 0; i < nodes.length; i++) {
      const currentNode = nodes[i];
      const lastSavedNode = lastSavedNodes.find(n => n.id === currentNode.id);
      if (!lastSavedNode || JSON.stringify(currentNode) !== JSON.stringify(lastSavedNode)) {
        return true;
      }
    }

    // 检查edges是否变化
    for (let i = 0; i < edges.length; i++) {
      const currentEdge = edges[i];
      const lastSavedEdge = lastSavedEdges.find(e => e.id === currentEdge.id);
      if (!lastSavedEdge || JSON.stringify(currentEdge) !== JSON.stringify(lastSavedEdge)) {
        return true;
      }
    }

    return false;
  }, [nodes, edges, lastSavedNodes, lastSavedEdges]);

  const saveGraphToServer = useCallback(async () => {
    if (!selectedProject || !selectedGraph || isSaving || !hasChanges()) return;

    setIsSaving(true);
    try {
      const response = await axios.put(`${API_BASE}/project/${selectedProject.id}/graph/${selectedGraph.id}`, {
        nodes,
        edges
      });
      // 更新selectedProject状态，确保前端数据与服务器保持一致
      setProjects(projects.map(project =>
        project.id === selectedProject.id ? response.data.project : project
      ));
      // 更新上次保存的nodes和edges
      setLastSavedNodes(nodes);
      setLastSavedEdges(edges);
    } catch (error) {
      console.error('Error saving graph:', error);
    } finally {
      setIsSaving(false);
    }
  }, [selectedProject, selectedGraph, nodes, edges, isSaving, projects, hasChanges]);

  useEffect(() => {
    const timer = setTimeout(() => {
      saveGraphToServer();
    }, 5000); // 降低保存频率到5秒
    return () => clearTimeout(timer);
  }, [nodes, edges, saveGraphToServer]);

  useEffect(() => {
    if (user) {
      loadProjects();
      loadPracticeProjects();
    }
  }, [user]);

  // 处理路由参数变化
  useEffect(() => {
    if (projects.length > 0) {
      // 如果有projectId参数，尝试找到并选择对应的项目
      if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setSelectedProject(project);
          
          // 如果有graphId参数，尝试找到并选择对应的graph
          if (graphId) {
            const graph = project.graphs?.find(g => g.id === graphId);
            if (graph) {
              setSelectedGraph(graph);
              
              // 如果有nodeId参数，尝试找到并选择对应的节点
              if (nodeId) {
                const node = graph.nodes?.find(n => n.id === nodeId);
                if (node) {
                  setSelectedNode(node);
                }
              }
            }
          }
        }
      }
    }
  }, [projects, projectId, graphId, nodeId]);

  useEffect(() => {
    const handleClickOutside = () => {
      closeContextMenu();
    };

    if (contextMenu.visible) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [contextMenu.visible]);

  const loadProjects = async () => {
    if (!user) return;
    try {
      console.log('Loading integration projects...');
      const response = await axios.get(`${API_BASE}/projects/${user.id}`);
      console.log('Integration projects loaded:', response.data.projects);
      setProjects(response.data.projects);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const loadPracticeProjects = async () => {
    if (!user) return;
    try {
      const response = await axios.get('/api/practice/projects/' + user.id);
      setPracticeProjects(response.data.projects);
    } catch (error) {
      console.error('Error loading practice projects:', error);
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

  const handleProjectEdit = (project) => {
    setContextMenu({ visible: false });
    // 这里可以添加编辑项目的逻辑
    setEditProjectData({ id: project.id, name: project.name, description: project.description });

    openDialog({
      title: 'Edit Project',
      confirmText: 'Save',
      cancelText: 'Cancel',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/integration/project/${editProjectData.id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              name: editProjectData.name,
              description: editProjectData.description
            })
          });

          if (!response.ok) {
            throw new Error('Failed to update project');
          }

          const result = await response.json();

          // 更新项目列表
          setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === editProjectData.id) {
              return result.project;
            }
            return p;
          }));

          // 如果当前选中的项目被编辑，更新选中状态
          if (selectedProject && selectedProject.id === editProjectData.id) {
            setSelectedProject(result.project);
          }

          openDialog({
            title: 'Success',
            message: result.message,
            confirmText: 'OK',
            onConfirm: closeDialog,
            onCancel: closeDialog
          });
        } catch (error) {
          openDialog({
            title: 'Error',
            message: 'Failed to update project. Please try again.',
            confirmText: 'OK',
            onConfirm: closeDialog,
            onCancel: closeDialog
          });
          console.error('Error updating project:', error);
        } finally {
          closeDialog();
        }
      },
      onCancel: closeDialog,
      children: (
        <div style={{ padding: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Project Name:</label>
            <input
              type="text"
              value={editProjectData.name}
              onChange={(e) => setEditProjectData(prev => ({ ...prev, name: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Project Description:</label>
            <textarea
              value={editProjectData.description}
              onChange={(e) => setEditProjectData(prev => ({ ...prev, description: e.target.value }))}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                minHeight: '80px'
              }}
            />
          </div>
        </div>
      )
    });
  };

  const handleProjectDelete = (project) => {
    setContextMenu({ visible: false });
    openDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete project "${project.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/integration/project/${project.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete project');
          }

          const result = await response.json();

          // 更新项目列表
          setProjects(prevProjects => prevProjects.filter(p => p.id !== project.id));

          // 如果当前选中的项目被删除，重置选中状态
          if (selectedProject && selectedProject.id === project.id) {
            setSelectedProject(null);
            setSelectedGraph(null);
          }

          openDialog({
            title: 'Success',
            message: result.message,
            confirmText: 'OK',
            onConfirm: closeDialog,
            onCancel: closeDialog
          });
        } catch (error) {
          openDialog({
            title: 'Error',
            message: 'Failed to delete project. Please try again.',
            confirmText: 'OK',
            onConfirm: closeDialog,
            onCancel: closeDialog
          });
          console.error('Error deleting project:', error);
        } finally {
          closeDialog();
        }
      },
      onCancel: closeDialog
    });
  };

  const handleGraphEdit = (graph) => {
    setContextMenu({ visible: false });
    setEditingGraph(graph);
    setNewGraph({ name: graph.name, description: graph.description });
    setShowGraphEditForm(true);
  };

  const handleGraphDelete = (graph) => {
    setContextMenu({ visible: false });
    openDialog({
      title: 'Confirm Delete',
      message: `Are you sure you want to delete graph "${graph.name}"?`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          const response = await fetch(`/api/integration/project/${selectedProject.id}/graph/${graph.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Failed to delete graph');
          }

          const result = await response.json();

          // 更新项目中的图形列表
          setSelectedProject(prevProject => ({
            ...prevProject,
            graphs: prevProject.graphs.filter(g => g.id !== graph.id)
          }));

          // 更新项目列表中的对应项目
          setProjects(prevProjects => prevProjects.map(p => {
            if (p.id === selectedProject.id) {
              return {
                ...p,
                graphs: p.graphs.filter(g => g.id !== graph.id)
              };
            }
            return p;
          }));

          // 如果当前选中的图形被删除，重置选中状态
          if (selectedGraph && selectedGraph.id === graph.id) {
            setSelectedGraph(null);
          }

          openDialog({
            title: 'Success',
            message: result.message,
            confirmText: 'OK',
            onConfirm: closeDialog,
            onCancel: closeDialog
          });
        } catch (error) {
          openDialog({
            title: 'Error',
            message: 'Failed to delete graph. Please try again.',
            confirmText: 'OK',
            onConfirm: closeDialog,
            onCancel: closeDialog
          });
          console.error('Error deleting graph:', error);
        } finally {
          closeDialog();
        }
      },
      onCancel: closeDialog
    });
  };

  const handleContextMenu = (e, type, item) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      type,
      item
    });
  };

  const closeContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, type: '', item: null });
  };

  const openDialog = (options) => {
    setDialog({
      visible: true,
      title: options.title || '',
      message: options.message || '',
      onConfirm: options.onConfirm || null,
      onCancel: options.onCancel || (() => setDialog({ ...dialog, visible: false })),
      confirmText: options.confirmText || 'Confirm',
      cancelText: options.cancelText || 'Cancel',
      confirmVariant: options.confirmVariant || 'primary'
    });
  };

  const closeDialog = () => {
    setDialog({ ...dialog, visible: false });
  };

  useEffect(() => {
    if (selectedProject && selectedGraph) {
      const graphData = selectedProject.graphs?.find(g => g.id === selectedGraph.id);
      if (graphData) {
        setNodes(graphData.nodes || []);
        setEdges(graphData.edges || []);
        // 初始化上次保存的nodes和edges
        setLastSavedNodes(graphData.nodes || []);
        setLastSavedEdges(graphData.edges || []);
      }
    }
  }, [selectedProject, selectedGraph]);

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
    // 更新路由
    navigate(`/integration/${project.id}`);
  };

  const handleNodeClick = (event, node) => {
    setSelectedNode(node);
    console.log('Node clicked:', node);
    const updatedNodes = nodes.map(n => ({
      ...n,
      className: `graph-node ${n.data.type || 'input'} ${n.id === node.id ? 'selected' : ''}`
    }));
    setNodes(updatedNodes);
    // 更新路由
    if (selectedProject && selectedGraph) {
      navigate(`/integration/${selectedProject.id}/${selectedGraph.id}/${node.id}`);
    }
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
        applications: [],
        externalLinks: [],
        questionLinks: []
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

    setNodes(updatedNodes);
    setEdges(updatedEdges);
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNode(null);
    }
  };

  // 获取所有graph中的所有节点
  const getAllNodes = () => {
    let allNodes = [];
    projects.forEach(project => {
      project.graphs?.forEach(graph => {
        if (graph.nodes) {
          allNodes = [...allNodes, ...graph.nodes];
        }
      });
    });
    return allNodes;
  };

  const handleAddRequisition = () => {
    if (selectedNode) {
      const targetNodeId = newRequisition.nodeId;
      const allNodes = getAllNodes();
      const targetNode = allNodes.find(n => n.id === targetNodeId);
      if (!targetNode) {
        openDialog({
          title: 'Error',
          message: 'Target node not found',
          confirmText: 'OK',
          onConfirm: closeDialog,
          onCancel: closeDialog
        });
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
        } else if (node.id === targetNodeId && nodes.some(n => n.id === targetNodeId)) {
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
      // 更新selectedNode为最新的节点数据
      if (selectedNode) {
        const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);
        if (updatedSelectedNode) {
          setSelectedNode(updatedSelectedNode);
        }
      }
      setNewRequisition({ projectId: '', graphId: '', nodeId: '' });
      setShowRequisitionForm(false);
    }
  };

  const handleDeleteRequisition = (requisitionId) => {
    if (selectedNode) {
      const allNodes = getAllNodes();
      const targetNode = allNodes.find(n => n.id === requisitionId);

      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              prerequisites: (node.data.prerequisites || []).filter(id => id !== requisitionId)
            }
          };
        } else if (targetNode && node.id === requisitionId && nodes.some(n => n.id === requisitionId)) {
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
      // 更新selectedNode为最新的节点数据
      if (selectedNode) {
        const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);
        if (updatedSelectedNode) {
          setSelectedNode(updatedSelectedNode);
        }
      }
    }
  };

  const handleAddApplication = () => {
    if (selectedNode) {
      const targetNodeId = newApplication.nodeId;
      const allNodes = getAllNodes();
      const targetNode = allNodes.find(n => n.id === targetNodeId);
      if (!targetNode) {
        openDialog({
          title: 'Error',
          message: 'Target node not found',
          confirmText: 'OK',
          onConfirm: closeDialog,
          onCancel: closeDialog
        });
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
        } else if (node.id === targetNodeId && nodes.some(n => n.id === targetNodeId)) {
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
      // 更新selectedNode为最新的节点数据
      if (selectedNode) {
        const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);
        if (updatedSelectedNode) {
          setSelectedNode(updatedSelectedNode);
        }
      }
      setNewApplication({ projectId: '', graphId: '', nodeId: '' });
      setShowApplicationForm(false);
    }
  };

  const handleDeleteApplication = (applicationId) => {
    if (selectedNode) {
      const allNodes = getAllNodes();
      const targetNode = allNodes.find(n => n.id === applicationId);

      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              applications: (node.data.applications || []).filter(id => id !== applicationId)
            }
          };
        } else if (targetNode && node.id === applicationId && nodes.some(n => n.id === applicationId)) {
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
      // 更新selectedNode为最新的节点数据
      if (selectedNode) {
        const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);
        if (updatedSelectedNode) {
          setSelectedNode(updatedSelectedNode);
        }
      }
    }
  };

  const handleAddExternalLink = async (link) => {
    if (selectedNode) {
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              externalLinks: [...(node.data.externalLinks || []), link]
            }
          };
        }
        return node;
      });
      setNodes(updatedNodes);
      // 更新selectedNode为最新的节点数据
      if (selectedNode) {
        const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);
        if (updatedSelectedNode) {
          setSelectedNode(updatedSelectedNode);
        }
      }
      // 更新selectedProject状态中的对应节点数据
      if (selectedProject && selectedGraph) {
        const updatedProjects = projects.map(project => {
          if (project.id === selectedProject.id) {
            return {
              ...project,
              graphs: project.graphs.map(graph => {
                if (graph.id === selectedGraph.id) {
                  return {
                    ...graph,
                    nodes: updatedNodes
                  };
                }
                return graph;
              })
            };
          }
          return project;
        });
        setProjects(updatedProjects);
        // 立即保存到服务器
        try {
          const response = await axios.put(`${API_BASE}/project/${selectedProject.id}/graph/${selectedGraph.id}`, {
            nodes: updatedNodes,
            edges
          });
          // 更新projects状态以确保与服务器保持一致
          setProjects(projects.map(project =>
            project.id === selectedProject.id ? response.data.project : project
          ));
        } catch (error) {
          console.error('Error saving external link:', error);
        }
      }
    }
  };

  const handleDeleteExternalLink = async (linkIndex) => {
    if (selectedNode) {
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              externalLinks: (node.data.externalLinks || []).filter((_, index) => index !== linkIndex)
            }
          };
        }
        return node;
      });
      setNodes(updatedNodes);
      // 更新selectedNode为最新的节点数据
      if (selectedNode) {
        const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);
        if (updatedSelectedNode) {
          setSelectedNode(updatedSelectedNode);
        }
      }
      // 更新selectedProject状态中的对应节点数据
      if (selectedProject && selectedGraph) {
        const updatedProjects = projects.map(project => {
          if (project.id === selectedProject.id) {
            return {
              ...project,
              graphs: project.graphs.map(graph => {
                if (graph.id === selectedGraph.id) {
                  return {
                    ...graph,
                    nodes: updatedNodes
                  };
                }
                return graph;
              })
            };
          }
          return project;
        });
        setProjects(updatedProjects);
        // 立即保存到服务器
        try {
          const response = await axios.put(`${API_BASE}/project/${selectedProject.id}/graph/${selectedGraph.id}`, {
            nodes: updatedNodes,
            edges
          });
          // 更新projects状态以确保与服务器保持一致
          setProjects(projects.map(project =>
            project.id === selectedProject.id ? response.data.project : project
          ));
        } catch (error) {
          console.error('Error saving external link:', error);
        }
      }
    }
  };

  const handleViewExternalLink = (link) => {
    setSelectedExternalLink(link);
    openDialog({
      title: 'External Link Details',
      message: `Content: ${link.contentName}`,
      confirmText: 'OK',
      onConfirm: closeDialog,
      onCancel: closeDialog
    });
  };

  const handleAddQuestionLink = async () => {
    if (selectedNode) {
      const questionIds = newQuestionLink.selectAll ?
        newQuestionLink.practiceId ?
          practiceProjects
            .find(p => p.id === newQuestionLink.projectId)
            ?.practices
            ?.find(p => p.id === newQuestionLink.practiceId)
            ?.questions
            ?.map(q => q.id) || []
        : []
        : newQuestionLink.questionIds;

      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              questionLinks: [...(node.data.questionLinks || []), ...questionIds]
            }
          };
        }
        return node;
      });

      const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);

      setNodes(updatedNodes);
      setSelectedNode(updatedSelectedNode);

      // 更新问题的关联节点
      for (const questionId of questionIds) {
        try {
          // 获取问题当前的关联节点
          const response = await axios.get(`/api/practice/question/${questionId}/nodes`);
          const currentNodes = response.data.nodes || [];

          // 添加当前节点到问题的关联节点列表
          const updatedQuestionNodes = [...currentNodes, selectedNode.id];

          // 更新问题的关联节点
          await axios.put(`/api/practice/question/${questionId}/nodes`, {
            nodes: updatedQuestionNodes
          });
        } catch (error) {
          console.error(`Error updating question nodes for ${questionId}:`, error);
        }
      }

      // 重新加载 practiceProjects 以更新 questionMap
      loadPracticeProjects();

      setNewQuestionLink({ projectId: '', practiceId: '', questionIds: [], selectAll: false });
      setShowQuestionLinkForm(false);
    }
  };

  const handleDeleteQuestionLink = async (questionId) => {
    if (selectedNode) {
      const updatedNodes = nodes.map(node => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              questionLinks: (node.data.questionLinks || []).filter(id => id !== questionId)
            }
          };
        }
        return node;
      });

      const updatedSelectedNode = updatedNodes.find(node => node.id === selectedNode.id);

      setNodes(updatedNodes);
      setSelectedNode(updatedSelectedNode);

      // 从问题的关联节点中移除当前节点
      try {
        // 获取问题当前的关联节点
        const response = await axios.get(`/api/practice/question/${questionId}/nodes`);
        const currentNodes = response.data.nodes || [];

        // 从问题的关联节点列表中移除当前节点
        const updatedQuestionNodes = currentNodes.filter(nodeId => nodeId !== selectedNode.id);

        // 更新问题的关联节点
        await axios.put(`/api/practice/question/${questionId}/nodes`, {
          nodes: updatedQuestionNodes
        });
      } catch (error) {
        console.error(`Error updating question nodes for ${questionId}:`, error);
      }

      // 重新加载 practiceProjects 以更新 questionMap
      loadPracticeProjects();
    }
  };

  const handleViewQuestionLink = (questionId) => {
    // 查找题目所在的项目和练习
    let targetProject = null;
    let targetPractice = null;
    let question = null;
    
    for (const project of practiceProjects) {
      for (const practice of project.practices || []) {
        const foundQuestion = practice.questions?.find(q => q.id === questionId);
        if (foundQuestion) {
          targetProject = project;
          targetPractice = practice;
          question = foundQuestion;
          break;
        }
      }
      if (question) break;
    }

    if (targetProject && targetPractice) {
      // 跳转到create mode下对应的问题
      navigate(`/practice/creator/${targetProject.id}/${targetPractice.id}`);
    }
  };

  const handleNodeClickFromList = (nodeId) => {
    // 首先在当前nodes中查找
    let targetNode = nodes.find(n => n.id === nodeId);

    if (targetNode) {
      // 选中节点并突出显示
      const updatedNodes = nodes.map(node => ({
        ...node,
        className: `graph-node ${node.data.type || 'input'} ${node.id === nodeId ? 'selected' : ''}`
      }));
      setNodes(updatedNodes);
      setSelectedNode(targetNode);
      // 更新路由
      if (selectedProject && selectedGraph) {
        navigate(`/integration/${selectedProject.id}/${selectedGraph.id}/${nodeId}`);
      }
    } else {
      // 如果在当前nodes中找不到，说明是来自其他graph的节点
      // 查找该节点所在的project和graph
      let targetProject = null;
      let targetGraph = null;

      for (const project of projects) {
        for (const graph of project.graphs || []) {
          if (graph.nodes && graph.nodes.some(node => node.id === nodeId)) {
            targetProject = project;
            targetGraph = graph;
            targetNode = graph.nodes.find(node => node.id === nodeId);
            break;
          }
        }
        if (targetProject) break;
      }

      if (targetProject && targetGraph && targetNode) {
        // 切换到目标project和graph
        setSelectedProject(targetProject);
        setSelectedGraph(targetGraph);
        // 这里不需要手动设置nodes和edges，因为useEffect会处理
        // 但是我们需要设置selectedNode，以便在切换后选中该节点
        setSelectedNode(targetNode);
        // 更新路由
        navigate(`/integration/${targetProject.id}/${targetGraph.id}/${nodeId}`);
      }
    }
  };

  return (
    <div className="integration-level">
      <div className="integration-header">
        <div className="header-left">
          <h2>Integration Level</h2>
          <div className="navigation-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/input" className="nav-link">Input Level</Link>
            <Link to="/practice/student" className="nav-link">Practice Level</Link>
          </div>
          <div className="user-status">
            {user ? `Logged in as: ${user.username}` : 'Not logged in'}
          </div>
        </div>
      </div>

      <div className="project-selection">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h3>Select Project</h3>
          <button className="create-btn" onClick={() => setShowProjectForm(true)}>
            New Project
          </button>
        </div>
        <div className="projects-list">
          {projects.map(project => (
            <div
              key={project.id}
              className={`project-item ${selectedProject?.id === project.id ? 'selected' : ''}`}
              onClick={() => handleProjectSelect(project)}
              onContextMenu={(e) => handleContextMenu(e, 'project', project)}
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
            <button className="create-btn" onClick={() => setShowGraphForm(true)}>
              New Graph
            </button>
          </div>
          <div className="graphs-list">
            {selectedProject.graphs?.map(graph => (
              <div
                key={graph.id}
                className={`graph-item ${selectedGraph?.id === graph.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedGraph(graph);
                  // 更新路由
                  navigate(`/integration/${selectedProject.id}/${graph.id}`);
                }}
                onContextMenu={(e) => handleContextMenu(e, 'graph', graph)}
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
              <GraphComponent
                nodes={nodes}
                setNodes={setNodes}
                edges={edges}
                setEdges={setEdges}
                selectedNode={selectedNode}
                setSelectedNode={setSelectedNode}
                onNodeClick={handleNodeClick}
                onEdgeDoubleClick={handleEdgeDoubleClick}
                setShowExternalLinkDialog={setShowExternalLinkDialog}
                handleDeleteExternalLink={handleDeleteExternalLink}
                handleViewExternalLink={handleViewExternalLink}
                setShowQuestionLinkForm={setShowQuestionLinkForm}
                handleDeleteQuestionLink={handleDeleteQuestionLink}
                handleViewQuestionLink={handleViewQuestionLink}
                practiceProjects={practiceProjects}
              />
            </div>

            <ManagementSection
              selectedNode={selectedNode}
              selectedProject={selectedProject}
              selectedGraph={selectedGraph}
              setShowRequisitionForm={setShowRequisitionForm}
              setNewRequisition={setNewRequisition}
              handleDeleteRequisition={handleDeleteRequisition}
              handleNodeClickFromList={handleNodeClickFromList}
              setShowMarkdownEditor={setShowMarkdownEditor}
              setNodeMarkdown={setNodeMarkdown}
              setShowApplicationForm={setShowApplicationForm}
              setNewApplication={setNewApplication}
              handleDeleteApplication={handleDeleteApplication}
              getAllNodes={getAllNodes}
            />
          </div>
        </div>
      )}

      <Forms
              showProjectForm={showProjectForm}
              setShowProjectForm={setShowProjectForm}
              newProject={newProject}
              setNewProject={setNewProject}
              handleCreateProject={handleCreateProject}
              showGraphForm={showGraphForm}
              setShowGraphForm={setShowGraphForm}
              newGraph={newGraph}
              setNewGraph={setNewGraph}
              handleCreateGraph={handleCreateGraph}
              showGraphEditForm={showGraphEditForm}
              setShowGraphEditForm={setShowGraphEditForm}
              editingGraph={editingGraph}
              setEditingGraph={setEditingGraph}
              handleUpdateGraph={handleUpdateGraph}
              showNodeForm={showNodeForm}
              setShowNodeForm={setShowNodeForm}
              editingNode={editingNode}
              setEditingNode={setEditingNode}
              newNode={newNode}
              setNewNode={setNewNode}
              handleAddNode={handleAddNode}
              handleUpdateNode={handleUpdateNode}
              showRequisitionForm={showRequisitionForm}
              setShowRequisitionForm={setShowRequisitionForm}
              newRequisition={newRequisition}
              setNewRequisition={setNewRequisition}
              handleAddRequisition={handleAddRequisition}
              showApplicationForm={showApplicationForm}
              setShowApplicationForm={setShowApplicationForm}
              newApplication={newApplication}
              setNewApplication={setNewApplication}
              handleAddApplication={handleAddApplication}
              showMarkdownEditor={showMarkdownEditor}
              setShowMarkdownEditor={setShowMarkdownEditor}
              nodeMarkdown={nodeMarkdown}
              setNodeMarkdown={setNodeMarkdown}
              selectedNode={selectedNode}
              nodes={nodes}
              setNodes={setNodes}
              setSelectedNode={setSelectedNode}
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={setShowDeleteConfirm}
              edgeToDelete={edgeToDelete}
              setEdgeToDelete={setEdgeToDelete}
              handleDeleteEdge={handleDeleteEdge}
              projects={projects}
              showExternalLinkDialog={showExternalLinkDialog}
              setShowExternalLinkDialog={setShowExternalLinkDialog}
              handleAddExternalLink={handleAddExternalLink}
              showQuestionLinkForm={showQuestionLinkForm}
              setShowQuestionLinkForm={setShowQuestionLinkForm}
              newQuestionLink={newQuestionLink}
              setNewQuestionLink={setNewQuestionLink}
              handleAddQuestionLink={handleAddQuestionLink}
              practiceProjects={practiceProjects}
            />

      <style>{styles}</style>

      {contextMenu.visible && (
        <div
          className="context-menu"
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 10000,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            borderRadius: '6px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.15)',
            padding: '8px 0'
          }}
          onClick={closeContextMenu}
        >
          {contextMenu.type === 'project' && (
            <>
              <div
                className="context-menu-item"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectEdit(contextMenu.item);
                }}
              >
                Edit
              </div>
              <div
                className="context-menu-item"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  color: '#f44336'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleProjectDelete(contextMenu.item);
                }}
              >
                Delete
              </div>
            </>
          )}
          {contextMenu.type === 'graph' && (
            <>
              <div
                className="context-menu-item"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGraphEdit(contextMenu.item);
                }}
              >
                Edit
              </div>
              <div
                className="context-menu-item"
                style={{
                  padding: '10px 20px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  color: '#f44336'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleGraphDelete(contextMenu.item);
                }}
              >
                Delete
              </div>
            </>
          )}
        </div>
      )}

      <Dialog
        visible={dialog.visible}
        title={dialog.title}
        message={dialog.message}
        onConfirm={dialog.onConfirm}
        onCancel={dialog.onCancel}
        confirmText={dialog.confirmText}
        cancelText={dialog.cancelText}
        confirmVariant={dialog.confirmVariant}
      />
    </div>
  );
};

export default IntegrationLevel;