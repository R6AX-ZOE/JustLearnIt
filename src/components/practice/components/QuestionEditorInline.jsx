import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState
} from 'reactflow';
import 'reactflow/dist/style.css';

const QuestionEditorInline = ({
  question,
  index,
  onSave,
  onCancel,
  onDelete,
  onInsertBelow
}) => {
  const [formData, setFormData] = useState({
    id: question.id,
    type: question.type || 'multiple-choice',
    question: question.question || '',
    options: question.options || ['', '', '', ''],
    correctAnswer: question.correctAnswer || '',
    responseFunction: question.responseFunction || '',
    nodes: question.nodes || []
  });
  const [integrationProjects, setIntegrationProjects] = useState([]);
  const [showNodeSelection, setShowNodeSelection] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [isWideScreen, setIsWideScreen] = useState(window.innerWidth >= 768);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedGraphId, setSelectedGraphId] = useState(null);
  const [graphCollapsed, setGraphCollapsed] = useState(false);
  const [reactFlowNodes, setReactFlowNodes] = useState([]);
  const [reactFlowEdges, setReactFlowEdges] = useState([]);
  const [_, onNodesChange] = useNodesState(reactFlowNodes);
  const [__, onEdgesChange] = useEdgesState(reactFlowEdges);
  const nodeSelectionRef = useRef(null);

  useEffect(() => {
    setFormData({
      id: question.id,
      type: question.type || 'multiple-choice',
      question: question.question || '',
      options: question.options || ['', '', '', ''],
      correctAnswer: question.correctAnswer || '',
      responseFunction: question.responseFunction || '',
      nodes: question.nodes || []
    });
  }, [question]);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // 计算 selectedProject 和 selectedGraph
    const project = integrationProjects.find(p => p.id === selectedProjectId);
    const graph = project?.graphs?.find(g => g.id === selectedGraphId);
    
    if (graph) {
      // 转换节点数据为 ReactFlow 格式
      const nodes = graph.nodes?.map(node => ({
        id: node.id,
        position: node.position,
        data: {
          label: node.data.label,
          type: node.data.type
        },
        style: {
          background: selectedNodes.includes(node.id) ? 'var(--accent-bg)' : 'var(--bg)',
          border: selectedNodes.includes(node.id) ? '2px solid var(--accent)' : '1px solid var(--border)',
          borderRadius: '4px',
          padding: '10px',
          fontSize: '12px',
          color: selectedNodes.includes(node.id) ? 'var(--accent)' : 'var(--text)'
        },
        className: selectedNodes.includes(node.id) ? 'selected' : ''
      })) || [];

      // 转换边缘数据为 ReactFlow 格式
      const edges = graph.edges?.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: 'bezier',
        style: {
          stroke: 'var(--border)',
          strokeWidth: 2
        }
      })) || [];

      setReactFlowNodes(nodes);
      setReactFlowEdges(edges);
    }
  }, [integrationProjects, selectedProjectId, selectedGraphId, selectedNodes]);

  useEffect(() => {
    const loadIntegrationProjects = async () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          const response = await axios.get(`/api/integration/projects/${user.id}`);
          setIntegrationProjects(response.data.projects);
        }
      } catch (error) {
        console.error('Error loading integration projects:', error);
      }
    };

    loadIntegrationProjects();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (nodeSelectionRef.current && !nodeSelectionRef.current.contains(event.target)) {
        setShowNodeSelection(false);
      }
    };

    if (showNodeSelection) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNodeSelection]);

  const handleTypeChange = (type) => {
    setFormData({ ...formData, type });
  };

  const handleQuestionChange = (questionText) => {
    setFormData({ ...formData, question: questionText });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectAnswerChange = (answer) => {
    setFormData({ ...formData, correctAnswer: answer });
  };

  const handleResponseFunctionChange = (responseFunction) => {
    setFormData({ ...formData, responseFunction });
  };

  const handleNodeToggle = (nodeId) => {
    setSelectedNodes(prev => {
      if (prev.includes(nodeId)) {
        return prev.filter(id => id !== nodeId);
      } else {
        return [...prev, nodeId];
      }
    });
  };

  const handleNodesSave = () => {
    setFormData({ ...formData, nodes: selectedNodes });
    setShowNodeSelection(false);
  };

  const handleOpenNodeSelection = () => {
    setSelectedNodes([...formData.nodes]);
    setSelectedProjectId(integrationProjects.length > 0 ? integrationProjects[0].id : null);
    setSelectedGraphId(null);
    setGraphCollapsed(false);
    setShowNodeSelection(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Updating question nodes:', question.id, 'with nodes:', formData.nodes);
      const response = await axios.put(`/api/practice/question/${question.id}/nodes`, {
        nodes: formData.nodes
      });
      console.log('Question nodes updated successfully:', response.data);
    } catch (error) {
      console.error('Error updating question nodes:', error);
    }
    onSave(formData);
  };

  const selectedProject = integrationProjects.find(p => p.id === selectedProjectId);
  const selectedGraph = selectedProject?.graphs?.find(g => g.id === selectedGraphId);

  const getNodeDisplayInfo = (nodeId) => {
    for (const project of integrationProjects) {
      for (const graph of project.graphs || []) {
        const node = graph.nodes?.find(n => n.id === nodeId);
        if (node) {
          return { ...node, projectName: project.name, graphName: graph.name };
        }
      }
    }
    return null;
  };

  return (
    <div className="question-editor-inline">
      <div className="editor-header">
        <h4>Question {index + 1}</h4>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onDelete(question.id)}
        >
          Delete
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Question Type</label>
          <select
            value={formData.type}
            onChange={(e) => handleTypeChange(e.target.value)}
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="fill-blank">Fill in the Blank</option>
            <option value="essay">Essay</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Question</label>
          <textarea
            value={formData.question}
            onChange={(e) => handleQuestionChange(e.target.value)}
            required
            rows={3}
          />
        </div>
        
        {formData.type === 'multiple-choice' && (
          <div className="form-group">
            <label>Options</label>
            {formData.options.map((option, idx) => (
              <div key={idx} className="option-input">
                <span className="option-label">{String.fromCharCode(65 + idx)}.</span>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                />
              </div>
            ))}
          </div>
        )}
        
        {formData.type !== 'essay' && (
          <div className="form-group">
            <label>Correct Answer</label>
            {formData.type === 'multiple-choice' ? (
              <select
                value={formData.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(e.target.value)}
              >
                <option value="">Select</option>
                {formData.options.map((option, index) => (
                  <option key={index} value={String.fromCharCode(65 + index)}>
                    {String.fromCharCode(65 + index)}. {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={formData.correctAnswer}
                onChange={(e) => handleCorrectAnswerChange(e.target.value)}
                required
              />
            )}
          </div>
        )}
        

        <div className="form-group">
          <label>Response Function (JavaScript, supports Markdown and KaTeX)</label>
          <textarea
            value={formData.responseFunction}
            onChange={(e) => handleResponseFunctionChange(e.target.value)}
            rows={4}
            placeholder="return isCorrect ? 'Correct!' : 'Incorrect!' ;"
          />
          <small className="form-text">
            Available variables: question, answer, isCorrect, Math
          </small>
        </div>
        
        <div className="form-group">
          <label>Linked Nodes</label>
          <div className="nodes-container">
            {formData.nodes.length > 0 ? (
              <ul className="linked-nodes-list">
                {formData.nodes.map((nodeId) => {
                  const nodeInfo = getNodeDisplayInfo(nodeId);
                  return (
                    <li key={nodeId} className="linked-node-item">
                      {nodeInfo ? `${nodeInfo.data.label} (${nodeInfo.projectName} / ${nodeInfo.graphName})` : `Node ${nodeId}`}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="no-nodes">No linked nodes</p>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleOpenNodeSelection}
            >
              Manage Linked Nodes
            </button>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onInsertBelow}>
            Insert Question Below
          </button>
          <button type="submit" className="btn btn-primary">
            Save
          </button>
        </div>
      </form>
      
      {showNodeSelection && (
        <div className="node-selection-overlay" ref={nodeSelectionRef}>
          <div className={`node-selection-dialog ${isWideScreen ? 'wide-screen' : 'narrow-screen'}`}>
            <div className="dialog-header">
              <h4>Select Nodes</h4>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowNodeSelection(false)}
              >
                ×
              </button>
            </div>
            
            {isWideScreen ? (
              <div className="dialog-content wide-layout">
                <div className="selection-panels">
                  <div className="project-panel">
                    <h5>Projects</h5>
                    <ul className="selection-list">
                      {integrationProjects.map(project => (
                        <li
                          key={project.id}
                          className={selectedProjectId === project.id ? 'selected' : ''}
                          onClick={() => {
                            setSelectedProjectId(project.id);
                            setSelectedGraphId(null);
                          }}
                        >
                          {project.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="graph-panel">
                    <h5>Graphs</h5>
                    <ul className="selection-list">
                      {selectedProject?.graphs?.map(graph => (
                        <li
                          key={graph.id}
                          className={selectedGraphId === graph.id ? 'selected' : ''}
                          onClick={() => setSelectedGraphId(graph.id)}
                        >
                          {graph.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                {selectedGraph && (
                  <div className="selected-graph-preview">
                    <h5>Selected Graph: {selectedGraph.name}</h5>
                    <div className="graph-visualization">
                      <ReactFlow
                        nodes={reactFlowNodes}
                        edges={reactFlowEdges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={(event, node) => handleNodeToggle(node.id)}
                        minZoom={0.5}
                        maxZoom={2}
                      >
                        <Background variant="dots" gap={12} size={1} />
                        <Controls />
                      </ReactFlow>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="dialog-content narrow-layout">
                {!graphCollapsed ? (
                  <>
                    <div className="project-list">
                      <h5>Projects</h5>
                      <ul className="selection-list">
                        {integrationProjects.map(project => (
                          <li
                            key={project.id}
                            className={selectedProjectId === project.id ? 'selected' : ''}
                            onClick={() => {
                              setSelectedProjectId(project.id);
                              setSelectedGraphId(null);
                            }}
                          >
                            {project.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="graph-list">
                      <h5>Graphs</h5>
                      <ul className="selection-list">
                        {selectedProject?.graphs?.map(graph => (
                          <li
                            key={graph.id}
                            className={selectedGraphId === graph.id ? 'selected' : ''}
                            onClick={() => setSelectedGraphId(graph.id)}
                          >
                            {graph.name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="selected-graph-preview">
                    <h5>Graph: {selectedGraph?.name}</h5>
                    <div className="graph-visualization">
                      <ReactFlow
                        nodes={reactFlowNodes}
                        edges={reactFlowEdges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={(event, node) => handleNodeToggle(node.id)}
                        minZoom={0.5}
                        maxZoom={2}
                      >
                        <Background variant="dots" gap={12} size={1} />
                        <Controls />
                      </ReactFlow>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="dialog-footer">
              {!isWideScreen && selectedGraphId && (
                <button
                  type="button"
                  className="btn btn-icon"
                  onClick={() => setGraphCollapsed(!graphCollapsed)}
                >
                  {graphCollapsed ? '▶' : '◀'}
                </button>
              )}
              <div className="footer-spacer"></div>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowNodeSelection(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleNodesSave}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionEditorInline;