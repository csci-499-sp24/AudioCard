import React from 'react';
import axios from 'axios';

export const CreateFlashcard = ({cardset, onCreateFlashcard}) => {
    
    const onSubmit = async (event) =>{
        event.preventDefault();
        if (cardset){
            const cardsetId = cardset.id
            const newCardData = {
                term: event.target.question.value,
                definition: event.target.answer.value
            }
            await axios.post(process.env.NEXT_PUBLIC_SERVER_URL+'/api/createflashcard', {cardsetId, newCardData});
            onCreateFlashcard();
        }
    }

  return (
    <div className="bg-slate-500 w-min">
        <div>Add a flashcard</div>
            <form className="display flex flex-col" onSubmit={(e) => onSubmit(e)}>
                <div className="flex flex-row">
                    <label htmlFor="question">Question: </label>
                    <input type="text" id="question" name="question"/>
                </div>
                <div className="flex flex-row">
                    <label htmlFor="answer" className="basis-1/2">Answer: </label>
                    <input type="text" id="answer" name="answer"/>
                </div>
                <button className="btn btn-secondary btn-large" type="submit">Submit</button>
            </form>
        </div>
    
  )
}