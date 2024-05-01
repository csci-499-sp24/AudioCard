import React, { useState, useEffect } from 'react';
import 'react-tooltip/dist/react-tooltip.css'; 
import { Tooltip } from 'react-tooltip'
import { useDarkMode } from '@/utils/darkModeContext';
import { getLanguage } from '@/utils/languageCodes';
import { getTranslation } from '@/utils/translations';

export const TestOptions = ({isSpeakMode, attempts, handleAttemptChange, 
    timeLimit, handleTimeLimit,
    voiceGender, setVoiceGender,
    language, setLanguage,
    speakingRate, setSpeakingRate}) => {
    const {isDarkMode} = useDarkMode();
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

    const voiceCommandsTooltip = getTranslation('Say "shuffle", "restart", or "exit"', language);

    return (
        <div className='container'>
            <h2>Options</h2>
            <div className='row d-flex align-items-center' style={{marginBottom: 10}}>
                <div className='col d-flex justify-content-end'>
                        <div className="me-2">Attempts per card:</div> 
                </div>
                <div className='col d-flex justify-content-begin'>
                        <div className="dropdown">
                            <button className="btn dropdown-toggle" style={{ backgroundColor: 'transparent', color: isDarkMode ? 'white' : 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {attempts ? attempts + 1 : "1"}
                            </button>
                            <ul className="dropdown-menu">
                                {[...Array(10)].map((_, index) => (
                                    <li key={index}><a className="dropdown-item" onClick={(e) => handleAttemptChange(index + 1)}>{index + 1}</a></li>
                                ))}
                            </ul>
                        </div>
                </div>
            </div>
            <div className='row d-flex align-items-center' style={{marginBottom: 10}}>
                <div className="col flex d-flex justify-content-end">
                    <label htmlFor="timeLimit" className="me-2">Time Limit: </label>
                </div>
                <div className='col flex d-flex justify-content-begin'>
                    <input type="number" id="timeLimit" name="timeLimit" value={inputValue} onChange={(e) => handleTimeLimit(e.target.value)} style={{ width: "25%", marginRight: 2 }} placeholder={timeLimit} disabled={!isTimeLimitUnlocked}  className={isTimeLimitUnlocked ? '' : 'darkInput'}/>
                    <div>seconds</div>
                    {!isSpeakMode && (<div className={`form-check form-switch d-flex align-items-center justify-content-center`} onClick={toggleTimeLimitUnlock}>
                    <input className="form-check-input" type="checkbox" id="toggleTimeLimit" checked={isTimeLimitUnlocked} onChange={() => {}} />
                    </div>)}
                </div>
            </div>
            {isSpeakMode && (
            <div className='SpeakSettingscontainer'> 
            <div className='row flex d-flex align-items-center'>
            <div className='col d-flex justify-content-end'>
            <div>Voice: </div>
            </div>
            <div className="col d-flex justify-content-begin dropdown">
                <button className="btn dropdown-toggle" style={{ backgroundColor: 'white', color: 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {voiceGender.charAt(0).toUpperCase() + voiceGender.slice(1).toLowerCase()}
                </button>
                <ul className="dropdown-menu">
                    <li><a className="dropdown-item" onClick={() => setVoiceGender('NEUTRAL')}>Neutral</a></li>
                    <li><a className="dropdown-item" onClick={() => setVoiceGender('MALE')}>Male</a></li>
                    <li><a className="dropdown-item" onClick={() => setVoiceGender('FEMALE')}>Female</a></li>
                </ul>
            </div>
            </div>
            <div className='row flex d-flex align-items-center mt-2'>
                <div className='col d-flex justify-content-end'>
                    <div>Language: </div>
                </div>
                <div className="col d-flex justify-content-begin dropdown">
                    <button className="btn dropdown-toggle" style={{ backgroundColor: 'white', color: 'black' }} type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        {getLanguage(language)}
                        </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" onClick={() => setLanguage('en-US')}>English (US)</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('en-GB')}>English (UK)</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('bn-IN')}>Bengali</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('cmn-CN')}>Chinese (Mandarin)</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('fr-FR')}>French</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('ru-RU')}>Russian</a></li>
                        <li><a className="dropdown-item" onClick={() => setLanguage('es-ES')}>Spanish</a></li>
                    </ul>
                </div> 
            </div>
            <div className='row flex d-flex align-items-center mt-3'>
                <div className='col d-flex justify-content-end'>
                    <div> Speaking Rate: </div> 

                    </div>
                <div className='col d-flex justify-content-begin'>
                <input
                    className='me-2'
                    type="range"
                    id="timeLimit"
                    name="timeLimit"
                    min="0.25"
                    max="4.0"
                    step="0.25"
                    value={speakingRate}
                    onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                    />
                    <span>{speakingRate}</span>
                </div>
            </div> 
            <div className='row flex d-flex align-items-center mt-3'>
                <div className='col d-flex justify-content-end'>
                    <div>Voice Commands:</div>
                </div>
                <div className='col d-flex justify-content-begin'>
                    <div>
                    <i className="bi bi-question-circle-fill" 
                        data-tooltip-id="voiceCommandTip"
                        data-tooltip-content={voiceCommandsTooltip}
                        data-tooltip-place='bottom'></i>
                    <Tooltip id = "voiceCommandTip" /> 
                    </div>
                </div> 
            </div> 
            </div>) 
            }
        <style jsx>{`.darkInput {
        background-color: #222;
                                }

        `}</style>
        </div>
    );
}