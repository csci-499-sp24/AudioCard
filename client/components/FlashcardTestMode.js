import React, { useState, useEffect } from 'react';
import style from '../styles/flashcardtestmode.module.css';
import { RotatingCardTest } from './Cards/RotatingCardTest';
import { useDarkMode } from '../utils/darkModeContext'

export const FlashcardTestMode = ({ cardData, userId}) => {
    const {isDarkMode} = useDarkMode();
    const [index, setIndex] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const [answer, setAnswer] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [borderClass, setBorderClass] = useState('');
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);
    const [showTestResult, setShowTestResult] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        setFlashcards(cardData);
    }, [cardData]);

    useEffect(() => {
        setIsFlipped(false);
    }, [index]);
    useEffect(() => {
        if (testStarted && index === flashcards.length && !isFlipped) {
            setShowTestResult(true);
        }
    }, [index, flashcards.length, isFlipped, testStarted]);

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
        if (isCorrect) {
            setScore((currentScore) => currentScore + 1);
        }
        setIsFlipped(true);
        setTestStarted(true);
        setTimeout(() => {
            if (index === flashcards.length - 1) {
                setShowTestResult(true);
            } else {
                setIsFlipped(false);
                setTimeout(() => {
                    setIndex((currentIndex) => currentIndex + 1);
                    setAnswer('');
                    setBorderClass('');
                }, 150);
            }
        }, 2000);
    };

    const handleRestartTest = () => {
        setIndex(0);
        setScore(0);
        const newProgress = flashcards.length > 0 ? ((index + 1) / flashcards.length) * 100 : 0;
        setProgress(newProgress);
        setShowTestResult(false);
        setIsFlipped(false);
        setTestStarted(false);
        setBorderClass('');
        setAnswer('');
    };

    const shuffleCards = () => {
        let shuffledCards = [...flashcards];
        for (let i = shuffledCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledCards[i], shuffledCards[j]] = [shuffledCards[j], shuffledCards[i]];
        }
        setFlashcards(shuffledCards);
        handleRestartTest();
        setShowOptions(false);
    };

    return (
        <div className="container">
            <div className={style.topRightButtons}>
                <button className={style.optionButton} onClick={() => setShowOptions(true)}>Options</button>
            </div>
            {showOptions && (
                <div className={style.optionsOverlay}>
                    <div className={style.optionsModal}>
                        <h2>Options</h2>
                        <button className={style.shuffleButton} onClick={shuffleCards}>Shuffle Cards</button>
                        <div className={style.closeButtonContainer}>
                            <button className={style.closeButton} onClick={() => setShowOptions(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            {showTestResult ? (
                <div className={style.testCompleteContainer}>
                    <h2>Your Test Result</h2>
                    <p>You got {score} out of {flashcards.length} correct!</p>
                    <button className={'btn btn-primary'} onClick={handleRestartTest}>Start New Test</button>
                </div>
            ) : (
                <>
                    <div className={style.progressBarContainer}>
                        <div className={style.progressBar} style={{ width: `${progress}%` }}></div>
                    </div>
                    <div className={style.flashcard}>
                        <RotatingCardTest
                            flashcards={flashcards}
                            index={index}
                            isFlipped={isFlipped}
                            borderClass={borderClass}
                            isDarkMode={isDarkMode}
                        />
                    </div>
                    {!isFlipped && (
                        <form onSubmit={handleSubmitAnswer} className="mt-4">
                            <div className={style.formGroup}>
                                <input
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
                </>
            )}
        </div>
    );
};