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
            <h1>Set Name: {cardset.title} </h1>
        </div>
    );
}

