import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';
import { EditView } from "@/components/EditCardset";
import Navbar from '@/components/Navbar/Navbar';
import { CreateCardset } from '@/components/CreateCardset';

const Cardset_Page = () => {
    const [allCardsets, setAllCardsets] = useState([]);
    const [displayedCardsets, setDisplayedCardsets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCardset, setSelectedCardset] = useState(null);
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isEditPageOpen, setIsEditPageOpen] = useState(false);

    const pageSize = 4;

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(null);
            }
        });
        if(!userData){
            fetchUserData();
        }
        return () => unsubscribe();
    }, [user, userData]);

    useEffect(() => {
        fetchCardsets();
    }) 

    const fetchUserData = async () => {
        if (!user || !user.uid) {
            return;
        }
        try{
            const firebaseId = user?.uid
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/api/users/getuser',  {params: { firebaseId: firebaseId}});
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching user: ', error);
        }
    }

    const fetchCardsets = async () => {
        if (!userData || !userData.id) {
            fetchUserData();
            return;
        }
        try{
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userData.id}/cardsets`,  {params: { userId: userData.id}});
            const cardsetsData = response.data.cardsets;
            setAllCardsets(cardsetsData);
            updateDisplayedCardsets();
        } catch (error) {
            console.error('Error fetching card sets:', error);
        }
    }
    const updateDisplayedCardsets =  async () => {
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        setDisplayedCardsets(allCardsets.slice(startIndex, endIndex));
    }

    const handleNextPage = async () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, Math.ceil(allCardsets.length / pageSize)));
    }

    const handlePrevPage = async  () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    }

    const fetchFlashCards = async (cardset) => {
        try{
            const response = await axios.get(
                process.env.NEXT_PUBLIC_SERVER_URL + `/api/cardsets/${cardset.id}/flashcards`
              );
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch(error) {
            console.error('Error fetching flashcards:', error);
        }
    }
    const selectCardset = async(cardset) => {
        setSelectedCardset(cardset);
        fetchFlashCards(cardset);
    }

    const handleCloseEditPage = () => {
        setIsEditPageOpen(false);
    }

    const handleCreateCardset = () => {
        fetchCardsets();
    }

    const [showCreateCardsetForm, setShowCreateCardsetForm] = useState(false);

    // Function to toggle the visibility of the CreateCardset form
    const toggleCreateCardsetForm = () => {
      setShowCreateCardsetForm(!showCreateCardsetForm);
    };

    return (
    <div className='wrapper'>
        <Navbar/>
        <div className="container">
            <div className="cardsetsContainer">
                <div className='row align-items-center mb-5'>
                    <div className='col-8 d-flex justify-content-center'>
                        <h2 className="heading">Your Cardsets</h2>
                    </div>
                    <div className="col-4 d-flex justify-content-end">
                        <button className="btn btn-secondary btn-large" onClick={toggleCreateCardsetForm}>Make Card Set</button>
                    </div>
                </div>
                <div className="row mb-5">
                    <div className="col-2 d-flex justify-content-center">
                        <button className="btn btn-secondary" onClick={handlePrevPage} disabled={currentPage === 1}><span>&#8592;</span></button>
                    </div>
                    <div className="col-8">
                            <div className='cardsetRow'>
                                {displayedCardsets.map((cardset, index) => (
                                    <div key={index} className="cardsetItem"  onClick={()=> selectCardset(cardset)}>{cardset.title}</div>
                                ))}
                            </div>
                        </div>
                    <div className="col-2 d-flex justify-content-center">
                        <button className="btn btn-secondary" onClick={handleNextPage} disabled={currentPage === Math.ceil(allCardsets.length / pageSize)}><span>&#8594;</span></button>
                    </div>
                </div>
            </div>
            <div className="row mb-2">
                {showCreateCardsetForm && <CreateCardset userId={userData.id} onCreateCardset={handleCreateCardset}/>}
            </div>
            
            <div className='setViewContainer'>
                <div className='row'>
                    <div className='col'>
                        {selectedCardset && (
                            <div className="cardsetTitleContainer">
                                <h1>Flashcard Set: {selectedCardset.title}</h1>
                                <div> Subject: {selectedCardset.subject} </div>
                                <div> {currentCardsetData.length} flashcards </div>
                            </div>
                        )}
                    </div>
                    <div className='col d-flex justify-content-end align-items-center'>
                        {selectedCardset && (
                            <button className="btn btn-secondary editButton" onClick={() => setIsEditPageOpen(true)}>Edit Set</button>
                        )}
                    </div>
                </div>
                <div className="flashcardContainer">
                    {currentCardsetData.map(flashcard => (
                        <div key={flashcard.id} className="flashcard">
                            <div>Question: {flashcard.term}</div>
                            <div>Answer: {flashcard.definition}</div>
                        </div>
                    ))}
                </div>
            </div>
            {isEditPageOpen && (
            <div className="edit-page-view">
            <div className="edit-page-content">
                <button className="close-btn" onClick={handleCloseEditPage}>
                &times;
                </button>
                {selectedCardset && (
                    <EditView cardset={selectedCardset} userId={userData.id} />
                )}
            </div>
            </div>
        )}
                
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

                .flashcard {
                    background-color: #f0f0f0; 
                    padding: 20px; 
                    border: 1px solid black;
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
            `}</style>
        </div>
    </div>
    );
};

export default Cardset_Page;
