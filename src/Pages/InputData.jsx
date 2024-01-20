import React, { useState } from 'react';
import './InputData.css';

const InputData = () => {
  const [targetVariable, setTargetVariable] = useState('');
  const [fileInputText, setFileInputText] = useState('Or drop your CSV file here');
  const [selectedFile, setSelectedFile] = useState(null);
  const [showDiagram, setShowDiagram] = useState(false);
  const [error, setError] = useState('');
  const [fileError, setFileError] = useState('');

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileInputText(file.name);
      setSelectedFile(file);
    }
  };

  const handleDiagramCheckboxChange = () => {
    setShowDiagram(!showDiagram);
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

    const allowedExtension = 'csv';
    const fileExtension = selectedFile.name.split('.').pop().toLowerCase();

    if (!fileExtension.endsWith(allowedExtension)) {
      setFileError('Invalid file type. Please select a CSV file.');
      return;
    } else {
      setFileError('');
    }

    const formData = new FormData();

    formData.append('targetVariable', targetVariable);
    formData.append('showDiagram', showDiagram);
    formData.append('csvFile', selectedFile);

    try {
      const response = await fetch('http://127.0.0.1:8001/prediction/receiveFormData/', {
        method: 'POST',
        body: formData,
      });
  
      if (response.ok) {
        const responseData = await response.json();
        console.log('Form data sent successfully');
        console.log('API Response:', responseData);
      } else {
        console.error('Error sending form data');
      }
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  return (
    <div className="input-data-container">
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
          <input type="checkbox" onChange={handleDiagramCheckboxChange} />
          Check this if you want to see the result as a diagram
        </div>

        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>
    </div>
  );
};

export default InputData;
