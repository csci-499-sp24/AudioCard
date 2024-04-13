import React, { useState } from 'react';
import style from '../../styles/rotatingcardtest.module.css';
import { useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';

export const RotatingCardTestLandingPage = ({ flashcards, index, isFlipped, borderClass }) => {
    const {isDarkMode} = useDarkMode();
     
    return (
        <div className={`d-flex justify-content-center ${style[borderClass]}`} id={style.containerLanding}>
            <div id={style.card} className={isFlipped ? style.isFlipped : ''}>
                <div id={`${isDarkMode ? style.frontDarkLanding : style.frontLanding}`}>
                    {flashcards[index] ? flashcards[index].term : "Loading"}
                </div>
                <div id={`${isDarkMode ? style.backDarkLanding : style.backLanding}`}>{flashcards[index] ? flashcards[index].definition : "Loading"}
                </div>
            </div>
        </div>
    );
}
