import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen } from 'lucide-react';
import { logoProjects } from '../../data/logoData';

const LogoCollectionModal = ({ isOpen, onClose }) => {
    // 1. Import all images from any subfolder in logo-collection
    // eager: true ensures they are bundled
    const imagesGlob = import.meta.glob('../../assets/logo-collection/**/*.{png,jpg,jpeg,webp}', {
        eager: true
    });

    // 2. Process images into a structure: { folderName: [imagePath1, imagePath2, ...] }
    const projectImages = useMemo(() => {
        const grouped = {};

        Object.keys(imagesGlob).forEach((path) => {
            // path is like "../../assets/logo-collection/wavix/mockup1.jpg"
            const parts = path.split('/');
            // The folder name is the second to last part (e.g., 'wavix')
            // [..., 'assets', 'logo-collection', 'wavix', 'mockup1.jpg']
            const folderName = parts[parts.length - 2];

            if (!grouped[folderName]) {
                grouped[folderName] = [];
            }
            grouped[folderName].push(imagesGlob[path].default);
        });

        return grouped;
    }, [imagesGlob]);

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
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Logo Collection</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Brand identity and logo design portfolio</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full transition-colors text-gray-500 dark:text-gray-400"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content Scroll Area */}
                        <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black/50 custom-scrollbar p-6 space-y-12">

                            {logoProjects.map((project) => {
                                const images = projectImages[project.folder] || [];

                                // Only show projects if they have images, or if we want to show empty state placeholders
                                // For now, let's render the section but show a message if empty
                                return (
                                    <div key={project.id} className="space-y-6">
                                        <div className="border-b border-gray-200 dark:border-white/5 pb-4">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <FolderOpen className="text-blue-500" size={20} />
                                                {project.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-3xl leading-relaxed">
                                                {project.description}
                                            </p>
                                        </div>

                                        {images.length > 0 ? (
                                            <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                                                {images.map((imgSrc, idx) => (
                                                    <motion.div
                                                        key={idx}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        whileInView={{ opacity: 1, y: 0 }}
                                                        viewport={{ once: true }}
                                                        transition={{ delay: idx * 0.05 }}
                                                        className="break-inside-avoid rounded-xl overflow-hidden border border-gray-100 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-zinc-800"
                                                    >
                                                        <img
                                                            src={imgSrc}
                                                            alt={`${project.title} mockup ${idx + 1}`}
                                                            className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500 ease-out"
                                                            loading="lazy"
                                                        />
                                                    </motion.div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="bg-gray-100 dark:bg-white/5 rounded-lg p-8 text-center border-2 border-dashed border-gray-200 dark:border-white/10">
                                                <p className="text-gray-500 dark:text-gray-400">
                                                    No images found for folder: <code className="text-blue-500">{project.folder}</code>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Add images to <code className="bg-gray-200 dark:bg-white/10 px-1 py-0.5 rounded">src/assets/logo-collection/{project.folder}/</code>
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}

                            {logoProjects.length === 0 && (
                                <div className="text-center py-20 text-gray-500">
                                    No projects defined in logoData.js
                                </div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LogoCollectionModal;
