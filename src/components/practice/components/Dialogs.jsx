import React from 'react';

const Dialogs = ({
  showProjectForm,
  setShowProjectForm,
  newProject,
  setNewProject,
  handleCreateProject,
  showPracticeForm,
  setShowPracticeForm,
  newPractice,
  setNewPractice,
  handleCreatePractice,
  showQuestionForm,
  setShowQuestionForm,
  newQuestion,
  setNewQuestion,
  handleCreateQuestion,
  isEditing,
  setIsEditing,
  setCurrentEditId
}) => {
  const handleCancel = (formType) => {
    if (formType === 'project') setShowProjectForm(false);
    else if (formType === 'practice') setShowPracticeForm(false);
    else if (formType === 'question') setShowQuestionForm(false);
    
    // 重置编辑状态
    setIsEditing(false);
    setCurrentEditId(null);
    
    // 重置表单数据
    if (formType === 'project') setNewProject({ name: '', description: '' });
    else if (formType === 'practice') setNewPractice({ name: '', description: '' });
    else if (formType === 'question') {
      setNewQuestion({
        type: 'multiple-choice',
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        feedback: ''
      });
    }
  };

  return (
    <>
      {/* 创建或编辑项目表单 */}
      {showProjectForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Project' : 'Create New Project'}</h3>
            <form onSubmit={handleCreateProject}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => handleCancel('project')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 创建或编辑练习表单 */}
      {showPracticeForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Practice' : 'Create New Practice'}</h3>
            <form onSubmit={handleCreatePractice}>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={newPractice.name}
                  onChange={(e) => setNewPractice({ ...newPractice, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={newPractice.description}
                  onChange={(e) => setNewPractice({ ...newPractice, description: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => handleCancel('practice')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {/* 创建或编辑问题表单 */}
      {showQuestionForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditing ? 'Edit Question' : 'Create New Question'}</h3>
            <form onSubmit={handleCreateQuestion}>
              <div className="form-group">
                <label>Question Type</label>
                <select
                  value={newQuestion.type}
                  onChange={(e) => setNewQuestion({ ...newQuestion, type: e.target.value })}
                >
                  <option value="multiple-choice">Multiple Choice</option>
                  <option value="fill-blank">Fill in the Blank</option>
                  <option value="essay">Essay</option>
                </select>
              </div>
              <div className="form-group">
                <label>Question</label>
                <textarea
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
                  required
                />
              </div>
              {newQuestion.type === 'multiple-choice' && (
                <div className="form-group">
                  <label>Options</label>
                  {newQuestion.options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...newQuestion.options];
                        newOptions[index] = e.target.value;
                        setNewQuestion({ ...newQuestion, options: newOptions });
                      }}
                      placeholder={`Option ${String.fromCharCode(65 + index)}`}
                    />
                  ))}
                </div>
              )}
              {newQuestion.type !== 'essay' && (
                <div className="form-group">
                  <label>Correct Answer</label>
                  {newQuestion.type === 'multiple-choice' ? (
                    <select
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                    >
                      <option value="">Select</option>
                      {newQuestion.options.map((option, index) => (
                        <option key={index} value={String.fromCharCode(65 + index)}>
                          {String.fromCharCode(65 + index)}. {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newQuestion.correctAnswer}
                      onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
                      required
                    />
                  )}
                </div>
              )}
              <div className="form-group">
                <label>Feedback</label>
                <textarea
                  value={newQuestion.feedback}
                  onChange={(e) => setNewQuestion({ ...newQuestion, feedback: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => handleCancel('question')}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {isEditing ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Dialogs;
