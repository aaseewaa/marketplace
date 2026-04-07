import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './ProfilePage.css';

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Неизвестно';
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Только что';
  if (diffMins < 60) return `${diffMins} мин. назад`;
  if (diffHours < 24) return `${diffHours} ч. назад`;
  if (diffDays < 7) return `${diffDays} дн. назад`;
  return past.toLocaleDateString('ru-RU');
};

export default function ProfilePage() {
  const { user, logout, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');
  const [editedDescription, setEditedDescription] = useState(user?.description || '');
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar);
  const [saveStatus, setSaveStatus] = useState('');
  
  const [settings, setSettings] = useState({
    city: user?.city || '',
    notifications: user?.notifications ?? true,
    privacy: user?.privacy || 'public',
  });
  
  const [reviews, setReviews] = useState(user?.reviews || []);
  const [newReview, setNewReview] = useState({ rating: 5, text: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!user?.id || !updateUser) return;
    
    const lastActive = user.lastActive ? new Date(user.lastActive).getTime() : 0;
    const now = Date.now();
    const tenMinutes = 10 * 60 * 1000;
    
    if (now - lastActive > tenMinutes) {
        updateUser({ ...user, lastActive: new Date().toISOString() });
    }
  }, []); 

  if (!isAuthenticated) {
    navigate('/auth', { replace: true });
    return null;
  }

  const stats = {
    registrationDate: user?.createdAt 
      ? new Date(user.createdAt).toLocaleDateString('ru-RU', { 
          year: 'numeric', month: 'long', day: 'numeric' 
        })
      : 'Не указано',
    lastActive: formatTimeAgo(user?.lastActive),
    isOnline: user?.lastActive && (Date.now() - new Date(user.lastActive) < 300000),
    city: settings.city || 'Не указан',
    rating: user?.rating || 4.8,
    totalOrders: 12,
    totalSales: 5,
    reviewsCount: reviews.length,
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setSaveStatus('Выберите изображение');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setSaveStatus('Макс. размер 2МБ');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setAvatarPreview(dataUrl);
      if (updateUser) updateUser({ ...user, avatar: dataUrl });
      setSaveStatus('Аватар обновлён');
      setTimeout(() => setSaveStatus(''), 2500);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveName = () => {
    if (!editedName.trim()) {
      setSaveStatus('Имя не может быть пустым');
      return;
    }
    if (updateUser) updateUser({ ...user, name: editedName.trim() });
    setIsEditingName(false);
    setSaveStatus('Имя обновлено');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleSaveDescription = () => {
    if (updateUser) updateUser({ ...user, description: editedDescription.trim() });
    setIsEditingDesc(false);
    setSaveStatus('Описание обновлено');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleSaveSettings = () => {
    if (updateUser) {
      updateUser({ 
        ...user, 
        city: settings.city,
        notifications: settings.notifications,
        privacy: settings.privacy
      });
    }
    setSaveStatus('Настройки сохранены');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth', { replace: true });
  };

  const handleComingSoon = (feature) => {
    setSaveStatus(`${feature} в разработке`);
    setTimeout(() => setSaveStatus(''), 2500);
  };

  const renderRating = (value, size = 'normal') => {
    const full = '★'.repeat(Math.floor(value));
    const empty = '☆'.repeat(5 - Math.floor(value));
    const className = size === 'large' ? 'rating-large' : 'rating-small';
    return <span className={`rating ${className}`}>{full}{empty}</span>;
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReview.text.trim()) {
      setSaveStatus('Напишите текст отзыва');
      return;
    }
    
    setIsSubmittingReview(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const review = {
      id: Date.now(),
      author: 'Гость',
      rating: newReview.rating,
      text: newReview.text.trim(),
      date: new Date().toISOString(),
    };
    
    const updatedReviews = [review, ...reviews];
    setReviews(updatedReviews);
    if (updateUser) updateUser({ ...user, reviews: updatedReviews });
    
    setNewReview({ rating: 5, text: '' });
    setIsSubmittingReview(false);
    setSaveStatus('Отзыв опубликован');
    setTimeout(() => setSaveStatus(''), 2000);
  };

  return (
    <div className="profile-page fade-in">
      <div className="profile-header gradient-bg">
        <div className="container header-content">
          <h1 className="header-title">Профиль пользователя</h1>
          <p className="header-subtitle">Управление аккаунтом и товарами</p>
        </div>
      </div>

      <div className="container">
        {saveStatus && (
          <div className={`status-banner ${saveStatus.includes('обнов') || saveStatus.includes('сохран') || saveStatus.includes('опублик') ? 'success' : 'error'}`}>
            {saveStatus}
          </div>
        )}

        <div className="profile-grid">
          
          <div className="profile-left card">
            {/* Аватар */}
            <div className="avatar-section">
              <div className="avatar-wrapper">
                {avatarPreview ? (
                  <img src={avatarPreview} alt="Аватар" className="avatar-image" />
                ) : (
                  <div className="avatar-placeholder gradient-bg">
                    <span className="avatar-initials">
                      {(user?.name || 'U').charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <button 
                  className="avatar-edit-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Изменить аватар"
                >
                  <span className="icon">📷</span>
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
              <p className="avatar-hint">Нажмите для загрузки</p>
            </div>

            <div className="profile-name-section">
              <label className="label">Имя</label>
              {isEditingName ? (
                <div className="edit-row">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="input"
                    autoFocus
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <div className="edit-btns">
                    <button className="btn btn-sm" onClick={handleSaveName}>Сохранить</button>
                    <button className="btn btn-outline btn-sm" onClick={() => {
                      setEditedName(user?.name || '');
                      setIsEditingName(false);
                    }}>Отмена</button>
                  </div>
                </div>
              ) : (
                <div className="name-row">
                  <h3 className="name-value">{user?.name || 'Не указано'}</h3>
                  <button className="btn btn-outline btn-sm" onClick={() => {
                    setEditedName(user?.name || '');
                    setIsEditingName(true);
                  }}>Изменить</button>
                </div>
              )}
            </div>

            <div className="profile-field">
              <span className="field-label">Email</span>
              <span className="field-value">{user?.email}</span>
            </div>

            <div className="profile-field">
              <label className="label">О себе</label>
              {isEditingDesc ? (
                <div className="edit-row">
                  <textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="input textarea"
                    rows="3"
                    placeholder="Расскажите о себе..."
                  />
                  <div className="edit-btns">
                    <button className="btn btn-sm" onClick={handleSaveDescription}>Сохранить</button>
                    <button className="btn btn-outline btn-sm" onClick={() => {
                      setEditedDescription(user?.description || '');
                      setIsEditingDesc(false);
                    }}>Отмена</button>
                  </div>
                </div>
              ) : (
                <div className="name-row">
                  <p className="field-value desc-value">
                    {user?.description || 'Нет описания'}
                  </p>
                  <button className="btn btn-outline btn-sm" onClick={() => {
                    setEditedDescription(user?.description || '');
                    setIsEditingDesc(true);
                  }}>Изменить</button>
                </div>
              )}
            </div>

            <div className="profile-nav">
              <button className="btn btn-outline btn-block" onClick={() => handleComingSoon('Каталог товаров')}>
                Каталог товаров
              </button>
              <button className="btn btn-outline btn-block" onClick={() => handleComingSoon('Мои товары')}>
                Мои товары
              </button>
              <button className="btn btn-outline btn-block" onClick={() => handleComingSoon('Мои заказы')}>
                Мои заказы
              </button>
            </div>

            <button className="btn btn-danger btn-block" onClick={handleLogout}>
              Выйти из аккаунта
            </button>
          </div>

          <div className="profile-right">
            
            <div className="card stats-card">
              <h3 className="stats-title">Статистика</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value gradient-text">{stats.totalOrders}</span>
                  <span className="stat-label">Заказов</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value gradient-text">{stats.totalSales}</span>
                  <span className="stat-label">Продаж</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value gradient-text">{stats.reviewsCount}</span>
                  <span className="stat-label">Отзывов</span>
                </div>
              </div>
            </div>

            <div className="card rating-card">
              <h3 className="stats-title">Рейтинг</h3>
              <div className="rating-wrapper">
                <span className="rating-value gradient-text">{stats.rating}</span>
                <div className="rating-stars-large">{renderRating(stats.rating, 'large')}</div>
                <p className="text-muted text-sm">на основе {stats.reviewsCount} отзывов</p>
              </div>
            </div>

            <div className="card info-card">
              <h3 className="stats-title">Информация</h3>
              <div className="info-list">
                <div className="info-row">
                  <span className="info-label">Регистрация</span>
                  <span className="info-value">{stats.registrationDate}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">
                    <span className={`status-dot ${stats.isOnline ? 'online' : 'offline'}`}></span>
                    Последняя активность
                  </span>
                  <span className="info-value">{stats.lastActive}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Город</span>
                  <span className="info-value">{settings.city || 'Не указан'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Роль</span>
                  <span className="info-value">Покупатель / Продавец</span>
                </div>
              </div>
            </div>

            <div className="card settings-card">
              <h3 className="stats-title">Настройки</h3>
              <div className="settings-form">
                <div className="form-group">
                  <label className="label">Город</label>
                  <input
                    type="text"
                    value={settings.city}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                    className="input"
                    placeholder="Введите город"
                  />
                </div>
                
                <div className="form-group">
                  <label className="label">Уведомления</label>
                  <div className="toggle-group">
                    <button
                      className={`toggle-btn ${settings.notifications ? 'active' : ''}`}
                      onClick={() => setSettings({ ...settings, notifications: true })}
                    >
                      Включены
                    </button>
                    <button
                      className={`toggle-btn ${!settings.notifications ? 'active' : ''}`}
                      onClick={() => setSettings({ ...settings, notifications: false })}
                    >
                      Выключены
                    </button>
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="label">Приватность профиля</label>
                  <select
                    value={settings.privacy}
                    onChange={(e) => setSettings({ ...settings, privacy: e.target.value })}
                    className="input"
                  >
                    <option value="public">Публичный</option>
                    <option value="private">Приватный</option>
                    <option value="friends">Только для покупателей</option>
                  </select>
                </div>
                
                <button className="btn btn-block" onClick={handleSaveSettings}>
                  Сохранить настройки
                </button>
              </div>
            </div>

            <div className="card reviews-card">
              <h3 className="stats-title">Отзывы ({reviews.length})</h3>
              
              <form onSubmit={handleSubmitReview} className="review-form">
                <div className="form-group">
                  <label className="label">Ваша оценка</label>
                  <div className="rating-input">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className={`rating-star ${newReview.rating >= star ? 'active' : ''}`}
                        onClick={() => setNewReview({ ...newReview, rating: star })}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="label">Текст отзыва</label>
                  <textarea
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="input textarea"
                    rows="3"
                    placeholder="Напишите ваш отзыв..."
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-block"
                  disabled={isSubmittingReview || !newReview.text.trim()}
                >
                  {isSubmittingReview ? 'Отправка...' : 'Опубликовать отзыв'}
                </button>
              </form>
              
              <div className="reviews-list">
                {reviews.length === 0 ? (
                  <p className="text-muted text-center">Пока нет отзывов</p>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <span className="review-author">{review.author}</span>
                        <span className="review-date">{formatTimeAgo(review.date)}</span>
                      </div>
                      <div className="review-rating">{renderRating(review.rating)}</div>
                      <p className="review-text">{review.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}