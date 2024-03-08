import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Flashcard } from './Flashcard';
import { CreateFlashcard } from './CreateFlashcard';

export const CardsetView = ({cardset}) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);

    useEffect(()=>{
        fetchFlashCards();
    },[cardset]);

    const handleCreateFlashcard = () =>{
        fetchFlashCards();
    }

    const fetchFlashCards = async () => {
        try{
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL+'/api/getflashcards',  {params: { cardsetId: cardset.id}});
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch(error) {
            console.error('Error fetching flashcards:', error);
        }
    }

  return (
    <div className="flex flex-col justify-center items-center h-min">
        {/*Form for changing currently viewed cardset */}
        <div className="bg-slate-600 w-min">
            <div>Current cardset: {cardset.title}</div>
        </div>
        {/*Pass all the cards of the cardset to the flashcard component*/}
        <Flashcard cardData={currentCardsetData}/>
        {/* Form for creating new flashcards */}
        <CreateFlashcard cardset={cardset} onCreateFlashcard={handleCreateFlashcard}/>
    </div>
    
  )
}
