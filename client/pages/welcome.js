import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useDarkMode } from '@/utils/darkModeContext';
import styles from "../styles/landingPage.module.css";
import { LandingPageCardSet } from '@/components/Cards/LandingPageCardSet';
import axios from 'axios';
import { ASRTestMode } from '../components/Test Mode/ASRTestMode';
import { ASRTestModeLandingPage } from '../components/Test Mode/ASRTestModeLandingPage';
import LandingPageNavbar from '../components/Navbar/LandingPageNavbar';
import Image from "next/image"; 
import voiceDark from '../assets/images/voice-dark.png';
import languagesDark from '../assets/images/languages-dark.png';
import testDark from '../assets/images/search-dark.png';
import voiceLight from '../assets/images/voice-light.png';
import languagesLight from '../assets/images/languages-light.png';
import testLight from '../assets/images/search-light.png';

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
            setCardset(response.data); 
        } catch (error) {
            console.error('Error fetching cardset:', error);
        }
    };

    return (
        <div className={`${styles.pages} ${styles.container}`}>
            <LandingPageNavbar />

            <div className="container">
                <div className="row d-flex align-items-center mb-6" id={styles.heroSection}>
                    <div className="col-lg-6 text-center pt-5" id={styles.heroSectionText}>
                        <div className="mt-6">
                            <h1 className="xl-text" id={styles.welcomeText}>Welcome to AudioCard</h1>
                            <p className={isDarkMode ? 'text-center text-light mb-4' : 'text-center text-muted mb-4'}  id={styles.welcomeSubText}>
                                Experience the power of audio learning like never before.
                            </p>
                            <Link href="/signup" className={isDarkMode ? 'nav-link text-white' : 'nav-link text-dark'} id={styles.navLink}>
                                <button className="btn btn-secondary">Get Started</button>
                            </Link>
                        </div>
                    </div>

                    <div className="col-lg-6">
                        <div className="mt-6">
                            <div className="mx-auto" id={`${isDarkMode ? styles.cardDark : styles.card}`}>
                                
                                {/* Rotating and dummy cards */}
                                { showCardset && cardset ? (
                                    <ASRTestModeLandingPage cardData={cardset}/>
                                ) : (
                                    <div className='d-flex justify-content-center'>
                                        <button id={styles.dummyCardButton} onClick={handleTryItOut}>
                                            <span id={styles.dummyCardButtonText}>Click here to try</span>
                                        </button>
                                        <h2 id={styles.dummyCardTextQuestion}>What is 2+2?</h2>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Unique Section */}
                <div className="row d-flex align-items-center" id={styles.uniqueSectionTitle}>
                    <h1 className="text-center">Things that makes AudioCard unique</h1>
                </div>

                <div className="row d-flex align-items-stretch" id={styles.uniqueSection}>
                    <div className="col-md-4 d-flex flex-column gap-4 px-5 pt-2">
                        <div className='mx-auto'>
                            {isDarkMode ? <Image src={languagesLight} alt="languages"/>: <Image src={languagesDark} alt="languages"/>}
                        </div>
                        <div>
                            <h4 className="text-center fw-bold">Multilingual Support</h4>
                            <p className={isDarkMode ? 'text-center text-light' : 'text-center text-muted'}>
                                Learn the material efficiently in a language that you feel the most comfortable with.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4 d-flex flex-column gap-4 px-5 pt-2">
                        <div className='mx-auto'>
                            {isDarkMode ? <Image src={ voiceLight} alt="voice"/>: <Image src={voiceDark} alt="voice"/>}
                        </div>
                        <div>
                            <h4 className="text-center fw-bold">Voice Commands and ASR</h4>
                            <p className={isDarkMode ? 'text-center text-light' : 'text-center text-muted'}>
                                Level up your study game using voice commands to learn your flashcards at a comfortable pace.
                            </p>
                        </div>
                    </div>

                    <div className="col-md-4 d-flex flex-column gap-4 px-5 pt-2">
                        <div className='mx-auto'>
                            {isDarkMode ? <Image src={testLight} alt="languages"/>: <Image src={testDark} alt="test"/>}

                        </div>
                        <div>
                            <h4 className="text-center fw-bold">Test Mode</h4>
                            <p className={isDarkMode ? 'text-center text-light' : 'text-center text-muted'}>
                                Set up your test in a way that makes the most sense to you and get practice in wherever you go.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 mt-5 border-top" id={styles.footerSection}>
                    <div className="col mb-3 text-white" id={styles.footerColLogo}>
                        <h3 className="text-white">AudioCard</h3>
                        <div className="" id={styles.footerIcons}> 
                            {isDarkMode ? <i className="fa-brands fa-facebook fa-lg" id={styles.footerIconFirst}></i> : <i className="fa-brands fa-facebook fa-lg text-white" id={styles.footerIconFirst}></i>}
                            {isDarkMode ? <i className="fa-brands fa-square-x-twitter fa-lg" id={styles.footerIcon}></i> : <i className="fa-brands fa-square-x-twitter fa-lg text-white" id={styles.footerIcon}></i>}
                            {isDarkMode ? <i className="fa-brands fa-instagram fa-lg" id={styles.footerIcon}></i> : <i className="fa-brands fa-instagram fa-lg text-white" id={styles.footerIcon}></i>}
                            {isDarkMode ? <i className="fa-brands fa-pinterest fa-lg" id={styles.footerIcon}></i> : <i className="fa-brands fa-pinterest fa-lg text-white" id={styles.footerIcon}></i>}
                        </div>
                    </div>
                    <div className="col mb-3 text-white"></div>
                    <div className="col mb-3 text-white d-flex justify-content-end" id={styles.footerCol}>
                        <ul className=" " id={styles.footerList}>
                            <li className="mb-2" id={styles.footerListMain}>Our company</li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>How we work</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Why AudioCard?</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>View plans</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Reviews</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col mb-3 text-white d-flex justify-content-end" id={styles.footerCol}>
                        <ul className=" " id={styles.footerList}>
                            <li className="mb-2" id={styles.footerListMain}>Help me</li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>FAQ</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Terms of use</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Privacy policy</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Cookies</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col mb-3 text-white d-flex justify-content-end" id={styles.footerCol}>
                        <ul id={styles.footerList}>
                            <li className="mb-2" id={styles.footerListMain}>Contact Us</li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Careers</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Support</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Live chat</a>
                            </li>
                            <li className="mb-2" id={styles.footerListItem}>
                                <a href="#" id={styles.navLinkLogoLanding}>Community</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
