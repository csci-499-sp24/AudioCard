import "/styles/globals.css";
import React, { useState, useEffect } from 'react';

export default function App({ Component, pageProps }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setIsDarkMode(prevDarkMode => !prevDarkMode);
  };

  useEffect(() => {
    const body = document.body;
    if (isDarkMode) {
      body.classList.add('dark-mode');
    } else {
      body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    setIsDarkMode(savedMode === 'true');
  }, []);

  useEffect(() => {
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);
  return (
  <div>
  <Component isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  </div>)

}