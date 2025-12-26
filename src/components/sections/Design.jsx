import React from 'react';
import Section from '../ui/Section';
import { designData } from '../../data';
import { Palette, PenTool, Layout } from 'lucide-react';

const icons = {
    Branding: Palette,
    "UI/UX": Layout,
    "Logo Design": PenTool,
};

const Design = () => {
    return (
        <Section id="design">
            <div className="max-w-4xl">
                <h2 className="text-2xl font-bold mb-6 tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
                    UI/UX & Design
                    <span className="text-sm font-normal text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded-full border border-gray-100 dark:border-white/10">
                        Secondary Skill
                    </span>
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-2xl text-lg leading-relaxed">
                    {designData.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {designData.items.map((item, index) => {
                        const Icon = icons[item.type] || Layout;
                        return (
                            <div key={index} className="aspect-square bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-sm flex flex-col items-center justify-center p-6 text-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
                                <Icon className="mb-4 text-gray-400 dark:text-gray-500" size={32} />
                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.title}</h3>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.type}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Section>
    );
};

export default Design;
