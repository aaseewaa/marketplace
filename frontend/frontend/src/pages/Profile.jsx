import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import EditProfileModal from '../components/EditProfileModal';
import ChangePasswordModal from '../components/ChangePasswordModal';
import AddProductModal from '../components/AddProductModal';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const { success, error: showError } = useToast();
  const [userProducts, setUserProducts] = useState([]);
  const [userOrders, setUserOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [addresses, setAddresses] = useState([]);
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
    } else if (activeTab === 'wishlist') {
      fetchWishlist();
    } else if (activeTab === 'addresses') {
      fetchAddresses();
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
      const response = await productsAPI.getMyOrders();
      setUserOrders(response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setUserOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getWishlist();
      setWishlist(response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
      setWishlist([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAddresses();
      setAddresses(response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки адресов:', error);
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    setSaving(true);
    const result = await updateProfile(formData);
    setSaving(false);
    if (result.success) {
      setShowEditProfile(false);
      success('Профиль успешно обновлен');
    }
    return result;
  };

  const handleChangePassword = async (passwordData) => {
    setSaving(true);
    const result = await changePassword(passwordData);
    setSaving(false);
    if (result.success) {
      setShowChangePassword(false);
      success('Пароль успешно изменен');
    }
    return result;
  };

  const handleAddProduct = async (productData) => {
    setSaving(true);
    try {
      const response = await productsAPI.create(productData);
      setUserProducts(prev => [response.data, ...prev]);
      setShowAddProduct(false);
      success('Товар успешно добавлен');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка при добавлении товара';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      created: 'Создан',
      completed: 'Завершён',
      cancelled: 'Отменён'
    };
    return statusMap[status] || status;
  };

  const getStatusClass = (status) => {
    const classMap = {
      created: 'status-created',
      completed: 'status-completed',
      cancelled: 'status-cancelled'
    };
    return classMap[status] || '';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const tabs = [
    { id: 'profile', label: 'Профиль' },
    { id: 'products', label: 'Мои товары' },
    { id: 'orders', label: 'Заказы' },
    { id: 'returns', label: 'Возвраты' },
    { id: 'wishlist', label: 'Избранное' },
    { id: 'addresses', label: 'Адреса' }
  ];

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
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
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
              <h3>Мои заказы</h3>
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : userOrders.length === 0 ? (
                <div className="empty-state">
                  <p>У вас пока нет заказов</p>
                  <Link to="/" className="button-primary">Перейти к покупкам</Link>
                </div>
              ) : (
                <div className="profile-orders-list">
                  {userOrders.map(order => (
                    <div key={order.id} className="profile-order-card">
                      <div className="profile-order-header">
                        <div className="profile-order-info">
                          <span className="profile-order-number">Заказ №{order.id}</span>
                          <span className="profile-order-date">{formatDate(order.created_at)}</span>
                        </div>
                        <div className={`profile-order-status ${getStatusClass(order.status)}`}>
                          {getStatusText(order.status)}
                        </div>
                      </div>
                      
                      <div className="profile-order-items">
                        {order.items && order.items.slice(0, 2).map(item => (
                          <div key={item.id} className="profile-order-item">
                            <span className="profile-order-item-name">{item.product_name}</span>
                            <span className="profile-order-item-quantity">× {item.quantity}</span>
                          </div>
                        ))}
                        {order.items && order.items.length > 2 && (
                          <div className="profile-order-more">
                            и ещё {order.items.length - 2} товаров
                          </div>
                        )}
                      </div>
                      
                      <div className="profile-order-footer">
                        <div className="profile-order-total">
                          <span>Итого:</span>
                          <strong>{formatPrice(order.total_amount)} ₽</strong>
                        </div>
                        <Link to={`/orders/${order.id}`} className="profile-order-link">
                          Подробнее
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'returns' && (
            <div className="returns-section">
              <h3>Возвраты</h3>
              <div className="empty-state">
                <p>Здесь будут отображаться ваши заявки на возврат</p>
                <Link to="/returns" className="button-primary">Перейти к возвратам</Link>
              </div>
            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="wishlist-section">
              <h3>Избранное</h3>
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : wishlist.length === 0 ? (
                <div className="empty-state">
                  <p>У вас пока нет избранных товаров</p>
                  <Link to="/" className="button-primary">Перейти к покупкам</Link>
                </div>
              ) : (
                <div className="products-grid">
                  {wishlist.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="addresses-section">
              <h3>Мои адреса</h3>
              {loading ? (
                <div className="loading">Загрузка...</div>
              ) : addresses.length === 0 ? (
                <div className="empty-state">
                  <p>У вас пока нет сохраненных адресов</p>
                  <Link to="/checkout" className="button-primary">Добавить адрес</Link>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map(address => (
                    <div key={address.id} className="address-card-profile">
                      <div className="address-details">
                        <p className="address-line">{address.address_line}</p>
                        <p className="address-city">{address.city}, {address.postal_code}</p>
                        <p className="address-country">{address.country}</p>
                        {address.is_default && <span className="default-badge">По умолчанию</span>}
                      </div>
                    </div>
                  ))}
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