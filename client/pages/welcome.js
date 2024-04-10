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

            <div className="container">
                <div className="row d-flex align-items-center mb-6" id={styles.heroSection}>
                    <div className="col-lg-6 text-center pt-5">
                        <div className="mt-6">
                            <h1 className="xl-text" id={styles.welcomeText}>Welcome to AudioCard</h1>
                            <p className="lead mb-4" id={styles.welcomeSubText}>
                                Experience the power of audio learning like never before.
                            </p>
                            <Link href="/signup" className={isDarkMode ? 'nav-link text-white' : 'nav-link text-dark'} id={styles.navLink}>
                                <button className="btn btn-secondary">Get Started</button>
                            </Link>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="mt-6">
                            {/* Placeholder for Rotating card */}
                            <div className="mx-auto" id={styles.card}>

                            </div>
                        </div>
                    </div>
                </div>

                <div className="row d-flex align-items-center" id={styles.uniqueSection}>
                    <div className="col-md-4 d-flex flex-column gap-4">
                        <div className='mx-auto'>
                            {isDarkMode ? <i className="fa-regular fa-pen-to-square " id={styles.navIconModeLanding}></i> : <i className="fa-regular fa-pen-to-square" id={styles.navIconModeLanding}></i>}
                        </div>
                        <div>
                            <h5 className="text-center fw-bold">Lorem Ipsum</h5>
                            <p className="text-center text-muted">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        </div>
                    </div>

                    <div className="col-md-4 d-flex flex-column gap-4">
                        <div className='mx-auto'>
                            {isDarkMode ? <i className="fa-regular fa-pen-to-square" id={styles.navIconModeLanding}></i> : <i className="fa-regular fa-pen-to-square" id={styles.navIconModeLanding}></i>}
                        </div>
                        <div>
                            <h5 className="text-center fw-bold">Lorem Ipsum</h5>
                            <p className="text-center text-muted">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        </div>
                    </div>

                    <div className="col-md-4 d-flex flex-column gap-4">
                        <div className='mx-auto'>
                            {isDarkMode ? <i className="fa-regular fa-pen-to-square" id={styles.navIconModeLanding}></i> : <i className="fa-regular fa-pen-to-square" id={styles.navIconModeLanding}></i>}
                        </div>
                        <div>
                            <h5 className="text-center fw-bold">Lorem Ipsum</h5>
                            <p className="text-center text-muted">Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                        </div>
                    </div>
                </div>

            </div>





            {/* <div className={`${styles.row} ${styles.welcomeMessageContainer}`}> 
                <div className={`${styles.col} ${styles.welcomeMessage}`}>
                    <h1>Welcome to AudioCard</h1>
                    <p>Experience the power of audio learning like never before.</p>
                    <div className={styles.wave}></div>
                </div>
            </div> */}

            
            {/* {showCardset && cardset && (
                <div className="container d-flex justify-content-center"> 
                     <ASRTestMode cardData={cardset}/>
                </div>
            )} */}

            {/* {!showCardset && (
                <div className="container">
                    <div className="row">
                        <div className="col text-center mt-4"> 
                            <button className="btn btn-primary" onClick={handleTryItOut}>Become a Quiz Master!</button>
                        </div>
                    </div>
                </div>
            )} */}
        </div>
    );
};

export default LandingPage;
