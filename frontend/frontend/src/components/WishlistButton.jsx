import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsAPI } from '../services/api';
import './WishlistButton.css';

const WishlistButton = ({ productId, size = 'medium' }) => {
  const { isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && productId) {
      checkWishlistStatus();
    }
  }, [productId, isAuthenticated]);

  const checkWishlistStatus = async () => {
    try {
      const response = await productsAPI.isInWishlist(productId);
      setIsInWishlist(response.data);
    } catch (err) {
      console.error('Ошибка проверки избранного:', err);
    }
  };

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showError('Войдите в аккаунт, чтобы добавлять в избранное');
      return;
    }

    setLoading(true);
    try {
      if (isInWishlist) {
        await productsAPI.removeFromWishlist(productId);
        setIsInWishlist(false);
        success('Товар удален из избранного');
      } else {
        await productsAPI.addToWishlist(productId);
        setIsInWishlist(true);
        success('Товар добавлен в избранное');
      }
    } catch (err) {
      showError('Ошибка при изменении избранного');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`wishlist-btn wishlist-btn-${size} ${isInWishlist ? 'active' : ''}`}
      onClick={handleToggle}
      disabled={loading}
    >
      <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 17.35L8.55 16.03C4.4 12.36 1.5 9.78 1.5 6.5C1.5 3.88 3.53 1.75 6.05 1.75C7.4 1.75 8.7 2.35 9.55 3.35L10 3.85L10.45 3.35C11.3 2.35 12.6 1.75 13.95 1.75C16.47 1.75 18.5 3.88 18.5 6.5C18.5 9.78 15.6 12.36 11.45 16.03L10 17.35Z" 
          fill={isInWishlist ? '#c00' : 'none'} 
          stroke={isInWishlist ? '#c00' : '#999'} 
          strokeWidth="1.5"/>
      </svg>
    </button>
  );
};

export default WishlistButton;