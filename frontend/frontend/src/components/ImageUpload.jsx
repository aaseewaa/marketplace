import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ onImageChange, currentImage = '', className }) => {
  const [newUrl, setNewUrl] = useState(currentImage);

  const handleAddUrl = () => {
    if (newUrl && (newUrl.startsWith('http://') || newUrl.startsWith('https://'))) {
      onImageChange(newUrl);
    }
  };

  return (
    <div className="image-upload-single">
      <input
        type="text"
        value={newUrl}
        onChange={(e) => setNewUrl(e.target.value)}
        onBlur={handleAddUrl}
        placeholder="https://example.com/image.jpg"
        className="url-input"
      />
      {currentImage && (
        <div className="image-preview">
          <img src={currentImage} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;