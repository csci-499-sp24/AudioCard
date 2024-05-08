import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import { getSubjectStyle } from '@/utils/getSubjectStyles';
import styles from '@/styles/cardProfile.module.css';

export const CardProfile = ({ cardset }) => {
    const {isDarkMode} = useDarkMode(); 
    const creationDate = new Date(cardset.createdAt).toLocaleDateString();
    const { bgColor, txtColor } = getSubjectStyle(cardset.subject, isDarkMode);

    return (
        <div key={cardset.id} className="container">
            <div className="card h-100">
                <div className="card-body" style={{ backgroundColor: `${bgColor}` }} id={isDarkMode ? styles.cardDark : styles.cardLight}>
                    <h3 className="text-dark">{cardset.title}</h3>
                    <h6 className={`card-subtitle mb-2`}><span style={{ color: `${txtColor}` }}>{cardset.subject}</span></h6>
                    
                    <div className="card-text d-flex justify-content-between mt-5" 
                        id={`${isDarkMode ? styles.cardDetailsDark : styles.cardDetails}`}
                    >
                        <small>{cardset.flashcardCount || 0} terms</small>
                        <small>Created at: {creationDate}</small>
                    </div>
                </div>
            </div>
        </div>
    )
}
