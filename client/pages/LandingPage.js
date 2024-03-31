import React from 'react';
import { useRouter } from 'next/router';
import { useDarkMode } from '@/utils/darkModeContext';
import styles from "../styles/landingPage.module.css"

const LandingPage = () => {
    const router = useRouter();
    const { isDarkMode, toggleDarkMode } = useDarkMode();

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSignup = () => {
        router.push('/signup');
    };

    return (
        <div className={`${styles.pages} ${styles.container}`}>
            {/* Navigation */}
            <nav>
                {/* Logo */}
                <div className={`${styles.row} ${styles.logoContainer}`}>
                    <div className={`${styles.col} ${styles.logo}`}>
                        AudioCard
                    </div>
                </div>
                
                <div className={`${styles.row} ${styles.authButtonsContainer}`}>
                    <div className={`${styles.col} ${styles.authButtons}`}>
                        {/* Login and Signup Buttons */}
                        <button onClick={handleLogin}>Login</button>
                        <button onClick={handleSignup}>Signup</button>
                    </div>

                    <div className='container d-flex justify-content-end'>
                        {/* Light/Dark Mode Toggle */}
                        <button className={styles.darkModeToggle} onClick={toggleDarkMode}>
                            {isDarkMode ? <i className="bi bi-brightness-high"></i> : <i className="bi bi-moon"></i>}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Welcome Message */}
            <div className={`${styles.row} ${styles.welcomeMessageContainer}`}> 
                <div className={`${styles.col} ${styles.welcomeMessage}`}>
                    <h1>Welcome to AudioCard</h1>
                    <p>Experience the power of audio learning like never before.</p>
                    {/* Wave effect */}
                    <div className={styles.wave}></div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
