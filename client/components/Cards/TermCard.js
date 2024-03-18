import React, {useState, useEffect} from 'react';
import style from '../../styles/rotatingcard.module.css';

export const TermCard = ({ flashcard }) => {
    return (
        <div key={flashcard.id} className="flashcard">
            <div>Question: {flashcard.term}</div>
            <div>Answer: {flashcard.definition}</div>
            <style jsx>{`
                .flashcard {
                    background-color: #f0f0f0; 
                    padding: 20px; 
                    border-radius: 8px; 
                }
                `}</style>
        </div>
    )
}
