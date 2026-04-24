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

  .practice-header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .practice-header-bar .header-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .practice-header-bar .header-left h3 {
    margin: 0;
    color: var(--text-h);
    font-size: 18px;
  }

  .question-counter {
    font-size: 14px;
    color: var(--text);
    background-color: var(--bg);
    padding: 4px 12px;
    border-radius: 12px;
  }

  .practice-header-bar .header-right {
    flex: 1;
    max-width: 300px;
    margin-left: 20px;
  }

  .progress-indicator {
    height: 8px;
    background-color: var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .stats-overview {
    display: flex;
    gap: 20px;
    margin-top: 30px;
  }

  .stat-card {
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px 40px;
    text-align: center;
  }

  .stat-number {
    font-size: 36px;
    font-weight: 700;
    color: var(--text-h);
  }

  .stat-label {
    font-size: 14px;
    color: var(--text);
    margin-top: 5px;
  }

  .empty-text {
    font-size: 14px;
    color: var(--text);
    padding: 10px 0;
    text-align: center;
  }

  .session-progress,
  .session-score {
    font-size: 12px;
    color: var(--text);
    margin-top: 4px;
  }

  .session-score {
    color: var(--accent);
    font-weight: 600;
  }

  .preview-info {
    padding: 10px 0;
  }

  .preview-info p {
    margin: 0 0 8px 0;
    color: var(--text);
    font-size: 14px;
  }

  .preview-info .btn {
    margin-top: 10px;
    margin-right: 5px;
  }

  /* Start Practice Menu Styles */
  .start-practice-btn {
    width: 100%;
    margin-bottom: 10px;
  }

  .practice-menu {
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: var(--shadow);
    margin-top: 10px;
    overflow: hidden;
  }

  .practice-menu.project-submenu {
    margin-top: 5px;
  }

  .menu-header {
    background-color: var(--bg);
    color: var(--text-h);
    padding: 12px 16px;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .menu-back {
    cursor: pointer;
    color: var(--accent);
    font-size: 14px;
  }

  .menu-back:hover {
    text-decoration: underline;
  }

  .menu-item {
    padding: 10px 16px;
    cursor: pointer;
    transition: background-color 0.2s;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .menu-item:hover {
    background-color: var(--bg);
    border-left: 3px solid var(--accent);
  }

  .menu-item-count {
    font-size: 12px;
    color: var(--text);
    background-color: var(--bg);
    padding: 2px 8px;
    border-radius: 10px;
  }

  .menu-empty {
    padding: 20px;
    text-align: center;
    color: var(--text);
    font-size: 14px;
  }

  /* Plugin Area Styles */
  .plugin-area {
    margin-top: 40px;
    padding: 20px;
    background-color: var(--bg);
    border: 1px dashed var(--border);
    border-radius: 8px;
  }

  .plugin-area h4 {
    margin: 0 0 15px 0;
    color: var(--text-h);
  }

  .plugin-content {
    text-align: center;
    color: var(--text);
    font-size: 14px;
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
    margin: 0 0 15px;
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

  .progress-bar {
    width: 100%;
    height: 8px;
    background-color: var(--border);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .progress-bar-fill {
    height: 100%;
    background-color: var(--accent);
    border-radius: 4px;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 14px;
    color: var(--text-h);
    font-weight: 500;
  }

  /* Student Home Styles */
  .practice-student-home {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }

  .practice-student-home.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 400px;
  }

  .loading-spinner {
    font-size: 18px;
    color: var(--text);
  }

  .start-practice-container {
    position: relative;
  }

  .btn-start-practice {
    padding: 10px 20px;
    font-size: 14px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-start-practice:hover {
    opacity: 0.9;
  }

  .practice-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    margin-top: 10px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: var(--shadow);
    min-width: 300px;
    max-height: 400px;
    overflow-y: auto;
    z-index: 100;
  }

  .dropdown-header {
    padding: 12px 16px;
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    color: var(--text-h);
  }

  .dropdown-empty {
    padding: 20px;
    text-align: center;
    color: var(--text);
  }

  .dropdown-project {
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
  }

  .dropdown-project:last-child {
    border-bottom: none;
  }

  .dropdown-project .project-name {
    font-weight: 600;
    color: var(--text-h);
    margin-bottom: 8px;
  }

  .dropdown-project .project-practices {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .dropdown-project .practice-item {
    padding: 8px 12px;
    background-color: var(--bg);
    border: none;
    border-radius: 4px;
    text-align: left;
    cursor: pointer;
    transition: background-color 0.2s;
    color: var(--text);
    font-size: 14px;
  }

  .dropdown-project .practice-item:hover {
    background-color: var(--bg);
    border-left: 3px solid var(--accent);
  }

  .dropdown-project .no-practices {
    font-size: 13px;
    color: var(--text);
    font-style: italic;
  }

  .preview-section {
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 30px;
    box-shadow: var(--shadow);
  }

  .preview-header {
    margin-bottom: 20px;
  }

  .preview-header h2 {
    margin: 0 0 8px 0;
    color: var(--text-h);
  }

  .preview-header p {
    margin: 0;
    color: var(--text);
  }

  .preview-content {
    display: grid;
    grid-template-columns: 250px 1fr;
    gap: 24px;
    margin-bottom: 20px;
  }

  .preview-sidebar h3,
  .preview-main h3 {
    margin: 0 0 12px 0;
    font-size: 16px;
    color: var(--text-h);
  }

  .question-list {
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px;
  }

  .question-list .question-item {
    display: flex;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid var(--border);
  }

  .question-list .question-item:last-child {
    border-bottom: none;
  }

  .question-list .question-number {
    color: var(--accent);
    font-weight: 600;
  }

  .question-list .question-preview {
    color: var(--text);
    font-size: 14px;
  }

  .more-questions {
    padding: 8px 0;
    color: var(--text);
    font-size: 13px;
    text-align: center;
  }

  .preview-main {
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 16px;
  }

  .preview-question-card {
    padding: 16px;
    background-color: var(--bg);
    border-radius: 6px;
    margin-bottom: 12px;
  }

  .preview-question-card:last-child {
    margin-bottom: 0;
  }

  .preview-question-card .question-type {
    font-size: 12px;
    color: var(--text);
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .preview-question-card .question-text {
    font-size: 15px;
    color: var(--text);
    margin-bottom: 12px;
  }

  .preview-question-card .question-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .preview-question-card .option-preview {
    font-size: 14px;
    color: var(--text);
    padding: 6px 10px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
  }

  .preview-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .btn-cancel {
    padding: 10px 20px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 4px;
    cursor: pointer;
    color: var(--text);
    font-size: 14px;
  }

  .btn-cancel:hover {
    background-color: var(--bg);
    border-color: var(--accent);
  }

  .btn-start {
    padding: 10px 24px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
  }

  .btn-start:hover {
    opacity: 0.9;
  }

  .home-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }

  .content-section h2 {
    margin: 0 0 16px 0;
    font-size: 22px;
    color: var(--text-h);
  }

  .session-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .session-card {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    box-shadow: var(--shadow);
  }

  .session-card.in-progress {
    border-left: 4px solid var(--accent);
  }

  .session-card.history {
    border-left: 4px solid #28a745;
  }

  .session-info h3 {
    margin: 0 0 8px 0;
    font-size: 17px;
    color: var(--text-h);
  }

  .session-meta {
    display: flex;
    gap: 20px;
    font-size: 14px;
    color: var(--text);
  }

  .btn-continue,
  .btn-view {
    padding: 8px 16px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    border: none;
    transition: all 0.2s;
  }

  .btn-continue {
    background-color: var(--accent);
    color: white;
  }

  .btn-continue:hover {
    opacity: 0.9;
  }

  .btn-view {
    background-color: #28a745;
    color: white;
  }

  .btn-view:hover {
    opacity: 0.9;
  }

  /* Practice Session Styles */
  .practice-session {
    min-height: 100vh;
  }

  .practice-session.loading,
  .practice-session.error {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .practice-session .error-message {
    background-color: var(--bg);
    border: 1px solid var(--border);
    padding: 40px;
    border-radius: 8px;
    text-align: center;
    box-shadow: var(--shadow);
  }

  .practice-session .error-message h2 {
    color: #c62828;
    margin-bottom: 16px;
  }

  .practice-session .error-message button {
    margin-top: 20px;
    padding: 10px 24px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .start-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    box-shadow: var(--shadow);
  }

  .start-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .start-header h1 {
    font-size: 32px;
    color: var(--text-h);
    margin: 0 0 12px 0;
  }

  .start-header .subtitle {
    font-size: 18px;
    color: var(--text);
    margin: 0;
  }

  .start-info {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 40px;
  }

  .info-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .info-icon {
    font-size: 36px;
  }

  .info-content h3 {
    margin: 0 0 4px 0;
    font-size: 18px;
    color: var(--text-h);
  }

  .info-content p {
    margin: 0;
    font-size: 14px;
    color: var(--text);
  }

  .start-actions {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  .btn-back {
    padding: 14px 28px;
    background-color: var(--bg);
    color: var(--text);
    text-decoration: none;
    border: 1px solid var(--border);
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-block;
    text-align: center;
  }

  .btn-back:hover {
    background-color: var(--bg);
    border-color: var(--accent);
  }

  .btn-begin {
    flex: 1;
    padding: 14px 28px;
    background-color: var(--accent);
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .btn-begin:hover {
    opacity: 0.9;
  }

  .practice-session.practice-mode {
    background-color: var(--bg);
  }

  .practice-session.practice-mode .practice-header {
    background-color: var(--bg);
    border-bottom: 1px solid var(--border);
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: var(--shadow);
  }

  .practice-session.practice-mode .header-left {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  .practice-session.practice-mode .header-left h2 {
    margin: 0;
    font-size: 22px;
    color: var(--text-h);
  }

  .practice-session.practice-mode .question-counter {
    font-size: 16px;
    color: var(--text);
    background-color: var(--bg);
    padding: 6px 14px;
    border-radius: 20px;
  }

  .practice-session.practice-mode .header-right {
    flex: 1;
    max-width: 300px;
    margin-left: 40px;
  }

  .practice-session.practice-mode .progress-indicator {
    height: 8px;
    background-color: var(--border);
    border-radius: 4px;
    overflow: hidden;
  }

  .practice-session.practice-mode .practice-content {
    padding: 40px;
    max-width: 900px;
    margin: 0 auto;
  }

  .end-container {
    max-width: 600px;
    margin: 0 auto;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    box-shadow: var(--shadow);
  }

  .end-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .end-header h1 {
    font-size: 36px;
    color: var(--text-h);
    margin: 0 0 12px 0;
  }

  .end-header .subtitle {
    font-size: 18px;
    color: var(--text);
    margin: 0;
  }

  .score-section {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 30px;
    padding: 30px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .score-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: var(--accent);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .score-value {
    font-size: 32px;
    font-weight: 700;
    color: white;
  }

  .score-details {
    flex: 1;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid var(--border);
  }

  .detail-item:last-child {
    border-bottom: none;
  }

  .detail-label {
    color: var(--text);
    font-size: 15px;
  }

  .detail-value {
    color: var(--text-h);
    font-weight: 600;
    font-size: 15px;
  }

  .end-message {
    text-align: center;
    margin-bottom: 30px;
  }

  .end-message .message {
    font-size: 20px;
    margin: 0;
    padding: 16px;
    border-radius: 8px;
  }

  .end-message .message.success {
    background-color: #e8f5e8;
    color: #2e7d32;
  }

  .end-message .message.good {
    background-color: #fff3cd;
    color: #856404;
  }

  .end-message .message.retry {
    background-color: #ffebee;
    color: #721c24;
  }

  .end-actions {
    display: flex;
    gap: 16px;
  }

  .btn-home,
  .btn-review {
    flex: 1;
    padding: 14px 24px;
    border-radius: 4px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-home {
    background-color: var(--bg);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .btn-home:hover {
    background-color: var(--bg);
    border-color: var(--accent);
  }

  .btn-review {
    background-color: var(--accent);
    color: white;
    border: none;
  }

  .btn-review:hover {
    opacity: 0.9;
  }

  .practice-session.start-page,
  .practice-session.end-page {
    background: linear-gradient(135deg, var(--accent) 0%, #764ba2 100%);
    padding: 40px 20px;
  }

  .practice-session.start-page .start-container,
  .practice-session.end-page .end-container {
    background-color: var(--bg);
    border: none;
  }

  /* Review Styles */
  .review-container {
    max-width: 900px;
    margin: 0 auto;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 40px;
    box-shadow: var(--shadow);
  }

  .review-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .review-header h2 {
    font-size: 32px;
    color: var(--text-h);
    margin: 16px 0 8px 0;
  }

  .review-header .subtitle {
    font-size: 18px;
    color: var(--text);
    margin: 0;
  }

  .btn-small {
    padding: 8px 16px;
    font-size: 14px;
  }

  .review-summary {
    display: flex;
    align-items: center;
    gap: 40px;
    margin-bottom: 40px;
    padding: 30px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .review-score {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 20px;
    background-color: var(--accent-bg);
    border-radius: 12px;
  }

  .review-score-value {
    font-size: 36px;
    font-weight: 700;
    color: var(--accent);
  }

  .review-score-label {
    font-size: 16px;
    color: var(--text);
    font-weight: 500;
  }

  .review-stats {
    display: flex;
    gap: 40px;
  }

  .review-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  .review-stat-value {
    font-size: 28px;
    font-weight: 700;
  }

  .review-stat-value.correct {
    color: #2e7d32;
  }

  .review-stat-value.incorrect {
    color: #c62828;
  }

  .review-stat-label {
    font-size: 14px;
    color: var(--text);
  }

  .review-questions {
    display: flex;
    flex-direction: column;
    gap: 24px;
    margin-bottom: 40px;
  }

  .review-question {
    padding: 24px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 12px;
  }

  .review-question-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .review-question-number {
    font-size: 18px;
    font-weight: 600;
    color: var(--text-h);
    margin: 0;
  }

  .review-question-status {
    font-size: 14px;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 16px;
  }

  .review-question-status.correct {
    background-color: #e8f5e8;
    color: #2e7d32;
  }

  .review-question-status.incorrect {
    background-color: #ffebee;
    color: #c62828;
  }

  .review-question-text {
    font-size: 18px;
    color: var(--text-h);
    margin: 0 0 20px 0;
    line-height: 1.6;
  }

  .review-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .review-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    background-color: var(--bg);
    border: 2px solid var(--border);
    border-radius: 8px;
  }

  .review-option-correct {
    background-color: #e8f5e8;
    border-color: #2e7d32;
  }

  .review-option-incorrect {
    background-color: #ffebee;
    border-color: #c62828;
  }

  .review-option-label {
    font-weight: 600;
    color: var(--text);
  }

  .review-option-text {
    flex: 1;
    color: var(--text);
  }

  .review-option-badge {
    font-size: 12px;
    font-weight: 600;
    padding: 4px 8px;
    border-radius: 4px;
    background-color: #2e7d32;
    color: white;
  }

  .review-fill-blank,
  .review-essay {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .review-answer-display {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px;
    background-color: var(--bg);
    border: 1px solid var(--border);
    border-radius: 8px;
  }

  .review-label {
    font-size: 14px;
    color: var(--text);
    font-weight: 600;
  }

  .review-value {
    font-size: 16px;
    font-weight: 500;
    color: var(--text-h);
  }

  .review-value.correct {
    color: #2e7d32;
  }

  .review-value.incorrect {
    color: #c62828;
  }

  .review-essay-value {
    flex: 1;
    font-size: 16px;
    color: var(--text-h);
    white-space: pre-wrap;
    word-break: break-word;
  }

  .review-feedback {
    margin-top: 20px;
    padding: 16px;
    background-color: var(--accent-bg);
    border-radius: 8px;
    border-left: 4px solid var(--accent);
  }

  .review-feedback-label {
    font-size: 14px;
    color: var(--text);
    font-weight: 600;
    margin: 0 0 8px 0;
  }

  .review-feedback-text {
    font-size: 15px;
    color: var(--text);
    margin: 0;
    line-height: 1.6;
  }

  .review-footer {
    text-align: center;
  }
`;
