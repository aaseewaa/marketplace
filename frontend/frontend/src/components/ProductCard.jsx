import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image">
        <div className="image-placeholder"></div>
        {product.quantity === 0 && (
          <div className="out-of-stock-badge">Нет в наличии</div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-price">{formatPrice(product.price)} ₽</p>
        <p className="product-seller">{product.owner_username}</p>
        {product.quantity > 0 && product.quantity < 5 && (
          <p className="product-stock-low">Осталось {product.quantity} шт.</p>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;