import React, {useState, useEffect} from 'react';
import styles from '../../styles/dashboardCard.module.css';
import { useDarkMode } from '@/utils/darkModeContext';
import { getSubjectStyle } from '@/utils/getSubjectStyles';

export const LandingPageCardSet = ({ cardset, onClick }) => {
    const {isDarkMode} = useDarkMode();
    console.log('cardset ', cardset);

    const { bgColor, txtColor } = getSubjectStyle(cardset.subject);

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
                    </div>
                </div>
            </div>
        </div>
    )
}
