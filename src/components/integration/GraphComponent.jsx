import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  useReactFlow
} from 'reactflow';
import 'reactflow/dist/style.css';

const GraphComponent = ({
  nodes,
  setNodes,
  edges,
  setEdges,
  selectedNode,
  setSelectedNode,
  onNodeClick,
  onEdgeDoubleClick,
  setShowExternalLinkDialog,
  handleDeleteExternalLink,
  handleViewExternalLink,
  setShowQuestionLinkForm,
  handleDeleteQuestionLink,
  handleViewQuestionLink,
  practiceProjects
}) => {
  const reactFlowInstance = useReactFlow();
  const [_, onNodesChange] = useNodesState(nodes);
  const [__, onEdgesChange] = useEdgesState(edges);

  // 创建题目 ID 到题目信息的映射，用于快速查找
  const questionMap = useMemo(() => {
    const map = new Map();
    for (const project of practiceProjects) {
      for (const practice of project.practices || []) {
        for (const question of practice.questions || []) {
          map.set(question.id, {
            ...question,
            practiceName: practice.name,
            projectName: project.name
          });
        }
      }
    }
    console.log('Question map created with', map.size, 'questions');
    console.log('Practice projects:', practiceProjects);
    return map;
  }, [practiceProjects]);

  const onConnect = useCallback((params) => {
    setEdges((eds) => addEdge({
      ...params,
      className: 'graph-edge'
    }, eds));
  }, [setEdges]);

  return (
    <div className="graph-section">
      <div className="graph-container">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onEdgeDoubleClick={onEdgeDoubleClick}
          connectionLineType={ConnectionLineType.Bezier}
          minZoom={0.5}
          maxZoom={2}
        >
          <Background variant="dots" gap={12} size={1} />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
      {selectedNode && (
        <div className="external-links-section">
          <div className="external-links-header">
            <h4>External Links</h4>
            <button
              className="control-btn"
              onClick={() => setShowExternalLinkDialog(true)}
            >
              Add External Link
            </button>
          </div>
          {selectedNode.data.externalLinks && selectedNode.data.externalLinks.length > 0 ? (
            <div className="external-links-list">
              {selectedNode.data.externalLinks.map((link, index) => (
                <div key={index} className="external-link-item">
                  <span
                    className="link-name"
                    onClick={() => {
                      window.location.href = `/input/${link.projectId}/${link.directoryId}/${link.contentId}`;
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleViewExternalLink(link);
                    }}
                  >
                    {link.contentName}
                  </span>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => handleDeleteExternalLink(index)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-links">No external links</p>
          )}

          <div className="question-links-header" style={{ marginTop: '20px', borderTop: '1px solid #ddd', paddingTop: '10px' }}>
            <h4>Question Links</h4>
            <button
              className="control-btn"
              onClick={() => setShowQuestionLinkForm(true)}
            >
              Add Question Links
            </button>
          </div>
          {selectedNode.data.questionLinks && selectedNode.data.questionLinks.length > 0 ? (
            <div className="question-links-list">
              {selectedNode.data.questionLinks.map((questionId, index) => {
                const question = questionMap.get(questionId);
                return (
                  <div key={index} className="question-link-item">
                    <span
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => handleViewQuestionLink(questionId)}
                    >
                      {question?.question || `Question ${questionId}`}
                    </span>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => handleDeleteQuestionLink(questionId)}
                    >
                      Delete
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="no-links">No question links</p>
          )}
        </div>
      )}
    </div>
  );
};

export default GraphComponent;