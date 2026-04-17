import React, { useState } from 'react';
import './ProductGallery.css';

const ProductGallery = ({ images, productName }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const imageList = images && images.length > 0 ? images : [null];

  const handleImageClick = (index) => {
    setSelectedImage(index);
  };

  const handleMainImageClick = () => {
    setIsZoomed(!isZoomed);
  };

  return (
    <div className="product-gallery">
      <div 
        className={`gallery-main ${isZoomed ? 'zoomed' : ''}`}
        onClick={handleMainImageClick}
      >
        {imageList[selectedImage] ? (
          <img 
            src={imageList[selectedImage]} 
            alt={productName}
            className="gallery-main-img"
          />
        ) : (
          <div className="image-placeholder-large"></div>
        )}
      </div>
      
      {imageList.length > 1 && (
        <div className="gallery-thumbnails">
          {imageList.map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
              onClick={() => handleImageClick(index)}
            >
              {img ? (
                <img src={img} alt={`${productName} ${index + 1}`} />
              ) : (
                <div className="thumbnail-placeholder"></div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;