import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { productsAPI, reviewsAPI, cartAPI } from '../services/api';
import EditProductModal from '../components/EditProductModal';
import WishlistButton from '../components/WishlistButton';
import ProductGallery from '../components/ProductGallery';
import './ProductPage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { success, error: showError } = useToast();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await productsAPI.getById(id);
      setProduct(response.data);
    } catch (err) {
      setError('Товар не найден');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getByProduct(id);
      setReviews(response.data);
    } catch (err) {
      console.error('Ошибка загрузки отзывов:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (quantity < 1 || quantity > product.quantity) {
      showError('Выберите корректное количество');
      return;
    }

    setAddingToCart(true);
    try {
      await cartAPI.addToCart(product.id, quantity);
      success('Товар добавлен в корзину');
    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка при добавлении в корзину');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setSubmittingReview(true);
    try {
      await reviewsAPI.create(id, { rating: reviewRating, comment: reviewComment });
      setReviewRating(5);
      setReviewComment('');
      setShowReviewForm(false);
      fetchReviews();
      success('Отзыв успешно добавлен');
    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка при добавлении отзыва');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleUpdateProduct = async (data) => {
    setSaving(true);
    try {
      const response = await productsAPI.update(id, data);
      setProduct(response.data);
      setShowEditModal(false);
      success('Товар успешно обновлен');
      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ошибка при обновлении товара';
      showError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!confirm('Вы уверены, что хотите удалить этот товар?')) {
      return;
    }

    setDeleting(true);
    try {
      await productsAPI.delete(id);
      success('Товар успешно удален');
      navigate('/');
    } catch (err) {
      showError(err.response?.data?.message || 'Ошибка при удалении товара');
    } finally {
      setDeleting(false);
    }
  };

  const handleContactSeller = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/chat/${product.owner_id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  if (loading) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="loading-state">
            <div className="loader"></div>
            <p>Загрузка товара...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-page">
        <div className="container">
          <div className="error-state">
            <p>{error || 'Товар не найден'}</p>
            <button onClick={() => navigate('/')} className="button-primary">
              Вернуться в каталог
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = user && product.owner_id === user.id;

  return (
    <div className="product-page">
      <div className="container">
        <div className="product-layout">
          <div className="product-gallery">
            <ProductGallery 
              images={product.images || (product.image ? [product.image] : [])}
              productName={product.name}
            />
          </div>

          <div className="product-info-section">
            <div className="product-actions-header">
              <div className="product-price-large">
                {formatPrice(product.price)} ₽
              </div>
              <WishlistButton productId={product.id} size="large" />
            </div>

            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-seller-section">
              <p className="product-seller-info">
                Продавец: {product.owner_username}
              </p>
              {!isOwner && (
                <button onClick={handleContactSeller} className="contact-seller-btn">
                  Написать продавцу
                </button>
              )}
            </div>

            <div className="product-stock">
              {product.quantity === 0 ? (
                <span className="out-of-stock">Нет в наличии</span>
              ) : product.quantity < 5 ? (
                <span className="low-stock">Осталось всего {product.quantity} шт.</span>
              ) : (
                <span className="in-stock">В наличии: {product.quantity} шт.</span>
              )}
            </div>

            {!isOwner && product.quantity > 0 && (
              <div className="purchase-section">
                <div className="quantity-selector">
                  <label>Количество:</label>
                  <div className="quantity-controls">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="quantity-btn"
                    >
                      -
                    </button>
                    <span className="quantity-value">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                      disabled={quantity >= product.quantity}
                      className="quantity-btn"
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart}
                  className="add-to-cart-btn button-primary"
                >
                  {addingToCart ? 'Добавление...' : 'Добавить в корзину'}
                </button>
              </div>
            )}

            {isOwner && (
              <div className="owner-actions">
                <button 
                  onClick={() => setShowEditModal(true)} 
                  className="button-secondary"
                >
                  Редактировать товар
                </button>
                <button 
                  onClick={handleDeleteProduct} 
                  disabled={deleting}
                  className="button-danger"
                >
                  {deleting ? 'Удаление...' : 'Удалить товар'}
                </button>
              </div>
            )}

            <div className="product-description">
              <h3>Описание</h3>
              <p>{product.description || 'Описание отсутствует'}</p>
            </div>
          </div>
        </div>

        <div className="reviews-section">
          <div className="reviews-header">
            <h3>Отзывы ({reviews.length})</h3>
            {isAuthenticated && !isOwner && (
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="button-secondary"
              >
                {showReviewForm ? 'Отмена' : 'Написать отзыв'}
              </button>
            )}
          </div>

          {showReviewForm && (
            <form onSubmit={handleSubmitReview} className="review-form">
              <div className="form-group">
                <label>Оценка</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="filter-select"
                >
                  <option value="5">5 - Отлично</option>
                  <option value="4">4 - Хорошо</option>
                  <option value="3">3 - Средне</option>
                  <option value="2">2 - Плохо</option>
                  <option value="1">1 - Ужасно</option>
                </select>
              </div>
              <div className="form-group">
                <label>Комментарий</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  required
                  rows="4"
                  className="filter-input"
                  placeholder="Поделитесь впечатлениями о товаре..."
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={submittingReview}
                className="button-primary"
              >
                {submittingReview ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </form>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="no-reviews">Пока нет отзывов. Будьте первым!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className="review-header">
                    <span className="review-author">{review.username}</span>
                    <span className="review-rating">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="review-date">
                      {new Date(review.created_at).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditProductModal
          product={product}
          onClose={() => setShowEditModal(false)}
          onSave={handleUpdateProduct}
          loading={saving}
        />
      )}
    </div>
  );
};

export default ProductPage;