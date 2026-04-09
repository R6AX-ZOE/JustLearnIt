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

const IntegrationLevel = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [requisitions, setRequisitions] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showNodeForm, setShowNodeForm] = useState(false);
  const [editingNode, setEditingNode] = useState(null);
  const [newNode, setNewNode] = useState({ title: '', type: 'input' });
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [newLink, setNewLink] = useState({ title: '', url: '', nodeIds: [] });
  const [showRequisitionForm, setShowRequisitionForm] = useState(false);
  const [newRequisition, setNewRequisition] = useState({ title: '' });

  // 模拟从后端获取项目数据
  useEffect(() => {
    // 这里应该从后端API获取数据
    // 模拟数据，实际项目中会从服务器获取
    const mockProjects = [
      { id: 1, name: 'Mathematics Fundamentals', description: 'Basic math concepts' },
      { id: 2, name: 'Physics Principles', description: 'Fundamental physics laws' },
      { id: 3, name: 'Computer Science Basics', description: 'Programming fundamentals' }
    ];
    setProjects(mockProjects);
  }, []);

  // 当选择项目时，生成对应的graph数据
  useEffect(() => {
    if (selectedProject) {
      // 模拟生成graph数据
      const mockNodes = [
        {
          id: '1',
          position: { x: 100, y: 100 },
          data: { label: 'Concept 1', type: 'input' },
          className: 'graph-node input'
        },
        {
          id: '2',
          position: { x: 300, y: 100 },
          data: { label: 'Concept 2', type: 'input' },
          className: 'graph-node input'
        },
        {
          id: '3',
          position: { x: 500, y: 100 },
          data: { label: 'Concept 3', type: 'input' },
          className: 'graph-node input'
        },
        {
          id: '4',
          position: { x: 300, y: 200 },
          data: { label: 'Relationship 1', type: 'connection' },
          className: 'graph-node connection'
        },
        {
          id: '5',
          position: { x: 300, y: 300 },
          data: { label: 'Concept 4', type: 'input' },
          className: 'graph-node input'
        },
        {
          id: '6',
          position: { x: 500, y: 300 },
          data: { label: 'Concept 5', type: 'input' },
          className: 'graph-node input'
        }
      ];
      
      const mockEdges = [
        {
          id: 'e1-4',
          source: '1',
          target: '4',
          className: 'graph-edge'
        },
        {
          id: 'e2-4',
          source: '2',
          target: '4',
          className: 'graph-edge'
        },
        {
          id: 'e4-5',
          source: '4',
          target: '5',
          className: 'graph-edge'
        },
        {
          id: 'e3-6',
          source: '3',
          target: '6',
          className: 'graph-edge'
        },
        {
          id: 'e5-6',
          source: '5',
          target: '6',
          className: 'graph-edge'
        }
      ];
      
      const mockExternalLinks = [
        { id: 1, title: 'External Resource 1', url: '#', nodeIds: ['1', '2'] },
        { id: 2, title: 'External Resource 2', url: '#', nodeIds: ['3'] },
        { id: 3, title: 'External Resource 3', url: '', nodeIds: ['4', '5', '6'] }
      ];
      
      const mockRequisitions = [
        { id: 1, title: 'Prerequisite 1' },
        { id: 2, title: 'Prerequisite 2' },
        { id: 3, title: 'Prerequisite 3' }
      ];
      
      setNodes(mockNodes);
      setEdges(mockEdges);
      setExternalLinks(mockExternalLinks);
      setRequisitions(mockRequisitions);
    }
  }, [selectedProject]);

  // 处理边的添加
  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      className: 'graph-edge'
    }, eds));
  }, []);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleNodeClick = (event, node) => {
    // 处理节点点击，实现graph导航
    setSelectedNode(node);
    console.log('Node clicked:', node);
  };

  // 添加节点
  const handleAddNode = () => {
    const newId = (nodes.length + 1).toString();
    const newNodeObj = {
      id: newId,
      position: { x: 100, y: 100 },
      data: { label: newNode.title, type: newNode.type },
      className: `graph-node ${newNode.type}`
    };
    setNodes([...nodes, newNodeObj]);
    setNewNode({ title: '', type: 'input' });
    setShowNodeForm(false);
  };

  // 编辑节点
  const handleEditNode = (node) => {
    setEditingNode(node);
    setNewNode({ title: node.data.label, type: node.data.type });
    setShowNodeForm(true);
  };

  // 更新节点
  const handleUpdateNode = () => {
    if (editingNode) {
      const updatedNodes = nodes.map(node => 
        node.id === editingNode.id 
          ? {
              ...node,
              data: { ...node.data, label: newNode.title, type: newNode.type },
              className: `graph-node ${newNode.type}`
            }
          : node
      );
      setNodes(updatedNodes);
      setEditingNode(null);
      setNewNode({ title: '', type: 'input' });
      setShowNodeForm(false);
    }
  };

  // 删除节点
  const handleDeleteNode = (nodeId) => {
    // 删除节点
    const updatedNodes = nodes.filter(node => node.id !== nodeId);
    // 删除与该节点相关的边
    const updatedEdges = edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId);
    // 更新外部链接
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

  // 添加外部链接
  const handleAddLink = () => {
    const newLinkObj = {
      id: externalLinks.length + 1,
      title: newLink.title,
      url: newLink.url,
      nodeIds: newLink.nodeIds
    };
    setExternalLinks([...externalLinks, newLinkObj]);
    setNewLink({ title: '', url: '', nodeIds: [] });
    setShowLinkForm(false);
  };

  // 编辑外部链接
  const handleEditLink = (link) => {
    setEditingLink(link);
    setNewLink({ title: link.title, url: link.url, nodeIds: [...link.nodeIds] });
    setShowLinkForm(true);
  };

  // 更新外部链接
  const handleUpdateLink = () => {
    if (editingLink) {
      const updatedLinks = externalLinks.map(link => 
        link.id === editingLink.id 
          ? { ...link, title: newLink.title, url: newLink.url, nodeIds: newLink.nodeIds }
          : link
      );
      setExternalLinks(updatedLinks);
      setEditingLink(null);
      setNewLink({ title: '', url: '', nodeIds: [] });
      setShowLinkForm(false);
    }
  };

  // 删除外部链接
  const handleDeleteLink = (linkId) => {
    setExternalLinks(externalLinks.filter(link => link.id !== linkId));
  };

  // 添加前置项
  const handleAddRequisition = () => {
    const newRequisitionObj = {
      id: requisitions.length + 1,
      title: newRequisition.title
    };
    setRequisitions([...requisitions, newRequisitionObj]);
    setNewRequisition({ title: '' });
    setShowRequisitionForm(false);
  };

  // 删除前置项
  const handleDeleteRequisition = (reqId) => {
    setRequisitions(requisitions.filter(req => req.id !== reqId));
  };

  // 过滤显示的外部链接（只显示焦点节点的链接）
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
        </div>
      </div>
      
      {/* 项目选择 */}
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
        <div className="integration-content">
          {/* 顶部Requisitions */}
          <div className="requisitions-section">
            <h3>Requisitions</h3>
            <div className="requisitions-container">
              {requisitions.map(req => (
                <div key={req.id} className="requisition-item">
                  {req.title}
                </div>
              ))}
            </div>
          </div>
          
          <div className="main-content">
            {/* 左侧Graph区域 */}
            <div className="graph-section">
              <div className="graph-header">
                <h3>Graph</h3>
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
            </div>
            
            {/* 右侧管理区域 */}
            <div className="management-section">
              {/* 焦点节点信息 */}
              {selectedNode && (
                <div className="node-info-section">
                  <h3>Node Info</h3>
                  <div className="node-info">
                    <p><strong>Label:</strong> {selectedNode.data.label}</p>
                    <p><strong>Type:</strong> {selectedNode.data.type}</p>
                  </div>
                </div>
              )}
              
              {/* 外部链接管理 */}
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
                          {link.url ? (
                            <a href={link.url} target="_blank" rel="noopener noreferrer">
                              {link.title}
                            </a>
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
          </div>
        </div>
      )}
      
      {/* 节点表单对话框 */}
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
      
      {/* 外部链接表单对话框 */}
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
                  <label>URL (optional)</label>
                  <input 
                    type="url" 
                    value={newLink.url}
                    onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                    placeholder="Enter external URL"
                  />
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
      
      {/* 前置项表单对话框 */}
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
                  <label>Title *</label>
                  <input 
                    type="text" 
                    value={newRequisition.title}
                    onChange={(e) => setNewRequisition({ title: e.target.value })}
                    required
                    placeholder="Enter requisition title"
                  />
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
        
        /* 项目选择 */
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
        
        /* Requisitions */
        .requisitions-section {
          margin-bottom: 20px;
        }
        
        .requisitions-section h3 {
          margin-bottom: 10px;
          color: #333;
        }
        
        .requisitions-container {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
        }
        
        .requisition-item {
          padding: 10px 16px;
          background: #ffebee;
          border-left: 4px solid #f44336;
          border-radius: 6px;
          color: #c62828;
          font-weight: 500;
        }
        
        /* 主内容区域 */
        .main-content {
          display: flex;
          gap: 20px;
          min-height: 600px;
        }
        
        /* Graph区域 */
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
        
        /* 管理区域 */
        .management-section {
          width: 350px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        /* 节点信息 */
        .node-info-section {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          padding: 20px;
        }
        
        .node-info-section h3 {
          margin: 0 0 15px 0;
          color: #333;
        }
        
        .node-info p {
          margin: 5px 0;
          color: #666;
        }
        
        /* 外部链接 */
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
        
        .add-btn {
          padding: 6px 12px;
          background: #e8f5e8;
          border: 1px solid #4caf50;
          border-radius: 4px;
          color: #2e7d32;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        .add-btn:hover {
          background: #c8e6c9;
        }
        
        .external-links-container {
          padding: 20px;
        }
        
        .external-link-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .external-link-item:hover {
          background: #e3f2fd;
        }
        
        .link-content a {
          text-decoration: none;
          color: #667eea;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .link-content a:hover {
          color: #764ba2;
          text-decoration: underline;
        }
        
        .link-content span {
          color: #666;
          font-weight: 500;
        }
        
        .link-actions {
          display: flex;
          gap: 5px;
        }
        
        .action-btn {
          padding: 4px 8px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 4px;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.2s ease;
        }
        
        .action-btn:hover {
          background: #f0f0f0;
        }
        
        .action-btn.delete-btn {
          background: #ffebee;
          border-color: #f44336;
          color: #c62828;
        }
        
        .action-btn.delete-btn:hover {
          background: #ffcdd2;
        }
        
        .no-links {
          color: #999;
          text-align: center;
          margin: 20px 0;
        }
        
        /* 对话框样式 */
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
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          width: 90%;
          max-width: 500px;
          max-height: 80vh;
          overflow-y: auto;
        }
        
        .dialog-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .dialog-header h3 {
          margin: 0;
          color: #333;
        }
        
        .close-btn {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #999;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s ease;
        }
        
        .close-btn:hover {
          background: #f0f0f0;
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
          transition: border-color 0.2s ease;
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1);
        }
        
        .node-selector {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: 200px;
          overflow-y: auto;
          border: 1px solid #ddd;
          border-radius: 6px;
          padding: 10px;
        }
        
        .node-checkbox {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
          transition: background 0.2s ease;
        }
        
        .node-checkbox:hover {
          background: #f8f9fa;
        }
        
        .form-actions {
          display: flex;
          gap: 10px;
          justify-content: flex-end;
          margin-top: 30px;
        }
        
        .btn {
          padding: 10px 20px;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }
        
        .btn-secondary {
          background: #f0f0f0;
          color: #666;
          border: 1px solid #ddd;
        }
        
        .btn-secondary:hover {
          background: #e0e0e0;
        }
        
        /* ReactFlow 自定义样式 */
        .graph-node {
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
          font-weight: 500;
          text-align: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .graph-node.input {
          background: #e8f5e8;
          border: 2px solid #4caf50;
        }
        
        .graph-node.connection {
          background: #fff3e0;
          border: 2px solid #ff9800;
        }
        
        .graph-edge {
          stroke: #667eea;
          stroke-width: 2;
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
          
          .navigation-links {
            width: 100%;
            justify-content: space-between;
          }
          
          .projects-list {
            flex-direction: column;
          }
          
          .project-item {
            flex: 1 1 100%;
          }
          
          .management-section {
            flex-direction: column;
          }
          
          .node-info-section,
          .external-links-section {
            width: 100%;
          }
          
          .graph-controls {
            flex-wrap: wrap;
            justify-content: flex-end;
          }
          
          .control-btn {
            font-size: 12px;
            padding: 4px 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default IntegrationLevel;