// src/components/DocxViewer.js
import React, { useEffect, useState } from 'react';
import mammoth from 'mammoth';
import styled from 'styled-components';

// Styled container to maintain consistency
const StyledContainer = styled.div`
  padding: 20px;
  height: 750px;
  overflow-y: scroll;
  border: 1px solid rgba(0, 0, 0, 0.3);
  font-family: 'Arial', sans-serif; // Ensure consistent font
  font-size: 16px; // Set default font size
  line-height: 1.6; // Set line height for better readability
`;

const DocxViewer = ({ fileUrl }) => {
  const [docContent, setDocContent] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDocContent = async () => {
      try {
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Error fetching file: ${response.statusText}`);
        
        const arrayBuffer = await response.arrayBuffer();
        const { value } = await mammoth.convertToHtml({ arrayBuffer });
        setDocContent(value);
      } catch (err) {
        setError(`Error loading DOCX file: ${err.message}`);
      }
    };
    if (fileUrl) {
      fetchDocContent();
    }
  }, [fileUrl]);

  return (
    <StyledContainer>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <div dangerouslySetInnerHTML={{ __html: docContent }} />}
    </StyledContainer>
  );
};

export default DocxViewer;