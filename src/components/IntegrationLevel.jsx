import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const IntegrationLevel = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [graphNodes, setGraphNodes] = useState([]);
  const [graphLinks, setGraphLinks] = useState([]);
  const [externalLinks, setExternalLinks] = useState([]);
  const [requisitions, setRequisitions] = useState([]);

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
        { id: 1, label: 'Concept 1', type: 'input' },
        { id: 2, label: 'Concept 2', type: 'input' },
        { id: 3, label: 'Concept 3', type: 'input' },
        { id: 4, label: 'Relationship 1', type: 'connection' },
        { id: 5, label: 'Concept 4', type: 'input' },
        { id: 6, label: 'Concept 5', type: 'input' }
      ];
      
      const mockLinks = [
        { source: 1, target: 4 },
        { source: 2, target: 4 },
        { source: 4, target: 5 },
        { source: 3, target: 6 },
        { source: 5, target: 6 }
      ];
      
      const mockExternalLinks = [
        { id: 1, title: 'External Resource 1', url: '#' },
        { id: 2, title: 'External Resource 2', url: '#' },
        { id: 3, title: 'External Resource 3', url: '#' }
      ];
      
      const mockRequisitions = [
        { id: 1, title: 'Prerequisite 1' },
        { id: 2, title: 'Prerequisite 2' },
        { id: 3, title: 'Prerequisite 3' }
      ];
      
      setGraphNodes(mockNodes);
      setGraphLinks(mockLinks);
      setExternalLinks(mockExternalLinks);
      setRequisitions(mockRequisitions);
    }
  }, [selectedProject]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleNodeClick = (node) => {
    // 处理节点点击，实现graph导航
    console.log('Node clicked:', node);
    // 这里可以实现节点的展开/收起，或者导航到节点详情
  };

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
                  <button className="control-btn">Zoom In</button>
                  <button className="control-btn">Zoom Out</button>
                  <button className="control-btn">Reset View</button>
                </div>
              </div>
              <div className="graph-container">
                <div className="graph-canvas">
                  {/* 简化的Graph可视化 */}
                  <div className="graph-visualization">
                    {graphNodes.map(node => (
                      <div 
                        key={node.id}
                        className={`graph-node ${node.type}`}
                        style={{
                          left: `${(node.id * 15) % 70 + 15}%`,
                          top: `${Math.floor(node.id / 2) * 20 + 10}%`
                        }}
                        onClick={() => handleNodeClick(node)}
                      >
                        {node.label}
                      </div>
                    ))}
                    {graphLinks.map((link, index) => (
                      <svg key={index} className="graph-link" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <line 
                          x1={`${(link.source * 15) % 70 + 20}%`}
                          y1={`${Math.floor(link.source / 2) * 20 + 20}%`}
                          x2={`${(link.target * 15) % 70 + 20}%`}
                          y2={`${Math.floor(link.target / 2) * 20 + 20}%`}
                          stroke="#667eea"
                          strokeWidth="2"
                        />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* 右侧External Links */}
            <div className="external-links-section">
              <h3>External Links</h3>
              <div className="external-links-container">
                {externalLinks.map(link => (
                  <div key={link.id} className="external-link-item">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      {link.title}
                    </a>
                  </div>
                ))}
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
        
        .graph-container {
          position: relative;
          height: 500px;
          overflow: auto;
        }
        
        .graph-canvas {
          position: relative;
          width: 100%;
          height: 100%;
          min-width: 800px;
          min-height: 600px;
        }
        
        .graph-visualization {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .graph-node {
          position: absolute;
          padding: 12px 16px;
          background: #e3f2fd;
          border: 2px solid #667eea;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 10;
          min-width: 100px;
          text-align: center;
        }
        
        .graph-node:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        
        .graph-node.input {
          background: #e8f5e8;
          border-color: #4caf50;
        }
        
        .graph-node.connection {
          background: #fff3e0;
          border-color: #ff9800;
        }
        
        .graph-link {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }
        
        /* External Links */
        .external-links-section {
          width: 300px;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow: hidden;
        }
        
        .external-links-section h3 {
          padding: 15px 20px;
          margin: 0;
          color: #333;
          border-bottom: 1px solid #e0e0e0;
          background: #f8f9fa;
        }
        
        .external-links-container {
          padding: 20px;
        }
        
        .external-link-item {
          margin-bottom: 15px;
          padding: 10px;
          background: #f8f9fa;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        
        .external-link-item:hover {
          background: #e3f2fd;
        }
        
        .external-link-item a {
          text-decoration: none;
          color: #667eea;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        
        .external-link-item a:hover {
          color: #764ba2;
          text-decoration: underline;
        }
        
        @media (max-width: 1200px) {
          .main-content {
            flex-direction: column;
          }
          
          .external-links-section {
            width: 100%;
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
        }
      `}</style>
    </div>
  );
};

export default IntegrationLevel;