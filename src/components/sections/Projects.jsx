import React from 'react';
import Section from '../ui/Section';
import { heroData } from '../../data';
import { ArrowUpRight, Github, Calendar, Trophy, Globe, ArrowDown, Loader2 } from 'lucide-react';
import { useGitHubProjects } from '../../hooks/useGitHubProjects';
import { motion } from 'framer-motion';

const Projects = () => {
    const { projects, loading, loadMore, hasMore, loadingMore } = useGitHubProjects(heroData.githubUsername);

    if (loading && projects.length === 0) return null;

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        }
    };

    // Image Curtain Reveal Variant
    const imageRevealVariants = {
        hidden: { scale: 1.1, filter: "blur(10px)" }, // Start zoomed in slightly
        visible: {
            scale: 1,
            filter: "blur(0px)",
            transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <Section id="projects" width="max-w-7xl">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-gray-900 dark:text-white mb-20 text-center md:text-left">
                Selected Works
            </h2>

            <div className="flex flex-col gap-32">
                {projects.map((project, index) => {
                    const screenshotUrl = project.links.live
                        ? `https://api.microlink.io/?url=${encodeURIComponent(project.links.live)}&screenshot=true&meta=false&embed=screenshot.url`
                        : null;

                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-10%" }}
                            className="flex flex-col gap-6"
                        >

                            {/* Header */}
                            <div>
                                <h3 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
                                    {project.title}
                                </h3>
                                <p className="text-xl text-gray-500 dark:text-gray-400 font-light">
                                    Web Application
                                </p>
                            </div>

                            {/* Main Grid */}
                            <div className="grid lg:grid-cols-[2fr_1fr] gap-8 lg:gap-16">

                                {/* Preview Image Container */}
                                <div className="aspect-video rounded-lg border border-gray-200 dark:border-white/10 overflow-hidden relative group bg-gray-100 dark:bg-white/5">
                                    <motion.div
                                        className="w-full h-full"
                                        variants={imageRevealVariants}
                                    >
                                        {screenshotUrl ? (
                                            <img
                                                src={screenshotUrl}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}

                                        {/* Fallback / No Image State */}
                                        <div
                                            className="w-full h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 p-8 text-center bg-gray-100 dark:bg-zinc-800"
                                            style={{ display: screenshotUrl ? 'none' : 'flex' }}
                                        >
                                            <Globe size={48} className="mb-4 opacity-50" />
                                            <span className="font-bold text-2xl tracking-tight mb-2">Preview Unavailable</span>
                                            <span className="text-sm font-mono opacity-70 uppercase tracking-widest">
                                                {project.links.live ? 'Live Link Active' : 'Code Only Project'}
                                            </span>
                                        </div>
                                    </motion.div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-sm z-10">
                                        {project.links.live && (
                                            <a href={project.links.live} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-white text-black rounded-full font-bold hover:scale-105 transition-transform">
                                                Visit Site
                                            </a>
                                        )}
                                        <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-black text-white border border-white/20 rounded-full font-bold hover:scale-105 transition-transform flex items-center gap-2">
                                            <Github size={18} /> Code
                                        </a>
                                    </div>
                                </div>

                                {/* Tech Stack */}
                                <div className="flex flex-col gap-6">
                                    <h4 className="text-xl font-medium text-gray-900 dark:text-white">Tech Stack</h4>
                                    <div className="flex flex-wrap gap-3">
                                        {project.tech.map((tech, tIdx) => (
                                            <motion.span
                                                key={tIdx}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full cursor-default"
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Footer Details */}
                            <div className="grid md:grid-cols-[1fr_2fr_auto] gap-8 border-t border-gray-100 dark:border-white/10 pt-8 mt-4">
                                <div className="space-y-4">
                                    <div>
                                        <span className="block text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">Type</span>
                                        <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                                            <Trophy size={16} /> Personal Project
                                        </span>
                                    </div>
                                    <div>
                                        <span className="block text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-1">Year</span>
                                        <span className="text-gray-900 dark:text-white font-medium flex items-center gap-2">
                                            <Calendar size={16} /> 2024
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <span className="block text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest mb-2">Description</span>
                                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light">
                                        {project.description}
                                    </p>
                                </div>

                                <div className="flex items-end justify-end">
                                    {project.links.live ? (
                                        <motion.a
                                            href={project.links.live}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, rotate: 45 }}
                                            className="p-4 rounded-full border border-gray-200 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-900 dark:text-white"
                                        >
                                            <ArrowUpRight size={24} />
                                        </motion.a>
                                    ) : (
                                        <motion.a
                                            href={project.links.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                            className="p-4 rounded-full border border-gray-200 dark:border-white/20 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-900 dark:text-white"
                                        >
                                            <Github size={24} />
                                        </motion.a>
                                    )}
                                </div>
                            </div>

                        </motion.div>
                    );
                })}
            </div>

            {/* Load More Button */}
            {hasMore && (
                <div className="flex justify-center mt-20">
                    <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        className="group relative px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
                    >
                        <span className="relative flex items-center gap-2 z-10">
                            {loadingMore ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Loading...
                                </>
                            ) : (
                                <>
                                    Load More Projects
                                    <ArrowDown size={20} className="group-hover:translate-y-1 transition-transform" />
                                </>
                            )}
                        </span>
                    </button>
                </div>
            )}
        </Section>
    );
};

export default Projects;
