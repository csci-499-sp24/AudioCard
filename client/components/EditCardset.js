import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { CreateFlashcard } from '@/components/CreateFlashcard';
import { EditFlashcard } from '@/components/EditFlashcard'; 
import { useDarkMode } from '@/utils/darkModeContext';
import { getSubjectStyle } from '@/utils/getSubjectStyles';

export const EditView = ({ cardset, userId, cardsetId, cardsetTitle, cardsetSubject, cardsetIsPublic}) => {
    const {isDarkMode} = useDarkMode();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const [isEditingSet, setisEditingSet] = useState(false);
    const [newTitle, setNewTitle] = useState(cardsetTitle);
    const [newSubject, setNewSubject] = useState(cardsetSubject);
    const [newPublicStatus, setNewPublicStatus] = useState(cardsetIsPublic);
    const [isAddingCard, setIsAddingCard] = useState(false);
    const [isEditingCard, setIsEditingCard] = useState(false); 
    const [txtColor, setTxtColor] = useState('');

    useEffect(() => {
        fetchFlashCards();
    }, [cardset]);

    useEffect(() => {
        const { bgColor, txtColor } = getSubjectStyle(newSubject);
        setTxtColor(txtColor);
    }, [newSubject]);

    const fetchFlashCards = async () => {
        try{
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userId}/cardsets/${cardsetId}/flashcards`);
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

    const onSubmitCardset = async (event) => {
        event.preventDefault();
        const updatedData = {
            title: newTitle,
            subject: newSubject,
            isPublic: newPublicStatus
        }
        try{
            await axios.put(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userId}/cardsets/${cardsetId}`, {updatedData});
        } catch (error) {
            if (error.response.status === 403) {
                console.error('User doesnt have permission to edit the cardset');
            } else {
                console.error('Error editing cardset: ', error.message);
            }
        }
        setisEditingSet(false);
    };

    const handleEdit = () => {
        setisEditingSet(true);
    }
    
    const deleteFlashcard = async (flashcard) => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets/${cardsetId}/flashcards/${flashcard.id}`)
            fetchFlashCards();
        } catch (error) {
            if (error.response.status === 403) {
                console.error('User doesnt have permission to edit the cardset');
            } else {
                console.error('Error deleting flashcard: ', error.message);
            }
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

    const handleCreateFlashcard = () => {
        fetchFlashCards();
        setIsAddingCard(false);
    }
    
    const toggleIsAddingCard = () => {
        setIsAddingCard(!isAddingCard);
        setSelectedFlashcard(null);
    }
    
    const handleEditCard = (flashcard) => {
        setSelectedFlashcard(flashcard);
        setIsEditingCard(true);
    }

    const handleEditFlashcard = () => {
        setSelectedFlashcard(null);
        setIsEditingCard(false);
        fetchFlashCards();
    }

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
                                    <select class="form-select" aria-label="Default select example"id="subject"  onChange={(e) => setNewSubject(e.target.value)}>
                                        <option selected>Subject</option>
                                        <option value="History">History</option>
                                        <option value="Math">Math</option>
                                        <option value="Science">Science</option>
                                        <option value="English">English</option>
                                        <option value="Programming">Programming</option>
                                        <option value="Fine Arts">Fine Arts</option>
                                        <option value="Foreign Languages">Foreign Languages</option>
                                        <option value="Nature">Nature</option>
                                        <option value="Humanities">Humanities</option>
                                        <option value="Health">Health</option>
                                        <option value="Other">Other</option>
                                    </select>
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
                                <h2 style={{ color: `${txtColor}` }}>Subject: {newSubject} </h2>
                            </div>
                            <div className='col d-flex justify-content-end'>
                                <button className={`btn ${isDarkMode ? 'light-btn' : ''}`} onClick={handleEdit}><i className="bi bi-pencil-fill"></i></button>
                            </div>
                            </>
                        )}
                </div>
            </div>

            <div className="flashcardContainer">
                {currentCardsetData.map(flashcard => (
                    <div key={flashcard.id} className="flashcard" style={{ backgroundColor: isDarkMode ? '#2e3956' : '#FFFFFF' }}>
                        <div className='row'>
                            {selectedFlashcard === flashcard && isEditingCard && !showDeleteConfirmation ? (                                        
                                    <EditFlashcard userId={userId} cardsetId={cardsetId} flashcard={selectedFlashcard} onEditFlashcard={handleEditFlashcard}/>
                            ) : (
                                <>
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
                                                        <button onClick={() => {setShowDeleteConfirmation(false); setSelectedFlashcard(null);}} className="btn btn-secondary">No</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="cardbuttons"> 
                                                    <button className={`btn ${isDarkMode ? 'light-btn' : ''}`} onClick={() => handleEditCard(flashcard)}><i className="bi bi-pencil-fill"></i></button>
                                                    <button className={`btn deleteButton ${isDarkMode ? 'light-btn' : ''}`} onClick={() => handleDelete(flashcard)}>
                                                        <i className="bi bi-trash" style={{ fontSize: '1.2em' }}></i>
                                                    </button>
                                                </div>
                                            )
                                        ) : 
                                        (<div className="cardbuttons"> 
                                            <button className={`btn ${isDarkMode ? 'light-btn' : ''}`} onClick={() => handleEditCard(flashcard)}><i className="bi bi-pencil-fill"></i></button>
                                            <button className={`btn deleteButton ${isDarkMode ? 'light-btn' : ''}`} onClick={() => handleDelete(flashcard)}>
                                                <i className="bi bi-trash" style={{ fontSize: '1.2em' }}></i>
                                            </button>
                                    </div>)}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className='addingContainer'>
                {isAddingCard && (
                    <div className=" row flashcard" style={{backgroundColor: isDarkMode?'#2e3956':'white', color: isDarkMode ? 'white' : 'black'}}>
                        <CreateFlashcard userId={userId} cardsetId={cardsetId} onCreateFlashcard={handleCreateFlashcard} />
                    </div>
                )}

                <div className='row d-flex justify-content-center'>
                    <button className={`btn ${isDarkMode ? 'light-btn' : ''}`} onClick={() => toggleIsAddingCard()}>
                        <i className="bi bi-plus-square" style={{ fontSize: '2em' }}></i>
                    </button>
                </div>
            </div>
            <style jsx>{`         
                .flashcardContainer {
                    display: grid;
                    grid-gap: 20px; 
                }

                .flashcard {
                    padding: 20px; 
                    border: 1px solid black;
                }
                .btn-danger{
                    margin-right: 10px;
                }
                
                .addingContainer{
                    padding: 20px; 
                }
                .light-btn {
                    color: #FFFFFF;
                }`}
            </style>
        </div>
    );
}
