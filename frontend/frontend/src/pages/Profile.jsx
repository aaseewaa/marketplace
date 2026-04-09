import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import AddProductModal from '../components/AddProductModal';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [userProducts, setUserProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (activeTab === 'products') {
      fetchUserProducts();
    } else if (activeTab === 'orders') {
      fetchUserOrders();
    }
  }, [activeTab]);

  const fetchUserProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getMyProducts();
      setUserProducts(response.data);
    } catch (error) {
      console.error('Ошибка загрузки товаров:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserOrders = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setUserOrders([]);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    setSaving(true);
    const result = await updateProfile(formData);
    setSaving(false);
    if (result.success) {
      setShowEditProfile(false);
      alert('Профиль успешно обновлен');
    }
    return result;
  };

  const handleChangePassword = async (passwordData) => {
    setSaving(true);
    const result = await changePassword(passwordData);
    setSaving(false);
    if (result.success) {
      setShowChangePassword(false);
      alert('Пароль успешно изменен');
    }
    return result;
  };

  const handleAddProduct = async (productData) => {
    setSaving(true);
    try {
      const response = await productsAPI.create(productData);
      setUserProducts(prev => [response.data, ...prev]);
      setShowAddProduct(false);
      alert('Товар успешно добавлен');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка при добавлении товара';
      alert(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.full_name?.charAt(0) || user.username?.charAt(0) || 'П'}
          </div>
          <div className="profile-info">
            <h1>{user.full_name || user.username}</h1>
            <p className="profile-username">@{user.username}</p>
            <p className="profile-email">{user.email}</p>
            <p className="profile-member">
              Участник с {new Date(user.created_at).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Профиль
          </button>
          <button
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Мои товары
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Мои заказы
          </button>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-details">
              <div className="info-card">
                <h3>Личная информация</h3>
                <div className="info-row">
                  <span className="info-label">Полное имя:</span>
                  <span className="info-value">{user.full_name || 'Не указано'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Имя пользователя:</span>
                  <span className="info-value">{user.username}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Дата регистрации:</span>
                  <span className="info-value">
                    {new Date(user.created_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
              </div>

              <div className="action-card">
                <h3>Действия</h3>
                <button 
                  onClick={() => setShowEditProfile(true)} 
                  className="action-button"
                >
                  Редактировать профиль
                </button>
                <button 
                  onClick={() => setShowChangePassword(true)} 
                  className="action-button secondary"
                >
                  Изменить пароль
                </button>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="products-section">
              <div className="section-header">
                <h3>Мои товары</h3>
                <button 
                  onClick={() => setShowAddProduct(true)} 
                  className="add-product-btn"
                >
                  + Добавить товар
                </button>
              </div>
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : userProducts.length === 0 ? (
                <div className="empty-state">
                  <p>У вас пока нет товаров</p>
                  <button 
                    onClick={() => setShowAddProduct(true)} 
                    className="button-primary"
                  >
                    Добавить первый товар
                  </button>
                </div>
              ) : (
                <div className="products-grid">
                  {userProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="orders-section">
              <h3>История заказов</h3>
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : userOrders.length === 0 ? (
                <div className="empty-state">
                  <p>У вас пока нет заказов</p>
                  <a href="/" className="button-primary">Перейти к покупкам</a>
                </div>
              ) : (
                <div className="orders-list">
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {showEditProfile && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditProfile(false)}
          onSave={handleUpdateProfile}
          loading={saving}
        />
      )}

      {showChangePassword && (
        <ChangePasswordModal
          onClose={() => setShowChangePassword(false)}
          onChangePassword={handleChangePassword}
          loading={saving}
        />
      )}

      {showAddProduct && (
        <AddProductModal
          onClose={() => setShowAddProduct(false)}
          onSave={handleAddProduct}
          loading={saving}
        />
      )}
    </div>
  );
};

export default Profile;