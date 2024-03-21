import React, { useState, useEffect } from 'react';
import style from '../styles/flashcard.module.css';
import { RotatingCardTest } from './Cards/RotatingCardTest';

export const FlashcardTestMode = ({ cardData, userId, cardsetId }) => {
    const [index, setIndex] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const [answer, setAnswer] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [borderClass, setBorderClass] = useState('');
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        setFlashcards(cardData);
    }, [cardData]);


    useEffect(() => {
        setIsFlipped(false);
    }, [index]);

    useEffect(() => {
        const newProgress = flashcards.length > 0 ? ((index + 1) / flashcards.length) * 100 : 0;
        setProgress(newProgress);
        console.log('Progress:', progress);
    }, [index, flashcards.length]);

    if (flashcards.length === 0) {
        return <div>No Flashcards Yet!</div>;
    }

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    const handleSubmitAnswer = (e) => {
        e.preventDefault();
        const isCorrect = answer.trim().toLowerCase() === flashcards[index].definition.toLowerCase();
        setBorderClass(isCorrect ? 'correct' : 'incorrect');
        setIsFlipped(true);
        setTimeout(() => {
            setIsFlipped(false);
            setTimeout(() => {
                setIndex((currentIndex) => (currentIndex + 1) % flashcards.length);
                setAnswer('');
                setBorderClass('');
            }, 150);
        }, 2000);
    };

    return (
        <div className="container">
            <div className={style.progressBarContainer}>
                <div className={style.progressBar} style={{ width: `${progress}%` }}></div>
            </div>
            <div className={style.flashcard}>
                <RotatingCardTest
                    flashcards={flashcards}
                    index={index}
                    isFlipped={isFlipped}
                    borderClass={borderClass}
                />
            </div>
            {!isFlipped && (
                <form onSubmit={handleSubmitAnswer} className="mt-4">
                    <div className={style.formGroup}>
                        <
                            input
                            type="text"
                            className={style.formControl}
                            placeholder="Enter your answer here"
                            value={answer}
                            onChange={handleAnswerChange}
                        />
                    </div>
                    <button type="submit" className={`btn btn-primary ${style.centeredButton}`}>Submit Answer</button>
                </form>
            )}
        </div>
    );
};