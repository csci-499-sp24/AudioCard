import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Flashcard } from './Flashcard';
import { CreateFlashcard } from './CreateFlashcard';
import styles from '../styles/CardSet.module.css';
import {useDarkMode} from '../utils/darkModeContext';

export const CardsetView = ({ userId, cardset, cardsetId, fetchFlachcardPage, canEdit}) => {
    const {isDarkMode} = useDarkMode();
    console.log('can edit:', canEdit)
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
            if (!userId) {
                console.error("User id not found");
                return;
            }
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userId}/cardsets/${cardsetId}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
            if (error.response.status === 403) {
                console.error('User doesnt have permission to see this cardset');
            } else {
                console.error('Error fetching flashcards: ', error.message);
            }
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
                        <Flashcard cardData={currentCardsetData} userId={userId} cardsetId={cardsetId} canEdit ={canEdit}/>
                    </div>
                </div>
                { canEdit ?
                    <div className='row col d-flex justify-content-between align-items-center'>
                        {/* Add new flashcard button */}
                        {showCreateFlashcardForm ?
                            null
                            :
                            <div className="d-flex justify-content-end">
                                <button className="btn btn-secondary btn-large" onClick={toggleCreateFlashcardForm}>Add Flashcard</button>
                            </div>
                        }
                    </div>
                :null }

                {/* Add or delete a flashcard section  */}
                {showCreateFlashcardForm ?
                    <div className='row'>
                        <hr />
                        <div className="col-12 mb-2" id={styles.greeting}>
                            <div className="d-flex justify-content-end">
                                <button className="btn" style={{color: isDarkMode ? 'white' : 'gray' }} onClick={toggleCreateFlashcardForm}>X</button>
                            </div>
                        </div>

                        <div className="col-12 my-2">
                            <div className="d-flex justify-content-center">
                                <CreateFlashcard userId={userId} cardsetId={cardsetId} onCreateFlashcard={handleCreateFlashcard} />
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