import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          MARKET
        </Link>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Найти
          </button>
        </form>

        <div className="header-actions">
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="header-link">
                {user?.username}
              </Link>
              <Link to="/cart" className="header-link">
                Корзина
              </Link>
              <button onClick={logout} className="header-link logout-btn">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="header-link">
                Вход
              </Link>
              <Link to="/register" className="header-link register-btn">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;