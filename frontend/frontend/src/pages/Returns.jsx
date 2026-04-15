import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import { productsAPI } from '../services/api';
import './Returns.css';

const Returns = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReturnForm, setShowReturnForm] = useState(null);
  const { success, error: showError } = useToast();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getMyOrders();
      const completedOrders = response.data.filter(o => o.status === 'completed');
      setOrders(completedOrders);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturnRequest = async (orderId, itemId, reason) => {
    try {
      await productsAPI.requestReturn(orderId, itemId, reason);
      success('Заявка на возврат отправлена');
      setShowReturnForm(null);
    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка отправки заявки');
    }
  };

  const ReturnForm = ({ order, item, onClose }) => {
    const [reason, setReason] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!reason.trim()) {
        showError('Укажите причину возврата');
        return;
      }
      setSubmitting(true);
      await handleReturnRequest(order.id, item.id, reason);
      setSubmitting(false);
    };

    return (
      <div className="return-form-modal">
        <div className="return-form-content">
          <h3>Возврат товара</h3>
          <p className="return-product">{item.product_name}</p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Причина возврата</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows="4"
                placeholder="Опишите причину возврата..."
              />
            </div>
            <div className="return-form-actions">
              <button type="button" onClick={onClose} className="button-secondary">
                Отмена
              </button>
              <button type="submit" disabled={submitting} className="button-primary">
                {submitting ? 'Отправка...' : 'Отправить заявку'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="returns-page">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="returns-page">
      <div className="container">
        <h1>Возврат товаров</h1>
        
        {orders.length === 0 ? (
          <div className="returns-empty">
            <p>У вас нет завершенных заказов для возврата</p>
            <Link to="/" className="button-primary">Перейти к покупкам</Link>
          </div>
        ) : (
          <div className="returns-list">
            {orders.map(order => (
              <div key={order.id} className="return-order-card">
                <div className="return-order-header">
                  <span className="return-order-number">Заказ №{order.id}</span>
                  <span className="return-order-date">
                    {new Date(order.completed_at).toLocaleDateString('ru-RU')}
                  </span>
                </div>
                <div className="return-order-items">
                  {order.items.map(item => (
                    <div key={item.id} className="return-order-item">
                      <div className="return-item-info">
                        <span className="return-item-name">{item.product_name}</span>
                        <span className="return-item-price">
                          {item.price_at_order} ₽ × {item.quantity}
                        </span>
                      </div>
                      <button
                        onClick={() => setShowReturnForm({ order, item })}
                        className="return-btn"
                      >
                        Вернуть товар
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {showReturnForm && (
          <ReturnForm
            order={showReturnForm.order}
            item={showReturnForm.item}
            onClose={() => setShowReturnForm(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Returns;