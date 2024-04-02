import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDarkMode } from '@/utils/darkModeContext';
import styles from "../styles/landingPage.module.css";
import { LandingPageCardSet } from '@/components/Cards/LandingPageCardSet';
import axios from 'axios';

const LandingPage = () => {
    const router = useRouter();
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [cardset, setCardset] = useState(null); // Use null as initial state
    const [showCardset, setShowCardset] = useState(false); // State to control cardset visibility

    const handleLogin = () => {
        router.push('/login');
    };

    const handleSignup = () => {
        router.push('/signup');
    };

    const handleTryItOut = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cardsets/${327}`);
            setCardset(response.data); // Set the fetched cardset
            setShowCardset(true); // Show the cardset
        } catch (error) {
            console.error('Error fetching cardset:', error);
        }
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

            {/* Display the fetched cardset if it's shown */}
            {showCardset && cardset && (
                <div className="container d-flex justify-content-center"> {/* Center the content */}
                    <div className="row">
                        <div className="col">
                            <Link 
                                id={styles.dashboardCardLink}
                                href={{ 
                                    pathname: `/cardsets/${cardset.id}`, 
                                    query: { 
                                        cardsetTitle: cardset.title,
                                        cardsetSubject: cardset.subject,
                                        cardsetIsPublic: cardset.isPublic  
                                    } 
                                }}
                            >
                                <LandingPageCardSet cardset={cardset} isDarkMode={isDarkMode} style={{width: "300px", height: "200px"}} />
                            </Link>
                        </div>
                    </div>
                </div>
            )}

{/* Display the "Try it Out" button if the cardset is not yet shown */}
{!showCardset && (
    <div className="container">
        <div className="row">
            <div className="col text-center mt-4"> {/* Center the content */}
                <button className="btn btn-primary" onClick={handleTryItOut}>Become a Quiz Master!</button>
            </div>
        </div>
    </div>
)}



        </div>
    );
};

export default LandingPage;
