import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';

export const TestOptions = ({testMode, attempts, handleAttemptChange}) => {
    const {isDarkMode} = useDarkMode();
    const [isSpeakMode, setIsSpeakMode] = useState(false); 
    if (testMode == 'speak'){
        setIsSpeakMode(true);
    }
    const visualAttempt = attempts + 1 ;

    return (
        <div className='container'>
            <h2>Options</h2>
            <div className='row d-flex align-items-center justify-content-center'>
                <div className='col d-flex justify-content-center'>
                    <div className="d-flex align-items-center">
                        <div className="me-2">Attempts per card:</div> 
                        <div className="dropdown">
                            <button className="btn dropdown-toggle" style={{ backgroundColor: isDarkMode ? '#222222' : 'white', color: isDarkMode ? 'white' : 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {visualAttempt ? visualAttempt : "1"}
                            </button>
                            <ul className="dropdown-menu">
                                {[...Array(10)].map((_, index) => (
                                    <li key={index}><a className="dropdown-item" onClick={(e) => handleAttemptChange(index + 1)}>{index + 1}</a></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}