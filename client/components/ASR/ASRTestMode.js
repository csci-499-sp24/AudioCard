import React, { useState, useEffect } from 'react';
import style from '../../styles/flashcardtestmode.module.css';
import { RotatingCardTest } from '../Cards/RotatingCardTest';
import {STT} from './speechToText';
import {TTS} from './textToSpeech';

export const ASRTestMode = ({ cardData}) => {
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
    
    const speakCard = () => {
        if (!showTestResult){
            TTS(flashcards[index].term);
        }
    }
    const handleAnswer = async (answer) => {
        let attempt = 0; 
        let providedCorrectAnswer = false;
        while (attempt < 3) {
            console.log(attempt);
            providedCorrectAnswer = await STT(answer);
            if (providedCorrectAnswer) {
                break; 
            }
            attempt++;
        }
        const isCorrect = providedCorrectAnswer;
        setBorderClass(isCorrect ? 'correct' : 'incorrect');
        if (isCorrect) {
            setScore((currentScore) => currentScore + 1);
            TTS('correct');
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

    useEffect(() => {
        setFlashcards(cardData);
    }, [cardData]);

    useEffect(() => {
        if (flashcards.length > 0) {
            speakCard();
            handleAnswer(flashcards[index].definition);
        }
    }, [flashcards, index]);

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
                        />
                    </div>
                </>
            )}
        </div>
    );
};