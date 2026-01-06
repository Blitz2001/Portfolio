import React from 'react';
import Section from '../ui/Section';
import { contactData } from '../../data';

const Contact = ({ onOpenResume }) => {
    return (
        <Section id="contact" className="bg-white text-gray-900 dark:bg-black dark:text-white py-24">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-block border border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-sm uppercase tracking-widest mb-4">
                        Contact
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                        GET IN TOUCH
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">

                    {/* Left Column: Copy & Socials */}
                    <div>
                        <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-10">
                            Secure. Creative. Impactful. Let's work together to build your next big project with confidence.
                        </p>

                        <div className="flex flex-wrap gap-4">
                            <a
                                href={contactData.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20 rounded-lg transition-all font-medium text-gray-700 dark:text-gray-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                                GitHub
                            </a>
                            <a
                                href={contactData.linkedin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20 rounded-lg transition-all font-medium text-gray-700 dark:text-gray-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg>
                                LinkedIn
                            </a>

                            <button
                                onClick={onOpenResume}
                                className="flex items-center gap-3 px-6 py-3 bg-gray-50 border border-gray-200 hover:bg-gray-100 hover:border-gray-300 dark:bg-white/5 dark:border-white/10 dark:hover:bg-white/10 dark:hover:border-white/20 rounded-lg transition-all font-medium text-gray-700 dark:text-gray-200"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                View Resume
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Email Card */}
                    <div className="bg-white border border-gray-200 dark:bg-gray-900/50 dark:border-gray-800 rounded-2xl p-8 md:p-10 relative shadow-xl dark:shadow-none">
                        {/* Green Dot Indicator */}
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">Email</span>
                        </div>

                        <a href="mailto:arunu.1w@gmail.com" className="block text-2xl md:text-3xl font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-8 break-all">
                            arunu.1w@gmail.com
                        </a>

                        <a
                            href="mailto:arunu.1w@gmail.com"
                            className="block w-full text-center bg-gray-900 text-white hover:bg-gray-800 dark:bg-white/5 dark:hover:bg-white/10 dark:border dark:border-white/10 dark:hover:border-white/20 dark:text-white font-bold py-4 rounded-xl transition-all"
                        >
                            GET IN TOUCH
                        </a>
                    </div>

                </div>
            </div>
        </Section>
    );
};

export default Contact;
