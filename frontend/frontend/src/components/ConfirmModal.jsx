import React from 'react';
import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, loading }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-modal-header">
          <h3>{title || 'Подтверждение'}</h3>
        </div>
        <div className="confirm-modal-body">
          <p>{message}</p>
        </div>
        <div className="confirm-modal-footer">
          <button onClick={onCancel} className="confirm-btn-cancel" disabled={loading}>
            Отмена
          </button>
          <button onClick={onConfirm} className="confirm-btn-confirm" disabled={loading}>
            {loading ? 'Загрузка...' : 'Подтвердить'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;