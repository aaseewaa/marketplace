import React, { useState } from 'react';
import ImageUpload from './ImageUpload';
import './Modal.css';

const EditProductModal = ({ product, onClose, onSave, loading }) => {
  const getInitialImages = () => {
    if (product.images && product.images.length > 0) {
      return product.images;
    }
    if (product.imageUrl) {
      return [product.imageUrl];
    }
    return [];
  };

  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    quantity: product?.quantity || '',
    images: getInitialImages()
  });
  const [error, setError] = useState('');

  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '');

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
      imageUrl: imageUrl
    });

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