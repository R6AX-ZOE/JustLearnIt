import React from 'react';
import MarkdownWithKaTeX from './MarkdownWithKaTeX';

const ManagementSection = ({
  selectedNode,
  selectedProject,
  selectedGraph,
  setShowRequisitionForm,
  setNewRequisition,
  handleDeleteRequisition,
  handleNodeClickFromList,
  setShowMarkdownEditor,
  setNodeMarkdown,
  setShowApplicationForm,
  setNewApplication,
  handleDeleteApplication,
  getAllNodes
}) => {
  return (
    <div className="management-section">
      {selectedNode && (
        <div className="prerequisites-section">
          <div className="section-header">
            <h3>Prerequisites</h3>
            <button
              className="control-btn"
              onClick={() => {
                setNewRequisition({
                  projectId: selectedProject?.id || '',
                  graphId: selectedGraph?.id || '',
                  nodeId: ''
                });
                setShowRequisitionForm(true);
              }}
            >
              Add
            </button>
          </div>
          <div className="prerequisites-list">
            {selectedNode?.data?.prerequisites?.length > 0 ? (
              selectedNode.data.prerequisites.map((prereqId, index) => {
                const prereqNode = getAllNodes().find(n => n.id === prereqId);
                return (
                  <div key={index} className="prerequisite-item">
                    <span
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => handleNodeClickFromList(prereqId)}
                    >
                      {prereqNode?.data?.label || `Node ${prereqId}`}
                    </span>
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
                  <MarkdownWithKaTeX source={selectedNode.data.description} />
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
              onClick={() => {
                setNewApplication({
                  projectId: selectedProject?.id || '',
                  graphId: selectedGraph?.id || '',
                  nodeId: ''
                });
                setShowApplicationForm(true);
              }}
            >
              Add
            </button>
          </div>
          <div className="applications-list">
            {selectedNode?.data?.applications?.length > 0 ? (
              selectedNode.data.applications.map((appId, index) => {
                const appNode = getAllNodes().find(n => n.id === appId);
                return (
                  <div key={index} className="application-item">
                    <span
                      style={{ cursor: 'pointer', textDecoration: 'underline' }}
                      onClick={() => handleNodeClickFromList(appId)}
                    >
                      {appNode?.data?.label || `Node ${appId}`}
                    </span>
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
  );
};

export default ManagementSection;