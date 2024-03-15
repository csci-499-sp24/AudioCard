import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flashcard } from './Flashcard';
import { CreateFlashcard } from './CreateFlashcard';
import { DeleteFlashcard } from './DeleteFlashcard'; // Import the DeleteFlashcard component
import styles from '../styles/CardSet.module.css';

export const CardsetView = ({ userId, cardset }) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]);

    const handleCreateFlashcard = () => {
        fetchFlashCards();
    }

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets/${cardset.id}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }

    const handleDeleteFlashcard = () => {
        // Refresh the list of flashcards after deletion
        fetchFlashCards();
    }

    return (
        <div className={styles.setContainer}>
            <div className="container">
                <div className="row">
                    <div className="col">
                        <h1 className={styles.setTitle}>Current cardset: {cardset.title}</h1>
                    </div>
                </div>
                <div className="row">
                    <div className='col'>
                        {currentCardsetData.map(flashcard => (
                            <div key={flashcard.id}>
                                <Flashcard cardData={flashcard} />
                                <DeleteFlashcard userId={userId} cardset={cardset} flashcardId={flashcard.id} onDeleteFlashcard={handleDeleteFlashcard} />
                            </div>
                        ))}
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <CreateFlashcard cardset={cardset} onCreateFlashcard={handleCreateFlashcard} />
                    </div>
                </div>
            </div>
        </div>
    );
}
