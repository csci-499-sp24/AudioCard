import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { TermCard } from '../../components/Cards/TermCard';
import { CardsetView } from '../../components/CardsetView';
import { EditView } from "@/components/EditCardset";
import ShareFunction from "@/components/share";
import { auth } from '../../utils/firebase';
import { useDarkMode } from '../../utils/darkModeContext';
import { getSubjectStyle } from '@/utils/getSubjectStyles';
import { CollaboratorList } from '@/components/collaboratorList';
import Image from 'next/image';
import exam from '../../assets/images/exam.png'; 



export default function CardsetPage() {
    const { isDarkMode } = useDarkMode();
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [isEditPageOpen, setIsEditPageOpen] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [cardset, setCardset] = useState([]);
    const [access, setAccess] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isadmin, setadmin] = useState(false);
    const [showSharePopup, setShowSharePopup] = useState(false);
    const [canEdit, setCanEdit] = useState(false);
    const [txtColor, setTxtColor] = useState('');
    const [isOwner, setIsOwner] = useState(false);
    const [Owner,SetOwner] = useState('');
    const cardsetId = router.query.cardsetId;
    useEffect(() => {
        if (cardset.subject) {
            const { bgColor, txtColor } = getSubjectStyle(cardset.subject);
            setTxtColor(txtColor);
        }
    }, [cardset]);
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

            const owner = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${id}`);
            SetOwner(owner.data.user.email)

            if (!ispublic) {
                setAccess(false)
            }
            if (id == userData.id) {
                setAccess(true);
                setadmin(true);
                setCanEdit(true);
                setIsOwner(true);
            }

            try {
                // Make a GET request to fetch shared cardsets for the user
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/shared/${userData.id}/cardsets/${cardsetId}/shared`);
                // Handle successful response
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

    const navigateToReviewPage = () => {
        const darkModeParam = isDarkMode ? '?darkMode=true' : '?darkMode=false';
        router.push(`/review/${cardsetId}${darkModeParam}`);
    };

    // Render flashcard data
    return (
        <div className={isDarkMode ? 'wrapperDark' : 'wrapperLight'}>
            <Navbar userId={userData?.id}/>
            <div className="container">
                <div className="row mt-5">
                    <div className='col'>
                        <button className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`} onClick={() => router.back()}>Back</button>
                        </div>
                    <div className="row">
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
                                    <div className='col d-flex justify-content-center mb-4 mt-3'>
                                        <button className="btn btn-lg testButton" style={{backgroundColor: isDarkMode? '#377ec9':'white', color: isDarkMode? 'white' : 'black'}} onClick={navigateToTestPage}> <Image style={{height: '1.5em', width: '1.5em'}}src={exam}/> Test</button>
                                        <button className="btn btn-lg ReviewButton"  style={{backgroundColor: isDarkMode? '#377ec9':'white', color: isDarkMode? 'white' : 'black'}} onClick={navigateToReviewPage}>
                                            <i className="bi bi-headphones"></i> Review</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Main Flashcard  */}
                    {!access || loading ? (
                        <div className='text-center'><h5>Loading...</h5></div>
                    ) : (
                        <CardsetView cardset={currentCardsetData} userId={userData?.id} cardsetId={cardsetId} fetchFlachcardPage={fetchFlashCards} canEdit={canEdit} />
                    )}
                    {/* All Flashcards in the set  */}
                    <div className="container">
                        <div className="row">
                            {/* Flashcard Info */}
                            {access && !loading ? (
                                <div className="col mt-5 mb-2">
                                    <div className="">
                                        <h3>Flashcard Set: {cardset.title}</h3>
                                        <div> Subject: <span style={{ color: `${txtColor}` }}>{cardset.subject}</span> </div>
                                        <div> {currentCardsetData.length} flashcards </div>
                                        {isOwner ? <></> : <div>Creator: {Owner}</div>}
                                        {cardset.isPublic ?
                                            <div>
                                                <span className="bi bi-globe" title="public"></span>
                                            </div>
                                            :
                                            <div>
                                                <span className="bi bi-lock" title="restricted"></span>
                                            </div>}

                                        {canEdit  ?
                                            <div>
                                                <CollaboratorList cardsetId={cardset.id} isOwner={isOwner} isadmin={isadmin}/>
                                            </div>
                                            : null}

                                    </div>
                                </div>
                            ) : null}
                            {/*Edit/Delete Flashcard set */}
                            {canEdit && (
                                <>
                                    <div className='col d-flex justify-content-end'>
                                        <div className="d-flex align-items-center">
                                            {isadmin ?
                                                <button className='btn' style={{ color: isDarkMode ? 'white' : 'gray' }} onClick={toggleSharePopup}>
                                                <i className="bi bi-share"></i>
                                            </button>
                                                : null}
                                            <button className={`btn ${isDarkMode ? 'btn-outline-light' : 'btn-outline-dark'}`} onClick={() => setIsEditPageOpen(true)}>Edit Set</button>
                                            <button className="btn deleteButton" onClick={() => handleDelete()}>
                                                <i className="bi bi-trash" style={{ fontSize: '1.2em' }}></i>
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

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

                            {isadmin && (
                                <div>
                                    {showSharePopup && (
                                        <div className="modal-content " style={{ backgroundColor: isDarkMode ? '#2e3956' : 'white', color: isDarkMode ? 'white' : 'black' }}>
                                            <div className='row'>
                                                <div className='col d-flex justify-content-end'>
                                                    <button className="close-btn" style={{ color: isDarkMode ? 'white' : 'black' }} onClick={toggleSharePopup}>
                                                        &times;
                                                    </button>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <ShareFunction userid={userData?.id} cardsetId={cardsetId} isOwner={isOwner}/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            {/* All Flashcards in the set */}
                            <div className="flashcardContainer mb-5">
                                {currentCardsetData.map(flashcard => (
                                    <TermCard key={flashcard.id} flashcard={flashcard} />
                                ))}
                            </div>
                            {/* Edit Flashcards set */}
                            {isEditPageOpen && (
                                <div className="edit-page-view" style={{ backgroundColor: isDarkMode ? '#0a092d' : '#ADD8E6' }}>
                                    <div className="edit-page-content">
                                        <button className="close-btn" style={{ color: isDarkMode ? 'white' : 'black' }} onClick={handleCloseEditPage}>
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
                    {showSharePopup && <div className="backdrop"></div>}
                    <style jsx>{`
                    
                    .backdrop {
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0, 0, 0, 0.5);
                        backdrop-filter: blur(5px);
                        z-index: 999;
                    }
    
    
                    .modal-content {
                        padding: 20px;
                        border-radius: 10px;
                        box-shadow: ${isDarkMode ? '0 0 10px rgba(255, 255, 255, 0.5)' : '0 0 10px rgba(0, 0, 0, 0.3)'};
                        position: fixed;
                        top: 50%;
                        left: 50%;
                        transform: translate(-50%, -50%);
                        width: 80%; 
                        max-width: 500px; 
                        z-index: 1000; 
                    }
    
                    .close-btn {
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        font-size: 24px;
                        cursor: pointer;
                        background: none;
                        border: none;
                        color: #fff; 
                    } 

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
                    .ReviewButton {
                        margin-left: 10px;
                    }
                    `}</style>
                </div>
            </div>
        </div>
    );

}