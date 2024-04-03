import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import style from '../styles/flashcardtestmode.module.css';
import { RotatingCardTest } from './Cards/RotatingCardTest';
import { TTS } from './ASR/textToSpeech';
import { useDarkMode } from '../utils/darkModeContext';

export const CardViewReviewMode = ({ userId, cardset }) => {
    const { isDarkMode } = useDarkMode();
    const [flashcards, setFlashcards] = useState([]);
    const [index, setIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [voiceGender, setVoiceGender] = useState('NEUTRAL');
    const [language, setLanguage] = useState('en-US');
    const [showTestResult, setShowTestResult] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const mounted = useRef(true);
    const timeoutRef = useRef(null);
    

    useEffect(() => {
        mounted.current = true;
        console.log('Entering useEffect');
        fetchFlashCards();
        return () => {
            mounted.current = false;
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        }
    }, [cardset]);

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

    useEffect(() => {
        if (dataFetched && index < flashcards.length) {
            fetchData();
        }
    }, [index, dataFetched]); 

    useEffect(() => {
        if (flashcards.length > 0 && index === flashcards.length) {
            setShowTestResult(true);
        } else {
            setShowTestResult(false);
        }
    }, [index, flashcards.length]);

    const fetchData = async () => {
        if (flashcards.length > 0 && index < flashcards.length && !showTestResult) {
            await speakCard();
        }
    };

    const speakCard = async () => {
        console.log('Entering speakCard function');
        if (!showTestResult){
            TTS(flashcards[index].term, voiceGender, language);
        }
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
                } else {
                    setShowTestResult(true);
                }
            }, 4000); 
        }, 5000); 
    };
    
    

    if (flashcards.length === 0) {
        return <div>No Flashcards Yet!</div>;
    }

    const handleRestartTest = () => {
        setIndex(0);
        setIsFlipped(false);
        setShowTestResult(false);
    };

    return (
        <div className="container">
            {showTestResult ? (
                <div className={style.testCompleteContainer}>
                    <button className={'btn btn-primary'} onClick={handleRestartTest}>Restart Review</button>
                </div>
            ) : (
                <div>
                    <div className={style.flashcard}>
                        <RotatingCardTest
                            flashcards={flashcards}
                            index={index}
                            isFlipped={isFlipped}
                        />
                    </div>
                </div>
            )}
        </div>
    );
    
};
