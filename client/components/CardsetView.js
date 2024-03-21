import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flashcard } from './Flashcard';
import { CreateFlashcard } from './CreateFlashcard';
import styles from '../styles/CardSet.module.css';

export const CardsetView = ({ userId, cardset, cardsetId, fetchFlachcardPage }) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [showCreateFlashcardForm, setShowCreateFlashcardForm] = useState(false);

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]);

    const handleCreateFlashcard = () => {
        fetchFlashCards();
        fetchFlachcardPage();
    }

    const fetchFlashCards = async () => {
        try {
            if (!userId){
                console.error("User id not found");
                return;
            }
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userId}/cardsets/${cardsetId}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
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
            fetchFlachcardPage();
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
                {/*Study mode with rorating flashcard */}
                <div className="row">
                    <div className='col mb-2'>
                        <Flashcard cardData={currentCardsetData} userId={userId} cardsetId={cardsetId} />
                    </div>
                </div>

                {/* Add new flashcard button */}
                { showCreateFlashcardForm ? 
                    null
                    : 
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-secondary btn-large" onClick={toggleCreateFlashcardForm}>Add Flashcard</button>
                    </div>
                }

                {/* Add or delete a flashcard section  */}
                { showCreateFlashcardForm ?
                    <div className='row'>
                        <hr />
                        <div className="col-12 mb-2" id={styles.greeting}>
                            <div className="d-flex justify-content-end">
                                <button className="btn" onClick={toggleCreateFlashcardForm}>X</button>
                            </div>
                        </div>

                        <div className="col-12 my-2">
                            <div className="d-flex justify-content-center">
                                <CreateFlashcard userId={userId} cardsetId={cardsetId} onCreateFlashcard={handleCreateFlashcard} />
                            </div>
                        </div>

                        <div className="col-12 mt-2" id={styles.greeting}>
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-outline-danger" onClick={handleDeleteFlashcard}>Delete Flashcard</button>
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
