import React, { useState } from 'react';
import axios from 'axios';
import style from '../styles/editCardset.module.css';
import {useDarkMode} from '../utils/darkModeContext';

export const EditFlashcard = ({ userId, cardsetId, flashcard, onEditFlashcard, handleEditCard, onCancel }) => {
    const [question, setQuestion] = useState(flashcard.term);
    const [answer, setAnswer] = useState(flashcard.definition);
    const {isDarkMode} = useDarkMode();

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
        <div id={style.editSingleFlashcardContainer}>
            <div className="d-flex justify-content-end">
                <button className="btn" style={{color: isDarkMode ? 'white' : 'gray' }} onClick={onCancel ? onCancel : handleEditCard}>X</button>
            </div>

            <h3 className="text-center">Editing flashcard</h3>

            <form className="form-group row d-flex flex-column align-items-center" onSubmit={(e) => onSubmit(e)}>
                <div className="form-group row mt-3">
                    <label for="question" className="col-sm-2 col-form-label">Question:</label>
                    <div className="col-sm-10">
                        <input type="text" id="question" name="question" class="form-control" value={question} onChange={(e) => setQuestion(e.target.value)}/>
                    </div>
                </div>

                <div className="form-group row mt-3">
                    <label for="answer" className="col-sm-2 col-form-label">Answer:</label>
                    <div className="col-sm-10">
                        <input type="text" id="answer" name="answer" className="form-control" value={answer} onChange={(e) => setAnswer(e.target.value)}/>
                    </div>
                </div>

                <div className="form-group row mt-3 d-flex justify-content-center">
                    <div className="col-sm-10 d-flex justify-content-center">
                        <button className="btn btn-secondary btn-large" type="submit">Save</button>
                    </div>
                </div>
            </form>
        </div>
    );
};
