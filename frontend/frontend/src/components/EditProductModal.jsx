import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import './Modal.css';

const EditProductModal = ({ product, onClose, onSave, loading }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    imageUrl: product?.imageUrl || ''
  });
  const [error, setError] = useState('');

  console.log('EditProductModal - начальный product:', product);
  console.log('EditProductModal - начальный imageUrl:', product?.imageUrl);

  const handleChange = (e) => {
    console.log('handleChange:', e.target.name, '=', e.target.value);
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (imageUrl) => {
    console.log('handleImageChange вызван с URL:', imageUrl);
    setFormData(prev => {
      console.log('Предыдущий formData:', prev);
      const newFormData = { ...prev, imageUrl };
      console.log('Новый formData:', newFormData);
      return newFormData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('=== EDIT SUBMIT ===');
    console.log('Текущий formData:', formData);
    console.log('imageUrl:', formData.imageUrl);

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

    const dataToSend = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: price,
      quantity: quantity,
      imageUrl: formData.imageUrl || null
    };

    console.log('Отправляем на бэкенд (редактирование):', dataToSend);

    const result = await onSave(dataToSend);

    if (result && !result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Редактировать товар</h3>
          <button onClick={onClose} className="modal-close">×</button>
        </div>
       
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}
         
          <div className="form-group">
            <label>Фото товара (URL)</label>
            <ImageUpload
              value={formData.imageUrl}
              onChange={handleImageChange}
            />
            <p className="hint-text">Введите ссылку на изображение</p>
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
            />
          </div>

          <div className="form-row">
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
              />
            </div><div className="form-group">
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
              />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="button-secondary">
              Отмена
            </button>
            <button type="submit" disabled={loading} className="button-primary">
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProductModal;