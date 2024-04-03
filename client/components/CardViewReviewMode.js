import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import style from '../styles/flashcardtestmode.module.css';
import { RotatingCardTest } from './Cards/RotatingCardTest';
import { TTS } from './ASR/textToSpeech';
import { useDarkMode } from '../utils/darkModeContext';
import { ReviewOptions } from './ReviewOptions';

export const CardViewReviewMode = ({ userId, cardset }) => {
    const { isDarkMode } = useDarkMode();
    const [flashcards, setFlashcards] = useState([]);
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [voiceGender, setVoiceGender] = useState('NEUTRAL');
    const [language, setLanguage] = useState('en-US');
    const [dataFetched, setDataFetched] = useState(false);
    const mounted = useRef(true);
    const timeoutRef = useRef(null);
    const [showOptions, setShowOptions] = useState(false);

    useEffect(() => {
        mounted.current = true;
        fetchFlashCards();
        return () => {
            mounted.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [cardset]);

    useEffect(() => {
        if (dataFetched && index < flashcards.length) {
            fetchData();
        }
    }, [index, dataFetched]);

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

    const fetchData = async () => {
        if (flashcards.length > 0 && index < flashcards.length) {
            await speakCard();
        }
    };

    const speakCard = async () => {
        TTS(flashcards[index].term, voiceGender, language);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        timeoutRef.current = setTimeout(() => {
            if (!mounted.current) return;
            setIsFlipped(true);
            TTS(flashcards[index].definition, voiceGender, language);
            timeoutRef.current = setTimeout(() => {
                if (!mounted.current) return;
                setIsFlipped(false);
                if (index < flashcards.length - 1) {
                    setIndex((currentIndex) => currentIndex + 1);
                }
            }, 4000);
        }, 5000);
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
            <div className={style.topRightButtons}>
                <button className={style.optionButton} onClick={handleShowOptions}>
                    Show Options
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
                        />
                        <div className={style.closeButtonContainer}>
                            <button className={style.closeButton} onClick={handleCloseOptions}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className={style.flashcardContainer}>
                <div className={style.flashcard}>
                        <RotatingCardTest
                            flashcards={flashcards}
                            index={index}
                            isFlipped={isFlipped}
                        />
                </div>
                <div className={style.restartButtonContainer}>
                    <button className={'btn btn-secondary'} onClick={handleRestartTest}>
                        Restart Review
                    </button>
                </div>
            </div>
        </div>
    );
};
