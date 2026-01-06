import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ExternalLink, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Cloudinary configuration
const CLOUD_NAME = 'dokj2l4fu';
const ASSETS = [
    {
        id: 'Brand_Style_Guide_new_compressed_rhrpby',
        title: 'Brand Style Guide'
    },
    {
        id: 'Brand_Development_Jigsawmena_R2_compressed_y6qcvs',
        title: 'Jigsawmena Brand Development'
    },
    {
        id: 'logo_proposal-_concept_3_compressed_nnrvrz',
        title: 'Logo Proposal Concept 3'
    },
    {
        id: 'OCRA_-_3_rd_draft_lblcac',
        title: 'OCRA Draft 3'
    },
    {
        id: 'Brand_Manual-_BluePrint_Creative_Group_gd09cv',
        title: 'BluePrint Creative Group Manual'
    }
];

// Smart Image Component that tries multiple URL variations
const CloudinaryThumbnail = ({ publicId, alt, onFound }) => {
    // Variations to try in order. 
    // We add 'pg_1' (Page 1) which is critical for PDF thumbnails
    const [phase, setPhase] = useState(0);
    const [imgSrc, setImgSrc] = useState(null);

    const getUrl = (pId, variant) => {
        const baseUrl = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

        switch (variant) {
            case 0: return `${baseUrl}/pg_1/brand-identity/${pId}.jpg`; // Folder + JPG
            case 1: return `${baseUrl}/pg_1/${pId}.jpg`;                // Root + JPG
            case 2: return `${baseUrl}/brand-identity/${pId}.jpg`;      // Folder + JPG (No pg_1)
            case 3: return `${baseUrl}/${pId}.jpg`;                     // Root + JPG (No pg_1)
            default: return null;
        }
    }

    // Initialize first URL
    if (!imgSrc && phase === 0) {
        setImgSrc(getUrl(publicId, 0));
    }

    const handleError = () => {
        const nextPhase = phase + 1;
        const nextUrl = getUrl(publicId, nextPhase);
        if (nextUrl) {
            // console.log(`Retrying image ${publicId} with variant ${nextPhase}`);
            setPhase(nextPhase);
            setImgSrc(nextUrl);
        } else {
            // All attempts failed
            setImgSrc('FAILED');
        }
    };

    const handleLoad = () => {
        // Image loaded successfully!
        // Report the full path context (folder or root) so the viewer knows how to construct page URLs
        let assetPath = '';

        if (phase === 0 || phase === 2) {
            // It was in the folder.
            assetPath = `brand-identity/${publicId}`;
        } else {
            // It was in root
            assetPath = `${publicId}`;
        }

        // Pass back the asset path (e.g., 'brand-identity/xyz' or 'xyz')
        if (onFound) onFound(assetPath);
    };

    if (imgSrc === 'FAILED') {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-gray-400 dark:text-gray-600 bg-gray-100 dark:bg-zinc-800/50">
                <FileText size={48} className="mb-4 opacity-50" />
                <span className="text-xs font-mono uppercase tracking-widest opacity-75">Preview N/A</span>
            </div>
        );
    }

    return (
        <img
            src={imgSrc}
            alt={alt}
            onError={handleError}
            onLoad={handleLoad}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
    );
};

