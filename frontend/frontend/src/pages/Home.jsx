import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';
import Filters from '../components/Filters';
import HeroSection from '../components/HeroSection';
import './Home.css';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'created_at',
    order: 'desc',
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      setFilters(prev => ({ ...prev, search: searchQuery }));
    }
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.order) params.order = filters.order;
      
      const response = await productsAPI.getAll(params);
      let allProducts = response.data;
      
      if (isAuthenticated && user) {
        allProducts = allProducts.filter(product => product.owner_id !== user.id);
      }
      
      setProducts(allProducts);
    } catch (err) {
      setError('Не удалось загрузить товары. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'created_at',
      order: 'desc',
    });
  };

  const handleCategoryClick = (searchQuery) => {
    setFilters(prev => ({ ...prev, search: searchQuery }));
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="home-page">
      <div className="container">
        <HeroSection onCategoryClick={handleCategoryClick} />
        
        <div className="home-layout">
          <aside className="filters-sidebar">
            <Filters
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </aside>
          
          <main className="products-main">
            <div className="products-header">
              <h2>
                {filters.search ? `Результаты поиска: "${filters.search}"` : 'Рекомендации'}
              </h2>
              <div className="products-count">
                {!loading && !error && <span>{products.length} товаров</span>}
              </div>
            </div>
            
            {error && (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchProducts} className="button-secondary">Повторить</button>
              </div>
            )}
            
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Загрузка товаров...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <p>Товары не найдены</p>
                <button onClick={handleResetFilters} className="button-secondary">
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Home;