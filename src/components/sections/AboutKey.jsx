import React from 'react';
import Section from '../ui/Section';
import { aboutData } from '../../data';

const AboutKey = () => {
    return (
        <Section id="about" className="bg-gray-900 text-white dark:bg-white/5">
            <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl font-bold mb-6 tracking-tight">Current Focus</h2>
                <p className="text-xl md:text-2xl leading-relaxed font-light text-gray-200 dark:text-gray-300">
                    {aboutData.text}
                </p>
            </div>
        </Section>
    );
};

export default AboutKey;
