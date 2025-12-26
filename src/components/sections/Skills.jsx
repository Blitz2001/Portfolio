import React from 'react';
import Section from '../ui/Section';
import { skillsData } from '../../data';

const Skills = () => {
    return (
        <Section id="skills" className="bg-gray-50/50 dark:bg-white/5">
            <div className="max-w-4xl">
                <h2 className="text-2xl font-bold mb-10 tracking-tight text-gray-900 dark:text-white">Technical Skills</h2>

                <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
                    {skillsData.map((group, index) => (
                        <div key={index}>
                            <h3 className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
                                {group.category}
                            </h3>
                            <ul className="space-y-2">
                                {group.items.map((skill, idx) => (
                                    <li key={idx} className="text-gray-700 dark:text-gray-300 font-medium">
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
