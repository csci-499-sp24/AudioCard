import React, {useState, useEffect} from 'react';
import axios from 'axios';

export const CardsetView = ({cardset}) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);

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
            console.log(response.data);
        } catch(error) {
            console.error('Error fetching flashcards:', error);
        }
    }

  return (
    <div className='Container'>
        <div className="cardsetTitleContainer">
            <h1>Flashcard Set: {cardset.title}</h1>
            <div> Subject: {cardset.subject} </div>
            <div> {cardset.flashcardCount} flashcards </div>
            <div className="flashcardContainer">
                {currentCardsetData.map(flashcard => (
                    <div key={flashcard.id} className="flashcard">
                        <div>Question: {flashcard.term}</div>
                        <div>Answer: {flashcard.definition}</div>
                    </div>
                ))}
            </div>
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