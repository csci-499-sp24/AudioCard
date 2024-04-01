import React, {useState, useEffect} from 'react';
import styles from '../../styles/dashboardCard.module.css';
import { useDarkMode } from '@/utils/darkModeContext';
import { getSubjectStyle } from '@/utils/getSubjectStyles';

export const ShareCard = ({ cardset}) => {
    const {isDarkMode} = useDarkMode();
    const { bgColor, txtColor } = getSubjectStyle(cardset.subject);

    
  return (
    <div key={cardset.id} className="container">
        <div className="card h-100 w-100"  style={{backgroundColor: isDarkMode?'#2e3956':'white', color: isDarkMode ? 'white' : 'black'}}>
            <div className="card-body">
                <h5 className="card-title">{cardset.title}</h5>
                <div className="mt-3">
                        <span className={styles.cardSubject} style={{ backgroundColor: `${bgColor}`, color: `${txtColor}` }}>
                            {cardset.subject}
                        </span>
                    </div>
                <div className='mt-4'>
                <p classname="card-creator">Created by: {cardset.user?.username}</p>
                </div>
                <p className="card-createdTime"><small className={isDarkMode? 'text-lighter' : 'text-muted'}>Created at: {new Date(cardset.createdAt).toLocaleDateString()}</small></p>
            </div>
            <div className="card-footer p-3"id={styles.cardFooter}>
                    <div className='row d-flex align-items-center'>
                        {cardset.isPublic ? 
                        <div className='col d-flex justify-content-begin'>
                            <span className="bi bi-globe" title="public"></span>
                            </div> 
                            : <div className='col'> 
                            <span className="bi bi-lock" title="restricted"></span> </div> }
                    </div>
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
