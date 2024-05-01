import React, { useState, useEffect, useRef } from 'react';
import style from '../../styles/flashcardtestmode.module.css';
import { RotatingCardTest } from '../Cards/RotatingCardTest';
import {checkAnswerSTT} from '../ASR/speechToText';
import {TTS} from '../ASR/textToSpeech';
import { useDarkMode } from '../../utils/darkModeContext';
import {TestOptions} from './testOptions';
import TimerComponent from './timerComponent';
import { getTranslation } from '@/utils/translations';
import { TestResults } from './TestResults';

export const ASRTestMode = ({ cardData}) => {
    const {isDarkMode} = useDarkMode();
    const [index, setIndex] = useState(0);
    const [flashcards, setFlashcards] = useState([]);
    const [isFlipped, setIsFlipped] = useState(false);
    const [borderClass, setBorderClass] = useState('');
    const [progress, setProgress] = useState(0);
    const [completion, setCompletion] = useState(0);
    const [score, setScore] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const [showTestResult, setShowTestResult] = useState(false);
    const [testStarted, setTestStarted] = useState(false);
    const [restartFlag, setRestartFlag] = useState(true); 
    const [showOptions, setShowOptions] = useState(false);
    const [maxAttempts, setMaxAttempts] = useState(0);
    const [speakingRate, setSpeakingRate] = useState(1.0); 
    const mounted = useRef(false);
    const [timeLimit, setTimeLimit] = useState(7);
    const [voiceGender, setVoiceGender] = useState('NEUTRAL');
    const [language, setLanguage] = useState('en-US');
    const [ringSize, setRingSize] = useState('scaleDown');
    const [micBorder, setMicBorder] = useState('');
    const [phrases, setPhrases] = useState(
        {
            tryAgain : 'Try Again.',
            correct : 'Correct.',
            theCorrectAnswerIs: 'The correct answer is.' ,
        }
    )
    const [voiceCommands, setVoiceCommands] = useState(
        {
            shuffle: 'shuffle',
            restart: 'restart',
            exit: 'exit',
        }
    )

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
        if (language !== 'en-US' && language !== 'en-GB') {
          setPhrases({
            tryAgain: getTranslation('Try again.', language),
            correct: getTranslation('Correct.', language),
            theCorrectAnswerIs: getTranslation('The correct answer is', language)
          });
          setVoiceCommands({
            shuffle: getTranslation('shuffle', language),
            restart: getTranslation('restart', language),
            exit: getTranslation('exit', language)
          });
        }
      }, [language]);
      
    
    useEffect(() => {
        console.log('Is Paused: ', isPaused);
    }, [isPaused]);

    useEffect(() => {
        setFlashcards(cardData);
        console.log("cardData--> ", cardData)
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
        const newCompletion = flashcards.length > 0 ? ((index + 1) / flashcards.length) * 100 : 0;
        setCompletion(newCompletion);
    }, [index, flashcards.length]);

    if (flashcards.length === 0) {
        return <div>No Flashcards Yet!</div>;
    }
    

    const speakCard = async () => {
        if (!showTestResult){
            let _duration = await TTS(flashcards[index].term, voiceGender, language, speakingRate);
            console.log(_duration); 
            if (_duration >= 3) {
                setIsPaused(true);
                let difference = _duration - 3;
                await new Promise(resolve => setTimeout(resolve, difference * 1000));
                console.log('Paused for', difference, 'seconds');
            }
            setIsPaused(false);
        }
    }


    const handleAnswer = async (answer) => {
        setTimeout(() => {
            setBorderClass('');
        }, 2000);
    
      let isCorrect = await checkAnswerSTT(answer, timeLimit, language, handleRestartTest, shuffleCards, voiceCommands, setRingSize);
    
        if (isCorrect) {
            setBorderClass('correct');
            setScore((currentScore) => currentScore + 1);
            const newProgress = progress + (100 / flashcards.length)
            setProgress(newProgress);
            TTS(phrases.correct, voiceGender, language, speakingRate);
        } else {
                setBorderClass('incorrect');
            for (let attempt = maxAttempts; attempt > 0 && mounted.current; attempt--) {
                TTS(phrases.tryAgain, voiceGender, language, speakingRate);
                setTimeout(() => {
                    setBorderClass('');
                }, 2000)
                isCorrect = await checkAnswerSTT(answer, timeLimit, language, handleRestartTest, shuffleCards, voiceCommands, setRingSize);
                setBorderClass(isCorrect ? 'correct' : 'incorrect');
                if (isCorrect) {
                    setScore((currentScore) => currentScore + 1);
                    const newProgress = progress + (100 / flashcards.length)
                    setProgress(newProgress);
                    TTS(phrases.correct, voiceGender, language);
                    break; 
                }
            }
            if (!mounted.current) return;
            if (!isCorrect) {
                setBorderClass('incorrect');
                let _duration = await TTS(`${phrases.theCorrectAnswerIs} ${flashcards[index].definition}`, voiceGender, language, speakingRate);
                setIsFlipped(false);
                console.log(_duration)
                if (_duration >= 3) {
                    setIsPaused(true);
                    let difference = _duration - 2;
                    await new Promise(resolve => setTimeout(resolve, difference * 1000));
                    console.log('Paused for', difference, 'seconds');
                }
                setIsPaused(false);
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
        setProgress(0);
        setCompletion(0);
        setShowTestResult(false);
        setIsFlipped(false);
        setTestStarted(false);
        setBorderClass('');
        setTimeLimit(timeLimit);
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
    }

    const handleTimeLimit = async (event) => {
        setTimeLimit(event);
    }
    return (
        <div className="container">
            <div className="d-flex justify-content-end">
                <button className={style.optionButton} onClick={() => setShowOptions(true)}><i className={`fa-solid fa-gear ${style.gearIcon}`}></i></button>
            </div>
            {showOptions && (
                <div className={style.optionsOverlay}>
                    <div className={style.optionsModal} style={{ backgroundColor: isDarkMode ? '#2e3956' : 'white' }}>
                    <TestOptions isSpeakMode={true} attempts={maxAttempts} handleAttemptChange={handleAttemptChange}
                    timeLimit={timeLimit} handleTimeLimit={handleTimeLimit}
                    voiceGender={voiceGender} setVoiceGender={setVoiceGender}
                    language={language} setLanguage={setLanguage}
                    speakingRate={speakingRate} setSpeakingRate={setSpeakingRate}/>
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
                //sharing data via props to TestResults component
                <TestResults score={score} flashcards = {flashcards} handleRestartTest = { handleRestartTest}/>
            ) : (
                <>
                    <div className={style.progressBarContainer}>
                        <div className={style.progressBar} style={{ width: `${progress}%` }}></div>
                        <div className={style.completionBar} style={{ width: `${completion}%` }}></div>
                    </div>
                    <TimerComponent
                        timeLimit={timeLimit}
                        showTestResult={showTestResult}
                        isFlipped={isFlipped}
                        isSpeakMode={true}
                        restartFlag={restartFlag}
                        isPaused={isPaused}/>
                    <div className={style.flashcard}>
                        <RotatingCardTest
                            flashcards={flashcards}
                            index={index}
                            isFlipped={isFlipped}
                            borderClass={borderClass}
                        />

                        <div className='row mx-auto mt-3 mb-5' id={style.optionButtons}>
                            <div className="d-flex justify-content-between">
                                <div className=''>
                                    <button className='btn btn-secondary' title='Restart Test' onClick={handleRestartTest}><i class="fa fa-refresh"></i></button>
                                </div>
                                <div className='d-flex justify-content-center mt-4 mb-2'>
                                    <div className={`${style.micRing} ${style[ringSize]}`}></div>
                                    <div className='container'>
                                    <i className={`bi bi-mic-fill ${isDarkMode ? style.micIconDark : style.micIconLight} ${ringSize==='scaleUp' ? style.micIconPulse : null}`}></i>
                                    </div>
                                    </div>
                                <div className=''>
                                    <button className='btn btn-secondary' title='Shuffle Cards' onClick={shuffleCards}><i class="fas fa-random"></i></button>
                                </div>

                            </div>
                        </div>

                    </div>
                </>
            )}
        </div>
    );
};