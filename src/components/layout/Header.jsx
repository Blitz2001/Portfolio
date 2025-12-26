import React from 'react';
import { contactData } from '../../data';
import ThemeToggle from '../ui/ThemeToggle';

const Header = () => {
    return (
        <header className="fixed top-0 left-0 right-0 z-40 px-6 md:px-12 py-8 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-sm transition-colors duration-300">
            <div className="text-xl font-bold tracking-tighter text-gray-900 dark:text-white">
                BlitzAS
            </div>

            <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-500 dark:text-gray-400">
                <a href={contactData.github} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">github</a>
                <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">linkedin</a>
                <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 dark:hover:text-white transition-colors">resume</a>
            </nav>

            <div className="flex items-center gap-6">
                <a href={`mailto:${contactData.email}`} className="hidden md:block text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                    {contactData.email}
                </a>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;
