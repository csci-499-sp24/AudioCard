import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlashcardTestMode } from './FlashcardTestMode';
import styles from '../styles/CardSet.module.css';

export const CardViewTestMode = ({ userId, cardset }) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]);

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userId}/cardsets/${cardset.id}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }

    return (
        <div className={styles.setContainer}>
            {/*Form for changing currently viewed cardset */}
            <div className="container">
                <hr />
                <div className="row">
                    <div className="col mb-2">
                        <h1 className={styles.setTitle}>Current cardset: {cardset.title}</h1>
                    </div>
                </div>
                {/*Pass all the cards of the cardset to the flashcard component*/}
                <div className="row">
                    <div className='col mb-2'>
                        <FlashcardTestMode cardData={currentCardsetData} userId={userId} cardsetId={cardset.id} />
                    </div>
                </div>
                <hr />
            </div>
        </div>
    )
}