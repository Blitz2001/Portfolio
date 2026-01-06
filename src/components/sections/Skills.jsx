import React from 'react';
import Section from '../ui/Section';
import { skillsData } from '../../data';
import GravityParticles from '../ui/GravityParticles';

const Skills = () => {
    return (
        <Section id="skills" className="bg-gray-50/50 dark:bg-zinc-900/50 py-20 relative overflow-hidden">
            {/* Background Particles */}
            <div className="absolute inset-0 z-0 opacity-40">
                <GravityParticles />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <h2 className="text-3xl font-bold mb-12 tracking-tight text-gray-900 dark:text-white">Technical Skills</h2>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {skillsData.map((group, index) => (
                        <div key={index}>
                            <h3 className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-6 pb-2 border-b border-gray-200 dark:border-white/10">
                                {group.category}
                            </h3>
                            <ul className="space-y-3">
                                {group.items.map((skill, idx) => (
                                    <li key={idx} className="text-gray-700 dark:text-gray-300 font-medium text-base">
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </Section>
    );
};

export default Skills;
