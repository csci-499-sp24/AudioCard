import React, {useState, useEffect} from 'react';
import style from '../../styles/termCard.module.css';
import { useDarkMode } from '@/utils/darkModeContext';

export const TermCard = ({ flashcard }) => {
    const {isDarkMode} = useDarkMode();
    return (
        <div key={flashcard.id} id={`${isDarkMode ? style.flashcardDark : style.flashcard}`}>
            <div>Question: {flashcard.term}</div>
            <div>Answer: {flashcard.definition}</div>
        </div>
    )
}
