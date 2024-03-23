import React, { useState } from 'react';
import styles from '../../styles/LightDarkMode.module.css';

const LightDarkMode = () => {
    const [darkMode, setDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setDarkMode(prevMode => !prevMode);
        // Additional logic for toggling dark mode can be added here
    };

    return (
        <button className={`${styles.toggleButton} ${darkMode ? styles.darkMode : ''}`} onClick={toggleDarkMode}>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
    );
};

export default LightDarkMode;
