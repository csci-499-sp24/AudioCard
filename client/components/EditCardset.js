import React, {useState, useEffect} from 'react';
import axios from 'axios'; 

export const EditView = ({ cardset, userId}) => {
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const [isEditingSet, setisEditingSet] = useState(false);
    const [newTitle, setNewTitle] = useState(cardset.title);
    const [newSubject, setNewSubject] = useState(cardset.subject);
    const [newPublicStatus, setNewPublicStatus] = useState(cardset.isPublic);

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

    const onSubmitCardset = async (event) => {
        event.preventDefault();
        const updatedData = {
            title: newTitle,
            subject: newSubject,
            isPublic: newPublicStatus
        }
        try{
            await axios.put(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userId}/cardsets/${cardset.id}`, {updatedData});
        } catch (error) {
            console.error('Error editing cardset:', error);
        }
        setisEditingSet(false);
    };

    const handleEdit = () => {
        setisEditingSet(true);

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
                <div className='row d-flex align-items-center'>
                        {isEditingSet ? (
                                <>
                                <form className="display flex flex-col" onSubmit={(e) => onSubmitCardset(e)}>
                                    <div className="flex flex-row">
                                        <label htmlFor="question">Title: </label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={newTitle}
                                            onChange={(e) => setNewTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-row">
                                        <label htmlFor="answer" className="basis-1/2">Subject: </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={newSubject}
                                            onChange={(e) => setNewSubject(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex flex-row">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="isPublic"
                                            checked={newPublicStatus}
                                            onChange={(e) => setNewPublicStatus(e.target.checked)}
                                        />
                                        <label className="form-check-label" htmlFor="isPublic">
                                            Make publicly viewable?
                                        </label>
                                    </div>
                                    <button className="btn btn-secondary btn-large" type="submit">Save</button>
                                </form>
                                </>
                            ) : ( 
                                <>
                                <div className='col'>
                                    <h2>Set Name: {newTitle} </h2>
                                    <h2>Subject: {newSubject} </h2>
                                </div>
                                <div className='col d-flex justify-content-end'>
                                    <button className='btn' onClick={handleEdit}><i className="bi bi-pencil-fill"></i></button>
                                </div>
                                </>
                            )}
                </div>
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
                }
                .btn-danger{
                    margin-right: 10px;
                }`}   
            </style>
        </div>
    );
}

