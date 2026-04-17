import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ onCategoryClick }) => {
  const navigate = useNavigate();

  const heroItems = [
    {
      id: 1,
      title: 'Premium Quality',
      subtitle: 'Лучшие бренды по отличным ценам',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrfT2Q9NVl0hanN3ivZA1DO2UOVv5lnMO74A&s',
      cta: 'Shop Now',
      category: 'premium',
      searchQuery: 'премиум'
    },
    {
      id: 2,
      title: 'Summer Collection',
      subtitle: 'Скидки до 50% на летнюю коллекцию',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRD6p1s95F6fZ421KByTRrjgwXS_5veEpcSiA&s',
      cta: 'Explore',
      category: 'summer',
      searchQuery: 'лето'
    },
    {
      id: 3,
      title: 'Streetwear',
      subtitle: 'Эксклюзивные модели от лучших дизайнеров',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTio0dJEwoCIsrYfc48V3ywkXLcPFA5ePz0wQ&s',
      cta: 'View Collection',
      category: 'streetwear',
      searchQuery: 'уличная мода'
    },
    {
      id: 4,
      title: 'Electronics',
      subtitle: 'Новинки техники по лучшим ценам',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHeaEAudsCyvel_zGQ7NT3AcbGpRGX9fzfpQ&s',
      cta: 'Discover',
      category: 'electronics',
      searchQuery: 'электроника'
    }
  ];

  const handleClick = (item) => {
    if (onCategoryClick) {
      onCategoryClick(item.searchQuery);
    } else {
      navigate(`/?search=${encodeURIComponent(item.searchQuery)}`);
    }
  };

  return (
    <div className="hero-section">
      <div className="hero-grid">
        {heroItems.map((item) => (
          <div 
            key={item.id} 
            className="hero-card"
            onClick={() => handleClick(item)}
            style={{ cursor: 'pointer' }}
          >
            <div className="hero-image">
              <img src={item.image} alt={item.title} />
            </div>
            <div className="hero-overlay">
              <div className="hero-content">
                <h3 className="hero-title">{item.title}</h3>
                <p className="hero-subtitle">{item.subtitle}</p>
                <span className="hero-cta">{item.cta} →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;