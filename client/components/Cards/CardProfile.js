import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';
import { getSubjectStyle } from '@/utils/getSubjectStyles';

export const CardProfile = ({ cardset }) => {
    const {isDarkMode} = useDarkMode(); 
    const creationDate = new Date(cardset.createdAt).toLocaleDateString();
    const {bgColor, txtColor} = getSubjectStyle(cardset.subject);

    return (
        <div key={cardset.id} className="col-md-6 mb-4">
            <div className="card h-100 " style={{ backgroundColor: isDarkMode ? '#2e3956':'white', color: isDarkMode? 'white':'black'}}>
                <div className="card-body">
                    <h5 className="card-title">{cardset.title}</h5>
                    <h6 className={`card-subtitle mb-2`} style={{ color: `${txtColor}` }}>Subject: {cardset.subject}</h6>
                    <div className="card-text">
                        <p>{cardset.flashcardCount || 0} terms</p>
                        <p><small>Created at: {creationDate}</small></p>
                    </div>
                </div>
            </div>
            <style jsx>{`

            .text-lighter{
                color: gray;
            }
`}</style>
        </div>
    )
}