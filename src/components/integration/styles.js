const styles = `
  .integration-level {
    padding: 20px;
    max-width: 1400px;
    margin: 0 auto;
    min-height: 80vh;
    background: var(--bg);
  }
  
  .integration-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--border);
  }
  
  .header-left h2 {
    margin: 0 0 15px 0;
    color: var(--text-h);
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
    background: var(--bg);
    transform: translateY(-1px);
  }
  
  .project-selection {
    margin-bottom: 30px;
  }
  
  .project-selection h3 {
    margin-bottom: 15px;
    color: var(--text-h);
  }
  
  .projects-list {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 10px 0;
    max-height: 200px;
    align-items: flex-start;
  }
  
  .project-item {
    flex: 0 0 250px;
    padding: 20px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }
  
  .project-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .project-item.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .project-item.selected h4,
  .project-item.selected p {
    color: white;
  }
  
  .project-item h4 {
    margin: 0 0 10px 0;
    color: var(--text-h);
  }
  
  .project-item p {
    margin: 0;
    color: var(--text);
    font-size: 14px;
  }
  
  .graph-selection h3 {
    margin-bottom: 15px;
    color: var(--text-h);
  }
  
  .graphs-list {
    display: flex;
    gap: 20px;
    overflow-x: auto;
    padding: 10px 0;
    max-height: 200px;
    align-items: flex-start;
  }
  
  .graph-item {
    flex: 0 0 250px;
    padding: 20px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
  }
  
  .graph-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .graph-item.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .graph-item.selected h4,
  .graph-item.selected p {
    color: white;
  }
  
  .graph-item h4 {
    margin: 0 0 10px 0;
    color: var(--text-h);
  }
  
  .graph-item p {
    margin: 0;
    color: var(--text);
    font-size: 14px;
  }
  
  .main-content {
    display: flex;
    gap: 20px;
    min-height: 600px;
  }
  
  .graph-section {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  
  .graph-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }
  
  .graph-header h3 {
    margin: 0;
    color: var(--text-h);
  }
  
  .graph-controls {
    display: flex;
    gap: 10px;
  }
  
  .control-btn {
    padding: 10px 20px;
    border: 1px solid var(--border);
    background: var(--bg);
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text);
    transition: all 0.2s ease;
  }
  
  .control-btn:hover {
    background: var(--bg);
    border-color: var(--accent);
    transform: translateY(-1px);
    box-shadow: var(--shadow);
  }
  
  .create-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .create-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .control-btn.delete-btn {
    background: var(--bg);
    border-color: #f44336;
    color: #f44336;
  }
  
  .control-btn.delete-btn:hover {
    background: var(--bg);
    border-color: #d32f2f;
    color: #d32f2f;
  }
  
  .graph-container {
    height: 400px;
  }
  
  .external-links-section {
    padding: 20px;
    border-top: 1px solid var(--border);
    background: var(--bg);
    text-align: left;
  }
  
  .external-links-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .external-links-header h4 {
    margin: 0;
    color: var(--text-h);
  }
  
  .external-links-list {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 15px;
    box-shadow: var(--shadow);
  }
  
  .external-link-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid var(--border);
  }
  
  .external-link-item:last-child {
    border-bottom: none;
  }
  
  .link-name {
    cursor: pointer;
    color: var(--accent);
    font-weight: 500;
  }
  
  .link-name:hover {
    text-decoration: underline;
  }
  
  .no-links {
    color: var(--text);
    text-align: center;
    margin: 0;
    padding: 20px;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: var(--shadow);
  }
  
  .management-section {
    width: 350px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
  .node-info-section,
  .prerequisites-section,
  .applications-section {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: var(--shadow);
    overflow: hidden;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border);
    background: var(--bg);
  }
  
  .section-header h3 {
    margin: 0;
    color: var(--text-h);
  }
  
  .node-info,
  .prerequisites-list,
  .applications-list {
    padding: 20px;
  }
  
  .node-info p {
    margin: 5px 0;
    color: var(--text);
  }
  
  .node-description {
    margin-top: 15px;
  }
  
  .node-description p {
    margin: 0 0 10px 0;
  }
  
  .description-content {
    background: var(--bg);
    border: 1px solid var(--border);
    padding: 15px;
    border-radius: 8px;
  }
  
  .no-description {
    color: var(--text);
    font-style: italic;
  }
  
  .prerequisite-item,
  .application-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }
  
  .prerequisite-item:last-child,
  .application-item:last-child {
    border-bottom: none;
  }
  
  .node-link-btn {
    background: none;
    border: none;
    color: var(--accent);
    cursor: pointer;
    text-decoration: underline;
    padding: 0;
    font-size: inherit;
  }
  
  .node-link-btn:hover {
    color: var(--accent);
    opacity: 0.8;
  }
  
  .action-btn {
    padding: 4px 8px;
    border: 1px solid var(--border);
    background: var(--bg);
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    color: var(--text);
    margin-left: 8px;
  }
  
  .action-btn.delete-btn {
    background: var(--bg);
    border-color: #f44336;
    color: #f44336;
  }
  
  .no-items {
    color: var(--text);
    text-align: center;
    margin: 0;
  }
  
  .add-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .add-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
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
    background: var(--bg);
    border: 1px solid var(--border);
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
    border-bottom: 1px solid var(--border);
  }
  
  .dialog-header h3 {
    margin: 0;
    color: var(--text-h);
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 28px;
    cursor: pointer;
    color: var(--text);
    line-height: 1;
  }
  
  .close-btn:hover {
    color: var(--text-h);
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
    color: var(--text);
    font-weight: 500;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 6px;
    font-size: 14px;
    background: var(--bg);
    color: var(--text);
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
  
  .project-selector {
    margin: 20px 0;
  }
  
  .project-selector h4 {
    margin: 0 0 10px 0;
    color: var(--text);
    font-size: 16px;
  }
  
  .directory-selector {
    margin: 20px 0;
  }
  
  .directory-selector h4 {
    margin: 0 0 10px 0;
    color: var(--text);
    font-size: 16px;
  }
  
  .directory-tree {
    border: 1px solid var(--border);
    border-radius: 6px;
    max-height: 300px;
    overflow-y: auto;
    padding: 10px;
    background: var(--bg);
  }
  
  .directory-tree-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    color: var(--text);
  }
  
  .directory-tree-item:hover {
    background: var(--bg);
    border-left: 3px solid var(--accent);
  }
  
  .directory-tree-item.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }
  
  .directory-tree-node {
    margin: 4px 0;
  }
  
  .folder-icon,
  .note-icon {
    font-size: 16px;
  }
  
  .folder-name,
  .note-name {
    flex: 1;
  }
  
  .content-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    user-select: none;
    color: var(--text);
  }
  
  .content-item:hover {
    background: var(--bg);
    border-left: 3px solid var(--accent);
  }
  
  .content-item.active {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
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
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transition: all 0.3s ease;
  }
  
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .btn-secondary {
    background: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
  }
  
  .btn-secondary:hover {
    background: var(--bg);
    border-color: var(--accent);
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
    .applications-section {
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
`;

export default styles;