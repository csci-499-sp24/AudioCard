import React, {useState, useEffect} from 'react';
import axios from 'axios'; 

export const EditView = ({ cardset, userId}) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]);

    const fetchFlashCards = async () => {
        try{
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userId}/cardsets/${cardset.id}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch(error) {
            console.error('Error fetching flashcards:', error);
        }
    }
    
    const deleteFlashcard = async (flashcard) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets/${cardset.id}/flashcards/${flashcard.id}`)
            fetchFlashCards();
        } catch (error) {
            console.error('Error deleting flashcard:', error);
        }
    };
    
    const handleDelete = (flashcard) => {
        setShowDeleteConfirmation(true);
        setSelectedFlashcard(flashcard);
    };

    const confirmDelete = () => {
        if (selectedFlashcard) {
            deleteFlashcard(selectedFlashcard);
            setSelectedFlashcard(null);
        }
    };

    
    
    return (
        <div className="container">
            <div className="setInfoContainer">
                <h2>Set Name: {cardset.title} </h2>
                <h2>Subject: {cardset.subject} </h2>
            </div>


            <div className="flashcardContainer">
                    {currentCardsetData.map(flashcard => (
                        <div key={flashcard.id} className="flashcard">
                        <div className='row'>
                            <div className='col'>
                                <div>Question: {flashcard.term}</div>
                                <div>Answer: {flashcard.definition}</div>
                            </div>
                            <div className='col d-flex justify-content-end'>
                            {selectedFlashcard === flashcard ? (
                                showDeleteConfirmation ? (
                                    <div className="delete-confirmation">
                                        <p>Are you sure you want to delete this flashcard?</p>
                                        <div className="d-flex justify-content-center">
                                            <button onClick={() => confirmDelete(flashcard)} className="btn btn-danger">Yes</button>
                                            <button onClick={() => setShowDeleteConfirmation(false)} className="btn btn-secondary">No</button>
                                        </div>
                                    </div>
                                ) : (
                                    <button className="btn deleteButton" onClick={() => handleDelete(flashcard)}>
                                        <i className="bi bi-trash" style={{ fontSize: '1.2em' }}></i>
                                    </button>
                                )
                            ) : (
                                <button className="btn deleteButton" onClick={() => handleDelete(flashcard)}>
                                    <i className="bi bi-trash" style={{ fontSize: '1.2em' }}></i>
                                </button>
                            )}
                            </div>
                        </div>
                        </div>
                    ))}
                
            </div>
            <style jsx>{`         
                .flashcardContainer {
                    display: grid;
                    grid-gap: 20px; 
                }

                .flashcard {
                    background-color: #f0f0f0; 
                    padding: 20px; 
                    border: 1px solid black;
                }`}   
            </style>
        </div>
    );
}

