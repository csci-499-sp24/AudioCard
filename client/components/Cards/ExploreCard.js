import React, {useState, useEffect} from 'react';

export const ExploreCard = ({ cardset, onCreateCardset, isDarkMode }) => {

  return (
    <div key={cardset.id} className="col-sm-6 col-md-4 col-lg-3 mb-4">
        <div className="card h-100" style={{ backgroundColor: isDarkMode ? '#2e3956':'white', color: isDarkMode? 'white':'black'}}onClick={() => onCreateCardset(cardset)}>
            <div className="card-body">
                <h5 className="card-title">{cardset.title}</h5>
                <p className="card-subject">Subject: {cardset.subject}</p>
                <p className="card-count">{cardset.flashcardCount} flashcards</p>
                <p classname="card-creator">Created by: {cardset.user?.username}</p>
                <p className="card-createdTime"><small className={isDarkMode? 'text-lighter' : 'text-muted'}>Created at: {new Date(cardset.createdAt).toLocaleDateString()}</small></p>
            </div>
        </div>
        <style jsx>{`

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
