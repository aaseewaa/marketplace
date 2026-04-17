import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      if (typeof productsAPI.getMyOrders !== 'function') {
        console.error('productsAPI.getMyOrders is not a function');
        setOrders([]);
        return;
      }
      const response = await productsAPI.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
      setOrders([]);
    } finally {
      setLoading(false);
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
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Загрузка заказов...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <h1>Мои заказы</h1>
        
        {orders.length === 0 ? (
          <div className="orders-empty">
            <p>У вас пока нет заказов</p>
            <Link to="/" className="button-primary">Перейти к покупкам</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <span className="order-number">Заказ №{order.id}</span>
                    <span className="order-date">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className={`order-status ${getStatusClass(order.status)}`}>
                    {getStatusText(order.status)}
                  </div>
                </div>
                
                <div className="order-items-list">
                  {order.items && order.items.map(item => (
                    <div key={item.id} className="order-item-row">
                      <div className="order-item-image">
                        <div className="image-placeholder-small"></div>
                      </div>
                      <div className="order-item-details">
                        <Link to={`/product/${item.productId}`} className="order-item-name">
                          {item.productName}
                        </Link>
                        <div className="order-item-meta">
                          {formatPrice(item.priceAtOrder)} ₽ × {item.quantity}
                        </div>
                      </div>
                      <div className="order-item-price">
                        {formatPrice(item.priceAtOrder * item.quantity)} ₽
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="order-footer">
                  <div className="order-total">
                    <span>Итого:</span>
                    <strong>{formatPrice(order.totalAmount)} ₽</strong>
                  </div>
                  <Link to={`/orders/${order.id}`} className="order-details-link">
                    Подробнее
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;