import React, {useState, useEffect} from 'react';
import { getSubjectStyle } from '@/utils/getSubjectStyles';
import { useDarkMode } from '@/utils/darkModeContext';

export const ExploreCard = ({ cardset, onCreateCardset}) => {
    const {isDarkMode} = useDarkMode();
    const { bgColor, txtColor } = getSubjectStyle(cardset.subject);
  return (
    <div key={cardset.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
        <div className="card h-100" style={{ backgroundColor: isDarkMode ? '#2e3956':'white', color: isDarkMode? 'white':'black'}}onClick={() => onCreateCardset(cardset)}>
            <div className="card-body">
                <h5 className="card-title">{cardset.title}</h5>
                <div className='mt-2 mb-3'>
                <span className="card-subject mb-5" style={{ backgroundColor: `${bgColor}`, color: `${txtColor}` }}> {cardset.subject} </span>
                </div>
                <p className="card-count">{cardset.flashcardCount} flashcards</p>
                <p classname="card-creator">Created by: {cardset.user?.username}</p>
                <p className="card-createdTime"><small className={isDarkMode? 'text-lighter' : 'text-muted'}>Created at: {new Date(cardset.createdAt).toLocaleDateString()}</small></p>
            </div>
        </div>
        <style jsx>{`
            .card-subject {
                background-clip: padding-box;
                border-radius: 20px;
                color: #000000;
                padding: 7px;
                display: inline;
            }
            .text-lighter{
                color: gray;
            }
            .card:hover {
                transform: scale(1.03); 
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); 
                transition: transform 0.3s ease, box-shadow 0.3s ease; 
            }
        `}</style>
    </div>
    )
}
