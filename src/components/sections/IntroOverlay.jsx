import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CustomFullStack, CustomDesign, CustomAutomation } from '../ui/Icons';
import GravityParticles from '../ui/GravityParticles';

const IntroOverlay = () => {
    const [isVisible, setIsVisible] = useState(true);

    const handleDismiss = () => {
        setIsVisible(false);
    };

    useEffect(() => {
        // Lock body scroll when overlay is visible
        if (isVisible) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        const handleScroll = (e) => {
            if (isVisible) {
                handleDismiss();
            }
        };

        // Listen for wheel event to dismiss on first scroll attempt
        window.addEventListener('wheel', handleScroll);

        // Also listen for touch move or keys for mobile/accessibility
        window.addEventListener('keydown', handleDismiss);
        window.addEventListener('touchmove', handleScroll);

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('wheel', handleScroll);
            window.removeEventListener('keydown', handleDismiss);
            window.removeEventListener('touchmove', handleScroll);
        };
    }, [isVisible]);

    // Curtain animation variants - Slide Up
    const curtainVariants = {
        visible: { y: 0 },
        exit: {
            y: '-100%',
            transition: { duration: 1, ease: [0.76, 0, 0.24, 1] } // Custom bezier for curtain feel
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.section
                    variants={curtainVariants}
                    initial="visible"
                    exit="exit"
                    className="fixed inset-0 z-[60] bg-[#050505] text-white overflow-y-auto overflow-x-hidden"
                >
                    {/* Interactive Particles Background */}
                    <div className="fixed inset-0 pointer-events-none">
                        <GravityParticles />
                    </div>

                    <div className="min-h-screen w-full flex flex-col items-center justify-start md:justify-center p-4 pt-24 pb-32 md:py-32 relative z-10 text-center">
                        <div>
                            {/* Name & Title */}
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-2xl md:text-7xl font-bold tracking-wider mb-2 uppercase"
                            >
                                Arunu Sampath
                            </motion.h1>

                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-base md:text-2xl text-gray-400 font-medium mb-4 md:mb-6"
                            >
                                Software Engineer
                            </motion.h2>

                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-gray-300 max-w-2xl mx-auto mb-6 md:mb-12 text-xs md:text-lg leading-relaxed font-light"
                            >
                                Architecting scalable, user-centric web solutions with clean code principles.
                            </motion.p>

                            {/* Technical Expertise Box */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                className="border border-cyan-500/30 rounded-xl p-4 md:p-8 bg-white/5 backdrop-blur-sm shadow-[0_0_30px_rgba(6,182,212,0.15)] mb-8 md:mb-12 mx-auto max-w-sm md:max-w-none"
                            >
                                <h3 className="text-[10px] md:text-sm font-bold tracking-widest text-cyan-400 mb-3 md:mb-6 uppercase border-b border-cyan-500/20 pb-2 md:pb-4 inline-block mx-auto px-4">
                                    Technical Expertise
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
                                    <div className="flex flex-col items-center gap-2 md:gap-3 group">
                                        <div className="p-2 md:p-3 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-colors">
                                            <CustomFullStack className="w-5 h-5 md:w-8 md:h-8 text-blue-400" />
                                        </div>
                                        <span className="font-medium text-xs md:text-base">Full-Stack Development</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 md:gap-3 group">
                                        <div className="p-2 md:p-3 bg-purple-500/10 rounded-full group-hover:bg-purple-500/20 transition-colors">
                                            <CustomDesign className="w-5 h-5 md:w-8 md:h-8 text-purple-400" />
                                        </div>
                                        <span className="font-medium text-xs md:text-base">Intuitive Interaction Design</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 md:gap-3 group">
                                        <div className="p-2 md:p-3 bg-emerald-500/10 rounded-full group-hover:bg-emerald-500/20 transition-colors">
                                            <CustomAutomation className="w-5 h-5 md:w-8 md:h-8 text-emerald-400" />
                                        </div>
                                        <span className="font-medium text-xs md:text-base">Efficient Automation</span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Action Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <button
                                    onClick={handleDismiss}
                                    className="px-6 py-2 md:px-8 md:py-3 rounded-full border-2 border-cyan-500 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] text-xs md:text-base"
                                >
                                    Discover My Work
                                </button>

                                <div className="mt-3 md:mt-6 flex flex-col items-center gap-2 text-gray-500 text-[10px] md:text-sm animate-bounce">
                                    <span>or scroll to explore</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.section>
            )}
        </AnimatePresence>
    );
};

export default IntroOverlay;
