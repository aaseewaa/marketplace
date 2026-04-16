import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImagesChange, currentImages = [], className }) => {
  const [newUrl, setNewUrl] = useState('');

  const handleAddUrl = () => {
    if (newUrl && (newUrl.startsWith('http://') || newUrl.startsWith('https://'))) {
      const newImages = [...currentImages, newUrl];
      if (onImagesChange && typeof onImagesChange === 'function') {
        onImagesChange(newImages);
      } else {
        console.error('onImagesChange не является функцией', onImagesChange);
      }
      setNewUrl('');
    }
  };

  const handleRemoveImage = (index) => {
    const newImages = currentImages.filter((_, i) => i !== index);
    if (onImagesChange && typeof onImagesChange === 'function') {
      onImagesChange(newImages);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    }
  };

  return (
    <div className="image-upload-multi">
      <div className="url-input-group">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="https://example.com/image.jpg"
          className="url-input"
        />
        <button type="button" onClick={handleAddUrl} className="add-url-btn button-secondary">
          Добавить
        </button>
      </div>
      
      {currentImages.length > 0 && (
        <div className="images-preview-list">
          {currentImages.map((url, index) => (
            <div key={index} className="preview-item">
              <img src={url} alt={`Фото ${index + 1}`} />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="remove-image-btn"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;