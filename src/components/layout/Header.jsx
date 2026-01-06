import React from 'react';
import { contactData } from '../../data';
import ThemeToggle from '../ui/ThemeToggle';
import Resume from '../../assets/Resume_3.pdf';

const Header = ({ onOpenResume }) => {
    const [isScrolled, setIsScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-[70] px-4 md:px-8 py-8 flex items-center justify-between transition-all duration-300 ${isScrolled
                ? 'bg-white/80 dark:bg-black/80 backdrop-blur-md shadow-sm py-4'
                : 'bg-transparent py-8'
                }`}
        >
            <div className={`text-xl font-bold tracking-tighter transition-colors duration-300 ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                BlitzAS
            </div>

            <nav className={`hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-500 dark:text-gray-400' : 'text-white/80'}`}>
                <a href={contactData.github} target="_blank" rel="noopener noreferrer" className={`transition-colors ${isScrolled ? 'hover:text-gray-900 dark:hover:text-white' : 'hover:text-white'}`}>github</a>
                <a href={contactData.linkedin} target="_blank" rel="noopener noreferrer" className={`transition-colors ${isScrolled ? 'hover:text-gray-900 dark:hover:text-white' : 'hover:text-white'}`}>linkedin</a>
                <a
                    href={Resume}
                    onClick={(e) => { e.preventDefault(); onOpenResume(); }}
                    className={`transition-colors cursor-pointer ${isScrolled ? 'hover:text-gray-900 dark:hover:text-white' : 'hover:text-white'}`}
                >
                    resume
                </a>
            </nav>

            <div className="flex items-center gap-6">
                <a href={`mailto:${contactData.email}`} className={`hidden md:block text-sm font-medium transition-colors duration-300 ${isScrolled ? 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white' : 'text-white/80 hover:text-white'}`}>
                    {contactData.email}
                </a>
                <ThemeToggle />
            </div>
        </header>
    );
};

export default Header;
