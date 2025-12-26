import React from 'react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import { heroData, contactData } from '../../data';
import heroCharacter from '../../assets/hero-character.jpg';

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

    const imageVariant = {
        hidden: { opacity: 0, x: 20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }
        }
    };

    return (
        <section className="min-h-[85vh] flex flex-col justify-center px-6 md:px-12 max-w-7xl mx-auto pt-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* Text Content (Left) */}
                <motion.div
                    variants={container}
                    initial="hidden"
                    animate="show"
                    className="order-2 lg:order-1"
                >
                    <div className="overflow-hidden mb-6">
                        <motion.h1 variants={item} className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 dark:text-white">
                            {heroData.name}
                        </motion.h1>
                    </div>

                    <div className="overflow-hidden mb-8">
                        <motion.h2 variants={item} className="text-2xl md:text-3xl font-medium text-gray-500 dark:text-gray-400 tracking-tight">
                            {heroData.title}
                        </motion.h2>
                    </div>

                    <div className="overflow-hidden mb-12">
                        <motion.p variants={item} className="text-xl md:text-2xl text-gray-800 dark:text-gray-300 max-w-lg leading-relaxed font-light">
                            {heroData.description}
                        </motion.p>
                    </div>

                    <motion.div variants={item} className="flex gap-6">
                        <Button href="#projects" variant="primary" className="text-lg px-8 py-3 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 rounded-full border-transparent hover:scale-105 transition-transform duration-300">
                            View Work
                        </Button>
                        <Button href={contactData.github} variant="ghost" className="text-lg px-8 py-3 hover:bg-gray-50 dark:hover:bg-white/10 text-gray-900 dark:text-white rounded-full hover:scale-105 transition-transform duration-300">
                            GitHub
                        </Button>
                    </motion.div>
                </motion.div>

                {/* Character Illustration (Right) */}
                <motion.div
                    className="order-1 lg:order-2 flex justify-center lg:justify-end"
                    initial="hidden"
                    animate="visible"
                    variants={imageVariant}
                >
                    <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                        <img
                            src={heroCharacter}
                            alt="Character Illustration"
                            className="w-full h-full object-contain drop-shadow-2xl"
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;
