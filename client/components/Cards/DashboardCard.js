import React, {useState, useEffect} from 'react';
import styles from '../../styles/dashboardCard.module.css';
import { useDarkMode } from '@/utils/darkModeContext';

export const DashboardCard = ({ cardset, onClick }) => {
    const {isDarkMode} = useDarkMode();
    console.log('cardset ', cardset);

    let bgColor = '';
    let txtColor = '';

    switch (cardset.subject) {
        case 'History': 
            bgColor = '#faf5cb';
            txtColor = '#998f3e';
            break;
        case 'Math': 
            bgColor = '#fbd6d6';
            txtColor = '#b95757';
            break;
        case 'Science': 
            bgColor = '#d6e8fb';
            txtColor = '#4478b0';
            break;
        case 'English': 
            bgColor = '#f6e6f5';
            txtColor = '#b67fb3';
            break;
        case 'Programming': 
            bgColor = '#d8f7f0';
            txtColor = '#5fac98';
            break;
        case 'Fine Arts': 
            bgColor = '#eae8f7';
            txtColor = '#7065b8';
            break;
        case 'Foreign Languages': 
            bgColor = '#fff0d7';
            txtColor = '#c8a162';
            break;
        case 'Nature': 
            bgColor = '#dff7fb';
            txtColor = '#71b8c5';
            break;
        case 'Humanities': 
            bgColor = '#fddbcc';
            txtColor = '#d76c3c';
            break;
        case 'Health': 
            bgColor = '#e8f7d7';
            txtColor = '#85a95b';
            break;
        case 'Other': 
            bgColor = '#f0f0f0';
            txtColor = '#9c9c9c';
            break;
        default: // if none of the above, assign grey colors
            bgColor = '#f0f0f0';
            txtColor = '#9c9c9c';
    }

    return (
        <div key={cardset.id} className="col" onClick={onClick}>
            <div className="card h-100" style={{backgroundColor: isDarkMode?'#2e3956':'white', color: isDarkMode ? 'white' : 'black'}}>
                <div className="card-body" style={{backgroundColor: isDarkMode? '#2e3956':'white'}}>
                    <h2 className="card-title">{cardset.title}</h2>
                    <div className="mt-3">
                        <span className={styles.cardSubject} style={{ backgroundColor: `${bgColor}`, color: `${txtColor}` }}>
                            {cardset.subject}
                        </span>
                    </div>
                    <div className="my-4">
                        <span className="card-count">{cardset.flashcardCount} flashcards</span>
                    </div>
                </div>
                <div className="card-footer p-3"id={styles.cardFooter}>
                    <div className='row d-flex align-items-center'>
                        {cardset.isPublic ? 
                        <div className='col d-flex justify-content-begin'>
                            <span className="bi bi-globe" title="public"></span>
                            </div> 
                            : <div className='col'> 
                            <span className="bi bi-lock" title="restricted"></span> </div> }
                        <div className='col d-flex justify-content-end'>
                            <a href="#" className={`btn ${isDarkMode? 'btn-outline-light' : 'btn-outline-dark'}`}>Edit</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
