import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import './AddProductModal.css';

const AddProductModal = ({ onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    images: []
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImagesChange = (images) => {
    setFormData(prev => ({ ...prev, images }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Название товара обязательно');
      return;
    }

    const price = Number(formData.price);
    if (isNaN(price) || price <= 0) {
      setError('Цена должна быть больше 0');
      return;
    }

    const quantity = Number(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      setError('Количество не может быть отрицательным');
      return;
    }

    const result = await onSave({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: price,
      quantity: quantity,
      images: formData.images
    });

    if (result && !result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Добавить товар</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Фото товара (URL)</label>
            <ImageUpload onImagesChange={handleImagesChange} currentImages={formData.images} />
            <p className="hint-text">Добавьте несколько ссылок для создания галереи</p>
          </div>

          <div className="form-group">
            <label>Название товара *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="filter-input"
              placeholder="Например: Ноутбук Lenovo"
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="filter-input"
              placeholder="Подробное описание товара..."
            ></textarea>
          </div>

          <div className="form-group">
            <label>Цена *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="1"
              step="1"
              className="filter-input"
              placeholder="Например: 50000"
            />
          </div>

          <div className="form-group">
            <label>Количество *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="0"
              step="1"
              className="filter-input"
              placeholder="Например: 10"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? 'Добавление...' : 'Добавить товар'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;