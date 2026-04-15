import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, authAPI } from '../services/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    try {
      if (typeof productsAPI.getOrderById !== 'function') {
        console.error('productsAPI.getOrderById is not a function');
        navigate('/orders');
        return;
      }
      const orderRes = await productsAPI.getOrderById(id);
      setOrder(orderRes.data);
      
      if (typeof authAPI.getAddresses === 'function') {
        const addressesRes = await authAPI.getAddresses();
        const orderAddress = addressesRes.data.find(a => a.id === orderRes.data.delivery_address_id);
        setAddress(orderAddress);
      }
    } catch (error) {
      console.error('Ошибка загрузки заказа:', error);
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    setUpdating(true);
    try {
      if (typeof productsAPI.updateOrderStatus !== 'function') {
        alert('Функция обновления статуса недоступна');
        return;
      }
      const response = await productsAPI.updateOrderStatus(id, newStatus);
      setOrder(response.data);
      alert('Статус заказа обновлен');
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка обновления статуса');
    } finally {
      setUpdating(false);
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
    if (!date) return '—';
    return new Date(date).toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Загрузка заказа...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="order-details-page">
      <div className="container">
        <button onClick={() => navigate('/orders')} className="back-link">
          ← Назад к заказам
        </button>
        
        <div className="order-details-header">
          <h1>Заказ №{order.id}</h1>
          <div className={`order-status-large ${getStatusClass(order.status)}`}>
            {getStatusText(order.status)}
          </div>
        </div>

        <div className="order-details-layout">
          <div className="order-details-main">
            <div className="details-section">
              <h3>Товары</h3>
              <div className="order-items-full">
                {order.items && order.items.map(item => (
                  <div key={item.id} className="order-item-full">
                    <div className="order-item-image">
                      <div className="image-placeholder-small"></div>
                    </div>
                    <div className="order-item-info-full">
                      <a href={`/product/${item.product_id}`} className="order-item-name">
                        {item.product_name}
                      </a>
                      <div className="order-item-meta">
                        {formatPrice(item.price_at_order)} ₽ × {item.quantity}
                      </div>
                    </div>
                    <div className="order-item-total-full">
                      {formatPrice(item.price_at_order * item.quantity)} ₽
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="details-section">
              <h3>Адрес доставки</h3>
              {address ? (
                <div className="address-info">
                  <p>{address.address_line}</p>
                  <p>{address.city}, {address.postal_code}</p>
                  <p>{address.country}</p>
                </div>
              ) : (
                <p className="no-info">Адрес не указан</p>
              )}
            </div>
          </div>

          <div className="order-details-sidebar">
            <div className="details-summary">
              <h3>Информация о заказе</h3>
              <div className="summary-item">
                <span>Дата создания:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              {order.completed_at && (
                <div className="summary-item">
                  <span>Дата завершения:</span>
                  <span>{formatDate(order.completed_at)}</span>
                </div>
              )}
              {order.cancelled_at && (
                <div className="summary-item">
                  <span>Дата отмены:</span>
                  <span>{formatDate(order.cancelled_at)}</span>
                </div>
              )}
              <div className="summary-total-details">
                <span>Итого к оплате:</span>
                <strong>{formatPrice(order.total_amount)} ₽</strong>
              </div>
            </div>

            {order.status === 'created' && (
              <div className="status-actions">
                <button 
                  onClick={() => handleUpdateStatus('completed')}
                  disabled={updating}
                  className="complete-btn button-primary"
                >
                  Подтвердить получение
                </button>
                <button 
                  onClick={() => handleUpdateStatus('cancelled')}
                  disabled={updating}
                  className="cancel-btn button-danger"
                >
                  Отменить заказ
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;