import React, {useState} from 'react';
import axios from 'axios';
import style from '../styles/editCardset.module.css';
import {useDarkMode} from '../utils/darkModeContext';

export const CreateFlashcard = ({userId, cardsetId, onCreateFlashcard, toggleIsAddingCard, toggleCreateFlashcardForm}) => {
    const {isDarkMode} = useDarkMode();
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
        <div className="p-3" id={style.editSingleFlashcardContainer}>
            <div className="d-flex justify-content-end">
                <button className="btn" style={{color: isDarkMode ? 'white' : 'gray' }} onClick={toggleCreateFlashcardForm ? toggleCreateFlashcardForm : toggleIsAddingCard}>X</button>
            </div>

            <h3 className="text-center">Add a flashcard</h3>

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
                        <button className="btn btn-secondary btn-large" type="submit">Add</button>
                    </div>
                </div>
            </form>
        </div>
    )
}