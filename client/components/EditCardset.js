import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { CreateFlashcard } from '@/components/CreateFlashcard';
import { EditFlashcard } from '@/components/EditFlashcard'; 
import { useDarkMode } from '@/utils/darkModeContext';
import { getSubjectStyle } from '@/utils/getSubjectStyles';
import { Tooltip } from 'react-tooltip'
import styles from '../styles/termCard.module.css';
import style from '../styles/editCardset.module.css';

export const EditView = ({ cardset, userId, cardsetId, cardsetTitle, cardsetSubject, cardsetLanguage, cardsetIsPublic, cardsetIsFriendsOnly}) => {
    const {isDarkMode} = useDarkMode();
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [selectedFlashcard, setSelectedFlashcard] = useState(null);
    const [isEditingSet, setisEditingSet] = useState(false);
    const [newTitle, setNewTitle] = useState(cardsetTitle);
    const [newSubject, setNewSubject] = useState(cardsetSubject);
    const [newLanguage, setNewLanguage] = useState(cardsetLanguage);
    const [newPublicStatus, setNewPublicStatus] = useState(cardsetIsPublic);
    const [newFriendsOnlyStatus, setNewFriendsOnlyStatus] = useState(cardsetIsFriendsOnly);
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
            language: newLanguage,
            isPublic: newPublicStatus,
            isFriendsOnly: newFriendsOnlyStatus
        }
        console.log(cardset);
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
        setisEditingSet(!isEditingSet);
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

    const deleteShareset = async() =>{
        try{
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${cardsetId}/delete`);

        }
        catch (error) {
            console.error('Error deleting rows associated with cardsetid:', error);
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
            <div className="mt-5 mb-5" id={style.setInfoContainer}>
                <div className='row d-flex align-items-center'>
                        {isEditingSet ? (
                            <div>
                                <div id={`${isDarkMode ? style.editPageViewDark : style.editPageViewLight}`}>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn" onClick={handleEdit}>X</button>
                                    </div>

                                    <h5 className="text-center">Edit Card Set</h5>

                                    <form className="form-group row d-flex flex-column align-items-center" id={style.editPageViewContainer} onSubmit={(e) => onSubmitCardset(e)}>
                                        <div class="form-group row mt-3">
                                            <label for="title" class="col-sm-2 col-form-label">Title:</label>
                                            <div class="col-sm-10">
                                                <input type="text" id="title" name="title" class="form-control" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Title"/>
                                            </div>
                                        </div>

                                        <div class="form-group row mt-3">
                                            <label htmlFor="answer" class="col-sm-2 col-form-label">Subject: </label>
                                            <div class="col-sm-10">
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
                                        </div>

                                        <div class="form-group row mt-3">
                                            <label for="answer" class="col-sm-2 col-form-label">Language</label>
                                            <div class="col-sm-10">
                                                <select class="form-select" aria-label="Default select example"id="language" onChange={(e) => setNewLanguage(e.target.value)}>
                                                    <option selected>Language</option>
                                                    <option value="English (US)">English (US)</option>
                                                    <option value="English (UK)">English (UK)</option>
                                                    <option value = "Arabic (Standard)">Arabic (Standard)</option>
                                                    <option value="Chinese (Mandarin)">Chinese (Mandarin)</option>
                                                    <option value="Bengali">Bengali</option>
                                                    <option value="French">French</option>
                                                    <option value="Hindi">Hindi</option>
                                                    <option value="Portuguese">Portuguese</option>
                                                    <option value="Russian">Russian</option>
                                                    <option value="Spanish">Spanish</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div class="form-group row mt-3">
                                            <div class="col-sm-2"></div>
                                            <div class="col-sm-10">
                                                <div class="form-check">
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
                                            </div>
                                        </div>

                                        {!newPublicStatus && 
                                            <div class="form-group row mt-3 d-flex align-items-center">
                                                <div class="col-sm-2">
                                                    <div className='me-2'><i className="bi bi-lock-fill"></i>
                                                    </div>
                                                </div>

                                                <div class="col-sm-10">
                                                    <div className='me-2'>
                                                        <button className={isDarkMode ? 'btn btn-outline-light' : 'btn btn-outline-dark'} data-bs-toggle="dropdown" aria-expanded="false">
                                                            {newFriendsOnlyStatus ? 'Friends Only': 'Only Me'} <i className="fas fa-caret-down"></i>
                                                        </button>
                                                        <ul className="dropdown-menu">
                                                            <li><a className="dropdown-item" onClick={() => {setNewFriendsOnlyStatus(false);deleteShareset();}}>Only Me</a></li>
                                                            <li><a className="dropdown-item" onClick={() => setNewFriendsOnlyStatus(true)}>Friends Only</a></li>
                                                        </ul>
                                                    
                                                        <i id={style.privacyTip} className="bi bi-exclamation-circle" 
                                                            data-tooltip-id="privacyTip"
                                                            data-tooltip-place='right'
                                                            data-tooltip-html="Collaborators will still be able to view this set until removed."
                                                        ></i>
                                                        <Tooltip id = "privacyTip"/> 
                                                    </div> 
                                                </div>
                                            </div>
                                        }

                                        <div class="form-group row mt-3 d-flex justify-content-center">
                                            <div class="col-sm-10 d-flex justify-content-center">
                                                <button className="btn btn-secondary btn-large" type="submit">Save</button>
                                            </div>
                                        </div>
                                        
                                    </form>
                                </div>
                            </div>
                        ) : ( 
                            <>
                            <div className='col'>
                                <h2>Set Name: {newTitle} </h2>
                                <h2>Subject: {newSubject} </h2>
                                <h2>Language: {newLanguage} </h2>

                            </div>
                            <div className='col d-flex justify-content-end'>
                                <button className={`btn ${isDarkMode ? 'light-btn' : ''}`} onClick={handleEdit}>
                                    <i className="bi bi-pencil-fill" id={isDarkMode ? style.lightPencil : style.darkPencil}></i>
                                </button>
                            </div>
                            </>
                        )}
                </div>
            </div>

            <div className="flashcardContainer">
                {currentCardsetData.map(flashcard => (
                    <div key={flashcard.id} className="mb-3" id={`${isDarkMode ? styles.flashcardDark : styles.flashcard}`}>
                        <div className='row'>
                            {selectedFlashcard === flashcard && isEditingCard && !showDeleteConfirmation ? (                                        
                                <EditFlashcard userId={userId} cardsetId={cardsetId} flashcard={selectedFlashcard} onEditFlashcard={handleEditFlashcard} handleEditCard={handleEditCard}/>
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
                                                        <button onClick={() => confirmDelete(flashcard)} className="btn btn-danger m-1">Yes</button>
                                                        <button onClick={() => {setShowDeleteConfirmation(false); setSelectedFlashcard(null);}} className="btn btn-secondary m-1">No</button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="cardbuttons"> 
                                                    <button className={`btn ${isDarkMode ? 'light-btn' : ''}`} onClick={() => handleEditCard(flashcard)}>
                                                        <i className="bi bi-pencil-fill" id={isDarkMode ? style.lightPencil : style.darkPencil}></i>
                                                    </button>
                                                    <button className={`btn deleteButton ${isDarkMode ? 'light-btn' : ''}`} onClick={() => handleDelete(flashcard)}>
                                                        <i className="bi bi-trash" id={isDarkMode ? style.lightTrash : style.darkTrash}></i>
                                                    </button>
                                                </div>
                                            )
                                        ) : 
                                        (<div className="cardbuttons"> 
                                            <button className={`btn ${isDarkMode ? 'light-btn' : ''}`} onClick={() => handleEditCard(flashcard)}>
                                                <i className="bi bi-pencil-fill" id={isDarkMode ? style.lightPencil : style.darkPencil}></i>
                                            </button>
                                            <button className={`btn deleteButton ${isDarkMode ? 'light-btn' : ''}`} onClick={() => handleDelete(flashcard)}>
                                                <i className="bi bi-trash" id={isDarkMode ? style.lightTrash : style.darkTrash}></i>
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
                    <div className="row flashcard mx-1 m-3" style={{backgroundColor: isDarkMode?'#2e3956':'white', color: isDarkMode ? 'white' : 'black'}}>
                        <CreateFlashcard userId={userId} cardsetId={cardsetId} onCreateFlashcard={handleCreateFlashcard} toggleIsAddingCard={toggleIsAddingCard}/>
                    </div>
                )}

                <div className='row d-flex justify-content-center'>
                    <button className={`btn ${isDarkMode ? 'light-btn' : ''}`} onClick={() => toggleIsAddingCard()}>
                        <i className="bi bi-plus-square" id={isDarkMode ? style.lightPlus : style.darkPlus}></i>
                    </button>
                </div>
            </div>
        </div>
    );
}

