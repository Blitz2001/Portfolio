import React from 'react';
import { motion } from 'framer-motion';

const Section = ({ children, id, className = "", width = "max-w-5xl", delay = 0 }) => {
    return (
        <section id={id} className={`py-20 md:py-28 px-6 md:px-12 ${width} mx-auto ${className}`}>
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: delay }}
            >
                {children}
            </motion.div>
        </section>
    );
};

export default Section;
