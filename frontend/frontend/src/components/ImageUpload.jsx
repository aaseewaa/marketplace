import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageSelect, currentImage, className }) => {
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [error, setError] = useState('');

  const handleUrlChange = (e) => {
    const url = e.target.value;
    setImageUrl(url);
    setError('');
    
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      onImageSelect(url);
    } else if (!url) {
      onImageSelect(null);
    }
  };

  const handleClear = () => {
    setImageUrl('');
    onImageSelect(null);
    setError('');
  };

  return (
    <div className={`image-upload-url ${className || ''}`}>
      <div className="url-input-container">
        <label className="url-label">Ссылка на изображение</label>
        <div className="url-input-wrapper">
          <input
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            placeholder="https://example.com/image.jpg"
            className="url-input"
          />
          {imageUrl && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-url-btn"
            >
              ×
            </button>
          )}
        </div>
        <p className="url-hint">
          Введите прямой URL адрес изображения (http:// или https://)
        </p>
      </div>
      
      {imageUrl && (
        <div className="image-preview-url">
          <img 
            src={imageUrl} 
            alt="Preview" 
            onError={() => setError('Не удалось загрузить изображение по указанному адресу')}
            onLoad={() => setError('')}
          />
          {error && <p className="preview-error">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;