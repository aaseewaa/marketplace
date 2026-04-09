import React, { useState } from 'react';
import './EditProfileModal.css';

const EditProfileModal = ({ user, onClose, onSave, loading: saving }) => {
  const [formData, setFormData] = useState({
    full_name: user.full_name || '',
    username: user.username,
    email: user.email,
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.username.trim()) {
      setError('Имя пользователя не может быть пустым');
      return;
    }

    if (!formData.email.trim()) {
      setError('Email не может быть пустым');
      return;
    }

    const result = await onSave(formData);
    if (result && !result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Редактировать профиль</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Полное имя</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              className="filter-input"
              placeholder="Иван Иванов"
            />
          </div>

          <div className="form-group">
            <label>Имя пользователя</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="filter-input"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="filter-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">
              Отмена
            </button>
            <button type="submit" disabled={saving} className="button-primary">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;