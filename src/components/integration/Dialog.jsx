import React from 'react';

const Dialog = ({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Confirm', 
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  children
}) => {
  if (!visible) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <div className="dialog-header">
          <h3>{title}</h3>
          <button 
            className="close-btn"
            onClick={onCancel}
          >
            ×
          </button>
        </div>
        <div className="dialog-content">
          {message && <p>{message}</p>}
          {children}
        </div>
        <div className="form-actions">
          <button 
            className={`btn btn-${confirmVariant}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button 
            className="btn btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;