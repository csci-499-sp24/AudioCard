import React, { useState, useEffect } from 'react';
import { useDarkMode } from '@/utils/darkModeContext';

export const TestOptions = ({isSpeakMode, attempts, handleAttemptChange, timeLimit, handleTimeLimit}) => {
    const {isDarkMode} = useDarkMode();
    const visualAttempt = attempts + 1 ;
    const [isTimeLimitUnlocked, setTimeLimitUnlocked] = useState(true);
    const inputValue = timeLimit === Infinity ? 30 : timeLimit;

    useEffect(() => {
        if (timeLimit === Infinity) {
            setTimeLimitUnlocked(false);
        } else {
            setTimeLimitUnlocked(true);
        }
    }, [timeLimit]);

    const toggleTimeLimitUnlock = () => {
        if (isTimeLimitUnlocked){
            handleTimeLimit(Infinity);
        }
        else {
            handleTimeLimit(inputValue);
        }
        setTimeLimitUnlocked(prevState => !prevState);
    };


    return (
        <div className='container'>
            <h2>Options</h2>
            <div className='row d-flex align-items-center justify-content-center' style={{marginBottom: 10}}>
                <div className='col d-flex justify-content-center'>
                    <div className="d-flex align-items-center">
                        <div className="me-2">Attempts per card:</div> 
                        <div className="dropdown">
                            <button className="btn dropdown-toggle" style={{ backgroundColor: 'transparent', color: isDarkMode ? 'white' : 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
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
            <div className='row' style={{marginBottom: 10}}>
                <div className="flex d-flex align-items-center justify-content-center">
                    <label htmlFor="answer" className="me-2">Time Limit: </label>
                    <input type="number" id="timeLimit" name="timeLimit" value={inputValue} onChange={(e) => handleTimeLimit(e.target.value)} style={{ width: "15%", marginRight: 2 }} disabled={!isTimeLimitUnlocked}  className={isTimeLimitUnlocked ? '' : 'darkInput'}/>
                    <div style={{marginRight: 2}}>seconds</div>
                    {!isSpeakMode && (<div className={`form-check form-switch d-flex align-items-center justify-content-center`} onClick={toggleTimeLimitUnlock}>
                    <input className="form-check-input" type="checkbox" id="toggleTimeLimit" checked={isTimeLimitUnlocked} onChange={() => {}} />
                    </div>)}
                </div>
            </div>
            {isSpeakMode && (<div className='row'>

            </div>) 
            }
        <style jsx>{`.darkInput {
        background-color: #222;
                                }       
        `}</style>
        </div>
    );
}