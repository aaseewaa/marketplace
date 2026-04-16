import React, { useState } from 'react';
import './ImageUpload.css';

const ImageUpload = ({ value = '', onChange, className }) => {
  const [url, setUrl] = useState(value);

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    if (onChange && typeof onChange === 'function') {
      onChange(newUrl);
    }
  };

  return (
    <div className="image-upload-single">
      <input
        type="text"
        value={url}
        onChange={handleUrlChange}
        placeholder="https://example.com/image.jpg"
        className="url-input"
      />
      {url && (
        <div className="image-preview">
          <img src={url} alt="Preview" />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;