import React, { useState, useEffect } from 'react';
import style from '../styles/flashcard.module.css';
import { RotatingCard } from '../components/Cards/RotatingCard';

export const FlashcardTestMode = ({ cardData, userId, cardsetId }) => {
    const [isFlipped, setFlipped] = useState(false);
    const [index, setIndex] = useState(0);
    const [flashcards, setFlashcards] = useState([]); // State to hold flashcards data

    useEffect(() => {
        setFlipped(false);
        setIndex(0);
        // Set the initial flashcards data
        setFlashcards(cardData);
    }, [cardData]);

    if (flashcards.length === 0) {
        return <div>No Flashcards Yet!</div>;
    }

    const handleChange = (change) => {
        if (index === flashcards.length - 1 && change === 1) {
            setIndex(0);
        } else if (index === 0 && change === -1) {
            setIndex(flashcards.length - 1);
        } else {
            setIndex(index + change);
        }
    };

    return (
        <div className="container">
            <div className="row mb-5">
                <div className='d-flex justify-content-between mb-3'>
                    <div className="align-self-center mx-auto" id={style.Previous}>
                        <button className="btn btn-secondary" onClick={() => handleChange(-1)}>Prev</button>
                    </div>

                    <RotatingCard flashcards={flashcards} index={index} />

                    <div className="align-self-center mx-auto" id={style.Next}>
                        <button className="btn btn-secondary" onClick={() => handleChange(1)}>Next</button>
                    </div>
                </div>

                <div className="d-flex flex-row justify-content-around" id={style.ButtonsSmallScreen}>
                    <div className="p-2"><button className="btn btn-secondary" onClick={() => handleChange(-1)}>Prev</button></div>
                    <div className="p-2"><button className="btn btn-secondary" onClick={() => handleChange(1)}>Next</button></div>
                </div>
            </div>
        </div>
    );
};
