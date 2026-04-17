import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsAPI } from '../services/api';
import ImageUpload from '../components/ImageUpload';

const SellPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    imageUrl: ''
  });

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // ✅ Функция для одного URL
  const handleImageChange = (url) => {
    console.log('Image URL changed:', url);
    setFormData(prev => ({ ...prev, imageUrl: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError('Название товара обязательно');
      return;
    }

    const price = Number(formData.price);
    if (isNaN(price) || price <= 0) {
      showError('Цена должна быть больше 0');
      return;
    }

    const quantity = Number(formData.quantity);
    if (isNaN(quantity) || quantity < 0) {
      showError('Количество не может быть отрицательным');
      return;
    }

    setLoading(true);
    try {
      await productsAPI.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: price,
        quantity: quantity,
        imageUrl: formData.imageUrl || null  // ← отправляем один URL
      });
      success('Товар успешно добавлен');
      navigate('/profile');
    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка при добавлении товара');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sell-page">
      <div className="container">
        <div className="sell-container">
          <h1>Продать товар</h1>
          <p className="sell-subtitle">Заполните информацию о товаре</p>

          <form onSubmit={handleSubmit} className="sell-form">
            <div className="form-group">
              <label>Фото товара (URL)</label>
              {/* ✅ ИСПРАВЛЕНО: value и onChange для одного URL */}
              <ImageUpload 
                value={formData.imageUrl}
                onChange={handleImageChange}
              />
              <p className="hint">Вставьте ссылку на изображение</p>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Название товара *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Например: Ноутбук Lenovo Legion 5"
                  required
                />
              </div>

              <div className="form-group">
                <label>Цена *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="0 ₽"
                  min="1"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Описание</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Опишите товар подробно: состояние, характеристики, комплектация..."
              />
            </div>

            <div className="form-group">
              <label>Количество *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Количество на складе"
                min="0"
                required
              />
            </div>

            <div className="sell-actions">
              <button type="button" onClick={() => navigate(-1)} className="cancel-btn">
                Отмена
              </button>
              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? 'Публикация...' : 'Опубликовать товар'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SellPage;