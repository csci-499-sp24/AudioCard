import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FlashcardTestMode } from './FlashcardTestMode';
import { ASRTestMode } from './ASRTestMode';
import styles from '../../styles/CardSet.module.css';
import { useDarkMode } from '@/utils/darkModeContext';

export const CardViewTestMode = ({ userId, cardset }) => {
    const [currentCardsetData, setCurrentCardsetData] = useState([]);
    const [selectedMode, setSelectedMode] = useState(null); 
    const {isDarkMode} = useDarkMode(); 

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
                            <li className="nav-item" style={{ flex: '1' }}>
                                <button
                                    className={`nav-link ${selectedMode === 'speak' ? 'active' : ''}`}
                                    onClick={() => setSelectedMode('speak')}
                                >
                                    <i className="bi bi-headset"></i> Speak
                                </button>
                            </li>
                            <li className="nav-item" style={{ flex: '1' }}>
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
                {selectedMode === 'speak' && <ASRTestMode cardData={currentCardsetData} userId={userId} cardsetId={cardset.id} />}
                {selectedMode === 'type' && <FlashcardTestMode cardData={currentCardsetData} userId={userId} cardsetId={cardset.id} />}
                {!selectedMode &&
                <div className='container d-flex justify-content-center mt-5' style={{backgroundColor: isDarkMode? '#252526' : 'white', width: '70%', borderRadius: '10px',}}>
                    <div className='container2'>
                        <div className='headingContainer mt-5'>
                            <div className='row'>
                                <h1>Test your knowledge!</h1>
                            </div>
                        </div>
                        <div classname='bodyContainer'>
                            <div className='row'>
                                <div>Select a mode to get started.</div>
                            </div>
                            <div className='row mt-5' style={{color: 'green'}}>
                                <div>&#127911; Speak Mode:</div>
                            </div>
                            <div className='row' style={{color:'green'}}>
                                <p style={{paddingLeft: '40px'}}>Make learning hands-free! The app will speak terms out to you and listen for your answers &#127897;</p>
                            </div>
                            <div className='row mt-5' style={{color: 'green'}}>
                                <div>&#x1F5A5; Type Mode:</div>
                            </div>
                            <div className='row' style={{color:'green'}}>
                                <p style={{paddingLeft: '40px'}}>Match your terms by typing and submitting your answers <i class="bi bi-input-cursor-text" style={{color: isDarkMode ? 'white': 'black'}}></i></p>
                            </div>
                            <div className='row mt-5' style={{color: '#FFA500'}}>
                                <div>	&#x2699; Settings:</div>
                            </div>
                            <div className='row mb-5' style={{color:'#FFA500'}}>
                                <p style={{paddingLeft: '40px'}}>Adjust time limits, maximum number of attempts</p>
                                <p style={{paddingLeft: '40px'}}>&#127911;: set the gender, language, and speaking rate!</p>
                            </div>
                        </div>
                </div>
                </div>}
            </div>
        </div>
    )
}