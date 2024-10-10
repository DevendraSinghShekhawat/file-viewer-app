// src/components/DocxToPdfViewer.js
import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import PdfViewer from './PdfViewer'; // Use your existing PdfViewer component
import html2pdf from 'html2pdf.js';

const DocxToPdfViewer = ({ fileUrl }) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  useEffect(() => {
    const convertDocxToPdf = async () => {
      try {
        // Fetch the DOCX file
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Convert DOCX to HTML using mammoth.js
        const { value: htmlContent } = await mammoth.convertToHtml({ arrayBuffer });

        // Create a div to render HTML content for conversion
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;

        // Add necessary styles
        tempDiv.style.position = 'relative';
        tempDiv.style.width = '210mm'; // A4 width
        tempDiv.style.minHeight = '297mm'; // A4 height
        tempDiv.style.padding = '20mm'; // Optional padding
        tempDiv.style.boxSizing = 'border-box';
        tempDiv.style.backgroundColor = '#fff';

        // Append to body
        document.body.appendChild(tempDiv);

        // Wait for the content to render
        setTimeout(async () => {
          const opt = {
            margin: [10, 10, 10, 10],
            filename: 'output.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          };

          const pdfBlob = await html2pdf().from(tempDiv).set(opt).outputPdf('blob');
          const pdfBlobUrl = URL.createObjectURL(pdfBlob);
          setPdfBlobUrl(pdfBlobUrl);

          // Clean up
          document.body.removeChild(tempDiv);
        }, 1000); // Adjust the delay as needed

      } catch (error) {
        console.error('Error converting DOCX to PDF:', error);
      }
    };

    if (fileUrl) {
      convertDocxToPdf();
    }
  }, [fileUrl]);

  return (
    <div>
      {pdfBlobUrl ? (
        <PdfViewer fileUrl={pdfBlobUrl} /> // Reuse your PdfViewer component
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DocxToPdfViewer;