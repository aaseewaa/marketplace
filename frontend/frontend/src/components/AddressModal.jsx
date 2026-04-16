import React, { useState } from 'react';
import './Modal.css';

const AddressModal = ({ address, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    addressLine: address?.addressLine || '',
    city: address?.city || '',
    postalCode: address?.postalCode || '',
    country: address?.country || 'Россия',
    isDefault: address?.isDefault || false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.addressLine.trim()) {
      setError('Введите адрес');
      return;
    }
    if (!formData.city.trim()) {
      setError('Введите город');
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
          <h3>{address ? 'Редактировать адрес' : 'Добавить адрес'}</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Адрес *</label>
            <input
              type="text"
              name="addressLine"
              value={formData.addressLine}
              onChange={handleChange}
              required
              className="filter-input"
              placeholder="Улица, дом, квартира"
            />
          </div>

          <div className="form-group">
            <label>Город *</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="filter-input"
            />
          </div>

          <div className="form-group">
            <label>Почтовый индекс</label>
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="filter-input"
            />
          </div>

          <div className="form-group">
            <label>Страна</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="filter-input"
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              Использовать как адрес по умолчанию
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? 'Сохранение...' : (address ? 'Сохранить' : 'Добавить')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressModal;