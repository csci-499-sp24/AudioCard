import React, { useState } from 'react';
import style from '../../styles/rotatingcardtest.module.css';
import { useEffect } from 'react';

export const RotatingCardTest = ({ flashcards, index, isFlipped, borderClass, isDarkMode }) => {
    console.log('Border class:', borderClass);
    return (
        <div className={`d-flex justify-content-center ${style[borderClass]}`} id={style.container}>
            <div id={style.card} className={isFlipped ? style.isFlipped : ''}>
                <div id={`${isDarkMode ? style.frontDark : style.front}`}>
                    {flashcards[index] ? flashcards[index].term : "Loading"}
                </div>
                <div id={`${isDarkMode ? style.backDark : style.back}`}>{flashcards[index] ? flashcards[index].definition : "Loading"}
                    {flashcards[index] ? flashcards[index].definition : "Loading"}
                </div>
            </div>
        </div>
    );
}
