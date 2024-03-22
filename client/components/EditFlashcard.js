import React, { useState } from 'react';
import axios from 'axios';

export const EditFlashcard = ({ userId, cardsetId, flashcard, onEditFlashcard }) => {
    const [question, setQuestion] = useState(flashcard.term);
    const [answer, setAnswer] = useState(flashcard.definition);

    const onSubmit = async (event) => {
        event.preventDefault();
        const updatedFlashcard = {
            term: question,
            definition: answer
        };
        try{
            await axios.put(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets/${cardsetId}/flashcards/${flashcard.id}`, {updatedFlashcard} );
        } catch (error) {
            if (error.response.status === 403) {
                console.error('User doesnt have permission to edit the cardset');
            } else {
                console.error('Error: ', error.message);
            }
        }
        onEditFlashcard();
    };

    return (
        <div className="bg-slate-500 w-min">
            <div>Editing flashcard</div>
            <form className="display flex flex-col" onSubmit={(e) => onSubmit(e)}>
                <div className="flex flex-row">
                    <label htmlFor="question">Question: </label>
                    <input
                        type="text"
                        id="question"
                        name="question"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </div>
                <div className="flex flex-row">
                    <label htmlFor="answer" className="basis-1/2">Answer: </label>
                    <input
                        type="text"
                        id="answer"
                        name="answer"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                    />
                </div>
                <button className="btn btn-secondary btn-large" type="submit">Submit</button>
            </form>
        </div>
    );
};