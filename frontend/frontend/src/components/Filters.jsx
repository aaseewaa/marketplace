import React, { useState } from 'react';
import './Filters.css';

const Filters = ({ filters, onFilterChange, onReset }) => {
  const [localMinPrice, setLocalMinPrice] = useState(filters.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filters.maxPrice);
  const [localSearch, setLocalSearch] = useState(filters.search);

  const sortOptions = [
    { value: 'created_at', label: 'По дате добавления' },
    { value: 'price', label: 'По цене' },
    { value: 'name', label: 'По названию' },
  ];

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  const handleOrderChange = (e) => {
    onFilterChange({ order: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onFilterChange({ search: localSearch });
  };

  const handlePriceApply = () => {
    onFilterChange({
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
    });
  };

  const handleReset = () => {
    setLocalSearch('');
    setLocalMinPrice('');
    setLocalMaxPrice('');
    onReset();
  };

  return (
    <div className="filters">
      <div className="filters-header">
        <h3>Фильтры</h3>
        <button onClick={handleReset} className="reset-filters-btn">
          Сбросить все
        </button>
      </div>

      <div className="filter-section">
        <label className="filter-label">Поиск</label>
        <form onSubmit={handleSearchSubmit} className="search-filter">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Название товара"
            className="filter-input"
          />
          <button type="submit" className="search-filter-btn">Найти</button>
        </form>
      </div>

      <div className="filter-section">
        <label className="filter-label">Цена</label>
        <div className="price-inputs">
          <input
            type="number"
            value={localMinPrice}
            onChange={(e) => setLocalMinPrice(e.target.value)}
            placeholder="от"
            className="filter-input price-input"
            min="0"
          />
          <span className="price-separator"></span>
          <input
            type="number"
            value={localMaxPrice}
            onChange={(e) => setLocalMaxPrice(e.target.value)}
            placeholder="до"
            className="filter-input price-input"
            min="0"
          />
        </div>
        <button onClick={handlePriceApply} className="apply-price-btn">
          Применить
        </button>
      </div>

      <div className="filter-section">
        <label className="filter-label">Сортировка</label>
        <select
          value={filters.sortBy}
          onChange={handleSortChange}
          className="filter-select"
        >
          {sortOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <select
          value={filters.order}
          onChange={handleOrderChange}
          className="filter-select"
        >
          <option value="desc">Сначала новые / дорогие</option>
          <option value="asc">Сначала старые / дешевые</option>
        </select>
      </div>

      {filters.search && (
        <div className="active-filter">
          <span>Поиск: {filters.search}</span>
          <button
            onClick={() => onFilterChange({ search: '' })}
            className="remove-filter"
          >
            ×
          </button>
        </div>
      )}
      
      {(filters.minPrice || filters.maxPrice) && (
        <div className="active-filter">
          <span>
            Цена: 
            {filters.minPrice && ` от ${filters.minPrice}`}
            {filters.maxPrice && ` до ${filters.maxPrice}`}
          </span>
          <button
            onClick={() => onFilterChange({ minPrice: '', maxPrice: '' })}
            className="remove-filter"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;