const BrandIdentityModal = ({ isOpen, onClose }) => {
    // Store valid asset paths as they are discovered by the thumbnail loader
    const [validPaths, setValidPaths] = useState({});
    const [selectedPdf, setSelectedPdf] = useState(null); // { id, title, path }
    const [pages, setPages] = useState([1]); // Array of page numbers to render
    const [scale, setScale] = useState(1.0);

    const handlePathFound = (id, path) => {
        setValidPaths(prev => ({ ...prev, [id]: path }));
    };

    const handleCardClick = (e, asset) => {
        e.preventDefault();
        const path = validPaths[asset.id] || asset.id;

        setSelectedPdf({
            id: asset.id,
            title: asset.title,
            path: path,
            downloadUrl: `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${path}.pdf`
        });
        setPages([1]); // Reset to just page 1
        setScale(1.0);
    };

    // When a page loads successfully, try to load the next one
    const handlePageLoad = (pageNum) => {
        setPages(prev => {
            // Only add next page if it's the last one currently known and we haven't already added it
            if (pageNum === prev[prev.length - 1]) {
                return [...prev, pageNum + 1];
            }
            return prev;
        });
    };

    // If a page fails (404), it means end of document (or error)
    const handlePageError = (pageNum) => {
        setPages(prev => prev.filter(p => p !== pageNum));
    };

    const getPageUrl = (path, page) => {
        return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/pg_${page}/${path}.jpg`;
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl relative"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-zinc-900 z-10 shrink-0">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Brand Identity Documents</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Comprehensive brand guidelines and manuals</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black/50 custom-scrollbar p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {ASSETS.map((asset, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group relative aspect-[3/4] bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-white/5 flex flex-col"
                                    >
                                        <div className="flex-1 w-full relative overflow-hidden bg-gray-100 dark:bg-zinc-800/50">
                                            <CloudinaryThumbnail
                                                publicId={asset.id}
                                                alt={asset.title}
                                                onFound={(path) => handlePathFound(asset.id, path)}
                                            />
                                        </div>
                                        <div className="p-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-white/5 flex items-center justify-between z-20 relative">
                                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate flex-1 pr-2">{asset.title}</span>
                                        </div>
                                        <a
                                            href="#"
                                            onClick={(e) => handleCardClick(e, asset)}
                                            className="absolute inset-0 z-10 bg-black/0 group-hover:bg-black/10 dark:group-hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-end p-6 opacity-0 group-hover:opacity-100"
                                        >
                                            <div className="w-full pt-4 pb-2 px-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 rounded-lg text-center shadow-lg mb-12">
                                                <p className="font-semibold text-gray-900 dark:text-white text-sm line-clamp-1">{asset.title}</p>
                                                <div className="flex items-center justify-center gap-2 mt-2 text-xs text-blue-500 font-medium">
                                                    <span>View Book</span>
                                                    <ExternalLink size={12} />
                                                </div>
                                            </div>
                                        </a>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Internal PDF Viewer Overlay (Image Scroll) */}
                        <AnimatePresence>
                            {selectedPdf && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="absolute inset-0 z-50 bg-white dark:bg-zinc-900 flex flex-col"
                                >
                                    {/* Viewer Header */}
                                    <div className="p-4 border-b border-gray-100 dark:border-white/10 flex justify-between items-center bg-white dark:bg-zinc-900 z-50 shadow-sm">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate pr-4 max-w-[30%]">
                                            {selectedPdf.title}
                                        </h3>

                                        {/* Controls */}
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 rounded-lg p-1">
                                                <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md">
                                                    <ZoomOut size={20} />
                                                </button>
                                                <span className="text-sm font-medium w-12 text-center">
                                                    {Math.round(scale * 100)}%
                                                </span>
                                                <button onClick={() => setScale(s => Math.min(2.0, s + 0.1))} className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md">
                                                    <ZoomIn size={20} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <a
                                                href={selectedPdf.downloadUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-blue-500"
                                                title="Open Original PDF"
                                            >
                                                <ExternalLink size={20} />
                                            </a>
                                            <button
                                                onClick={() => setSelectedPdf(null)}
                                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                                            >
                                                <X size={24} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Verified Viewer Container (Vertical Scroll) */}
                                    <div className="flex-1 bg-gray-50 dark:bg-black/90 overflow-auto flex justify-center p-8 custom-scrollbar">
                                        <div className="flex flex-col items-center gap-8 w-full transition-all duration-200 ease-out">
                                            {pages.map((pageNum) => (
                                                <div key={pageNum} className="relative shadow-2xl bg-white min-h-[200px] flex items-center justify-center transition-all duration-200"
                                                    style={{ width: `${scale * 100}%`, maxWidth: scale > 1 ? 'none' : '1000px' }}
                                                >
                                                    {/* Show spinner only if it's the last page being loaded */}
                                                    {pageNum === pages[pages.length - 1] && (
                                                        <div className="absolute inset-0 flex items-center justify-center -z-10 bg-white">
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                                        </div>
                                                    )}

                                                    <img
                                                        src={getPageUrl(selectedPdf.path, pageNum)}
                                                        alt={`Page ${pageNum}`}
                                                        onLoad={() => handlePageLoad(pageNum)}
                                                        onError={() => handlePageError(pageNum)}
                                                        className="w-full h-auto block"
                                                    />
                                                </div>
                                            ))}

                                            {/* End of Doc Indicator */}
                                            {pages.length > 0 && <div className="h-20 text-gray-500 text-sm italic flex items-center justify-center">End of Document</div>}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default BrandIdentityModal;
