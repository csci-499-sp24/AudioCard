import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlashcardTestMode } from './FlashcardTestMode';
import { ASRTestMode } from './ASRTestMode';
import styles from '../../styles/CardSet.module.css';
import style from '../../styles/testmode.module.css';
import { useDarkMode } from '@/utils/darkModeContext';

export const CardViewTestMode = ({ cardset, userId }) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [selectedMode, setSelectedMode] = useState(null); 
    const {isDarkMode} = useDarkMode();
    const [preferredLanguage, setPreferredLanguage] = useState('');

  useEffect(() => {
        fetchFlashCards();
    }, [cardset]);

    const fetchFlashCards = async () => {
        try {
            const response = await axios.get(process.env.NEXT_PUBLIC_SERVER_URL + `/api/users/${userId}/cardsets/${cardset.id}/flashcards`);
            const flashcards = response.data.flashcards;
            setCurrentCardsetData(flashcards);
        } catch (error) {
            if (error.response.status === 403) {
                console.error('User doesnt have permission to see the cardset');
            } else {
                console.error('Error fetching flashcards: ', error.message);
            }
        }
    } 

    useEffect(() => {
        if(userId) {
            const fetchPreferredLanguage = async () => {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/${userId}/prefLanguage`);
                setPreferredLanguage(response.data.prefLanguage);
            };
        
            fetchPreferredLanguage();
        }
    }, [userId]);


    return (
        <div className={styles.setContainer}>
            <div className="container">
                <hr style={{borderColor: isDarkMode ? 'white' : 'black', borderWidth: '2px'}}/>
                <div className="row">
                        <h1 className={styles.setTitle}>{cardset.title}</h1>
                </div>
                <div className="row mb-2">
                    <div className="col-12">
                        <ul className="nav nav-tabs nav-fill" style={{width: '100%'}}>
                            <li className="nav-item" style={{ flex: '1', borderTop: '1px solid #ccc', borderRight: '1px solid #ccc', borderLeft: '1px solid #ccc', borderRadius: '5px' }}>
                                <button
                                    className={`nav-link ${selectedMode === 'speak' ? 'active' : ''}`}
                                    onClick={() => setSelectedMode('speak')}
                                >
                                    <i className="bi bi-headset"></i> Speak
                                </button>
                            </li>
                            <li className="nav-item" style={{ flex: '1', borderTop: '1px solid #ccc', borderRight: '1px solid #ccc', borderRadius: '5px' }}>
                                <button
                                    className={`nav-link ${selectedMode === 'type' ? 'active' : ''}`}
                                    onClick={() => setSelectedMode('type')}
                                >
                                    <i className="bi bi-keyboard"></i> Type
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                
                {selectedMode === 'speak' && currentCardsetData.length > 0 && <ASRTestMode cardData={currentCardsetData} cardsetLanguage={preferredLanguage ? preferredLanguage : cardset.language}/>}
                {selectedMode === 'type' && currentCardsetData.length > 0 &&  <FlashcardTestMode cardData={currentCardsetData}  />}
                
                {!selectedMode &&
                    <div className='container d-flex justify-content-center mt-5 mb-5' style={{backgroundColor: isDarkMode? '#252526' : 'white', width: '70%', borderRadius: '10px',}}>
                        <div className='container2'>
                            <div className='headingContainer mt-5'>
                                <div className='row'>
                                    <h1 className='text-center'>Test your knowledge!</h1>
                                </div>
                            </div>
                            
                            <div className='d-flex flex-column justify-content-center align-content-center'>
                                <div className='row'>
                                    <div className='text-center'>Select a mode above to start.</div>
                                </div>

                                <div className='d-flex flex-column justify-content-center mt-5 mb-5'>
                                    <div id={style.reviewModeGreen}>&#127911; Speak Mode:</div>
                                    <p id={style.reviewModeGreenSub}>The app will speak out your flashcard terms and definitions, all you have to do is listen! &#128266;</p>
                                    
                                    <div id={style.reviewModeGreen}>&#x1F5A5; Type Mode:</div>
                                    <p id={style.reviewModeGreenSub}>Match your terms by typing and submitting your answers <i class="bi bi-input-cursor-text" style={{color: isDarkMode ? 'white': 'black'}}></i></p>

                                    <div id={style.reviewModeOrange}>	&#x2699; Settings:</div>
                                    <p id={style.reviewModeOrangeSub}>Adjust time limits, maximum number of attempts</p>
                                    <p id={style.reviewModeOrangeSub}>&#127911;: -set the gender, language, and speaking rate!</p>
                                    <p id={style.reviewModeOrangeSub}> &#128483; -voice commands: &apos;shuffle&apos;, &apos;restart&apos;, or &apos;exit&apos;</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}
