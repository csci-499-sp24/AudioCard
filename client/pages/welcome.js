import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDarkMode } from '@/utils/darkModeContext';
import styles from "../styles/landingPage.module.css";
import { LandingPageCardSet } from '@/components/Cards/LandingPageCardSet';
import axios from 'axios';
import { ASRTestMode } from '../components/Test Mode/ASRTestMode';
import LandingPageNavbar from '../components/Navbar/LandingPageNavbar';

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
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${42}/cardsets/${345}/flashcards`);
            setCardset(response.data.flashcards); // Set the fetched cardset
            setShowCardset(true); // Show the cardset
        } catch (error) {
            console.error('Error fetching cardset:', error);
        }
    };

    useEffect(() => {
        fetchCardset(345);
    }, []);
    
    const fetchCardset = async (cardsetId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cardsets/${cardsetId}`);
            setCardsetData(response.data); 
        } catch (error) {
            console.error('Error fetching cardset:', error);
        }
    };

    return (
        <div className={`${styles.pages} ${styles.container}`}>
            <LandingPageNavbar />

            {/* Welcome Message */}
            <div className={`${styles.row} ${styles.welcomeMessageContainer}`}> 
                <div className={`${styles.col} ${styles.welcomeMessage}`}>
                    <h1>Welcome to AudioCard</h1>
                    <p>Experience the power of audio learning like never before.</p>
                    {/* Wave effect */}
                    <div className={styles.wave}></div>
                </div>
            </div>

            
            {showCardset && cardset && (
                <div className="container d-flex justify-content-center"> {/* Center the content */}
                     <ASRTestMode cardData={cardset}/>
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