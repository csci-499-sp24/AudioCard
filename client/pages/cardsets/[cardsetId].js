import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import { Flashcard } from '../../components/Flashcard';
import { TermCard } from '../../components/Cards/TermCard';
import { CardsetView } from '../../components/CardsetView';
import { EditView } from "@/components/EditCardset";
import { auth } from '../../utils/firebase';

export default function CardsetPage () {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [isEditPageOpen, setIsEditPageOpen] = useState(false);
    const [showCreateFlashcardForm, setShowCreateFlashcardForm] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const cardsetId = router.query.cardsetId; // get current cardset Id from route
    const cardsetTitle = router.query.cardsetTitle; // get current cardset title from route's query prop
    const cardsetSubject = router.query.cardsetSubject; // get current cardset subject route's query prop

    useEffect(() => {
        fetchFlashCards();
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

    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try {
            const firebaseId = user?.uid;
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + '/api/users/getuser', { params: { firebaseId: firebaseId } });
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    };

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/flashcards/${cardsetId}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
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

    // Render flashcard data
    return (
        <div className='wrapper'>
            <Navbar />
            <div className="container">
                <div className="row">
                    <div className="col mt-5 mb-2">
                        <h1 className="text-center">{cardsetTitle}</h1>
                    </div>

                    <div className="d-flex">
                        <button className="btn btn-secondary editButton" onClick={() => router.back()}>Back</button>
                    </div>
                </div>       
            </div>

            {/* Main Flashcard  */}
            <CardsetView cardset={currentCardsetData} userId={userData?.id} cardsetId={cardsetId} fetchFlachcardPage={fetchFlashCards}/>

            {/* All Flashcards in the set  */}
            <div className="container">
                <div className="row">
                    {/* Flashcard Info */}
                    <div className="col mt-5 mb-2">
                        <div className="">
                            <h3>Flashcard Set: {cardsetTitle}</h3>
                            <div> Subject: {cardsetSubject} </div>
                            <div> {currentCardsetData.length} flashcards </div>
                        </div>
                    </div>
                    
                    {/*Edit/Delete Flashcard set */}
                    <div className='col d-flex justify-content-end align-items-center'>
                        <div className="d-flex align-items-center">
                            <button className="btn btn-secondary editButton" onClick={() => setIsEditPageOpen(true)}>Edit Set</button>
                            <button className="btn deleteButton" onClick={() => handleDelete()}><i className="bi bi-trash" style={{ fontSize: '1.2em' }}></i></button>
                        </div>
                    </div>   

                    {/* Delete message */}
                    {showDeleteConfirmation && (
                        <div className="row">
                            <div className="col d-flex justify-content-end">
                                <div className="delete-confirmation">
                                    <p>Are you sure you want to delete this set: {cardsetTitle}?</p>
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
                            <TermCard key={flashcard.id} flashcard={flashcard}/>
                        ))}
                    </div>
                    
                    {/* Edit Flashcards set */}
                    { isEditPageOpen && (
                        <div className="edit-page-view">
                            <div className="edit-page-content">
                                <button className="close-btn" onClick={handleCloseEditPage}>
                                &times;
                                </button>
                                { currentCardsetData && (
                                    <EditView cardset={currentCardsetData} userId={userData.id} cardsetId={cardsetId} />
                                )}
                            </div>
                        </div>
                    )}
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
                        background-color: #ADD8E6;
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
            `}</style>     
            </div>
        </div>
    );
}
