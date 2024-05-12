import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CardViewReviewMode } from '@/components/CardViewReviewMode';
import axios from 'axios';
import { auth } from '@/utils/firebase';
import styles from '../../styles/testmode.module.css';
import { useDarkMode } from '@/utils/darkModeContext';
import { AuthContext } from  "../../utils/authcontext"
import React, { useContext } from 'react';

const ReviewPage = () => {
    const {isDarkMode} = useDarkMode();
    const router = useRouter();
    const { id } = router.query; // This is the ID of the cardset
    const user = useContext(AuthContext).user;
    const [userData, setUserData] = useState(null);
    const [cardsetData, setCardsetData] = useState(null);
    const [startReview, setStartReview] = useState(false);
    const [preferredLanguage, setPreferredLanguage] = useState('');
    
    useEffect(() => {
        if (!userData) {
            fetchUserData();
        }
       
    }, [user, userData]);

    useEffect(() => {
        if (id) {
            fetchCardset(id);
        }
    }, [id]);

    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try {
            const firebaseId = user?.uid
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/api/users/getuser', { params: { firebaseId: firebaseId } });
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching user: ', error);
        }
    }

    const fetchCardset = async (cardsetId) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/cardsets/${cardsetId}`);
            setCardsetData(response.data); 
        } catch (error) {
            console.error('Error fetching cardset:', error);
        }
    };

    useEffect(() => {
        if(userData) {
            const fetchPreferredLanguage = async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userData.id}/prefLanguage`);
                setPreferredLanguage(response.data.prefLanguage);
            };
        
            fetchPreferredLanguage();
        }
    }, [userData]);

    return (
        <div className='container'>
            <h1 className="text-center mt-5">Review Mode</h1>
            <button className={styles.exitButton} style={{color: isDarkMode? 'white': 'black'}} onClick={() => router.back()}>
                &times;
            </button>
            <hr style={{borderColor: isDarkMode ? 'white' : 'black', borderWidth: '2px'}}/>
            <div className="row">
                    <div className="col mb-2">
                        <h1 className={styles.setTitle}>{cardsetData?.title}</h1>
                    </div>
                </div>
            <hr style={{borderColor: isDarkMode ? 'white' : 'black', borderWidth: '2px'}}/>
            {cardsetData && startReview && <CardViewReviewMode userId={userData?.id} cardset={cardsetData} isDarkMode={isDarkMode} preferredLanguage={preferredLanguage ? preferredLanguage : cardsetData.language} />}
            {!startReview &&  <div className='container d-flex justify-content-center mt-5 mb-5' style={{backgroundColor: isDarkMode? '#252526' : 'white', width: '70%', borderRadius: '10px',}}>
                    <div className='container2'>
                        <div className='headingContainer mt-5'>
                            <div className='row'>
                                <h1 className='text-center'>Review your card set</h1>
                            </div>
                        </div>
                        <div className='d-flex flex-column justify-content-center align-content-center'>
                            <div className='row text-center'>
                                <div>Welcome to review mode, a hands-free studying experience.</div>
                            </div>

                            <div className='d-flex flex-column justify-content-center mt-5'>
                                    <div id={styles.reviewModeGreen}>&#127911; Review Mode:</div>
                                    <p id={styles.reviewModeGreenSub}>The app will speak out your flashcard terms and definitions, all you have to do is listen! &#128266;</p>
                                    
                                    <div id={styles.reviewModeOrange}>	&#x2699; Settings:</div>
                                    <p id={styles.reviewModeOrangeSub}><i className="bi bi-arrow-clockwise"></i> Loop: put your card set on an endless loop</p>
                                    <p id={styles.reviewModeOrangeSub}>&#127911;: set the gender, language, and speaking rate!</p>
                                    <p id={styles.reviewModeOrangeSub}><i className="bi bi-clock"></i> Delay: seconds between question and answer</p>
                                    <p className='mb-5' id={styles.reviewModeOrangeSub}>&#128483; Enable Voice Commands: say &apos;shuffle&apos;, &apos;restart&apos;, or &apos;exit&apos;</p>
                            </div>
                        </div>
                        
                        <div className='row mb-5'>
                            <div className='col d-flex justify-content-center'>
                            <button className={styles.startButton} onClick={() => setStartReview(true)}>Start</button>
                            </div>
                        </div>
                </div>
                </div>
            }

        </div>
    );
};

export default ReviewPage;
