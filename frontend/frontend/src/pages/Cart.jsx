import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { cartAPI } from '../services/api';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingItemId, setUpdatingItemId] = useState(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await cartAPI.getCart();
      setCart(response.data);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setUpdatingItemId(itemId);
    try {
      await cartAPI.updateCartItem(itemId, newQuantity);
      
      setCart(prevCart => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.items.map(item => {
          if (item.id === itemId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...prevCart, items: updatedItems, total_amount: newTotal };
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка обновления корзины');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (!confirm('Удалить товар из корзины?')) {
      return;
    }

    setUpdatingItemId(itemId);
    try {
      await cartAPI.removeFromCart(itemId);
      
      setCart(prevCart => {
        if (!prevCart) return prevCart;
        const updatedItems = prevCart.items.filter(item => item.id !== itemId);
        const newTotal = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        return { ...prevCart, items: updatedItems, total_amount: newTotal };
      });
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка удаления товара');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Очистить всю корзину?')) {
      return;
    }

    setUpdatingItemId('clear');
    try {
      await cartAPI.clearCart();
      setCart({ items: [], total_amount: 0 });
    } catch (error) {
      alert(error.response?.data?.message || 'Ошибка очистки корзины');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Загрузка корзины...</p>
          </div>
        </div>
      </div>
    );
  }

  const cartItems = cart?.items || [];
  const totalAmount = cart?.total_amount || 0;

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <h1>Корзина</h1>
          <div className="cart-empty">
            <p>В вашей корзине пока нет товаров</p>
            <Link to="/" className="button-primary">Перейти к покупкам</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <div className="cart-header">
          <h1>Корзина</h1>
          <button 
            onClick={handleClearCart} 
            className="clear-cart-btn" 
            disabled={updatingItemId === 'clear'}
          >
            {updatingItemId === 'clear' ? 'Очистка...' : 'Очистить корзину'}
          </button>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => {
              const isUpdating = updatingItemId === item.id;
              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <div className="image-placeholder-small"></div>
                  </div>
                  <div className="cart-item-info">
                    <h3 className="cart-item-title">{item.product_name}</h3>
                    <p className="cart-item-price">{formatPrice(item.price)} ₽</p>
                  </div>
                  <div className="cart-item-quantity">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                      disabled={isUpdating}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">
                      {isUpdating ? '...' : item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                      disabled={isUpdating}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-total">
                    <span>{formatPrice(item.price * item.quantity)} ₽</span>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={isUpdating}
                    className="remove-item-btn"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h3>Итого</h3>
            <div className="summary-row">
              <span>Товары ({cartItems.length})</span>
              <span>{formatPrice(totalAmount)} ₽</span>
            </div>
            <div className="summary-row delivery">
              <span>Доставка</span>
              <span>Рассчитывается при оформлении</span>
            </div>
            <div className="summary-total">
              <span>Итого к оплате</span>
              <span>{formatPrice(totalAmount)} ₽</span>
            </div>
            <button className="checkout-btn button-primary">
              Оформить заказ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;