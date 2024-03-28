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
                    <div className='row d-flex'>
                        <div className='col'>
                            <div>Attempts per card: </div>
                            <div className="dropdown me-2 flex-grow-1 col">
                                <button className="btn  flex-grow-1 dropdown-toggle" style={{ backgroundColor: isDarkMode ? '#222222' : 'white', color: isDarkMode? 'white': 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    {visualAttempt ? visualAttempt: "1"}
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(1)}>1</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(2)}>2</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(3)}>3</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(4)}>4</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(5)}>5</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(6)}>6</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(7)}>7</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(8)}>8</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(9)}>9</a></li>
                                    <li><a className="dropdown-item" onClick={(e) => handleAttemptChange(10)}>10</a></li>
                                </ul>
                            </div>
                        </div>
                </div>
        </div>
    );
}