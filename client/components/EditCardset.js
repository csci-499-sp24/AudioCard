import React, {useState, useEffect} from 'react';
import axios from 'axios'; 

export const EditView = ({ cardset, userId}) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
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
    
    
    return (
        <div className="container">
            <div className="setInfoContainer">
                <h2>Set Name: {cardset.title} </h2>
                <h2>Subject: {cardset.subject} </h2>
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
                    border: 1px solid black;
                }`}   
            </style>
        </div>
    );
}

