import React, { useState, useEffect } from 'react';

export const CardProfile = ({ cardset }) => {
    const creationDate = new Date(cardset.createdAt).toLocaleDateString();

    return (
        <div key={cardset.id} className="col-md-6 mb-4">
            <div className="card h-100">
                <div className="card-body">
                    <h5 className="card-title">{cardset.title}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Subject: {cardset.subject}</h6>
                    <div className="card-text">
                        <p>{cardset.flashcardCount || 0} terms</p>
                        <p><small>Created at: {creationDate}</small></p>
                    </div>
                </div>
            </div>
        </div>
    )
}