import React from 'react';
import Hero from './components/sections/Hero';
import Projects from './components/sections/Projects';
import Skills from './components/sections/Skills';
import Design from './components/sections/Design';
import AboutKey from './components/sections/AboutKey';
import Contact from './components/sections/Contact';
import Header from './components/layout/Header';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <main className="bg-white dark:bg-black min-h-screen transition-colors duration-300 text-gray-900 dark:text-white">
        <Header />
        <Hero />
        <Projects />
        <Skills />
        <Design />
        <AboutKey />
        <Contact />
      </main>
    </ThemeProvider>
  );
}

export default App;
