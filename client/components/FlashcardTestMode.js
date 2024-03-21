import React, { useState, useEffect } from 'react';
import style from '../styles/flashcard.module.css';
import { RotatingCardTest } from './Cards/RotatingCardTest';

export const FlashcardTestMode = ({ cardData, userId, cardsetId }) => {
    const [index, setIndex] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const [answer, setAnswer] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setFlashcards(cardData);
    }, [cardData]);

    
    useEffect(() => {
        setIsFlipped(false);
    }, [index]);


    if (flashcards.length === 0) {
        return <div>No Flashcards Yet!</div>;
    }

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    const handleSubmitAnswer = (e) => {
        e.preventDefault();
        setIsFlipped(true);
        setTimeout(() => {
            setIsFlipped(false);
            setTimeout(() => {
                setIndex((currentIndex) => (currentIndex + 1) % flashcards.length);
                setAnswer(''); 
            }, 150);
        }, 1500);
    };

    return (
        <div className="container">
            <div className={style.flashcard}>
                <RotatingCardTest
                    flashcards={flashcards}
                    index={index}
                    isFlipped={isFlipped}
                />
            </div>

            {!isFlipped && (
                <form onSubmit={handleSubmitAnswer} className="mt-4">
                    <div className="form-group">
                        <
                            input
                            type="text"
                            className="form-control"
                            placeholder="Enter your answer here"
                            value={answer}
                            onChange={handleAnswerChange}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Submit Answer</button>
                </form>
            )}
        </div>
    );
};