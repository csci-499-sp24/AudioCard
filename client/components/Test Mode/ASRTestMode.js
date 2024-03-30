import React, { useState, useEffect, useRef } from 'react';
import style from '../../styles/flashcardtestmode.module.css';
import { RotatingCardTest } from '../Cards/RotatingCardTest';
import {checkAnswerSTT} from '../ASR/speechToText';
import {TTS} from '../ASR/textToSpeech';
import { useDarkMode } from '../../utils/darkModeContext';
import { TestOptions } from './testOptions';
import { TimerComponent } from './timerComponent';

export const ASRTestMode = ({ cardData}) => {
    const {isDarkMode} = useDarkMode();
    const [index, setIndex] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [borderClass, setBorderClass] = useState('');
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);
    const [showTestResult, setShowTestResult] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [maxAttempts, setMaxAttempts] = useState(0);
    const mounted = useRef(false)
    const [timeLimit, setTimeLimit] = useState(7);
    const [voiceGender, setVoiceGender] = useState('NEUTRAL');

    const fetchData = async () => {
        if (flashcards.length > 0) {
            await speakCard();
            await handleAnswer(flashcards[index].definition);
        }
    }

    React.useEffect(() => {
        mounted.current= true;
        return ()=>{mounted.current = false;}
      }, []);
    

    useEffect(() => {
        setFlashcards(cardData);
    }, [cardData]);

    useEffect(() => {
        fetchData();
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
    

    const speakCard = async () => {
        if (!showTestResult){
            TTS(flashcards[index].term, voiceGender);
        }
    }


    const handleAnswer = async (answer) => {
        setTimeout(() => {
            setBorderClass('');
        }, 2000);
    
      let isCorrect = await checkAnswerSTT(answer, timeLimit);
    
        if (isCorrect) {
            setBorderClass('correct');
            setScore((currentScore) => currentScore + 1);
            TTS('Correct', voiceGender);
        } else {
                setBorderClass('incorrect');
            for (let attempt = maxAttempts; attempt > 0 && mounted.current; attempt--) {
                TTS('Try again.', voiceGender);
                setTimeout(() => {
                    setBorderClass('');
                }, 2000)
                isCorrect = await checkAnswerSTT(answer, timeLimit);
                setBorderClass(isCorrect ? 'correct' : 'incorrect');
                if (isCorrect) {
                    setScore((currentScore) => currentScore + 1);
                    TTS('Correct', voiceGender);
                    break; 
                }
            }
            if (!mounted.current) return;
            if (!isCorrect) {
                setBorderClass('incorrect');
                TTS(`The correct answer is ${flashcards[index].definition}`, voiceGender);
            }
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
                    <div className={style.optionsModal} style={{ backgroundColor: isDarkMode ? '#2e3956' : 'white' }}>
                    <TestOptions isSpeakMode={true} attempts={maxAttempts} handleAttemptChange={handleAttemptChange}
                    timeLimit={timeLimit} handleTimeLimit={handleTimeLimit}
                    voiceGender={voiceGender} setVoiceGender={setVoiceGender}/>
                    <div className={style.closeButtonContainer}>
                        <button className={style.closeButton} onClick={() => {
                        setShowOptions(false);
                    }}
                    >Close</button>
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
                    <TimerComponent
                        timeLimit={timeLimit}
                        showTestResult={showTestResult}
                        isFlipped={isFlipped}
                        handleSubmitAnswer={handleAnswer}
                        isSpeakMode={true}/>
                    <div className={style.flashcard}>
                        <RotatingCardTest
                            flashcards={flashcards}
                            index={index}
                            isFlipped={isFlipped}
                            borderClass={borderClass}
                        />
                    <div className='d-flex justify-content-center align-items-center mt-3'>
                     <button className='btn btn-secondary' onClick={shuffleCards}><i class="fas fa-random"></i></button>
                     </div>
                    </div>
                </>
            )}
        </div>
    );
};