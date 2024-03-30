import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDarkMode } from '@/utils/darkModeContext';
import styles from "../styles/landingPage.module.css"
import { ASRTestMode } from '../components/ASR/ASRTestMode';

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
        <div className={styles.pages}> {/* Use the imported CSS class */}
            {/* Navigation */}  
            <nav>
                {/* Logo */}
                <div className='row'> 
                    <div className='col d-flex align-items-center justify-content-center'>
                        <div className={styles.logo}>AudioCard</div>
                    </div>
                </div>
                
                <div className='row' >
                    <div className='col d-flex align-items-center justify-content-center'>
                    
                {/* Login and Signup Buttons */}
                <div className={styles.authButtons}> {/* Use the imported CSS class */}
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
                </div>
            </nav>

            {/* Welcome Message */}
            <div className='row'> 
                <div className='col d-flex align-items-center justify-content-center'>
                 <div className={styles.welcomeMessage}> {/* Use the imported CSS class */}
                        <h1>Welcome to AudioCard</h1>
                        <p>Experience the power of audio learning like never before.</p>
                    </div>
                </div>
            </div>
        </div>

        
    );
    
};

export default LandingPage;
