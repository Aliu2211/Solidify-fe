import React from 'react';
import '../../styles/ConfirmationModal.css';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = 'Delete', 
  cancelText = 'Cancel',
  isDeleting = false,
  type = 'danger' // danger, warning, info
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <span className={`material-symbols-outlined ${type === 'danger' ? 'text-red' : ''}`}>
              {type === 'danger' ? 'warning' : 'info'}
            </span>
            {title}
          </h3>
          <button type="button" onClick={onClose} disabled={isDeleting}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-actions">
          <button 
            type="button" 
            className="btn-secondary" 
            onClick={onClose}
            disabled={isDeleting}
          >
            {cancelText}
          </button>
          <button 
            type="button" 
            className={`btn-${type === 'danger' ? 'delete' : 'primary'}`}
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="spinner-small"></span>
                Processing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined">
                  {type === 'danger' ? 'delete' : 'check'}
                </span>
                {confirmText}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
