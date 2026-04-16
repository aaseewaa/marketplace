import React from 'react';
import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const getImageUrl = () => {
    if (product.imageUrl) {
      let url = product.imageUrl;
      if (!url.startsWith('http')) {
        url = `http://localhost:8080${url.startsWith('/') ? url : '/' + url}`;
      }
      return url;
    }
    return null;
  };

  const imageUrl = getImageUrl();

  return (
    <div className="product-card-wrapper">
      <Link to={`/product/${product.id}`} className="product-card">
        <div className="product-image">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="product-img"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="image-placeholder"></div>';
              }}
            />
          ) : (
            <div className="image-placeholder"></div>
          )}
          {product.quantity === 0 && (
            <div className="out-of-stock-badge">Нет в наличии</div>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-title">{product.name}</h3>
          <p className="product-price">{formatPrice(product.price)} ₽</p>
          <p className="product-seller">{product.ownerUsername}</p>
          {product.quantity > 0 && product.quantity < 5 && (
            <p className="product-stock-low">Осталось {product.quantity} шт.</p>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;