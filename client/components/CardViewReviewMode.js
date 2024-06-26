import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import style from '../styles/flashcardtestmode.module.css';
import { RotatingCardTest } from './Cards/RotatingCardTest';
import { TTS } from './ASR/textToSpeech';
import { useDarkMode } from '../utils/darkModeContext';
import { ReviewOptions } from './ReviewOptions';
import { ListenForVoiceCommands } from './ASR/speechToText';
import { getLanguageCode } from '@/utils/languageCodes';
import { getTranslation } from '@/utils/translations';

export const CardViewReviewMode = ({ userId, cardset, preferredLanguage }) => {
    const { isDarkMode } = useDarkMode();
    const [flashcards, setFlashcards] = useState([]);
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [voiceGender, setVoiceGender] = useState('NEUTRAL');
    const [language, setLanguage] = useState(getLanguageCode(preferredLanguage));
    const [dataFetched, setDataFetched] = useState(false);
    const mounted = useRef(true);
    const timeoutRef = useRef(null);
    const [showOptions, setShowOptions] = useState(false);
    const [delay, setDelay] = useState(4);
    const [willLoop, setWillLoop] = useState(false);
    const [speakingRate, setSpeakingRate] = useState(1.0);
    const [isReviewDone, setIsReviewDone ] = useState(false);
    const [isVoiceCommandsEnabled, setIsVoiceCommandsEnabled] = useState(false);
    const [voiceCommands, setVoiceCommands] = useState(
        {
            shuffle: 'shuffle',
            restart: 'restart',
            exit: 'exit',
        }
    )

    useEffect(() => {
        mounted.current = true;
        fetchFlashCards();
        return () => {
            mounted.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [cardset]);

    useEffect(() => {
        const controller = new AbortController(); 
        const fetchData = async () => {
            if (flashcards.length > 0 && index < flashcards.length) {
                await speakCard(controller.signal);
            }
        };
        if (dataFetched && index < flashcards.length) {
            fetchData();
        }
        if (dataFetched && index >= flashcards.length){
            setIsReviewDone(true);
        }
        return() => {
            controller.abort(); 
        }
    }, [index, dataFetched]);

    useEffect(() => {
        if (language !== 'en-US' && language !== 'en-GB') {
          setVoiceCommands({
            shuffle: getTranslation('shuffle', language),
            restart: getTranslation('restart', language),
            exit: getTranslation('exit', language)
          });
        }
    }, [language]);

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/cardsets/${cardset.id}/flashcards`);
            const fetchedFlashcards = response.data.flashcards;
            setFlashcards(fetchedFlashcards);
            setDataFetched(true);
        } catch (error) {
            console.error('Error fetching flashcards: ', error.message);
        }
    };


    const speakCard = async (signal) => {
        if (!mounted.current || signal.aborted) return;
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        let _duration;
        const currentIndex = index;
        if (index !== currentIndex) return ; 
        const speakAndPause = async (text) => {
            _duration = await TTS(text, voiceGender, language, speakingRate);
            await new Promise(resolve => setTimeout(resolve, _duration * 1000));
        };
    
        await speakAndPause(flashcards[currentIndex].term);
        await new Promise(resolve => setTimeout(resolve, delay * 1000));
        if (!mounted.current || signal.aborted) return;
        setIsFlipped(true); 
        await speakAndPause(flashcards[currentIndex].definition);
        
        setTimeout(() => {
            if (index !== currentIndex || !mounted.current) return;
            setIsFlipped(false);
            setTimeout(() => {
                if (willLoop){
                    if (currentIndex + 1 >= flashcards.length){
                        setIndex (0);
                        return; 
                    }
                }
                setIndex((currentIndex) => currentIndex + 1);
            }, 150);
        }, 2000);
        
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

    const handleRestartTest = () => {
        setIndex(0);
        setIsFlipped(false);
    };

    const handleShowOptions = () => {
        setShowOptions(true);
    };

    const handleCloseOptions = () => {
        setShowOptions(false);
    };

    return (
        <div className="container">
            <div className='d-flex justify-content-end'>
            <button className={style.optionButton} onClick={handleShowOptions}>
                <div>
                    <i className="fa-solid fa-gear"></i>
                </div>
            </button>
            </div>
            {showOptions && (
                <div className={style.optionsOverlay}>
                    <div className={style.optionsModal} style={{ backgroundColor: isDarkMode ? '#2e3956' : 'white' }}>
                        <ReviewOptions
                            voiceGender={voiceGender}
                            setVoiceGender={setVoiceGender}
                            language={language}
                            setLanguage={setLanguage}
                            delay={delay}
                            setDelay={setDelay}
                            willLoop={willLoop}
                            setWillLoop={setWillLoop}
                            speakingRate={speakingRate}
                            setSpeakingRate={setSpeakingRate}
                            isVoiceCommandsEnabled={isVoiceCommandsEnabled}
                            setIsVoiceCommandsEnabled={setIsVoiceCommandsEnabled}
                        />
                        <div className={style.closeButtonContainer}>
                            <button className={style.closeButton} onClick={handleCloseOptions}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {isReviewDone ? (<div className='reviewDoneContainer'>
            <div className='row mx-auto mt-3 mb-5' id={style.optionButtons}>
                            <div className="d-flex justify-content-between">
                                <div className=''>
                                    <button className='btn btn-secondary' title='Restart Test' onClick={() => {setIsReviewDone(false); handleRestartTest();}}><i class="fa fa-refresh"></i> Restart Review</button>
                                </div>
                                <div className=''>
                                    <button className='btn btn-secondary' title='Shuffle Cards' onClick={() => {setIsReviewDone(false); shuffleCards();}}><i class="fas fa-random"></i> Shuffle and Restart</button>
                                </div>

                            </div>
                        </div>
                </div>) : (
            <div className={style.flashcardContainer}>
                <div className={style.flashcard}>
                        <RotatingCardTest
                            flashcards={flashcards}
                            index={index}
                            isFlipped={isFlipped}
                        />
                </div>

                <div className='row mx-auto mt-3 mb-5' id={style.optionButtons}>
                            <div className="d-flex justify-content-between">
                                <div className=''>
                                    <button className='btn btn-secondary' title='Restart Test' onClick={handleRestartTest}><i class="fa fa-refresh"></i></button>
                                </div>
                                {isVoiceCommandsEnabled && (
                                <div className='d-flex justify-content-center mt-4 mb-2'>
                                <div className={`${style.micRing} ${style.scaleUp}`}></div>
                                    <div className='container'>
                                            <i className={`bi bi-mic-fill ${isDarkMode ? style.micIconDark : style.micIconLight} ${style.micIconPulse}`}></i>
                                    </div>
                                </div>
                                )}
                                <div className=''>
                                    <button className='btn btn-secondary' title='Shuffle Cards' onClick={shuffleCards}><i class="fas fa-random"></i></button>
                                </div>

                            </div>
                        </div>
                        <ListenForVoiceCommands isVoiceCommandsEnabled={isVoiceCommandsEnabled}
                        shuffleCards={shuffleCards}
                        handleRestartTest={handleRestartTest}
                        voiceCommands={voiceCommands}
                        language={language}/>   
            </div>
        )}
        </div>
    );
};