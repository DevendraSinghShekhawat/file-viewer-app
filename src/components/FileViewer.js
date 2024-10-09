// src/components/FileViewer.js
import React, { useState } from 'react';
import PdfViewer from './PdfViewer'; // Use PdfViewer for both PDF and DOCX (converted to PDF)
import DocxToPdfViewer from './DocxToPdfViewer';
import { debounce } from 'lodash';
import styled from 'styled-components';

const FileViewerContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: #f9f9f9;
`;

const FileViewer = () => {
  const [fileType, setFileType] = useState('pdf'); // State to track file type
  const [fileUrl, setFileUrl] = useState(''); // State to track entered file URL
  const [debouncedFileUrl, setDebouncedFileUrl] = useState(''); // Debounced URL state

  // Debounce the URL input changes to prevent frequent updates
  const handleFileUrlChange = debounce((url) => {
    setDebouncedFileUrl(url);
  }, 1000);

  // Handle URL input changes
  const onUrlChange = (e) => {
    setFileUrl(e.target.value);
    handleFileUrlChange(e.target.value);
  };

  return (
    <FileViewerContainer>
      <h1>File Viewer</h1>
      {/* Dropdown to select file type */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Select File Type:
          <select value={fileType} onChange={(e) => setFileType(e.target.value)} style={{ margin: '0 10px' }}>
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>
        </label>
      </div>

      {/* Input field to enter file URL */}
      <div style={{ marginBottom: '20px' }}>
        <label>
          Enter File URL:
          <input
            type="text"
            value={fileUrl}
            onChange={onUrlChange}
            style={{ margin: '0 10px', width: '400px' }}
          />
        </label>
      </div>

      {/* Conditionally render the appropriate viewer based on file type and URL */}
      {fileType === 'pdf' && debouncedFileUrl ? (
        <PdfViewer fileUrl={debouncedFileUrl} /> // Render PDF viewer
      ) : fileType === 'docx' && debouncedFileUrl ? (
        <DocxToPdfViewer fileUrl={debouncedFileUrl} /> // Convert DOCX to PDF and render
      ) : (
        <p>Please enter a file URL to view the document.</p>
      )}
    </FileViewerContainer>
  );
};

export default FileViewer;