// src/components/DocxToPdfViewer.js
import React, { useState, useEffect } from 'react';
import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import PdfViewer from './PdfViewer'; // Use the updated PdfViewer component

const DocxToPdfViewer = ({ fileUrl }) => {
  const [pdfBlobUrl, setPdfBlobUrl] = useState(null);

  useEffect(() => {
    const convertDocxToPdf = async () => {
      try {
        // Fetch the DOCX file
        const response = await fetch(fileUrl);
        if (!response.ok) throw new Error(`Failed to fetch file: ${response.statusText}`);
        const arrayBuffer = await response.arrayBuffer();

        // Convert DOCX to HTML using mammoth
        const { value: htmlContent } = await mammoth.convertToHtml({ arrayBuffer });

        // Create a hidden div to render the HTML for canvas conversion
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        document.body.appendChild(tempDiv);

        // Convert the HTML content to a canvas using html2canvas
        const canvas = await html2canvas(tempDiv);
        const imgData = canvas.toDataURL('image/png');

        // Create a new PDF document using jsPDF
        const pdfDoc = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210; // Width in mm for A4 page
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

        pdfDoc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // Convert the PDF document to a Blob and create a URL
        const pdfBlob = pdfDoc.output('blob');
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(pdfBlobUrl);

        // Clean up temporary div
        document.body.removeChild(tempDiv);
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
        <PdfViewer fileUrl={pdfBlobUrl} /> // Use the PdfViewer component to render the converted PDF
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DocxToPdfViewer;