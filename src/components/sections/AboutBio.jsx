import React from 'react';
import Section from '../ui/Section';
import GravityParticles from '../ui/GravityParticles';
// Importing the image directly if possible, or using the path.
// Assuming relative path from this component to assets
import profileImage from '../../assets/dp gmail.jpg';
import resumePdf from '../../assets/Resume_3.pdf';

const AboutBio = () => {
    return (
        <Section id="about" className="bg-transparent relative overflow-hidden py-24">
            {/* Particles Background - Only visible in dark mode to avoid cluttering light mode */}
            <div className="absolute inset-0 z-0 opacity-40 dark:opacity-40">
                <GravityParticles />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 text-gray-900 dark:text-white">

                {/* Header / Intro */}
                <div className="flex flex-col md:flex-row gap-12 mb-16 items-start">
                    {/* Image Column */}
                    <div className="shrink-0">
                        <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl">
                            <img
                                src={profileImage}
                                alt="Arunu Sampath"
                                className="w-full h-full object-cover"
                            />
                            {/* Glow Effect */}
                            <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10"></div>
                        </div>
                        <div className="mt-4 inline-block bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-blue-200 dark:border-blue-500/30">
                            Who Am I
                        </div>
                    </div>

                    {/* Bio Text Column */}
                    <div className="flex-1">
                        <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight text-gray-900 dark:text-white">
                            Who is <span className="text-gray-500 dark:text-gray-400">Arunu Sampath?</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                            I am currently an undergraduate at <strong className="text-gray-900 dark:text-white">SLIIT</strong>, specializing in <strong className="text-gray-900 dark:text-white">Data Science</strong>. My passion lies at the intersection of data-driven insights and interactive web applications.
                        </p>
                        <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-6">
                            While my academic focus is on data, my practical expertise covers the entire <strong className="text-gray-900 dark:text-white">MERN Stack ecosystem</strong>. I am dedicated to building scalable digital solutions that look as good as they perform, constantly expanding my knowledge in <strong className="text-gray-900 dark:text-white">AI automation</strong> and modern web architectures.
                        </p>
                    </div>
                </div>

                {/* Cards Section: Education & Competencies */}
                <div className="grid md:grid-cols-2 gap-8 mt-32">

                    {/* Education Card */}
                    <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-sm border border-gray-200 dark:border-white/10 rounded-2xl p-8 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors duration-300">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 rounded-full flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M12 14l9-5-9-5-9 5 9 5z" />
                                    <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Education</h3>
                            </div>
                        </div>

                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">BSc (Hons) in Information Technology</h4>
                        <p className="text-purple-600 dark:text-purple-400 font-medium mb-4">Specializing in Data Science</p>

                        <div className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-400">
                            <p>Sri Lanka Institute of Information Technology (SLIIT)</p>
                            <p>Expected Graduation: 2027</p>
                        </div>
                    </div>

                    {/* Core Competencies */}
                    <div className="flex flex-col justify-center">
                        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-6">Core Competencies</h3>
                        <div className="flex flex-wrap gap-3">
                            {['Full-Stack Development (MERN)', 'Data Science & Analytics', 'AI & Automation (n8n, Agents)', 'Interactive UI Design'].map((tag, i) => (
                                <span key={i} className="px-4 py-2 bg-gray-100 border border-gray-200 text-gray-700 dark:bg-white/5 dark:border-white/10 dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-white/10 dark:hover:border-white/20 transition-colors rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </Section>
    );
};

export default AboutBio;
