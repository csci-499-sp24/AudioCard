import React, {useState, useEffect} from 'react';
import style from '../../styles/rotatingcard.module.css';

export const RotatingCard = ({ flashcards, index, isDarkMode }) => {
    return (
        <div className="d-flex justify-content-center" id={style.container}>
            <div id={style.card}>
                <div id={`${isDarkMode ? style.frontDark : style.front}`}>{flashcards[index] ? flashcards[index].term : "Loading"}</div>
                <div id={`${isDarkMode ? style.backDark : style.back}`}>{flashcards[index] ? flashcards[index].definition : "Loading"}</div>
            </div>
        </div>
    )
}
