import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlashcardTestMode } from './FlashcardTestMode';
import { ASRTestMode } from './ASRTestMode';
import styles from '../../styles/CardSet.module.css';

export const CardViewTestMode = ({ userId, cardset }) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [selectedMode, setSelectedMode] = useState(null); 

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]);

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userId}/cardsets/${cardset.id}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
            if (error.response.status === 403) {
                console.error('User doesnt have permission to see the cardset');
            } else {
                console.error('Error fetching flashcards: ', error.message);
            }
        }
    }

    const handleModeSelection = (mode) => {
        setSelectedMode(mode);
    };

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
                <div className="row mb-2 d-flex justify-content-center align-items-center'">
                <div className='col d-flex justify-content-end'>
                    <button className="btn btn-secondary" onClick={() => handleModeSelection('speak')}>Speak Mode</button>
                </div>
                <div className='col'>
                    <button className="btn btn-secondary" onClick={() => handleModeSelection('type')}>Type Mode</button>
                </div>
                </div>
                <hr />
                {selectedMode === 'speak' && <ASRTestMode cardData={currentCardsetData} userId={userId} cardsetId={cardset.id} />}
                {selectedMode === 'type' && <FlashcardTestMode cardData={currentCardsetData} userId={userId} cardsetId={cardset.id} />}
            </div>
        </div>
    )
}