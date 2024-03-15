import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { auth } from '../utils/firebase';

export const CardsetView = ({cardset}) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const firebaseId = auth.currentUser.uid;
    const [userData, setUserData] = useState(null);
    const [copyCreated, setCopyCreated] = useState(false); 

    useEffect(() => {
        fetchUserData();
    }, [firebaseId]);


    const fetchUserData = async () => {
        try{
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/api/users/getuser',  {params: { firebaseId: firebaseId}});
            const userData = response.data.user;
            setUserData(userData);
        } catch (error) {
            console.error('Error fetching user', error);
        }
    }

    useEffect(()=>{
        fetchFlashCards();
    },[cardset]);


    const fetchFlashCards = async () => {
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

    const makeCopy = async () => {
        try {
            if (!userData) {
                console.error('User data not available');
                return;
            }
            const newSetData = {
                title: cardset.title,
                subject: cardset.subject,
                isPublic: cardset.isPublic,
            };
            const newCardsetResponse = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userData.id}/cardsets`, { newSetData });

            const newCardsetId = newCardsetResponse.data.cardset.id; 

            await Promise.all(currentCardsetData.map(async (flashcard) => {
                const newCardData = {
                    term: flashcard.term,
                    definition: flashcard.definition
                }
                const cardsetId = newCardsetId; 
                await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userData.id}/cardsets/${newCardsetId}/flashcards`, {cardsetId, newCardData});
            }));

            setCopyCreated(true);
        } catch (error) {
            console.error('Error adding cardset to library:', error);
        }
    };


  return (
    <div className='Container'>
        <div className='row'>
            <div className='col'>
                <div className="cardsetTitleContainer">
                    <h1>Flashcard Set: {cardset.title}</h1>
                    <div> Subject: {cardset.subject} </div>
                    <div> {cardset.flashcardCount} flashcards </div>
                </div>
            </div>
            <div className='col d-flex justify-content-end align-items-center'>
                <button className="btn btn-secondary copybutton"  onClick={() => makeCopy()} disabled={copyCreated}>
                    {copyCreated ? "Copy created" : "Make a copy"} </button>
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
        <style jsx>{`
                .flashcardContainer {
                    display: grid;
                    grid-gap: 20px; 
                }

                .flashcard {
                    background-color: #f0f0f0; 
                    padding: 20px; 
                    border-radius: 8px; 
                }
            `}</style>
    </div>
    
  )
}