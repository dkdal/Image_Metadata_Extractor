import React, { useState } from 'react';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [email, setEmail] = useState('');
  const [action, setAction] = useState('');
  const [metadata, setMetadata] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleActionChange = (e) => {
    setAction(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await performAction({ image, email, action });

      if (response.ok) {
        const metadata = await extractMetadata(image);
        setMetadata(metadata);
      } else {
        console.error('Failed to perform action');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const performAction = async ({ image, email, action }) => {
    try {
      const input = {
        image: encodeURIComponent(image),
        email: encodeURIComponent(email),
        action: action
      };
      const params = {
        input: JSON.stringify(input),
        stateMachineArn: 'arn:aws:states:us-east-1:851725527345:stateMachine:tasm'
      };
      const response = await fetch('https://uf0v84fqxj.execute-api.us-east-1.amazonaws.com/FirstStage/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });
      return response;
    } catch (error) {
      throw new Error('Failed to perform action');
    }
  };

  const extractMetadata = async (image) => {
    return new Promise((resolve, reject) => {
      const imgElement = document.createElement('img');
      imgElement.src = image;
      imgElement.onload = () => {
        const { naturalWidth, naturalHeight, type, size } = imgElement;
        const format = image.split(';')[0].split('/')[1];
        resolve({
          width: naturalWidth,
          height: naturalHeight,
          format: format,
          size: size,
          type: type
        });
      };
      imgElement.onerror = () => {
        reject('Failed to load image');
      };
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Image Uploader</h1>
        <form id="uploadForm" onSubmit={handleSubmit}>
          <label htmlFor="imageInput" className="custom-file-upload">
            <input type="file" id="imageInput" accept="image/*" onChange={handleImageChange} required />
            Choose Image
          </label>
          <input type="email" id="emailInput" placeholder="Enter your email" value={email} onChange={handleEmailChange} required />
          <select id="actionSelect" value={action} onChange={handleActionChange}>
            <option value="">Select Action</option>
            <option value="getimage">Get Image</option>
            <option value="upload">Upload Image</option>
          </select>
          <button type="submit">Perform Action</button>
        </form>
        {metadata && (
          <div className="metadata-container">
            <h2>Image Metadata:</h2>
            <p>Width: {metadata.width}px</p>
            <p>Height: {metadata.height}px</p>
            <p>Format: {metadata.format}</p>
            <p>Size: {metadata.size} bytes</p>
            <p>Type: {metadata.type}</p>
          </div>
        )}
        {image && (
          <div className="preview-container">
            <h2>Preview:</h2>
            <img src={image} alt="Preview" className="preview-image" />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
