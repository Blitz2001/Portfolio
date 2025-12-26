import React from 'react';
import { contactData } from '../../data';

const Contact = () => {
    return (
        <footer id="contact" className="py-20 px-6 border-t border-gray-100 dark:border-white/10 text-center">
            <div className="flex justify-center gap-8 mb-8">
                <a href={contactData.linkedin} className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">LinkedIn</a>
                <a href={contactData.github} className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">GitHub</a>
                <a href={`mailto:${contactData.email}`} className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors">Email</a>
            </div>
            <p className="text-sm text-gray-400 dark:text-gray-600">
                &copy; {new Date().getFullYear()} Arunu Sampath. Built with React & Tailwind.
            </p>
        </footer>
    );
};

export default Contact;
