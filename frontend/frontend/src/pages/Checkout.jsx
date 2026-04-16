import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cartAPI, authAPI, productsAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import AddressModal from '../components/AddressModal';
import ConfirmModal from '../components/ConfirmModal';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { success, error: showError } = useToast();
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, addressId: null, type: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cartRes, addressesRes] = await Promise.all([
        cartAPI.getCart(),
        authAPI.getAddresses()
      ]);
      setCart(cartRes.data);
      setAddresses(addressesRes.data);
      
      const defaultAddress = addressesRes.data.find(a => a.isDefault);
      if (defaultAddress) {
        setSelectedAddressId(defaultAddress.id);
      } else if (addressesRes.data.length > 0) {
        setSelectedAddressId(addressesRes.data[0].id);
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (addressData) => {
    try {
      let response;
      if (editingAddress) {
        response = await authAPI.updateAddress(editingAddress.id, addressData);
        setAddresses(prev => prev.map(a => 
          a.id === editingAddress.id ? response.data : a
        ));
      } else {
        response = await authAPI.createAddress(addressData);
        setAddresses(prev => [...prev, response.data]);
      }
      
      if (addressData.isDefault || (!editingAddress && addresses.length === 0)) {
        setSelectedAddressId(response.data.id);
      }
      
      setShowAddressModal(false);
      setEditingAddress(null);
      success(editingAddress ? 'Адрес обновлен' : 'Адрес добавлен');
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message || 'Ошибка сохранения адреса' };
    }
  };

  const handleDeleteAddress = (addressId) => {
    setConfirmModal({ isOpen: true, addressId, type: 'deleteAddress' });
  };

  const confirmDeleteAddress = async () => {
    try {
      await authAPI.deleteAddress(confirmModal.addressId);
      setAddresses(prev => prev.filter(a => a.id !== confirmModal.addressId));
      if (selectedAddressId === confirmModal.addressId) {
        const remaining = addresses.filter(a => a.id !== confirmModal.addressId);
        if (remaining.length > 0) {
          setSelectedAddressId(remaining[0].id);
        } else {
          setSelectedAddressId(null);
        }
      }
      success('Адрес удален');
    } catch (error) {
      showError('Ошибка удаления адреса');
    } finally {
      setConfirmModal({ isOpen: false, addressId: null, type: '' });
    }
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddressId) {
      showError('Выберите адрес доставки');
      return;
    }

    if (!cart?.items?.length) {
      showError('Корзина пуста');
      return;
    }

    setSubmitting(true);
    try {
      const orderItems = cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      
      const response = await productsAPI.createOrder(selectedAddressId, orderItems);
      success('Заказ успешно оформлен!');
      navigate(`/orders/${response.data.id}`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Ошибка оформления заказа';
      showError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const totalAmount = cart?.totalAmount || 0;

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <h1>Оформление заказа</h1>
          <div className="cart-empty">
            <p>Корзина пуста</p>
            <a href="/" className="button-primary">Перейти к покупкам</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Оформление заказа</h1>
        
        <div className="checkout-layout">
          <div className="checkout-main">
            <div className="checkout-section">
              <div className="section-header">
                <h3>Адрес доставки</h3>
                <button 
                  onClick={() => {
                    setEditingAddress(null);
                    setShowAddressModal(true);
                  }}
                  className="add-btn"
                >
                  + Добавить адрес
                </button>
              </div>
              
              {addresses.length === 0 ? (
                <div className="empty-addresses">
                  <p>У вас нет сохраненных адресов</p>
                  <button 
                    onClick={() => {
                      setEditingAddress(null);
                      setShowAddressModal(true);
                    }}
                    className="button-secondary"
                  >
                    Добавить адрес
                  </button>
                </div>
              ) : (
                <div className="addresses-list">
                  {addresses.map(address => (
                    <div 
                      key={address.id}
                      className={`address-card ${selectedAddressId === address.id ? 'selected' : ''}`}
                      onClick={() => setSelectedAddressId(address.id)}
                    >
                      <div className="address-radio">
                        <div className={`radio ${selectedAddressId === address.id ? 'checked' : ''}`}></div>
                      </div>
                      <div className="address-details">
                        <p className="address-line">{address.addressLine}</p>
                        <p className="address-city">{address.city}, {address.postalCode}</p>
                        <p className="address-country">{address.country}</p>
                        {address.isDefault && <span className="default-badge">По умолчанию</span>}
                      </div>
                      <div className="address-actions">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingAddress(address);
                            setShowAddressModal(true);
                          }}
                          className="edit-address-btn"
                        >
                          Редактировать
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                          className="delete-address-btn"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="checkout-section">
              <h3>Товары в заказе</h3>
              <div className="order-items">
                {cartItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div className="order-item-image">
                      <div className="image-placeholder-small"></div>
                    </div>
                    <div className="order-item-info">
                      <h4>{item.product_name}</h4>
                      <p>{formatPrice(item.price)} ₽ × {item.quantity}</p>
                    </div>
                    <div className="order-item-total">
                      {formatPrice(item.price * item.quantity)} ₽
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Сумма заказа</h3>
              <div className="summary-row">
                <span>Товары ({cartItems.length})</span>
                <span>{formatPrice(totalAmount)} ₽</span>
              </div>
              <div className="summary-row">
                <span>Доставка</span>
                <span>Рассчитывается</span>
              </div>
              <div className="summary-total">
                <span>Итого</span>
                <span>{formatPrice(totalAmount)} ₽</span>
              </div>
              <button 
                onClick={handleSubmitOrder}
                disabled={submitting || addresses.length === 0}
                className="submit-order-btn button-primary"
              >
                {submitting ? 'Оформление...' : 'Подтвердить заказ'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <AddressModal
          address={editingAddress}
          onClose={() => {
            setShowAddressModal(false);
            setEditingAddress(null);
          }}
          onSave={handleSaveAddress}
          loading={submitting}
        />
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen && confirmModal.type === 'deleteAddress'}
        title="Удаление адреса"
        message="Вы уверены, что хотите удалить этот адрес? Это действие нельзя отменить."
        onConfirm={confirmDeleteAddress}
        onCancel={() => setConfirmModal({ isOpen: false, addressId: null, type: '' })}
        loading={submitting}
      />
    </div>
  );
};

export default Checkout;