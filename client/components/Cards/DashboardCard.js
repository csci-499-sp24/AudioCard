import React, {useState, useEffect} from 'react';
import styles from '../../styles/dashboardCard.module.css';

export const DashboardCard = ({ cardset, onClick }) => {
    console.log('cardset ', cardset);

    let bgColor = '';
    let txtColor = '';

    switch (cardset.subject) {
        case 'History': 
            bgColor = '#faf5cb';
            txtColor = '#998f3e';
            break;
        case 'Math': 
            bgColor = '#fbd6d6';
            txtColor = '#b95757';
            break;
        case 'Science': 
            bgColor = '#d6e8fb';
            txtColor = '#4478b0';
            break;
        case 'English': 
            bgColor = '#f6e6f5';
            txtColor = '#b67fb3';
            break;
        case 'Programming': 
            bgColor = '#d8f7f0';
            txtColor = '#5fac98';
            break;
        case 'Fine Arts': 
            bgColor = '#eae8f7';
            txtColor = '#7065b8';
            break;
        case 'Foreign Languages': 
            bgColor = '#fff0d7';
            txtColor = '#c8a162';
            break;
        case 'Nature': 
            bgColor = '#dff7fb';
            txtColor = '#71b8c5';
            break;
        case 'Humanities': 
            bgColor = '#fddbcc';
            txtColor = '#d76c3c';
            break;
        case 'Health': 
            bgColor = '#e8f7d7';
            txtColor = '#85a95b';
            break;
        case 'Other': 
            bgColor = '#f0f0f0';
            txtColor = '#9c9c9c';
            break;
        default: // if none of the above, assign grey colors
            bgColor = '#f0f0f0';
            txtColor = '#9c9c9c';
    }

    return (
        <div key={cardset.id} className="col" onClick={onClick}>
            <div className="card h-100">
                <div className="card-body">
                    <h2 className="card-title">{cardset.title}</h2>
                    <div className="mt-3">
                        <span className={styles.cardSubject} style={{ backgroundColor: `${bgColor}`, color: `${txtColor}` }}>
                            {cardset.subject}
                        </span>
                    </div>
                    <div className="my-4">
                        <span className="card-count">{cardset.flashcardCount} flashcards</span>
                    </div>
                </div>
                <div className="card-footer d-flex justify-content-end p-3" id={styles.cardFooter}>
                    <a href="#" className="btn btn-outline-dark">Edit</a>
                </div>
            </div>
        </div>
    )
}
