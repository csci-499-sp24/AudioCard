import React, {useState, useEffect} from 'react';
import style from '../../styles/termCard.module.css';

export const TermCard = ({ flashcard }) => {
    return (
        <div key={flashcard.id} id={style.flashcard}>
            <div>Question: {flashcard.term}</div>
            <div>Answer: {flashcard.definition}</div>
        </div>
    )
}
