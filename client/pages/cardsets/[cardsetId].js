import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { Flashcard } from '../../components/Flashcard';
import { TermCard } from '../../components/Cards/TermCard';
import { CardsetView } from '../../components/CardsetView';
import { EditView } from "@/components/EditCardset";
import ShareFunction from "@/components/share";
import { auth } from '../../utils/firebase';
import {useDarkMode} from '../../utils/darkModeContext';

export default function CardsetPage () {
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [isEditPageOpen, setIsEditPageOpen] = useState(false);
    const [showCreateFlashcardForm, setShowCreateFlashcardForm] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [cardset, setCardset] = useState([]);
    const [access, setAccess] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isadmin, setadmin] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [canEdit, setCanEdit] = useState(false);

    const cardsetId = router.query.cardsetId; // get current cardset Id from route

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        if (!userData) {
            fetchUserData();
        }
        return () => unsubscribe();
    }, [user, userData]);

    useEffect(() => {
        fetchFlashCards();
        checkaccess();
    }, [userData]);

    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try {
            const firebaseId = user?.uid;
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/api/users/getuser', { params: { firebaseId: firebaseId } });
            const userData = await response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    };

    const toggleSharePopup = () => {
        setShowSharePopup(!showSharePopup);
    };

    const fetchFlashCards = async () => {
        try {
            setLoading(true);
            // get current cardset's flashcards
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userData.id}/cardsets/${cardsetId}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
            // get current cardset's info - for edits
            const resp = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userData.id}/cardsets/${cardsetId}`);
            const cardsetData = resp.data;
            setCardset(cardsetData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }

    const checkaccess = async () => {
        try {
            const resp = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userData.id}/cardsets/${cardsetId}`);
            const cardsetData = resp.data;
            const id = cardsetData.userId;
            const ispublic = cardsetData.isPublic
            if (!ispublic) {
                setAccess(false)
            }
            if (id == userData.id) {
                setAccess(true);
                setadmin(true);
                setCanEdit(true);
            }

            try {
                // Make a GET request to fetch shared cardsets for the user
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${userData.id}/cardsets/${cardsetId}/shared`);
                // Handle successful response
                console.log(response)
                const role = response.data[0].authority;
                setAccess(true)
                if (role == 'admin') {
                    setadmin(true)
                    setCanEdit(true)
                }
                if (role == 'edit') {
                    setCanEdit(true)
                }

                
            } catch (error) {
                // Handle error
                console.error('Error fetching shared cardsets:', error);
            }

        }
        catch (error) {
            console.error('Error fetching flashcards:', error);
        }
    }

    const handleCloseEditPage = () => {
        setIsEditPageOpen(false);
        fetchFlashCards();
    }

    const handleDelete = () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDelete = () => {
        deleteCardSet(cardsetId);
    };




    const deleteCardSet = async (cardsetId) => {
        try {
            await axios.delete(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userData.id}/cardsets/${cardsetId}`);
            setCurrentCardsetData([]);
            setShowDeleteConfirmation(false);
            router.push('/dashboard');
        } catch (error) {
            console.error('Error deleting cardset:', error);
        }
    };
    const navigateToTestPage = () => {
        const darkModeParam = isDarkMode ? '?darkMode=true' : '?darkMode=false';
        router.push(`/test/${cardsetId}${darkModeParam}`);
    };

    // Render flashcard data
    return (
        <div className='wrapper'>
            <Navbar userId={userData?.id}/>
            <div className="container">
                <div className="row">
                    <div className="col mt-5 mb-2">
                        <h1 className="text-center">{cardset.title}</h1>
                    </div>
                    {!access ? (
                        <div>
                            This card set is NOT PUBLIC.
                        </div>
                    ) : (
                        <div className="container">
                            <div className="row">
                                <div className="row d-flex align-items-center">
                                    <div className='col'>
                                        <button className={`btn ${isDarkMode? 'btn-outline-light' : 'btn-outline-dark'}`} onClick={() => router.back()}>Back</button>
                                    </div>
                                    <div className='col d-flex justify-content-end mb-4'>
                                        <button className="btn btn-secondary testButton" onClick={navigateToTestPage}>Test Mode</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Main Flashcard  */}
                    {!access || loading ? (
                        <div className='text-center'><h5>Loading...</h5></div>
                    ) : (
                        <CardsetView cardset={currentCardsetData} userId={userData?.id} cardsetId={cardsetId} fetchFlachcardPage={fetchFlashCards} canEdit={canEdit}/>
                    )}
                    {/* All Flashcards in the set  */}
                    <div className="container">
                        <div className="row">
                            {/* Flashcard Info */}
                            {access && !loading ? (
                                <div className="col mt-5 mb-2">
                                    <div className="">
                                        <h3>Flashcard Set: {cardset.title}</h3>
                                        <div> Subject: {cardset.subject} </div>
                                        <div> {currentCardsetData.length} flashcards </div>
                                    </div>
                                </div>
                            ) : null}
                            {/*Edit/Delete Flashcard set */}
                            {canEdit ? (
                                <div className='col d-flex justify-content-end align-items-center'>
                                    <div className="d-flex align-items-center">
                                        {isadmin && (
                                            <div>
                                                <button className='btn' onClick={toggleSharePopup}>Share</button>
                                                {showSharePopup && <ShareFunction userid={userData?.id} cardsetId={cardsetId} />}
                                            </div>
                                        )}
                                        <button className={`btn ${isDarkMode? 'btn-outline-light' : 'btn-outline-dark'}`} onClick={() => setIsEditPageOpen(true)}>Edit Set</button>
                                        <button className="btn deleteButton" onClick={() => handleDelete()}><i className="bi bi-trash" style={{ fontSize: '1.2em' }}></i></button>
                                    </div>
                                </div>
                            ) : null}
                            {/* Delete message */}
                            {showDeleteConfirmation && (
                                <div className="row">
                                    <div className="col d-flex justify-content-end">
                                        <div className="delete-confirmation">
                                            <p>Are you sure you want to delete this set: {cardset.title}?</p>
                                            <div className="d-flex justify-content-center">
                                                <button onClick={confirmDelete} className="btn btn-danger">Yes</button>
                                                <button onClick={() => setShowDeleteConfirmation(false)} className="btn btn-secondary">No</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* All Flashcards in the set */}
                            <div className="flashcardContainer mb-5">
                                {currentCardsetData.map(flashcard => (
                                    <TermCard key={flashcard.id} flashcard={flashcard} />
                                ))}
                            </div>
                            {/* Edit Flashcards set */}
                            { isEditPageOpen && (
                                <div className="edit-page-view" style={{ backgroundColor: isDarkMode ? '#0a092d' : '#ADD8E6' }}>
                                    <div className="edit-page-content">
                                        <button className="close-btn" style={{color: isDarkMode ? 'white' : 'black' }} onClick={handleCloseEditPage}>
                                        &times;
                                        </button>
                                        {currentCardsetData && (
                                            <EditView
                                                cardset={currentCardsetData}
                                                userId={userData.id}
                                                cardsetId={cardsetId}
                                                cardsetTitle={cardset.title}
                                                cardsetSubject={cardset.subject}
                                                cardsetIsPublic={cardset.isPublic}
                                                isDarkMode={isDarkMode}
                                            />
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <style jsx>{`
                        
                    .heading{
                        margin-top: 20px;
                    }
                    .cardsetRow {
                        display: flex;
                        flex-wrap: wrap;
                        justify-content: space-between;
                    }

                    .cardsetItem {
                        width: calc(25% - 10px); /* Adjust the width as needed */
                        display: flex; 
                        justify-content: center;
                        margin-bottom: 10px;
                        background-color: #fDfDfD;
                        padding: 50px;
                        border: 1px solid black;
                    }

                    .pagination {
                        margin-top: 20px;
                    }

                    .pagination button {
                        margin-right: 10px;
                    }

                    .flashcardContainer {
                        display: grid;
                        grid-gap: 20px;
                    }

                    .edit-page-view {
                        position: fixed;
                        top: 0;
                        left: 0; 
                        width: 100%; 
                        height: 100%;
                        z-index: 999;
                        overflow-y: auto;
                        transition: transform 0.3s ease;
                        transform: translateX(${isEditPageOpen ? "0" : "100%"});
                    }
                
                    .editButton{
                        marin-right:5px;
                    }

                    .deleteButton {
                        background-color: #DC3545;
                        margin-left: 5px;
                        box-shadow: none;
                        padding-top: 3px;
                        padding-bottom: 3px;
                        padding-left: 20px;
                        padding-right: 20px;
                    }

                    .btn-danger{
                        margin-right: 10px;
                    }
                    .delete-confirmation {
                        margin-bottom: 10px; 
                    }
                    .close-btn {
                        top: 10px;
                        right: 10px;
                        font-size: 24px;
                        cursor: pointer;
                        background: none;
                        border: none;
                      }
                    `}</style>
                </div>
            </div>
        </div>
    );
    
    }