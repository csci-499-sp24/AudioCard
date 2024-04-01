import React, { useState, useEffect } from 'react';
import style from '../../styles/flashcardtestmode.module.css';
import { RotatingCardTest } from '../Cards/RotatingCardTest';
import { useDarkMode } from '../../utils/darkModeContext'
import { TestOptions } from './testOptions';
import TimerComponent from './timerComponent';

export const FlashcardTestMode = ({ cardData, userId}) => {
    const {isDarkMode} = useDarkMode();
    const [index, setIndex] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const [answer, setAnswer] = useState('');
    const [isFlipped, setIsFlipped] = useState(false);
    const [borderClass, setBorderClass] = useState('');
    const [progress, setProgress] = useState(0);
    const [completion, setCompletion] = useState(0); 
    const [score, setScore] = useState(0);
    const [showTestResult, setShowTestResult] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [maxAttempts, setMaxAttempts] = useState(0);
    const [timeLimit, setTimeLimit] = useState(Infinity);
    const [restartFlag, setRestartFlag] = useState(true); 

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

    // useEffect(() => {
    //     const newCompletion = flashcards.length > 0 ? ((index + 1) / flashcards.length) * 100 : 0;
    //     setCompletion(newCompletion);
    // }, [index, flashcards.length]);


    if (flashcards.length === 0) {
        return <div>No Flashcards Yet!</div>;
    }

    const handleAnswerChange = (e) => {
        setAnswer(e.target.value);
    };

    const handleSubmitAnswer = (e) => {
        console.log("This is attempt no: ", attempts)
        setAttempts((prevAttempts) => prevAttempts - 1);
        e.preventDefault();
        setTimeout(() => {
            setBorderClass('');
        }, 2000)
        // if definition starts with article - ignore it
        let defitinition = flashcards[index].definition.toLowerCase();
        let defitinitionFirstWord = defitinition.slice(0, defitinition.indexOf(" ")); // article
        let restOfDefitinition = defitinition.slice(defitinition.indexOf(" ")+1); //rest of the word/phrase
        let isCorrect;
        
        if (defitinitionFirstWord === 'the' || defitinitionFirstWord === 'a' || defitinitionFirstWord === 'an') {
            isCorrect = answer.trim().toLowerCase() === restOfDefitinition;
            setBorderClass(isCorrect ? 'correct' : 'incorrect');
        }
        else {
            // remove 2+ whitespaces from user's answer
            let userAnswer = answer.replace(/\s+/g, ' ').trim().toLowerCase();

            // "deaccent" the definition string before comparing
            let defitinitionStringNorm = defitinition.normalize('NFD').replace(/\p{Diacritic}/gu, ''); 

            // check if definition and answer contain commas
            let defitinitionContainsCommas = /[,\,]/.test(defitinitionStringNorm);
            console.log("defitinitionContainsCommas: ", defitinitionContainsCommas);
            
            // replace defitition with space if it contains a commas, but the answer doesn't
            if (defitinitionContainsCommas) {
                let answerContainsDash = /[,\,]/.test(userAnswer);
                console.log("answerContainsDash: ", answerContainsDash);
                if (!answerContainsDash) { 
                    defitinitionStringNorm = defitinitionStringNorm.replace(/,/g, "");
                    console.log("defitinitionStringNorm: ", defitinitionStringNorm);
                }
                else {
                    defitinitionStringNorm = defitinitionStringNorm.replace(/,/g, "");
                    userAnswer = userAnswer.replace(/,/g, "");
                    console.log("userAnswer: ", userAnswer);
                }
            }

            // check if definition and answer contain dashes
            let defitinitionContainsDash = /[,\-]/.test(defitinitionStringNorm);
            
            // replace defitition with space if it contains a dash, but the answer doesn't
            if (defitinitionContainsDash) {
                let answerContainsDash = /[,\-]/.test(userAnswer);
                if (!answerContainsDash) { 
                    defitinitionStringNorm = defitinitionStringNorm.replace(/-/g, " ");
                }
            }

            // compares final strings ignoring accents and dashes
            isCorrect = userAnswer.toLowerCase() === defitinitionStringNorm.toLowerCase();
        }
        
        setBorderClass(isCorrect ? 'correct' : 'incorrect');
        if (!isCorrect && attempts > 0) {
            console.log("Answer submitted. Attempts left: ", attempts);
            return;
        }
        if (isCorrect) {
            setScore((currentScore) => currentScore + 1);
            // update the progress bar
            const newProgress = progress + (100 / flashcards.length)
            setProgress(newProgress);
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
                    setAttempts(maxAttempts);
                    setBorderClass('');
                }, 150);
            }
        }, 2000);
    };

    const handleRestartTest = () => {
        setIndex(0);
        setScore(0);
        setProgress(0);
        setCompletion(0);
        setShowTestResult(false);
        setIsFlipped(false);
        setTestStarted(false);
        setBorderClass('');
        setAnswer('');
        setCompletion(0);
        setAttempts(maxAttempts);
        setRestartFlag(!restartFlag);
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

    const handleAttemptChange = (attemptNum) => {
        setMaxAttempts(attemptNum - 1);
        setAttempts(attemptNum - 1);
        console.log("Attempts changed to: ", maxAttempts)
    }

    const handleTimeLimit = async (event) => {
        setTimeLimit(event);
    }

    return (
        <div className="container">
            <div className={style.topRightButtons}>
                <button className={style.optionButton} onClick={() => setShowOptions(true)}>Options</button>
            </div>
            {showOptions && (
                <div className={style.optionsOverlay}>
                    <div className={style.optionsModal} style={{ backgroundColor: isDarkMode ? '#2e3956' : 'white'}}>
                    <div className='row justify-content-center'>
    
                        <TestOptions isSpeakMode={false} attempts={maxAttempts} handleAttemptChange={handleAttemptChange}
                        timeLimit={timeLimit} handleTimeLimit={handleTimeLimit}/>
                    </div>
                    <div className='row mt-5'>
                        <div className={style.closeButtonContainer}>
                            <button className={style.closeButton} onClick={() => setShowOptions(false)}>Close</button>
                        </div>
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
                    <div className={style.completionBar} style={{ width: `${completion}%` }}></div>
                </div>
                    {(timeLimit!==Infinity) && (
                    <TimerComponent
                        timeLimit={timeLimit}
                        showTestResult={showTestResult}
                        isFlipped={isFlipped}
                        handleSubmitAnswer={handleSubmitAnswer}
                        isSpeakMode={false}
                        attempts={attempts}
                        setAttempts={setAttempts}
                        restartFlag={restartFlag}/>
                        )}
                    <div className={style.flashcard}>
                        <RotatingCardTest
                            flashcards={flashcards}
                            index={index}
                            isFlipped={isFlipped}
                            borderClass={borderClass}
                        />
                    </div>
                    {!isFlipped && (
                        <form onSubmit={(event) => { handleSubmitAnswer(event) }} className="mt-4">
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
                    {!isFlipped && (
                        <div className='row mx-auto mt-3 mb-5' id={style.optionButtons}>
                            <div className="d-flex justify-content-between">
                                <div className=''>
                                    <button className='btn btn-secondary' title='Restart Test' onClick={handleRestartTest}><i class="fa fa-refresh"></i></button>
                                </div>
                                <div className=''>
                                    <button className='btn btn-secondary' title='Shuffle Cards' onClick={shuffleCards}><i class="fas fa-random"></i></button>
                                </div>

                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};