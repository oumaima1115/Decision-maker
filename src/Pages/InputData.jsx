import React, { useState } from 'react';
import './InputData.css';

const InputData = () => {
  const [targetVariable, setTargetVariable] = useState('');
  const [fileInputText, setFileInputText] = useState('Or drop your CSV file here');
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');
  const [showImages, setShowImages] = useState(false);
  const [imageUrls, setImageUrls] = useState([]);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInputText(file.name);
      setSelectedFile(file);
    }
  };

  const downloadImage = async (imageUrl) => {
    try {
      const fullImageUrl = `http://127.0.0.1:8001${imageUrl}`;
      const response = await fetch(fullImageUrl);
      const blob = await response.blob();
  
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = imageUrl.split('/').pop();
  
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error(`Error downloading image: ${imageUrl}`, error);
    }
  };
  
  

  const handleDownloadImages = () => {
    console.log(imageUrls); 
    for (let i = 0; i < imageUrls.length; i++) {
      downloadImage(imageUrls[i], i);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!targetVariable.trim()) {
      setError('Target variable cannot be empty');
      return;
    } else {
      setError('');
    }
  
    if (!selectedFile) {
      setFileError('Please select a CSV file');
      return;
    } else {
      setFileError('');
    }
  
    try {
      const formData = new FormData();
      formData.append('targetVariable', targetVariable);
      formData.append('csvFile', selectedFile);
  
      const response = await fetch('http://127.0.0.1:8001/prediction/receiveFormData/', {
        method: 'POST',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
  
      const responseData = await response.json();
  
      if (responseData.status === 'success' && responseData.image_urls) {
        setImageUrls(responseData.image_urls.map(url => `http://127.0.0.1:8001${url}`));
        setShowImages(true);
        handleDownloadImages();
      } else {
        setShowImages(false);
        setImageUrls([]);
      }
    } catch (error) {
      setError('Error submitting form. Please try again.');
      console.error('Error submitting form', error);
    }
  };
  


  return (
    <div className="input-data-container">
      {showImages ? (
        <div className="image-container">
          {imageUrls.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} className="result-image" />
          ))}
          <button className="download-button" onClick={handleDownloadImages}>
            Download Images
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-label">
            Choose the target variable:
            <div className="target-input-container">
              <input
                type="text"
                placeholder="Please write the target"
                value={targetVariable}
                onChange={(e) => setTargetVariable(e.target.value)}
                className="target-input"
              />
            </div>
            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="form-label">
            Select the CSV file to import the data and start prediction
            <div className="file-input-container">
              <label className="file-input-label">
                <input
                  type="file"
                  onChange={handleFileInputChange}
                  className="file-input"
                  accept=".csv"
                />
                <div className="select-csv-button">Select CSV file</div>
                <div className="file-input-text">{fileInputText}</div>
              </label>
              {fileError && <div className="error-message">{fileError}</div>}
            </div>
          </div>

          <div className="form-label">
            <input
              type="checkbox"
              checked={true}
              onChange={() => {}}
            />
            Check this if you want to see the result as a diagram
          </div>

          <button type="submit" className="submit-button">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default InputData;