import React from 'react';
import './Cart.css';

const Cart = () => {
  return (
    <div className="cart-page">
      <div className="container">
        <h1>Корзина</h1>
        <div className="cart-empty">
          <p>В вашей корзине пока нет товаров</p>
          <a href="/" className="button-primary">Перейти к покупкам</a>
        </div>
      </div>
    </div>
  );
};

export default Cart;