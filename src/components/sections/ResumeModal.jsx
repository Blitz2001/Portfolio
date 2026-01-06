import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, ExternalLink, Mail, Phone, MapPin, Github, Linkedin, Globe } from 'lucide-react';
import resumeFile from '../../assets/Resume_3.pdf';

const ResumeModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-zinc-900 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-white/10"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-zinc-900 z-10">
                            <h2 className="text-xl font-bold text-white">Resume</h2>

                            <div className="flex items-center gap-4">
                                <a
                                    href={resumeFile}
                                    download="Arunu_Sampath_Resume.pdf"
                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm font-medium"
                                >
                                    <Download size={16} />
                                    Download PDF
                                </a>

                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-red-500/20 text-gray-400 hover:text-red-400 rounded-full transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 overflow-y-auto bg-white p-8 md:p-12 custom-scrollbar text-gray-900">
                            <div className="max-w-3xl mx-auto space-y-6">
                                {/* Resume Header */}
                                <div className="text-center space-y-2 border-b-2 border-gray-800 pb-6">
                                    <h1 className="text-4xl font-bold uppercase tracking-wide text-gray-900">Arunu Sampath</h1>
                                    <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-gray-700 font-medium">
                                        <span className="flex items-center gap-1"><MapPin size={14} /> Colombo, Sri Lanka</span>
                                        <div className="hidden sm:block">|</div>
                                        <a href="mailto:arunu.1w@gmail.com" className="flex items-center gap-1 hover:text-blue-600"><Mail size={14} /> arunu.1w@gmail.com</a>
                                        <div className="hidden sm:block">|</div>
                                        <a href="tel:+94771629691" className="flex items-center gap-1 hover:text-blue-600"><Phone size={14} /> +94-771629691</a>
                                    </div>
                                    <div className="flex justify-center gap-4 text-sm font-bold pt-1">
                                        <a href="#" className="hover:text-blue-600">GitHub</a>
                                        <span>|</span>
                                        <a href="#" className="hover:text-blue-600">LinkedIn</a>
                                        <span>|</span>
                                        <a href="#" className="hover:text-blue-600">Portfolio</a>
                                    </div>
                                </div>

                                {/* Summary */}
                                <section>
                                    <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-2 pb-1 text-blue-900">Summary</h3>
                                    <p className="text-sm leading-relaxed text-gray-800">
                                        Undergraduate Software Engineer specializing in the MERN stack. Experienced in building scalable platforms with
                                        role-based access control, payment integrations, and real-time systems.
                                    </p>
                                </section>

                                {/* Education */}
                                <section>
                                    <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-blue-900">Education</h3>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h4 className="font-bold text-gray-900">Sri Lanka Institute of Information Technology (SLIIT)</h4>
                                        <span className="text-sm font-semibold text-gray-600 italic">Expected Grad Date: 2027</span>
                                    </div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="italic">BSc (Hons) in Information Technology – Data Science</span>
                                        <span className="font-semibold">GPA: 3.54 / 4.0</span>
                                    </div>
                                    <ul className="list-disc list-inside text-sm text-gray-700 ml-2">
                                        <li><span className="font-semibold">Relevant Coursework:</span> Object-Oriented Programming, Database Design, Statistics.</li>
                                    </ul>
                                </section>

                                {/* Technical Skills */}
                                <section>
                                    <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-blue-900">Technical Skills</h3>
                                    <ul className="list-disc list-outside ml-5 text-sm space-y-1 text-gray-800">
                                        <li><span className="font-bold">Languages:</span> JavaScript (ES6+), Java, C++, SQL, HTML5, CSS3.</li>
                                        <li><span className="font-bold">Frameworks/Tools:</span> React.js, Node.js, Express.js, MongoDB, Docker, Git, Cloudinary.</li>
                                        <li><span className="font-bold">Specialized:</span> RESTful API Design, JWT, Socket.io, Google Gemini API.</li>
                                    </ul>
                                </section>

                                {/* Technical Projects */}
                                <section className="space-y-4">
                                    <h3 className="text-lg font-bold uppercase border-b border-gray-300 mb-3 pb-1 text-blue-900">Technical Projects</h3>

                                    {/* Project 1 */}
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-gray-900">SerendibGo – Unified Travel Platform</h4>
                                            <span className="text-xs text-gray-500 italic">React, Node.js, MongoDB, Docker, Google Gemini API</span>
                                        </div>
                                        <ul className="list-disc list-outside ml-5 text-sm text-gray-700 mt-1 space-y-1">
                                            <li>Built a full-stack marketplace with 4 distinct user roles (Admin, Guide, Hotel, Traveler) using a microservices-oriented approach.</li>
                                            <li>Integrated <span className="font-semibold">Stripe API</span> for secure transactions and <span className="font-semibold">Google Gemini API</span> for real-time, AI-powered travel recommendations.</li>
                                            <li>Containerized the environment using <span className="font-semibold">Docker</span>, ensuring 100% consistency between development and production.</li>
                                        </ul>
                                    </div>

                                    {/* Project 2 */}
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-gray-900">ProAssignment – Management System</h4>
                                            <span className="text-xs text-gray-500 italic">React, Node.js, Express, MongoDB, Socket.io</span>
                                        </div>
                                        <ul className="list-disc list-outside ml-5 text-sm text-gray-700 mt-1 space-y-1">
                                            <li>Developed <span className="font-semibold">50+ REST API endpoints</span> across 14 route modules, improving system modularity and data retrieval speed.</li>
                                            <li>Implemented <span className="font-semibold">real-time notifications</span> and live chat via <span className="font-semibold">Socket.io</span>, significantly reducing communication latency.</li>
                                            <li>Optimized database performance through <span className="font-semibold">custom indexing</span> on MongoDB, enhancing search efficiency for large datasets.</li>
                                            <li className="list-none flex items-center gap-1 mt-1 text-blue-700 font-medium">
                                                <ExternalLink size={12} /> <a href="#" className="hover:underline">Live Demo: ProAssignment - Professional Assignment Services</a>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Project 3 */}
                                    <div>
                                        <div className="flex justify-between items-baseline">
                                            <h4 className="font-bold text-gray-900">Geekspot – Tech E-Commerce Platform</h4>
                                            <span className="text-xs text-gray-500 italic">Vite, Tailwind, Node.js, Cloudinary, PDFKit</span>
                                        </div>
                                        <ul className="list-disc list-outside ml-5 text-sm text-gray-700 mt-1 space-y-1">
                                            <li>Built a full order lifecycle and an automated <span className="font-semibold">PDF invoice generation</span> engine, streamlining the post-purchase user experience.</li>
                                            <li>Optimized media delivery using <span className="font-semibold">Cloudinary</span>, reducing page load weight by approximately <span className="font-semibold">40%</span>.</li>
                                            <li>Designed a real-time <span className="font-semibold">Admin Dashboard</span> for inventory management and sales analytics.</li>
                                            <li className="list-none flex gap-4 mt-1 text-blue-700 font-medium">
                                                <span className="flex items-center gap-1"><Github size={12} /> <a href="https://github.com/Blitz2001/geekspot" target="_blank" rel="noopener noreferrer" className="hover:underline">GitHub</a></span>
                                                <span className="flex items-center gap-1"><ExternalLink size={12} /> <a href="#" className="hover:underline">Live Demo</a></span>
                                            </li>
                                        </ul>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ResumeModal;
