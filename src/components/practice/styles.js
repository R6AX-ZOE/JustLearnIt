export const styles = `
  .practice-level {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: var(--bg);
  }

  .practice-header {
    background-color: var(--bg);
    border-bottom: 1px solid var(--border);
    padding: 20px;
    box-shadow: var(--shadow);
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .header-right {
    display: flex;
    align-items: flex-start;
  }

  .mode-switcher {
    display: flex;
    gap: 10px;
  }

  .mode-btn {
    padding: 8px 16px;
    border: 1px solid var(--border);
    background-color: var(--bg);
    color: var(--text);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
  }

  .mode-btn:hover {
    border-color: var(--accent);
    color: var(--accent);
  }

  .mode-btn.active {
    background-color: var(--accent);
    color: white;
    border-color: var(--accent);
  }

  h2 {
    margin: 0;
    color: var(--text-h);
  }

  .navigation-links {
    display: flex;
    gap: 15px;
    margin: 10px 0;
  }

  .nav-link {
    color: var(--accent);
    text-decoration: none;
    font-size: 14px;
  }

  .nav-link:hover {
    text-decoration: underline;
  }

  .user-status {
    font-size: 14px;
    color: var(--text);
  }

  .practice-content {
    display: flex;
    flex: 1;
    gap: 20px;
    padding: 0 20px 20px;
  }

  .practice-sidebar {
    width: 300px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: var(--shadow);
    padding: 20px;
    overflow-y: auto;
  }

  .sidebar-section {
    margin-bottom: 30px;
  }

  .sidebar-section h3 {
    margin: 0 0 15px;
    color: var(--text-h);
    font-size: 16px;
    border-bottom: 1px solid var(--border);
    padding-bottom: 8px;
  }

  .projects-list, .practices-list, .questions-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .project-item, .practice-item, .question-item {
    padding: 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .project-item:hover, .practice-item:hover, .question-item:hover {
    background-color: var(--bg);
    border-left: 3px solid var(--accent);
  }

  .project-item.active, .practice-item.active, .question-item.active {
    background-color: var(--accent-bg);
    color: var(--accent);
  }

  .create-btn {
    padding: 10px;
    border: 1px dashed var(--border);
    background-color: var(--bg);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text);
    transition: all 0.2s;
  }

  .create-btn:hover {
    background-color: var(--bg);
    border-color: var(--accent);
    color: var(--accent);
  }

  .practice-main {
    flex: 1;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: var(--shadow);
    padding: 20px;
    overflow-y: auto;
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    color: var(--text);
  }

  .practice-interface {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .practice-header-info h3 {
    margin: 0;
    color: var(--text-h);
  }

  .practice-header-info p {
    margin: 5px 0 0;
    color: var(--text);
    font-size: 14px;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .question-header h4 {
    margin: 0;
    color: var(--text-h);
  }

  .question-content {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 20px;
    border-radius: 8px;
  }

  .question-content p {
    margin: 0 0 20px;
    color: var(--text);
    font-size: 16px;
  }

  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .option {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .option-label {
    font-weight: bold;
    min-width: 20px;
  }

  .fill-blank input {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 14px;
    background: var(--bg);
    color: var(--text);
  }

  .essay textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 14px;
    resize: vertical;
    background: var(--bg);
    color: var(--text);
  }

  .feedback {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
    font-size: 14px;
  }

  .feedback.correct {
    background-color: #e8f5e8;
    color: #2e7d32;
  }

  .feedback.incorrect {
    background-color: #ffebee;
    color: #c62828;
  }

  .submit-button-container {
    margin-top: 20px;
    display: flex;
    justify-content: flex-start;
  }

  .summary-page {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 20px;
    border-radius: 8px;
  }

  .summary-stats {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin: 20px 0;
  }

  .stat-item {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 15px;
    border-radius: 4px;
    box-shadow: var(--shadow);
    min-width: 150px;
  }

  .stat-label {
    display: block;
    font-size: 14px;
    color: var(--text);
    margin-bottom: 5px;
  }

  .stat-value {
    display: block;
    font-size: 24px;
    font-weight: bold;
    color: var(--text-h);
  }

  .summary-actions {
    margin: 20px 0;
  }

  .summary-details {
    margin-top: 30px;
  }

  .summary-details h4 {
    margin: 0 0 15px;
    color: var(--text-h);
  }

  .answers-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .answer-item {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 15px;
    border-radius: 4px;
    box-shadow: var(--shadow);
  }

  .answer-header {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    margin-bottom: 10px;
  }

  .answer-number {
    font-weight: bold;
    min-width: 40px;
    color: var(--text-h);
  }

  .answer-question {
    flex: 1;
    color: var(--text);
  }

  .answer-content {
    margin: 10px 0;
    padding-left: 50px;
  }

  .answer-label {
    font-weight: bold;
    margin-right: 10px;
    color: var(--text-h);
  }

  .answer-feedback {
    margin: 10px 0;
    padding-left: 50px;
  }

  .feedback-label {
    font-weight: bold;
    margin-right: 10px;
    color: var(--text-h);
  }

  .feedback-value {
    color: #2e7d32;
  }

  .feedback-value.correct {
    color: #2e7d32;
  }

  .feedback-value.incorrect {
    color: #c62828;
  }

  .questions-section {
    margin: 0;
    padding: 0;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .section-header h4 {
    margin: 0;
    color: var(--text-h);
  }

  .question-item-card {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .question-item-card:hover {
    border-color: var(--accent);
    box-shadow: var(--shadow);
  }

  .question-item-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .question-number {
    font-weight: bold;
    color: var(--accent);
  }

  .question-type {
    font-size: 12px;
    color: var(--text);
    background-color: var(--bg);
    padding: 2px 8px;
    border-radius: 4px;
  }

  .question-text {
    margin: 0;
    color: var(--text);
    font-size: 14px;
  }

  .question-editor-inline {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .editor-header h4 {
    margin: 0;
    color: var(--text-h);
  }

  .option-input {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
  }

  .option-input .option-label {
    min-width: 30px;
    font-weight: bold;
    color: var(--text-h);
  }

  .option-input input {
    flex: 1;
    padding: 8px;
    border: 1px solid var(--border);
    border-radius: 4px;
    background: var(--bg);
    color: var(--text);
    font-size: 14px;
  }

  .btn-danger {
    background-color: #c62828;
    color: white;
    border: none;
  }

  .btn-danger:hover {
    background-color: #b71c1c;
  }

  .inline-form {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 20px;
    border-radius: 8px;
  }

  .inline-form h4 {
    margin: 0 0 20px;
    color: var(--text-h);
  }

  .question-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.2s;
  }

  .btn-primary {
    background-color: var(--accent);
    color: white;
  }

  .btn-primary:hover {
    opacity: 0.9;
  }

  .btn-secondary {
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .btn-secondary:hover {
    background-color: var(--bg);
    border-color: var(--accent);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .modal-content {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 30px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
  }

  .modal-content h3 {
    margin: 0 0 20px;
    color: var(--text-h);
  }

  .form-group {
    margin-bottom: 15px;
  }

  .form-group label {
    display: block;
    margin-bottom: 5px;
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
  }

  .form-group input,
  .form-group textarea,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-size: 14px;
    background: var(--bg);
    color: var(--text);
  }

  .form-group textarea {
    resize: vertical;
    min-height: 80px;
  }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
  }

  .no-questions {
    text-align: center;
    color: var(--text);
    padding: 40px 0;
  }

  .context-menu {
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    box-shadow: var(--shadow);
    min-width: 120px;
  }

  .context-menu-item {
    padding: 8px 12px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text);
  }

  .context-menu-item:hover {
    background-color: var(--bg);
    border-left: 3px solid var(--accent);
  }

  .nodes-container {
    margin-bottom: 10px;
  }

  .linked-nodes-list {
    list-style: none;
    padding: 0;
    margin: 0 0 10px 0;
  }

  .linked-node-item {
    padding: 5px 10px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    margin-bottom: 5px;
    font-size: 14px;
  }

  .no-nodes {
    color: var(--text);
    font-size: 14px;
    margin: 0 0 10px 0;
    font-style: italic;
  }

  .node-selection-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .node-selection-dialog {
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    max-height: 90vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .node-selection-dialog.wide-screen {
    width: 800px;
    max-width: 90%;
  }

  .node-selection-dialog.narrow-screen {
    width: 95%;
    max-width: 400px;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border-bottom: 1px solid var(--border);
  }

  .dialog-header h4 {
    margin: 0;
    color: var(--text-h);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--text);
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-btn:hover {
    color: var(--text-h);
  }

  .dialog-content {
    padding: 20px;
    overflow-y: auto;
    flex: 1;
  }

  .dialog-content.wide-layout {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .selection-panels {
    display: flex;
    gap: 20px;
  }

  .project-panel,
  .graph-panel {
    flex: 1;
    min-width: 0;
  }

  .project-panel h5,
  .graph-panel h5 {
    margin: 0 0 10px;
    color: var(--text-h);
    font-size: 14px;
  }

  .selection-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 200px;
    overflow-y: auto;
    border: 1px solid var(--border);
    border-radius: 4px;
  }

  .selection-list li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid var(--border);
    transition: background-color 0.2s;
    font-size: 14px;
  }

  .selection-list li:last-child {
    border-bottom: none;
  }

  .selection-list li:hover {
    background-color: var(--bg);
  }

  .selection-list li.selected {
    background-color: var(--accent-bg);
    color: var(--accent);
  }

  .selected-graph-preview {
    border: 1px solid var(--border);
    border-radius: 4px;
    padding: 15px;
  }

  .selected-graph-preview h5 {
    margin: 0 0 15px;
    color: var(--text-h);
    font-size: 14px;
  }

  .node-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 10px;
  }

  .node-item {
    padding: 10px;
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
  }

  .node-item:hover {
    border-color: var(--accent);
    background-color: var(--bg);
  }

  .node-item.selected {
    border-color: var(--accent);
    background-color: var(--accent-bg);
    color: var(--accent);
  }

  .node-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .check-mark {
    color: var(--accent);
    font-weight: bold;
    margin-left: 5px;
  }

  .dialog-content.narrow-layout {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .dialog-content.narrow-layout .project-list,
  .dialog-content.narrow-layout .graph-list {
    max-height: 150px;
    overflow-y: auto;
  }

  .dialog-content.narrow-layout .selection-list {
    max-height: 120px;
  }

  .dialog-footer {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 15px 20px;
    border-top: 1px solid var(--border);
  }

  .footer-spacer {
    flex: 1;
  }

  .btn-icon {
    padding: 8px 12px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text);
  }

  .btn-icon:hover {
    background-color: var(--bg);
    border-color: var(--accent);
  }

  .linked-nodes-section {
    margin-top: 15px;
    padding: 10px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
  }

  .linked-nodes-section h5 {
    margin: 0 0 10px;
    color: var(--text-h);
    font-size: 14px;
  }

  .linked-nodes-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .linked-nodes-section li {
    padding: 5px 0;
    font-size: 14px;
    color: var(--text);
  }

  .graph-visualization {
    position: relative;
    width: 100%;
    height: 400px;
    border: 1px solid var(--border);
    border-radius: 4px;
    overflow: hidden;
    background-color: var(--bg);
  }

  .graph-visualization .react-flow__container {
    background-color: var(--bg);
  }

  .graph-visualization .react-flow__node {
    font-size: 12px;
    padding: 10px;
    border-radius: 4px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    color: var(--text);
  }

  .graph-visualization .react-flow__node.selected {
    background-color: var(--accent-bg);
    border: 2px solid var(--accent);
    color: var(--accent);
  }

  .graph-visualization .react-flow__edge-path {
    stroke: var(--border);
    stroke-width: 2;
  }
`;