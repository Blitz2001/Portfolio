import { useState, useEffect } from 'react';
import { projectsData } from '../data';

export const useGitHubProjects = (username) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // If no username provided, fallback immediately
        if (!username) {
            setProjects(projectsData);
            setLoading(false);
            return;
        }

        const fetchProjects = async () => {
            try {
                const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);

                // If rate limited or other error, throw to catch block
                if (!response.ok) {
                    throw new Error(`GitHub API Error: ${response.status}`);
                }

                const data = await response.json();

                // 1. Filter: hosted OR non-forks
                const allRepos = data.filter(repo => !repo.fork);
                const hostedProjects = allRepos.filter(repo => repo.homepage);
                const otherProjects = allRepos.filter(repo => !repo.homepage);

                // Prioritize hosted projects, then others. Limit to 4.
                const finalSelection = [...hostedProjects, ...otherProjects].slice(0, 4);

                if (finalSelection.length === 0) {
                    setProjects(projectsData);
                    return;
                }

                // 2. Enhance with README data
                const enhancedProjects = await Promise.all(finalSelection.map(async (repo) => {
                    let readmeDescription = null;
                    let readmeTech = [];

                    try {
                        const readmeRes = await fetch(`https://api.github.com/repos/${username}/${repo.name}/readme`, {
                            headers: { 'Accept': 'application/vnd.github.raw' }
                        });

                        if (readmeRes.ok) {
                            const text = await readmeRes.text();

                            // Clean text
                            const cleanText = text
                                .replace(/#+\s.*/g, '')
                                .replace(/!\[.*?\]\(.*?\)/g, '')
                                .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
                                .replace(/<[^>]*>/g, '')
                                .trim();

                            const paragraphs = cleanText.split(/\n\s*\n/);
                            if (paragraphs.length > 0) {
                                readmeDescription = paragraphs[0].slice(0, 200) + (paragraphs[0].length > 200 ? '...' : '');
                            }

                            const commonTech = [
                                "React", "Next.js", "Vue", "Angular", "Svelte",
                                "Node.js", "Express", "Python", "Django", "Flask",
                                "Java", "Spring", "C#", ".NET", "Go", "Rust",
                                "MongoDB", "PostgreSQL", "MySQL", "Firebase", "Supabase",
                                "Tailwind", "Bootstrap", "Sass", "Docker", "AWS"
                            ];

                            const foundTech = commonTech.filter(tech =>
                                new RegExp(`\\b${tech}\\b`, 'i').test(text)
                            );

                            if (foundTech.length > 0) {
                                readmeTech = foundTech;
                            }
                        }
                    } catch (err) {
                        console.warn(`Failed to fetch readme for ${repo.name}`, err);
                    }

                    return {
                        title: repo.name,
                        description: readmeDescription || repo.description || "No description available.",
                        highlights: [`Stars: ${repo.stargazers_count}`, repo.language].filter(Boolean),
                        tech: [...new Set([repo.language, ...readmeTech].filter(Boolean))],
                        links: {
                            github: repo.html_url,
                            live: repo.homepage,
                        }
                    };
                }));

                setProjects(enhancedProjects);
            } catch (err) {
                console.warn("GitHub API failed or rate limited, falling back to static data.", err);
                // Fallback to manual data on error
                setProjects(projectsData);
                setError(null); // Clear error since we handled it gracefully
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [username]);

    return { projects, loading, error };
};
