import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Core PDF.js worker setup
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Fix for Vite: Load worker directly from node_modules via Vite's asset handling
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

const PdfThumbnail = ({ url }) => {
    const [numPages, setNumPages] = useState(null);
    const [loadError, setLoadError] = useState(null);

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setLoadError(null);
    }

    function onDocumentLoadError(error) {
        console.error('PDF Load Error:', error);
        setLoadError(error);
    }

    if (loadError) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 dark:bg-zinc-800 p-4 text-center">
                <div className="text-red-500 mb-2">⚠️</div>
                <span className="text-xs text-red-500 break-words block max-w-full">
                    {loadError.message || 'Failed to load PDF'}
                </span>
            </div>
        );
    }

    return (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-zinc-800 overflow-hidden relative">
            <Document
                file={url}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="h-12 w-12 bg-gray-300 dark:bg-white/10 rounded-lg mb-2"></div>
                        <span className="text-xs text-gray-400">Loading PDF...</span>
                    </div>
                }
                className="w-full h-full flex items-center justify-center"
            >
                <Page
                    pageNumber={1}
                    width={300}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="shadow-sm max-w-full max-h-full object-contain"
                />
            </Document>
        </div>
    );
};

export default PdfThumbnail;
