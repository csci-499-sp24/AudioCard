import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flashcard } from './Flashcard';
import { CreateFlashcard } from './CreateFlashcard';
import styles from '../styles/CardSet.module.css';

export const CardsetView = ({ userId, cardset, cardsetId }) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [showCreateFlashcardForm, setShowCreateFlashcardForm] = useState(false);

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]); // <--delete

    const handleCreateFlashcard = () => {
        console.log("what get for adding new  cardset: ", cardset);
        console.log("what get for adding new  cardset caddd: ", cardsetId);
        fetchFlashCards();
    }

    const fetchFlashCards = async () => {
        try {
            console.log("what get for adding new  caddd: ", cardsetId);
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userId}/cardsets/${cardsetId}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
            console.log('flashcards currentCardsetData:', currentCardsetData);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }

    const handleDeleteFlashcard = async () => {
        if (currentCardsetData.length === 0) {
            // No flashcards to delete
            return;
        }

        const flashcardIdToDelete = currentCardsetData[currentCardsetData.length - 1].id; // Get the ID of the last flashcard
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets/${cardsetId}/flashcards/${flashcardIdToDelete}`);
            // Refresh the list of flashcards after deletion
            fetchFlashCards();
        } catch (error) {
            console.error('Error deleting flashcard:', error);
        }
    }

    const toggleCreateFlashcardForm = () => {
        setShowCreateFlashcardForm(!showCreateFlashcardForm);
    };

    return (
        <div className={styles.setContainer}>
            {/*Form for changing currently viewed cardset */}

            <div className="container">
                <hr />

                <div className="row">
                    <div className='col mb-2'>
                        <Flashcard cardData={currentCardsetData} userId={userId} cardsetId={cardsetId} />
                    </div>
                </div>

                { showCreateFlashcardForm ? 
                    null
                    : <button className="btn btn-secondary btn-large" onClick={toggleCreateFlashcardForm}>Add Flashcard</button>
                }

                { showCreateFlashcardForm ?
                    <div>
                        <div className="d-flex justify-content-end">
                            <button className="btn" onClick={toggleCreateFlashcardForm}>X</button>
                        </div>
                        <div className="row">
                            <div className="col mb-2">
                                {/* Form for creating new flashcards */}
                                <CreateFlashcard cardsetId={cardsetId} onCreateFlashcard={handleCreateFlashcard} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col mb-2">
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-outline-danger" onClick={handleDeleteFlashcard}>Delete Flashcard</button>
                                </div>
                            </div>
                        </div>
                    </div>
                : null
                }

       

                <hr />
            </div>
        </div>
    )
}
