import React, { useState } from 'react';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Design from './components/sections/Design';
import AboutBio from './components/sections/AboutBio';
import Contact from './components/sections/Contact';
import Header from './components/layout/Header';
import IntroOverlay from './components/sections/IntroOverlay';
import ResumeModal from './components/sections/ResumeModal';
import ScrollToTop from './components/ui/ScrollToTop';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  return (
    <ThemeProvider>
      <main className="bg-white dark:bg-black min-h-screen transition-colors duration-300 text-gray-900 dark:text-white">
        <Header onOpenResume={() => setIsResumeOpen(true)} />
        <IntroOverlay />
        <Hero />
        <Projects />
        <Skills />
        <Design />
        <AboutBio />
        <Contact onOpenResume={() => setIsResumeOpen(true)} />

        <ResumeModal
          isOpen={isResumeOpen}
          onClose={() => setIsResumeOpen(false)}
        />
        <ScrollToTop />
      </main>
    </ThemeProvider>
  );
}

export default App;
