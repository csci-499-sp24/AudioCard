import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';
import { useRouter } from 'next/router';
import { useDarkMode } from '../utils/darkModeContext';
import { TermCard } from '../components/Cards/TermCard';
import { getSubjectStyle } from '@/utils/getSubjectStyles';
import styles from '../styles/navbar.module.css'; 
import style from '../styles/explore.module.css'; 

export const CardsetView = ({ cardset }) => {
    const { isDarkMode } = useDarkMode();
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const firebaseId = auth.currentUser?.uid;
    const [userData, setUserData] = useState(null);
    const [copyCreated, setCopyCreated] = useState(false);
    const [userAvatar, setUserAvatar] = useState(''); 
    const [txtColor, setTxtColor] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, [firebaseId]);

    useEffect(() => {
        fetchuserAvatar(cardset.user?.username); 
    }, [cardset]);

    useEffect(() => {
        if (cardset.subject) {
            const { bgColor, txtColor } = getSubjectStyle(cardset.subject);
            setTxtColor(txtColor);
        }
    }, [cardset]);

    const fetchUserData = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/api/users/getuser', { params: { firebaseId: firebaseId } });
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching user', error);
        }
    }

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]);


    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(
                process.env.NEXT_PUBLIC_SERVER_URL + `/api/cardsets/${cardset.id}/flashcards`
            );
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }

    const makeCopy = async () => {
        try {
            if (!userData) {
                console.error('User data not available');
                return;
            }
            const newSetData = {
                title: cardset.title,
                subject: cardset.subject,
                isPublic: false,
                isFriendsOnly: false
            };
            const newCardsetResponse = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userData.id}/cardsets`, { newSetData });

            const newCardsetId = newCardsetResponse.data.cardset.id;

            await Promise.all(currentCardsetData.map(async (flashcard) => {
                const newCardData = {
                    term: flashcard.term,
                    definition: flashcard.definition
                }
                const cardsetId = newCardsetId;
                await axios.post(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userData.id}/cardsets/${newCardsetId}/flashcards`, { cardsetId, newCardData });
            }));

            setCopyCreated(true);
        } catch (error) {
            console.error('Error adding cardset to library:', error);
        }
    };

    const fetchuserAvatar = async (username) => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/userAvatar/avatar/${username}`);
            setUserAvatar(response.data.url);
        } catch (error) {
            console.error('Error fetching avatar:', error);
        }
    };

    const navigateToUserProfile = (userId) => {
        router.push(`/profile/${userId}`);
    }

    const setDefaultAvatar = (event) => {
        event.target.src = '/userAvatar.jpg';
    };

    return (
        <div className='Container'>
            <div className='row'>
                <div className='col'>
                    <div className="cardsetTitleContainer">
                        <h3>Flashcard Set: {cardset.title}</h3>
                        <div> Subject:  <span style={{ color: `${txtColor}` }}>{cardset.subject}</span> </div>
                        <div> Flashcards: {cardset.flashcardCount} </div>
                        <div className='mb-2'>Created by:
                            <span
                                style={{cursor: 'pointer', marginLeft: '3px', color: isDarkMode ? '#137eff' : 'blue'}}
                                onClick={() => navigateToUserProfile(cardset.user?.id)}
                            >
                                {cardset.user?.username}
                                <img src={userAvatar} onError={setDefaultAvatar} alt="User Avatar" className={styles.navUserAvatar} style={{borderColor: 'white', marginLeft: '5px'}} />
                            </span>
                        </div>
                    </div>
                </div>
                <div className='col d-flex justify-content-end align-items-center'>
                    <button id={`${isDarkMode ? style.copyBtnDark : style.copyBtnLight}`}
                    className="btn btn-secondary copybutton" onClick={() => makeCopy()} disabled={copyCreated}>
                        {copyCreated ? "Copy created" : "Make a copy"} </button>
                </div>
            </div>
            <div className="flashcardContainer  mt-3" id={style.cardsetsContainerScrollable}>
                {currentCardsetData.map(flashcard => (
                    <TermCard key={flashcard.id} flashcard={flashcard} />
                ))}
            </div>
            <style jsx>{`
                .flashcardContainer {
                    display: grid;
                    grid-gap: 20px; 
                }

                .flashcard {
                    padding: 20px; 
                    border-radius: 8px; 
                }
            `}</style>
        </div>
    )
}
