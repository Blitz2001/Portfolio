import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../ui/Button';
import { heroData, contactData } from '../../data';
// import heroCharacter3D from '../../assets/hero-character-3d.png';
import heroVideoLoop from '../../assets/0103.mp4';
// const heroVideoLoop = "https://res.cloudinary.com/dokj2l4fu/video/upload/v1704560000/placeholder_video.mp4"; // Placeholder until user uploads to Cloudinary
import { User, Briefcase, Code, Mail, ChevronLeft, ChevronRight } from 'lucide-react'; // Assuming lucide-react is installed, if not will use text or standard icons

const Hero = () => {
    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const sideNavContainer = {
        hidden: { x: 50, opacity: 0 },
        show: {
            x: 0,
            opacity: 1,
            transition: { delay: 1, duration: 0.8, ease: "easeOut" }
        }
    };

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Retract faster than header change, e.g. > 100px
            setIsScrolled(window.scrollY > 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { icon: Code, label: 'Skills', href: '#skills' },
        { icon: User, label: 'About Me', href: '#about' },
        { icon: Briefcase, label: 'Hire Me', href: '#contact' }
    ];

    return (
        <section className="relative min-h-screen overflow-hidden">

            {/* Full Screen Video Background */}
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    webkit-playsinline="true"
                    preload="auto"
                    // poster={heroCharacter3D}
                    className="w-full h-full object-cover object-top"
                >
                    <source src={heroVideoLoop} type="video/mp4" />
                </video>
                {/* Gradient Overlay: Darker on left for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>

            {/* Futuristic Side Navigation - Fixed & Centered */}
            <motion.div
                variants={sideNavContainer}
                initial="hidden"
                animate="show"
                className="fixed right-6 md:right-12 top-[40%] -translate-y-1/2 z-50 flex flex-col items-end gap-4"
            >
                {/* Mobile Toggle Button */}
                <button
                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                    className={`md:hidden p-2 rounded-full transition-all duration-300 mb-2 z-50 ${isScrolled
                        ? 'text-gray-400 hover:text-gray-900 hover:bg-gray-100/50'
                        : 'text-white/30 hover:text-white hover:bg-white/10'
                        }`}
                    aria-label="Toggle Navigation"
                >
                    <motion.div
                        animate={{ rotate: isMobileNavOpen ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronLeft size={24} />
                    </motion.div>
                </button>

                {/* Nav Items Container */}
                <motion.div
                    className="flex flex-col gap-4 items-end overflow-hidden md:overflow-visible"
                    initial={false}
                    animate={{
                        opacity: isMobileNavOpen ? 1 : 0,
                        height: isMobileNavOpen ? 'auto' : 0,
                        x: isMobileNavOpen ? 0 : 20,
                        pointerEvents: isMobileNavOpen ? 'auto' : 'none'
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    style={{ originX: 1 }} // Animate from right
                >
                    {/* Desktop Override: Always show by removing motion props via media query if possible, 
                        but since we can't easily do that in inline styles, we'll keep it simple for mobile 
                        and duplicate for desktop or ensure the parent div layout handles it. 
                        Actually, simplified approach: Use a separate wrapper for mobile animation vs desktop structure.
                     */}
                    {/* FIX: The above motion.div logic applies to mobile. For desktop we need it always visible. 
                         We can use a tailwind md: class to override styles, but framer motion inline styles win.
                         Better Approach: Conditional rendering specifically for mobile animation wrapper vs desktop static.
                      */}
                </motion.div>

                {/* 
                   Wait, I need to preserve the Desktop behavior (Always Visible).
                   The previous code had `md:flex`.
                   I will revert to a structure that separates mobile state from desktop state or handles both gracefully.
                */}

                <div className="flex flex-col gap-4 items-end">
                    {/* Mobile Only Wrapper for Animation */}
                    <motion.div
                        className="md:hidden flex flex-col gap-4 items-end"
                        initial="closed"
                        animate={isMobileNavOpen ? "open" : "closed"}
                        variants={{
                            open: { opacity: 1, height: 'auto', x: 0, display: 'flex' },
                            closed: { opacity: 0, height: 0, x: 20, transitionEnd: { display: 'none' } }
                        }}
                    >
                        {navItems.map((navItem, index) => (
                            <div key={`mobile-${index}`} className="flex items-center gap-2">
                                <a
                                    href={navItem.href}
                                    className={`p-3 rounded-full backdrop-blur-md border ${isScrolled
                                        ? 'bg-white/80 border-gray-200 text-gray-700 dark:bg-black/20 dark:border-white/10 dark:text-white'
                                        : 'bg-white/10 border-white/20 text-white'
                                        }`}
                                >
                                    <navItem.icon size={20} />
                                </a>
                            </div>
                        ))}
                    </motion.div>

                    {/* Desktop Only: Always Visible */}
                    <div className="hidden md:flex flex-col gap-4 items-end">
                        <AnimatePresence>
                            {navItems.map((navItem, index) => (
                                <motion.a
                                    key={index}
                                    href={navItem.href}
                                    layout
                                    initial="collapsed"
                                    animate="collapsed"
                                    whileHover="expanded"
                                    className={`group flex items-center gap-2 p-3 rounded-full backdrop-blur-md border transition-colors duration-300 ${isScrolled
                                        ? 'bg-white/80 border-gray-200 text-gray-700 hover:bg-gray-100 shadow-sm dark:bg-black/20 dark:border-white/10 dark:hover:bg-white/10 dark:text-white/70'
                                        : 'bg-white/10 border-white/20 hover:bg-white/20 text-white'
                                        }`}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <motion.span
                                        variants={{
                                            collapsed: { opacity: 0, width: 0, display: 'none' },
                                            expanded: { opacity: 1, width: 'auto', display: 'block' }
                                        }}
                                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                                        className="text-sm font-medium whitespace-nowrap overflow-hidden"
                                    >
                                        <span className="pl-2 pr-1">{navItem.label}</span>
                                    </motion.span>
                                    <div className="relative flex items-center justify-center w-6 h-6">
                                        <navItem.icon className={`w-5 h-5 transition-colors ${isScrolled ? 'text-gray-700 dark:text-white/70 group-hover:text-gray-900 dark:group-hover:text-white' : 'text-white'}`} />
                                    </div>
                                </motion.a>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </motion.div>

            {/* Content Container - Left Aligned - Absolute at 50% vertical */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="absolute top-1/2 left-0 w-full z-10 -translate-y-1/2 px-4 md:px-8 text-left"
            >
                <div className="overflow-hidden">
                    <motion.h1
                        variants={item}
                        className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter text-white mb-2 drop-shadow-2xl leading-[0.9]"
                    >
                        Code. <br />
                        Create. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Scale.</span>
                    </motion.h1>
                </div>
            </motion.div>

            {/* Bio & Buttons - Center Bottom */}
            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4 text-center flex flex-col items-center gap-6"
            >
                <div className="overflow-hidden">
                    <motion.p variants={item} className="text-lg md:text-xl text-gray-300 leading-relaxed font-light drop-shadow-md">
                        From concept to deployment, I build web applications that look great and perform even better.
                    </motion.p>
                </div>

                <motion.div variants={item} className="flex flex-wrap justify-center gap-5">
                    <Button href="#projects" variant="white" className="text-base px-8 py-3 rounded-full border-0 shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-105 transition-all duration-300 font-medium">
                        View Work
                    </Button>
                    <Button href={contactData.linkedin} target="_blank" rel="noopener noreferrer" variant="ghost" className="text-base px-8 py-3 hover:bg-white/10 text-white border border-white/20 rounded-full backdrop-blur-sm transition-all duration-300 font-medium flex items-center gap-2">
                        Contact Me
                    </Button>
                </motion.div>
            </motion.div>
        </section >
    );
};

export default Hero;
