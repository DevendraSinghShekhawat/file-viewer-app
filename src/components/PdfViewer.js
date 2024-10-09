// src/components/PdfViewer.js
import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { zoomPlugin } from '@react-pdf-viewer/zoom';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/zoom/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

const PdfViewer = ({ fileUrl }) => {
  // Initialize plugins
  const zoomPluginInstance = zoomPlugin();
  const pageNavigationPluginInstance = pageNavigationPlugin();

  // Initialize the default layout plugin with custom toolbar
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    sidebarTabs: () => [], // Remove all sidebar tabs
    renderToolbar: (Toolbar) => (
      <Toolbar>
        {(slots) => {
          const {
            ZoomInButton,
            ZoomOutButton,
            ZoomPopover,
          } = zoomPluginInstance;
          const {
            GoToNextPage,
            GoToPreviousPage,
            CurrentPageInput,
            NumberOfPages,
          } = pageNavigationPluginInstance;

          return (
            <div
              style={{
                alignItems: 'center',
                display: 'flex',
                width: '100%',
              }}
            >
              {/* Pagination controls */}
              <div style={{ padding: '0px 2px' }}>
                <GoToPreviousPage />
              </div>
              <div
                style={{
                  padding: '0px 2px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <CurrentPageInput /> / <NumberOfPages />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <GoToNextPage />
              </div>

              {/* Spacer to push zoom controls to the right */}
              <div style={{ flexGrow: 1 }}></div>

              {/* Zoom controls */}
              <div style={{ padding: '0px 2px' }}>
                <ZoomOutButton />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomPopover />
              </div>
              <div style={{ padding: '0px 2px' }}>
                <ZoomInButton />
              </div>
            </div>
          );
        }}
      </Toolbar>
    ),
  });

  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
      <div
        style={{
          border: '1px solid rgba(0, 0, 0, 0.3)',
          height: '750px',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Viewer
          fileUrl={fileUrl}
          plugins={[
            defaultLayoutPluginInstance,
            zoomPluginInstance,
            pageNavigationPluginInstance,
          ]}
        />
      </div>
    </Worker>
  );
};

export default PdfViewer;