import React, {useState} from 'react';
import axios from 'axios';

export const CreateFlashcard = ({userId, cardsetId, onCreateFlashcard}) => {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    
    const onSubmit = async (event) =>{
        event.preventDefault();
        if (cardsetId){
            if (!userId) {
                console.error("User id not found");
                return;
            }
            const newCardData = {
                term: question,
                definition: answer
            }
            try{
                await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+`/api/users/${userId}/cardsets/${cardsetId}/flashcards`, {cardsetId, newCardData});
                setQuestion('');
                setAnswer('');
                onCreateFlashcard();
            } catch (error) {
                if (error.response.status === 403) {
                    console.error('User doesnt have permission to edit the cardset');
                } else {
                    console.error('Error creating flashcard: ', error.message);
                }
            }
        }
    }

  return (
    <div className="bg-slate-500 w-min">
        <div>Add a flashcard</div>
        <form className="display flex flex-col" onSubmit={(e) => onSubmit(e)}>
            <div className="flex flex-row">
                <label htmlFor="question">Question: </label>
                <input type="text" id="question" name="question" value={question} onChange={(e) => setQuestion(e.target.value)} />
            </div>
            <div className="flex flex-row">
                <label htmlFor="answer" className="basis-1/2">Answer: </label>
                <input type="text" id="answer" name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)} />
            </div>
            <button className="btn btn-secondary btn-large" type="submit">Add</button>
        </form>
    </div>
  )
}