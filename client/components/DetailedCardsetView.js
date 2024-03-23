import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';
import { useRouter } from 'next/router';

export const CardsetView = ({cardset, isDarkMode}) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const firebaseId = auth.currentUser.uid;
    const [userData, setUserData] = useState(null);
    const [copyCreated, setCopyCreated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchUserData();
    }, [firebaseId]);


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
                isPublic: cardset.isPublic,
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

    const navigateToUserProfile = (userId) => {
        router.push(`/profile/${userId}`);
    }

    return (
        <div className='Container'>
            <div className='row'>
                <div className='col'>
                    <div className="cardsetTitleContainer">
                        <h1>Flashcard Set: {cardset.title}</h1>
                        <div> Subject: {cardset.subject} </div>
                        <div> {cardset.flashcardCount} flashcards </div>
                        <div>Created by:
                            <span
                                style={{ cursor: 'pointer', color: 'blue' }}
                                onClick={() => navigateToUserProfile(cardset.user?.id)}
                            >
                                {cardset.user?.username}
                            </span>
                        </div>
                    </div>
                </div>
                <div className='col d-flex justify-content-end align-items-center'>
                    <button className="btn btn-secondary copybutton" onClick={() => makeCopy()} disabled={copyCreated}>
                        {copyCreated ? "Copy created" : "Make a copy"} </button>
                </div>
            </div>
            <div className="flashcardContainer">
                {currentCardsetData.map(flashcard => (
                    <div key={flashcard.id} className="flashcard" style={{ backgroundColor: isDarkMode ? '#2e3956' : '#FFFFFF' }}>
                        <div>Question: {flashcard.term}</div>
                        <div>Answer: {flashcard.definition}</div>
                    </div>
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